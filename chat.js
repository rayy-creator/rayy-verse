import { CORS, json, askOpenAI, readMessages } from './_openai.js';

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(request) {
  let form;
  try { form = await request.formData(); } catch { return json({ message: 'Request tidak valid' }, 400); }
  return askOpenAI(readMessages(form));
}
