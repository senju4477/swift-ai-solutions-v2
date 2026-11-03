import { createHash } from 'node:crypto';

const DEFAULT_RECIPIENT = 'info@swiftaisolutions.com.au';
const EMAIL = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)+$/i;
const BODY_LIMIT = 16_384;
const WINDOW = 10 * 60 * 1000;

function reply(status, message, extra = {}) {
  return Response.json({ success: status === 200, message }, {
    status,
    headers: { 'Cache-Control': 'no-store', ...extra },
  });
}

function mailbox(value) {
  return typeof value === 'string' && value.length <= 254 && EMAIL.test(value);
}

function settings(env) {
  const user = (env.SMTP_USER || '').trim();
  const recipient = (env.NOTIFY_EMAIL || DEFAULT_RECIPIENT).trim();
  const host = (env.SMTP_HOST || 'smtp.hostinger.com').trim();
  const port = Number(env.SMTP_PORT || 465);
  const secureValue = env.SMTP_SECURE || (port === 465 ? 'true' : 'false');
  const password = env.SMTP_PASSWORD;
  if (!mailbox(user) || !mailbox(recipient) || !password ||
      !/^[a-zA-Z0-9.-]+$/.test(host) || !Number.isInteger(port) ||
      port < 1 || port > 65535 || !['true', 'false'].includes(secureValue)) {
    throw new Error('EMAIL_CONFIGURATION');
  }
  const secure = secureValue === 'true';
  if ((port === 465 && !secure) || (port === 587 && secure)) {
    throw new Error('EMAIL_CONFIGURATION');
  }
  return { user, recipient, host, port, secure, password };
}

function allowedOrigins(env) {
  const url = new URL(env.SITE_URL || 'https://swiftaisolutions.com.au');
  const origins = new Set([url.origin]);
  if (['swiftaisolutions.com.au', 'www.swiftaisolutions.com.au'].includes(url.hostname)) {
    origins.add('https://swiftaisolutions.com.au');
    origins.add('https://www.swiftaisolutions.com.au');
  }
  return origins;
}

async function boundedJSON(request) {
  if (Number(request.headers.get('content-length')) > BODY_LIMIT) throw new Error('TOO_LARGE');
  if (!request.body) throw new Error('INVALID_BODY');
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0;
  let text = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > BODY_LIMIT) {
        await reader.cancel();
        throw new Error('TOO_LARGE');
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } finally {
    reader.releaseLock();
  }
}

function submission(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('INVALID_BODY');
  const read = (key, limit, required = false, multiline = false) => {
    const input = value[key] ?? '';
    if (typeof input !== 'string') throw new Error('INVALID_BODY');
    const text = input.trim();
    const controls = multiline ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/;
    if (text.length > limit || (required && !text) || controls.test(text)) throw new Error('INVALID_BODY');
    return text;
  };
  const data = {
    name: read('name', 160, true),
    business: read('business', 160, true),
    email: read('email', 254, true),
    phone: read('phone', 80),
    message: read('message', 5000, false, true),
    industry: read('industry', 80, true),
    plan: read('plan', 80, true),
  };
  if (!mailbox(data.email) || read('website', 200)) throw new Error('INVALID_BODY');
  return data;
}

async function smtpSend(config, message) {
  const { default: nodemailer } = await import('nodemailer');
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: !config.secure,
    auth: { user: config.user, pass: config.password },
    tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    disableFileAccess: true,
    disableUrlAccess: true,
    logger: false,
    debug: false,
  });
  return transport.sendMail(message);
}

// The factory lets local checks exercise failure handling without real mailbox credentials.
export function createEnquiryHandler({ env = process.env, sendMail = smtpSend, now = Date.now } = {}) {
  const buckets = new Map();
  let total = [];
  return async function handleEnquiry(request) {
    if (request.method !== 'POST') return reply(405, 'Use POST to submit an enquiry.', { Allow: 'POST' });
    let origins;
    try { origins = allowedOrigins(env); } catch { return reply(503, 'Online enquiries are not configured yet. Please email ' + DEFAULT_RECIPIENT + '.'); }
    if (!origins.has(request.headers.get('origin'))) return reply(403, 'Please submit the form from our website.');
    if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') || '')) {
      return reply(415, 'Please submit the website enquiry form.');
    }
    let config;
    try { config = settings(env); } catch { return reply(503, 'Online enquiries are not configured yet. Please email ' + DEFAULT_RECIPIENT + '.'); }
    let data;
    try { data = submission(await boundedJSON(request)); } catch (error) {
      return error.message === 'TOO_LARGE'
        ? reply(413, 'Your enquiry is too long. Please shorten it and try again.')
        : reply(400, 'Please check your name, business, email and message, then try again.');
    }
    const time = now();
    for (const [key, times] of buckets) {
      const recent = times.filter(t => t > time - WINDOW);
      if (recent.length) buckets.set(key, recent); else buckets.delete(key);
    }
    total = total.filter(t => t > time - WINDOW);
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim().slice(0, 100);
    const key = createHash('sha256').update(ip || 'shared-process').digest('hex');
    const recent = buckets.get(key) || [];
    const perKeyLimit = ip ? 5 : 20;
    if (recent.length >= perKeyLimit || total.length >= 40 || (!buckets.has(key) && buckets.size >= 1024)) {
      return reply(429, 'Too many enquiries have been submitted. Please wait a few minutes or email us.', { 'Retry-After': '600' });
    }
    buckets.set(key, [...recent, time]);
    total.push(time);
    const message = {
      from: { name: 'Swift AI Solutions website', address: config.user },
      to: config.recipient,
      replyTo: { name: data.name, address: data.email },
      subject: 'New website enquiry — ' + data.business,
      text: [
        'New enquiry from the Swift AI Solutions website',
        '',
        'Name: ' + data.name,
        'Business: ' + data.business,
        'Email: ' + data.email,
        'Phone: ' + (data.phone || 'Not provided'),
        'Industry: ' + data.industry,
        'Selected plan: ' + data.plan,
        '',
        'Message:',
        data.message || 'No additional message.',
      ].join('\n'),
      disableFileAccess: true,
      disableUrlAccess: true,
    };
    try {
      const info = await sendMail(config, message);
      const accepted = (info.accepted || []).some(address => String(address).toLowerCase() === config.recipient.toLowerCase());
      if (!accepted) throw new Error('SMTP_NOT_ACCEPTED');
      return reply(200, 'Your enquiry has been submitted. We will be in touch.');
    } catch (error) {
      // Avoid logging enquiry contents, addresses, passwords or SMTP server responses.
      const code = typeof error.code === 'string' && /^[A-Z0-9_]+$/.test(error.code) ? error.code : 'SEND_FAILED';
      console.error('[Swift AI enquiry]', code);
      return reply(502, 'We could not confirm your enquiry was sent. Please email ' + config.recipient + ' or contact us before retrying.');
    }
  };
}
