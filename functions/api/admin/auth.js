import { createSessionCookie, isAuthConfigured, verifyPassword } from '../../_lib/auth.js';
import { json, readJson } from '../../_lib/http.js';

export async function onRequestPost({ request, env }) {
  if (!isAuthConfigured(env)) return json({ message: 'Admin access is not configured yet.' }, { status: 503 });
  try {
    const { password } = await readJson(request, 10_000);
    if (!(await verifyPassword(password, env))) return json({ message: 'That password is not correct.' }, { status: 401 });
    return json({ ok: true }, { headers: { 'Set-Cookie': await createSessionCookie(request, env) } });
  } catch {
    return json({ message: 'Unable to sign in.' }, { status: 400 });
  }
}
