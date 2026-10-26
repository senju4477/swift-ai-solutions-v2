# Asset notes

- `public/images/swift-ai-solutions-logo.png`: the exact uploaded logo, copied without pixel edits. SHA-256: `131c8dab4e3cb080cc43052d262fc2e3be0d1e6634541d29b743ca93a2f465d1`. CSS crops only the surrounding canvas for layout; the source file remains unchanged.
- `public/images/receptionist-hero.png`: generated with the built-in imagegen tool. The approved landing-page screenshot was the composition reference. The supplied logo was not regenerated.
- `app/service-icons.jsx`: original code-native SVG icon family.
- `public/audio/*-sample-*.mp3`: stock synthetic Australian voices, generated from `app/demo-scenarios.json` before publishing. Hashes in filenames identify the new long recordings. Matching `.vtt` captions and `.txt` transcripts share the same filename stem. See `docs/audio-update.md` for the audio processing and fictional details.
- Manrope: self-hosted through `@fontsource/manrope`; no third-party font request is needed at runtime.

## Hero prompt

Use case: photorealistic-natural. Asset type: website hero photograph for Swift AI Solutions. Input image 1 is a reference for subject, lighting, and composition only: the supplied approved website screenshot. Create ONLY the photographic background asset, with no website UI or text. Landscape 1536x1024. A friendly professional female receptionist around 30, dark brown hair, natural smile, wearing an elegant plain black polo and a black telephone headset, seated at a modern bright Australian local-business reception desk. She appears from chest up entirely in the RIGHTMOST 35 percent of the frame, facing slightly left with gaze toward camera. Softly blurred bright office windows and a subtle green plant at the far right. The left 55 percent of the image is softly blurred pale cool white and blue office space with lots of empty space to support the actual website heading. Premium natural commercial photography, realistic skin and hair, warm daylight on face, pale cool blue light in background. Follow the receptionist-and-office visual character in the reference screenshot. Do not reproduce any logos, words, phone mockups, cards, icons, typography or UI. No watermark. Keep shoulders and head comfortably inside frame, no extreme crop.

## Version 2 workshop asset

`public/images/workshop-hero-v2.webp`: generated using the built-in image-generation tool for this comparison version; the exact logo was not regenerated. Prompt: premium natural commercial photograph, friendly male mechanic in navy workwear under an open bonnet in a bright clean Australian workshop, landscape 1536×1024, subject centre-right, softer workshop space to the left, natural daylight, no text, logos, watermark or UI overlays. The generated photo is illustrative, not a photo of Swift AI Solutions staff. WebP derivative saved at quality 88 for faster delivery.
