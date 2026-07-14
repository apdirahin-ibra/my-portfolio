export const json = (data, init = {}) => {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(data), { ...init, headers });
};

export const readJson = async (request, maxBytes = 1_500_000) => {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > maxBytes) throw new Error('Request is too large');
  const text = await request.text();
  if (text.length > maxBytes) throw new Error('Request is too large');
  return JSON.parse(text || '{}');
};

export const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');
