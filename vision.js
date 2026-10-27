import { CORS, json, askOpenAI, readMessages } from './_openai.js';

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(request) {
  let form;
  try { form = await request.formData(); } catch { return json({ message: 'Request tidak valid' }, 400); }

  const file = form.get('file');
  if (!file || typeof file === 'string') return json({ message: 'File gambar tidak ada' }, 400);
  if (file.size > 4 * 1024 * 1024) return json({ message: 'Foto terlalu besar (maks 4 MB)' }, 413);

  const b64 = Buffer.from(await file.arrayBuffer()).toString('base64');
  const url = `data:${file.type || 'image/jpeg'};base64,${b64}`;

  const msgs = readMessages(form);
  const last = msgs[msgs.length - 1];
  last.content = [
    { type: 'text', text: String(last.content || 'Jelaskan gambar ini secara detail') },
    { type: 'image_url', image_url: { url } }
  ];
  return askOpenAI(msgs);
}
