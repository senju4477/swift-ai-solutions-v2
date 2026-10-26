# Complete sample calls — 24 October 2026

All three recordings were regenerated from complete 13-turn conversations. Each asks for a name, address and explicit callback number. Their actual decoded durations exceed one minute; no long silence was added to extend short recordings.

| Call | Duration | Listening level | True peak | MP3 bitrate |
| --- | ---: | ---: | ---: | ---: |
| Automotive workshop | 87.424 seconds | −16.40 LUFS | −2.22 dBTP | 192 kbps |
| Plumbing | 94.332 seconds | −16.42 LUFS | −2.19 dBTP | 192 kbps |
| Electrical | 100.771 seconds | −16.42 LUFS | −2.24 dBTP | 192 kbps |

Measured by decoding the finished MP3s with ffmpeg and inspecting them with ffprobe, using `scripts/check-audio.py`.

The two stock Australian voices have calmer rates, individually matched volume, trimmed outer silence, short turn-taking pauses and gentle edge fades. Two-pass mastering balances the final listening level and leaves headroom to avoid clipping. The 192 kbps export reduces additional compression loss; the original synthesized source limits its underlying fidelity.

The earlier short files measured −21.34, −21.13 and −21.21 LUFS respectively. The new recordings are approximately 4.7–4.9 LU louder, with nearly identical listening levels across the three samples and more than 2 dB of true-peak headroom.

## Information collected

- Automotive: full name, address, phone, make/model/year, kilometres, registration, service type, brake symptoms and warning lights, drop-off preference, SMS preference and approval of estimated costs before work.
- Plumbing: name, full job address and unit, phone, type of tap, where it leaks, flooding/urgency, ownership/authority, preferred time, gate/parking access and a request to confirm the call-out fee and parts.
- Electrical: name, business and site address, phone, fitting count/type, desired LED upgrade, routine work versus a fault, storeys/ceiling, authority to approve, access/parking, inspection preference and after-hours quoting.

Each call ends with the team confirming availability and pricing; it does not claim a real appointment has been made. Visible transcripts, timed captions, summaries and downloadable transcripts match the new recordings. Content hashes in the media filenames prevent reuse of the earlier short audio from browser caches.

## Fictional details

The people, businesses, addresses and vehicle registration are invented for the demonstration. The phone numbers are ACMA’s reserved creative-work numbers: 0491 570 006, 0491 570 156 and 0491 570 157.

Source checked 24 October 2026: [ACMA — phone numbers for creative works](https://www.acma.gov.au/phone-numbers-use-tv-shows-films-and-creative-works).

Only local, pre-recorded assets are used by the website. No live telephone, booking, SMS, database or workshop-system connection was added.
