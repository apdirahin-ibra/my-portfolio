import { saveMessage } from '../_lib/db.js';
import { escapeHtml, json, readJson } from '../_lib/http.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendEmail = async (env, message) => {
  if (!env.RESEND_API_KEY) return false;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.RESEND_API_KEY}` },
    body: JSON.stringify({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: env.CONTACT_EMAIL || 'apdirahiimipraahim@gmail.com',
      reply_to: message.email,
      subject: `Portfolio enquiry: ${message.projectType || 'General'} from ${message.name}`,
      html: `<h2>New portfolio enquiry</h2><p><strong>Name:</strong> ${escapeHtml(message.name)}</p><p><strong>Email:</strong> ${escapeHtml(message.email)}</p><p><strong>Project type:</strong> ${escapeHtml(message.projectType || 'Not specified')}</p><p><strong>Message:</strong></p><p style="white-space:pre-wrap">${escapeHtml(message.message)}</p>`,
    }),
  });
  if (!response.ok) throw new Error(`Resend returned ${response.status}`);
  return true;
};

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await readJson(request, 40_000);
    if (body.website) return json({ ok: true });
    const message = {
      id: crypto.randomUUID(),
      name: String(body.name || '').trim().slice(0, 120),
      email: String(body.email || '').trim().toLowerCase().slice(0, 200),
      projectType: String(body.projectType || '').trim().slice(0, 120),
      message: String(body.message || '').trim().slice(0, 5000),
    };
    if (!message.name || !emailPattern.test(message.email) || !message.message) return json({ message: 'Please complete every required field.' }, { status: 400 });

    let saved = false;
    if (env.DB) { await saveMessage(env.DB, message); saved = true; }
    if (env.RESEND_API_KEY) {
      if (saved) context.waitUntil(sendEmail(env, message).catch((error) => console.error(JSON.stringify({ event: 'contact_email_failed', message: error instanceof Error ? error.message : String(error) }))));
      else await sendEmail(env, message);
    }
    if (!saved && !env.RESEND_API_KEY) return json({ message: 'The contact service is not configured yet.' }, { status: 503 });
    return json({ ok: true });
  } catch (error) {
    console.error(JSON.stringify({ event: 'contact_submit_failed', message: error instanceof Error ? error.message : String(error) }));
    return json({ message: 'Unable to send your message right now.' }, { status: 500 });
  }
}
