import { isAuthenticated } from '../../_lib/auth.js';
import { saveMedia } from '../../_lib/db.js';
import { json } from '../../_lib/http.js';

const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

export async function onRequestPost({ request, env }) {
  if (!(await isAuthenticated(request, env))) return json({ message: 'Unauthorized' }, { status: 401 });
  if (!env.DB) return json({ message: 'Add the DB binding to enable image uploads.' }, { status: 503 });
  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > 1_800_000) return json({ message: 'Compressed images must be smaller than 1.5 MB.' }, { status: 413 });
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return json({ message: 'Choose an image to upload.' }, { status: 400 });
    const extension = allowedTypes.get(file.type);
    if (!extension) return json({ message: 'Use a JPG, PNG, WebP, or GIF image.' }, { status: 415 });
    if (file.size > 1_500_000) return json({ message: 'Compressed images must be smaller than 1.5 MB.' }, { status: 413 });
    const id = crypto.randomUUID();
    await saveMedia(env.DB, {
      id,
      data: await file.arrayBuffer(),
      contentType: file.type,
      originalName: file.name.slice(0, 120),
    });
    return json({ url: `/api/media/${id}` }, { status: 201 });
  } catch (error) {
    console.error(JSON.stringify({ event: 'media_upload_failed', message: error instanceof Error ? error.message : String(error) }));
    return json({ message: 'The image could not be uploaded.' }, { status: 500 });
  }
}
