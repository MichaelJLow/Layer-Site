const EMAIL = 'contact@workwithlayer.com';
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

const ALLOWED_HOSTS = new Set(['www.workwithlayer.com', 'workwithlayer.com', 'localhost', '127.0.0.1']);

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

function clean(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 4000);
}

function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '')
    .split(',')[0]
    .trim();
  return forwarded || req.socket?.remoteAddress || 'unknown';
}

function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

function originAllowed(req) {
  const origin = String(req.headers.origin || '');
  if (!origin) return false;
  try {
    const url = new URL(origin);
    if (ALLOWED_HOSTS.has(url.hostname)) return true;
    return url.protocol === 'https:' && url.hostname.startsWith('personal-portfolio-site') && url.hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

function json(res, status, payload) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(payload);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Method not allowed' });
  }

  if (!originAllowed(req)) {
    return json(res, 403, { ok: false, error: 'Request origin is not allowed.' });
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    res.setHeader('Retry-After', '600');
    return json(res, 429, { ok: false, error: 'Please wait a few minutes before sending another enquiry.' });
  }

  const body = readBody(req);
  if (clean(body.website)) {
    return json(res, 200, { ok: true });
  }

  const name = clean(body.name);
  const email = clean(body.email);
  const company = clean(body.company);
  const message = clean(body.message);

  if (!name || !email || !message) {
    return json(res, 400, {
      ok: false,
      error: 'Please add your name, work email, and a short note about the workflow.',
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(res, 400, { ok: false, error: 'Please use a valid work email.' });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    console.error('Contact form unavailable: mail environment is not configured');
    return json(res, 503, {
      ok: false,
      error: `The enquiry form is temporarily unavailable. Email ${EMAIL} and it will reach us directly.`,
    });
  }

  const subject = `Workflow review request from ${company || name}`;
  const text = [
    `Name: ${name}`,
    `Work email: ${email}`,
    `Company: ${company || 'Not given'}`,
    '',
    'Where work is getting stuck:',
    message,
  ].join('\n');

  try {
    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM,
        to: [EMAIL],
        reply_to: email,
        subject,
        text,
      }),
    });

    if (!sent.ok) {
      throw new Error('mail provider rejected the message');
    }

    return json(res, 200, { ok: true });
  } catch (error) {
    console.error('Contact form failed', error instanceof Error ? error.message : 'unknown error');
    return json(res, 502, {
      ok: false,
      error: `Something went wrong sending the request. Email ${EMAIL} and it will reach us directly.`,
    });
  }
}
