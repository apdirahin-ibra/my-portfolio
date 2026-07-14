export async function onRequestGet({ params, env }) {
  if (!env.MEDIA) return new Response('Media storage is not configured', { status: 503 });
  const rawPath = Array.isArray(params.path) ? params.path.join('/') : String(params.path || '');
  if (!rawPath.startsWith('portfolio/')) return new Response('Not found', { status: 404 });
  const object = await env.MEDIA.get(rawPath);
  if (!object?.body) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('ETag', object.httpEtag);
  headers.set('Cache-Control', headers.get('Cache-Control') || 'public, max-age=31536000, immutable');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(object.body, { headers });
}
