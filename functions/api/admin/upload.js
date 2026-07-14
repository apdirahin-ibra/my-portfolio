import { isAuthenticated } from '../../_lib/auth.js';
import { json } from '../../_lib/http.js';

const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

export async function onRequestPost({ request, env }) {
  if (!(await isAuthenticated(request, env))) return json({ message: 'Unauthorized' }, { status: 401 });
  if (!env.MEDIA) return json({ message: 'Add the MEDIA R2 binding to enable image uploads.' }, { status: 503 });
  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > 8_500_000) return json({ message: 'Images must be smaller than 8 MB.' }, { status: 413 });
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return json({ message: 'Choose an image to upload.' }, { status: 400 });
    const extension = allowedTypes.get(file.type);
    if (!extension) return json({ message: 'Use a JPG, PNG, WebP, or GIF image.' }, { status: 415 });
    if (file.size > 8_000_000) return json({ message: 'Images must be smaller than 8 MB.' }, { status: 413 });
    const key = `portfolio/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
    await env.MEDIA.put(key, file.stream(), {
      httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
      customMetadata: { originalName: file.name.slice(0, 120) },
    });
    return json({ url: `/api/media/${key}` }, { status: 201 });
  } catch (error) {
    console.error(JSON.stringify({ event: 'media_upload_failed', message: error instanceof Error ? error.message : String(error) }));
    return json({ message: 'The image could not be uploaded.' }, { status: 500 });
  }
}
