export const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS }
  });

export async function askOpenAI(messages) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return json({ message: 'OPENAI_API_KEY belum diset di Vercel' }, 500);
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  let r, j;
  try {
    r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({ model, messages })
    });
    j = await r.json().catch(() => ({}));
  } catch (e) {
    return json({ message: 'Gagal nyambung ke OpenAI' }, 502);
  }

  if (!r.ok) {
    const msg =
      r.status === 401 ? 'API key OpenAI tidak valid atau sudah dicabut.'
      : r.status === 429 ? 'Kuota/limit OpenAI habis atau terlalu banyak request.'
      : (j.error && j.error.message) || 'OpenAI error ' + r.status;
    return json({ message: msg }, r.status);
  }

  const out = String(j?.choices?.[0]?.message?.content || '').trim();
  if (!out) return json({ message: 'OpenAI tidak mengembalikan jawaban' }, 502);
  return json({ result: out });
}

export function readMessages(form) {
  let msgs = null;
  try { msgs = JSON.parse(String(form.get('messages') || 'null')); } catch {}
  if (!Array.isArray(msgs) || !msgs.length) {
    msgs = [{ role: 'user', content: String(form.get('prompt') || '') }];
  }
  return msgs.slice(-12);
}
