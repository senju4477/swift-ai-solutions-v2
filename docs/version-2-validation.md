# Version 2 comparison preview

Original project: appgprj_6adb1bcf431c8191843f8c6fe06f099e
Original published source: de0f0bb431f20f280ca8e221ce62937a0b102869
Version 2 project: appgprj_6ade0ff9162c8191a8c50927bb4d9e19

The original repository was opened read-only, then copied into a fresh checkout. No commit, push, deployment or access change was performed on the original. Version 2 has a separate source repository and hosting manifest. Both previews have public access, as requested.

The approved screenshot supplies the composition: workshop hero with illustrative call overlays, navy audio section immediately below, combined industries/benefits, three setup steps, aligned pricing with Standard highlighted, FAQs, two-column enquiry section and compact footer. Existing FAQ answers and plan inclusions are retained with clearer conditions.

The exact supplied logo bytes are unchanged. SHA-256: 131c8dab4e3cb080cc43052d262fc2e3be0d1e6634541d29b743ca93a2f465d1.

Existing audio is unchanged: Automotive 87.424 s; Plumbing 94.332 s; Electrical 100.771 s. All have 13 transcript turns, matching captions, 192 kbps MP3, and decoded loudness about -16.4 LUFS. Fictional synthetic examples; no real calls, SMS or bookings.

Standard estimator: A$349 + max(0, minutes - 450) × A$0.30. At 600 minutes the result is A$394.00, before other agreed charges and taxes.

Enquiries are intentionally preview-only. There is no verified delivery destination or authorised configuration for the separate preview. Validation, review, copy and download run in the browser; form values are not persisted or posted. No sent confirmation is displayed. Delivery remains unfinished.

Confirmed: pilot A$299/month, 450 minutes, no pilot setup fee; Standard A$349/month, 450 minutes, A$0.30 per additional minute; Enterprise custom pricing. The pilot is a limited programme without invented dates or eligibility criteria. Standard/Enterprise setup, pilot overages, SMS/telephony costs, GST, billing and cancellation terms require confirmation before signup.

## Build and compatibility

Preserves the existing standard Next.js application and Hostinger scripts. Node >=22, npm run build, .next/standalone for Hostinger, process.env.PORT and 0.0.0.0. A separate static export supports the ChatGPT preview. No Cloudflare-specific application code or Docker dependency.

Static export and asset-link checks passed. All three audio recordings decode, exceed 60 seconds and match their text/caption assets. Exact logo hash verified.

Browser QA passed at desktop 1363px, tablet frame 820px (805px content including scroll bar), and mobile 390px. No horizontal overflow detected. Verified all three sample recordings play; pause, seeking, restart and industry switching work. Tabs retain keyboard controls. Mobile menu opens and Escape closes it. All three pricing links select the matching plan in the one enquiry form. Estimator checked at 450 (A$349) and 600 (A$394). Native FAQ summary opens using Enter. Invalid submissions show field errors and focus the first invalid field. A fictional enquiry was reviewed, copied to clipboard and downloaded; no enquiry was sent.

The standard standalone production build passed and served successfully via process.env.PORT on 0.0.0.0, without development tools. The build environment runs Node 24.22.1; Node 22 is the configured Hostinger target, not an externally deployed/tested Hostinger instance. No external Hostinger system was accessed.
