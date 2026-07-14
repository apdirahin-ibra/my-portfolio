import { getContent } from '../_lib/db.js';
import { json } from '../_lib/http.js';

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ content: null, configured: false }, { status: 200 });
  try {
    return json({ content: await getContent(env.DB), configured: true }, { status: 200 });
  } catch (error) {
    console.error(JSON.stringify({ event: 'content_read_failed', message: error instanceof Error ? error.message : String(error) }));
    return json({ message: 'Unable to load portfolio content' }, { status: 500 });
  }
}
