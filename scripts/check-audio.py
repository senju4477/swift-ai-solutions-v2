"""Decode and measure the delivered audio, including duration and peak headroom."""
from hashlib import sha256
import json
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parent.parent
metadata = json.loads((root / 'app/demo-audio.json').read_text())
results = {}
for name, media in metadata.items():
    path = root / 'public' / media['src'].lstrip('/')
    probe = json.loads(subprocess.run([
        'ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)
    ], check=True, capture_output=True, text=True).stdout)
    stream = probe['streams'][0]
    assert stream['codec_name'] == 'mp3' and int(stream['bit_rate']) >= 192000
    assert int(stream['sample_rate']) == 44100 and stream['channels'] == 1
    assert sha256(path.read_bytes()).hexdigest()[:10] in path.name, 'Unversioned or stale audio asset'
    pcm = subprocess.run([
        'ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', str(path),
        '-f', 's16le', '-acodec', 'pcm_s16le', '-'
    ], check=True, capture_output=True)
    duration = len(pcm.stdout) / (44100 * 2)
    assert not pcm.stderr, f'{name}: decode errors'
    assert duration >= 60 and media['cues'][-1]['end'] >= 60, f'{name}: recording is too short'
    assert abs(duration - media['duration']) < .1, f'{name}: incorrect playback timing'
    measured = subprocess.run([
        'ffmpeg', '-hide_banner', '-nostats', '-i', str(path),
        '-af', 'loudnorm=I=-16:TP=-2:LRA=7:print_format=json', '-f', 'null', '-'
    ], check=True, capture_output=True, text=True)
    levels = json.loads(measured.stderr[measured.stderr.rfind('{'):])
    loudness, peak = float(levels['input_i']), float(levels['input_tp'])
    assert -17 <= loudness <= -15, f'{name}: inconsistent listening level ({loudness} LUFS)'
    assert peak <= -1, f'{name}: insufficient peak headroom ({peak} dBTP)'
    results[name] = {
        'duration_seconds': round(duration, 3), 'integrated_loudness_lufs': loudness,
        'true_peak_dbtp': peak, 'bitrate_kbps': int(stream['bit_rate']) // 1000,
        'transcript_turns': len(media['cues']), 'src': media['src']
    }
print(json.dumps(results, indent=2))
