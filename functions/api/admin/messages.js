import { isAuthenticated } from '../../_lib/auth.js';
import { ensureSchema, listMessages } from '../../_lib/db.js';
import { json } from '../../_lib/http.js';

export async function onRequestGet({ request, env }) {
  if (!(await isAuthenticated(request, env))) return json({ message: 'Unauthorized' }, { status: 401 });
  if (!env.DB) return json({ messages: [] });
  try { return json({ messages: await listMessages(env.DB) }); }
  catch { return json({ message: 'Unable to load enquiries.' }, { status: 500 }); }
}

export async function onRequestPatch({ request, env }) {
  if (!(await isAuthenticated(request, env))) return json({ message: 'Unauthorized' }, { status: 401 });
  if (!env.DB) return json({ message: 'Database unavailable' }, { status: 503 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return json({ message: 'Message id is required' }, { status: 400 });
  await ensureSchema(env.DB);
  await env.DB.prepare("UPDATE contact_messages SET status = 'read' WHERE id = ?").bind(id).run();
  return json({ ok: true });
}

export async function onRequestDelete({ request, env }) {
  if (!(await isAuthenticated(request, env))) return json({ message: 'Unauthorized' }, { status: 401 });
  if (!env.DB) return json({ message: 'Database unavailable' }, { status: 503 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return json({ message: 'Message id is required' }, { status: 400 });
  await ensureSchema(env.DB);
  await env.DB.prepare('DELETE FROM contact_messages WHERE id = ?').bind(id).run();
  return json({ ok: true });
}
