# Swift AI Solutions — Version 2

Separate comparison version based on original published source de0f0bb431f20f280ca8e221ce62937a0b102869. Original website, deployment, repository and access settings are unchanged.

## Hostinger Node.js Web App

Use Node.js 22, install with npm ci, build with npm run build and start with npm start. The standard Next.js build creates .next/standalone and copies public and .next/static assets. scripts/start.mjs uses process.env.PORT and binds to 0.0.0.0. No Docker, Cloudflare runtime dependency or SSH-only deployment is required.

For the separate ChatGPT preview, SWIFT_STATIC_EXPORT=1 npm run build creates out/. The destination identity is in .openai/hosting.json. Do not use the original Site project ID.

## Content and interactions

Approved redesign composition with exact logo; three preserved synthetic example calls and matching transcripts; compact industry controls; retained plan inclusions; Standard estimator; native accessible FAQ accordions; validated enquiry review/copy/download.

The Hostinger Node.js enquiry form keeps its review/copy/download flow and adds a Send Enquiry action. The server sends to info@swiftaisolutions.com.au using authenticated SMTP, with the enquirer as Reply-To. Set the runtime SMTP variables in `.env.example`, including the mailbox password privately in Hostinger, then redeploy. Success means SMTP acceptance; confirm inbox delivery with a marked test enquiry. Static review builds retain preview-only preparation. Calling, SMS, booking and customer dashboard integrations remain unchanged. See `docs/enquiry-email.md`.

Pricing: Pilot A$299/month, Standard A$349/month, 450 minutes each; Standard additional minutes A$0.30; Enterprise custom. At 600 Standard minutes the estimate is A$394, before other agreed charges and taxes. No pilot setup fee. Other setup/usage/SMS/telephony/GST and billing conditions require confirmation.

See docs/version-2-validation.md and docs/asset-notes.md.
