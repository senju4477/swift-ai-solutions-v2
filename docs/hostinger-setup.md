# Swift AI Solutions — Hostinger handover

Prepared 23 October 2026. Review preview: https://swift-ai-solutions.walkersaint402.chatgpt.site

This is a source handover. No Hostinger account, live website, domain or database has been changed. A future Hostinger deployment should use a separate, unused test domain or subdomain; keep the existing production site in place during review.

## Source archive

Recreate the uploadable ZIP from the project root:

```bash
python3 scripts/package-hostinger.py /absolute/path/Swift-AI-Solutions-Hostinger-Source.zip
```

`package.json` is at the archive root. The ZIP includes the Next.js source, exact supplied logo, hero photograph, local MP3 recordings, captions, lockfile and documentation. It excludes dependencies, build output, Git data, ChatGPT deployment identity and local environment files. Hostinger installs dependencies and builds from source.

## hPanel settings

For a later authorised deployment, choose **Websites → Add Website → Node.js web app → Upload your files**, then select the source ZIP. Use these settings:

| Setting | Value |
| --- | --- |
| Framework / application type | Next.js / `next` |
| Root directory | Archive root (`/` or empty) |
| Node.js | 22 |
| Package manager | npm |
| Build script selector | `build` |
| Build command, if shown as a command field | `npm run build` |
| Output directory | `.next` |
| Entry file | Leave empty; ignored by the Next.js preset |

Hostinger’s Next.js preset starts the standalone server automatically. `npm start` remains available for local or manual Node.js hosting. This project exports a config object from `next.config.mjs` and its normal build prepares standalone output, including public and Next.js static assets.

Do not set `SWIFT_STATIC_EXPORT` or `SITES_MANAGED_LINUX_CONTAINER` on Hostinger. Those switches are for the ChatGPT static preview.

## Enquiry contact

No verified Swift AI Solutions enquiry address has been supplied. Leave `NEXT_PUBLIC_CONTACT_EMAIL` empty until it is confirmed. The current form prepares a reviewable enquiry with the chosen plan and industry, plus copy/download actions; it does not send or store submissions.

When a verified address is supplied, set `NEXT_PUBLIC_CONTACT_EMAIL` before building. This enables a visitor’s email application; the visitor still sends the email. Server-side enquiry delivery and live receptionist integrations are separate work.

## Local production check

```bash
npm ci
npm run build
npm start
```

The app reads the hosting-provided `PORT`, defaults to 3000 and binds to `0.0.0.0`. No database is required. After a future test deployment, check the homepage, three pricing selections, enquiry preparation, all sample recordings and the privacy/service-information links. Review build/runtime logs if the app does not start.

## Official references

Checked 23 October 2026:

- [Hostinger: creating a Node.js app](https://docs.hostinger.com/node.js/creating-an-app)
- [Hostinger: build settings](https://docs.hostinger.com/node.js/build-settings)
- [Hostinger: Next.js preset](https://docs.hostinger.com/node.js/overview-1/next)

Build and browser evidence is recorded in `docs/validation.md`. Compatibility checks do not constitute an actual deployment to your Hostinger account.
