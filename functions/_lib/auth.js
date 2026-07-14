const COOKIE_NAME = 'portfolio_admin';
const encoder = new TextEncoder();

const toBase64Url = (value) => btoa(String.fromCharCode(...new Uint8Array(value)))
  .replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');

const fromBase64Url = (value) => {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - value.length % 4) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
};

const importKey = (secret) => crypto.subtle.importKey(
  'raw',
  encoder.encode(secret),
  { name: 'HMAC', hash: 'SHA-256' },
  false,
  ['sign', 'verify'],
);

const sign = async (value, secret) => {
  const key = await importKey(secret);
  return toBase64Url(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
};

const verifySignature = async (value, signature, secret) => {
  try {
    const key = await importKey(secret);
    return await crypto.subtle.verify('HMAC', key, fromBase64Url(signature), encoder.encode(value));
  } catch {
    return false;
  }
};

export const isAuthConfigured = (env) => Boolean(env.ADMIN_PASSWORD && env.SESSION_SECRET);

export const verifyPassword = async (candidate, env) => {
  if (!isAuthConfigured(env) || typeof candidate !== 'string') return false;
  const received = await sign(candidate, env.SESSION_SECRET);
  return verifySignature(env.ADMIN_PASSWORD, received, env.SESSION_SECRET);
};

export const createSessionCookie = async (request, env) => {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 12;
  const payload = toBase64Url(encoder.encode(JSON.stringify({ exp: expiresAt })));
  const signature = await sign(payload, env.SESSION_SECRET);
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE_NAME}=${payload}.${signature}; HttpOnly${secure}; SameSite=Strict; Path=/; Max-Age=43200`;
};

export const clearSessionCookie = (request) => {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE_NAME}=; HttpOnly${secure}; SameSite=Strict; Path=/; Max-Age=0`;
};

export const isAuthenticated = async (request, env) => {
  if (!env.SESSION_SECRET) return false;
  const cookie = request.headers.get('cookie') || '';
  const session = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!session) return false;
  const [payload, signature] = session.slice(COOKIE_NAME.length + 1).split('.');
  if (!payload || !signature || !(await verifySignature(payload, signature, env.SESSION_SECRET))) return false;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    return Number(data.exp) > Date.now();
  } catch {
    return false;
  }
};
