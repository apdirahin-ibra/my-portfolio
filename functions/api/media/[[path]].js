import { getMedia } from '../../_lib/db.js';

export async function onRequestGet({ params, env }) {
  if (!env.DB) return new Response('Media storage is not configured', { status: 503 });
  const rawPath = Array.isArray(params.path) ? params.path.join('/') : String(params.path || '');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(rawPath)) return new Response('Not found', { status: 404 });
  const media = await getMedia(env.DB, rawPath);
  if (!media?.data) return new Response('Not found', { status: 404 });
  const bytes = new Uint8Array(media.data);
  const headers = new Headers({
    'Content-Type': media.content_type,
    'Content-Length': String(bytes.byteLength),
    'Cache-Control': 'public, max-age=31536000, immutable',
    ETag: `"${rawPath}"`,
  });
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(bytes, { headers });
}
