import { isAuthenticated } from '../../_lib/auth.js';
import { getContent, saveContent } from '../../_lib/db.js';
import { json, readJson } from '../../_lib/http.js';

const isValidContent = (content) => content && typeof content === 'object'
  && content.profile && Array.isArray(content.projects)
  && Array.isArray(content.experience) && Array.isArray(content.education)
  && Array.isArray(content.skillGroups);

export async function onRequestGet({ request, env }) {
  if (!(await isAuthenticated(request, env))) return json({ message: 'Unauthorized' }, { status: 401 });
  if (!env.DB) return json({ message: 'Add the DB binding to enable content management.' }, { status: 503 });
  try {
    return json({ content: await getContent(env.DB) });
  } catch (error) {
    console.error(JSON.stringify({ event: 'admin_content_read_failed', message: error instanceof Error ? error.message : String(error) }));
    return json({ message: 'Unable to load saved content.' }, { status: 500 });
  }
}

export async function onRequestPut({ request, env }) {
  if (!(await isAuthenticated(request, env))) return json({ message: 'Unauthorized' }, { status: 401 });
  if (!env.DB) return json({ message: 'Add the DB binding to publish content.' }, { status: 503 });
  try {
    const { content } = await readJson(request);
    if (!isValidContent(content)) return json({ message: 'The portfolio content is incomplete or invalid.' }, { status: 400 });
    await saveContent(env.DB, content);
    return json({ ok: true });
  } catch (error) {
    console.error(JSON.stringify({ event: 'admin_content_write_failed', message: error instanceof Error ? error.message : String(error) }));
    return json({ message: error instanceof Error ? error.message : 'Unable to publish content.' }, { status: 400 });
  }
}
