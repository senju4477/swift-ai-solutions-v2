"""Build-time only: pip install edge-tts==7.3.1; requires ffmpeg and ffprobe.

Balances Australian neural voices, trims outer silence and masters local MP3 assets.
The published website needs no speech service or runtime Python installation.
"""
import asyncio
from array import array
from hashlib import sha256
import json
import os
from pathlib import Path
import ssl
import subprocess
import sys
import tempfile
import wave

import edge_tts
import edge_tts.communicate

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'public/audio'
CACHE = ROOT / '.sites-runtime/audio-source'
SAMPLE_RATE = 44100
PROFILES = {
    'assistant': {'voice': 'en-AU-NatashaNeural', 'rate': '-4%'},
    'caller': {'voice': 'en-AU-WilliamNeural', 'rate': '-2%'},
}
if os.environ.get('SSL_CERT_FILE'):
    edge_tts.communicate._SSL_CTX = ssl.create_default_context(cafile=os.environ['SSL_CERT_FILE'])


def stamp(seconds):
    hours, remainder = divmod(round(seconds * 1000), 3600000)
    minutes, remainder = divmod(remainder, 60000)
    seconds, millis = divmod(remainder, 1000)
    return f'{hours:02}:{minutes:02}:{seconds:02}.{millis:03}'


def normalization(source, target):
    """Two-pass linear loudness matching with true-peak headroom."""
    options = f'I={target}:TP=-2:LRA=7'
    result = subprocess.run([
        'ffmpeg', '-hide_banner', '-nostats', '-i', str(source),
        '-af', f'loudnorm={options}:print_format=json', '-f', 'null', '-'
    ], check=True, capture_output=True, text=True)
    measured = json.loads(result.stderr[result.stderr.rfind('{'):])
    return (f'loudnorm={options}:measured_I={measured["input_i"]}'
            f':measured_TP={measured["input_tp"]}:measured_LRA={measured["input_lra"]}'
            f':measured_thresh={measured["input_thresh"]}:offset={measured["target_offset"]}'
            ':linear=true')


