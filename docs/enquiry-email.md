# Website enquiry email

The Hostinger Node.js build sends reviewed enquiries to **info@swiftaisolutions.com.au**. It keeps the existing form fields, industry and plan selection, and review/copy/download actions. The added Send Enquiry button submits to `/api/enquiry/`; the authenticated mailbox is From and the enquirer's address is Reply-To. No auto-reply is sent to the enquirer.

## Hostinger environment

| Key | Value |
| --- | --- |
| SITE_URL | https://swiftaisolutions.com.au |
| SMTP_HOST | smtp.hostinger.com |
| SMTP_PORT | 465 |
| SMTP_SECURE | true |
| SMTP_USER | info@swiftaisolutions.com.au |
| SMTP_PASSWORD | Enter this mailbox's password privately in Hostinger |
| NOTIFY_EMAIL | info@swiftaisolutions.com.au |

These SMTP defaults are for Hostinger Email. If the mailbox is on a different provider, use that mailbox's outgoing server settings. Do not add quotes around values. Do not put SMTP_PASSWORD in public variables or commit credentials. The build sets NEXT_PUBLIC_ENQUIRY_DELIVERY automatically; no additional dashboard variable is needed for that flag. The old NEXT_PUBLIC_CONTACT_EMAIL variable is not used by the SMTP sender.

After these code changes reach the configured GitHub branch, redeploy the application with `npm run build`. Keep SWIFT_STATIC_EXPORT and SITES_MANAGED_LINUX_CONTAINER unset on Hostinger. Subsequent password-only changes require the application to restart. Static preview builds intentionally omit the sending route and retain preview-only preparation; the existing published preview is not redeployed by this change.

## Verification

Submit a clearly marked test enquiry, including industry and plan. Confirm its arrival in the destination inbox or Spam/Junk, and confirm Reply targets the address supplied in the form. The form reports success only after SMTP accepts the destination; that does not guarantee inbox placement. Missing configuration and sending failures display an error while retaining entered details.

The handler validates fields and request size, requires the configured website origin, uses TLS with certificate verification, and includes a hidden spam field and in-memory request limits. Limits reset on restart and apply separately per process. It does not save enquiries in a database or browser storage. Mailbox storage and email-provider handling still apply.

References: [Hostinger environment variables](https://www.hostinger.com/support/how-to-edit-or-add-environment-variables-after-deployment/), [Hostinger Email SMTP](https://www.hostinger.com/support/1575756-how-to-get-email-account-configuration-details-for-hostinger-email/).
