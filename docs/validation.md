# Validation — Swift AI Solutions v4

## New complete recordings

Each audio file was regenerated, fully decoded and played to completion in the production browser preview. Playback used the new content-hashed filenames, rather than the old short recordings.

| Sample | Decoded duration | Browser duration | Turns | Listening level | True peak |
| --- | ---: | ---: | ---: | ---: | ---: |
| Automotive workshop | 87.424 s | 87.423651 s | 13 | −16.40 LUFS | −2.22 dBTP |
| Plumbing | 94.332 s | 94.331859 s | 13 | −16.42 LUFS | −2.19 dBTP |
| Electrical | 100.771 s | 100.771247 s | 13 | −16.42 LUFS | −2.24 dBTP |

- All three reached `ended: true` at their full duration with no media error. The automotive and electrical players were explicitly checked as unmuted.
- `scripts/check-audio.py` verified MP3 decoding, 192 kbps encoding, 44.1 kHz mono output, timing agreement, listening levels and peak headroom. Each recording includes spoken content beyond 60 seconds.
- Every script asks for the customer's name, address and explicit callback number, along with the information relevant to the service. The spoken numbers are ACMA creative-work examples; names, addresses and other business/customer details are fictional.
- All recordings have 13 timed transcript turns. The publishing check verifies that every spoken message appears in both the VTT captions and plain-text transcript.
- The full plumbing transcript was opened as text through the production preview and matched the script. Browser automation could not capture the native download event; the file itself was served successfully.
- Desktop playback, scenario selection and the updated summaries were inspected. No site-origin browser console errors were observed.
- Mobile views at iframe widths 320 and 390 pixels had document widths of 305 and 375 pixels respectively after scrollbar space, with no horizontal overflow. The electrical sample loaded the new 100.771-second file and all 13 transcript turns. Transcript show/hide controls worked.
- The transcript-following calculation was corrected to use element bounds within its scroll container. The final production build was checked on mobile: it advanced the transcript as playback progressed, reopening retained the current passage, Restart returned audio and transcript to zero, and play/pause worked again without a media error.

See `docs/audio-update.md` for processing details, measured improvements and the information captured by each scenario. `docs/sample-call-transcripts.md` contains the complete readable scripts.

## Build and hosting

- The final Next.js 15.5.28 standalone output, including the transcript-following correction, built on Node.js 22.23.4. Browser QA uses the managed Node.js 24.19.0 runtime.
- The final publishing workflow builds the static ChatGPT preview and verifies local links, captions, transcripts, audio duration metadata and the exact supplied logo hash. It excludes the temporary mobile QA page.
- `scripts/start.mjs` reads `PORT`, binds to `0.0.0.0` and launches the standalone server. Audio generation is a development-only task; Hostinger needs no Python, ffmpeg or external speech service at runtime.
- The Hostinger source ZIP contains the current audio, captions and transcripts and excludes dependencies, build output, local environment files and ChatGPT Site identity.

## Retained website checks

The v3 design, logo, industry workflows, plan-aware enquiry form, pricing and navigation are retained. Their prior desktop/mobile checks passed, including all three Get Started actions selecting the correct plan in one form, A$349 Standard marked Most Popular, the usage estimator and preview enquiry preparation. No live receptionist, booking, SMS or database integration was added by this audio update.

The original Hostinger website and database were not accessed or modified. Publication is to the existing ChatGPT Site only.