def trimmed_pcm(path):
    """Trim only outer silence; preserve a margin and fade edges to avoid clicks."""
    with wave.open(str(path), 'rb') as source:
        assert source.getsampwidth() == 2 and source.getnchannels() == 1
        samples = array('h', source.readframes(source.getnframes()))
    if sys.byteorder != 'little':
        samples.byteswap()
    threshold = 65
    first = next((i for i, value in enumerate(samples) if abs(value) >= threshold), None)
    if first is None:
        raise ValueError(f'Silent speech source: {path.name}')
    last = len(samples) - next(i for i, value in enumerate(reversed(samples)) if abs(value) >= threshold)
    margin = round(SAMPLE_RATE * .06)
    samples = samples[max(0, first - margin):min(len(samples), last + margin)]
    fade = min(round(SAMPLE_RATE * .008), len(samples) // 2)
    for i in range(fade):
        samples[i] = round(samples[i] * i / fade)
        samples[-i - 1] = round(samples[-i - 1] * i / fade)
    if sys.byteorder != 'little':
        samples.byteswap()
    return samples.tobytes()


async def build():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)
    scenarios = json.loads((ROOT / 'app/demo-scenarios.json').read_text())
    previous = json.loads((ROOT / 'app/demo-audio.json').read_text())
    limit = asyncio.Semaphore(3)

    async def utterance(scenario, index, role, text):
        profile = PROFILES[role]
        key = sha256(json.dumps([profile, text], sort_keys=True).encode()).hexdigest()
        path = CACHE / f'{key}.mp3'
        if not path.exists():
            async with limit:
                speech = edge_tts.Communicate(
                    text, **profile, proxy=os.getenv('HTTPS_PROXY') or os.getenv('https_proxy'),
                    connect_timeout=10, receive_timeout=45
                )
                temporary = path.with_suffix('.partial')
                await asyncio.wait_for(speech.save(str(temporary)), timeout=60)
                temporary.replace(path)
        return scenario['id'], index, path

    jobs = [utterance(s, i, role, text)
            for s in scenarios for i, (role, text) in enumerate(s['messages'])]
    sources = {(sid, i): path for sid, i, path in await asyncio.gather(*jobs)}
    metadata = {}
    assets = []
    with tempfile.TemporaryDirectory(prefix='swift-demo-master-') as temporary:
        temporary = Path(temporary)
        for scenario in scenarios:
            frames = [bytes(round(.16 * SAMPLE_RATE) * 2)]
            elapsed = .16
            cues = []
            for i, (role, text) in enumerate(scenario['messages']):
                source = sources[(scenario['id'], i)]
                wav = temporary / f'{scenario["id"]}-{i}.wav'
                subprocess.run([
                    'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
                    '-af', normalization(source, -18), '-ar', str(SAMPLE_RATE), '-ac', '1',
                    '-c:a', 'pcm_s16le', str(wav)
                ], check=True)
                data = trimmed_pcm(wav)
                duration = len(data) / (SAMPLE_RATE * 2)
                cues.append({'start': round(elapsed, 3), 'end': round(elapsed + duration, 3)})
                frames.append(data)
                elapsed += duration
                if i < len(scenario['messages']) - 1:
                    gap = .30 if role == 'assistant' else .34
                    frames.append(bytes(round(gap * SAMPLE_RATE) * 2))
                    elapsed += gap
            # Spoken content must extend beyond one minute; no padding a short call.
            if cues[-1]['end'] < 60:
                raise ValueError(f'{scenario["id"]}: spoken content is only {elapsed:.1f}s')
            frames.append(bytes(round(.42 * SAMPLE_RATE) * 2))
            elapsed += .42
            master = temporary / f'{scenario["id"]}.wav'
            with wave.open(str(master), 'wb') as target:
                target.setnchannels(1)
                target.setsampwidth(2)
                target.setframerate(SAMPLE_RATE)
                target.writeframes(b''.join(frames))
            mp3 = temporary / f'{scenario["id"]}.mp3'
            subprocess.run([
                'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(master),
                '-af', normalization(master, -16), '-ar', str(SAMPLE_RATE), '-ac', '1',
                '-codec:a', 'libmp3lame', '-b:a', '192k',
                '-metadata', f'title=Swift AI Solutions — {scenario["name"]} sample',
                '-metadata', 'artist=Synthetic Australian demonstration voices', str(mp3)
            ], check=True)
            digest = sha256(mp3.read_bytes()).hexdigest()[:10]
            stem = f'{scenario["id"]}-sample-{digest}'
            captions = temporary / f'{stem}.vtt'
            lines = ['WEBVTT', '']
            transcript_lines = [f'Swift AI Solutions — {scenario["business"]}',
                                'Fictional pre-recorded demonstration. No live call or booking.', '']
            for i, ((role, text), cue) in enumerate(zip(scenario['messages'], cues)):
                speaker = 'Swift AI' if role == 'assistant' else 'Sample caller'
                lines.extend([str(i + 1), f'{stamp(cue["start"])} --> {stamp(cue["end"])}',
                              f'{speaker}: {text}', ''])
                transcript_lines.extend([f'{speaker}: {text}', ''])
            captions.write_text('\n'.join(lines))
            transcript = temporary / f'{stem}.txt'
            transcript.write_text('\n'.join(transcript_lines))
            assets.extend([(mp3, OUTPUT / f'{stem}.mp3'), (captions, OUTPUT / f'{stem}.vtt'),
                           (transcript, OUTPUT / f'{stem}.txt')])
            metadata[scenario['id']] = {
                'src': f'/audio/{stem}.mp3', 'captions': f'/audio/{stem}.vtt',
                'transcript': f'/audio/{stem}.txt', 'duration': round(elapsed, 3), 'cues': cues
            }
            print(f'{scenario["id"]}: {elapsed:.2f}s, {len(cues)} turns, 192 kbps, {mp3.stat().st_size:,} bytes', flush=True)
        # Replace only after every recording has succeeded.
        for source, destination in assets:
            destination.write_bytes(source.read_bytes())
        (ROOT / 'app/demo-audio.json').write_text(json.dumps(metadata, indent=2) + '\n')
        retained = {item[key] for item in metadata.values() for key in ('src', 'captions', 'transcript')}
        for item in previous.values():
            for key in ('src', 'captions', 'transcript'):
                old = item.get(key)
                if old and old not in retained and Path(old).parent.as_posix() == '/audio':
                    (ROOT / 'public' / old.lstrip('/')).unlink(missing_ok=True)


if __name__ == '__main__':
    asyncio.run(build())
