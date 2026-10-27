# Rayy AI

Chat AI dengan fitur analisis foto (vision), dijalankan di Vercel.

## Isi repo

- `index.html` : halaman utama
- `api/chat.js` : worker untuk chat
- `api/vision.js` : worker untuk analisis foto
- `api/_openai.js` : kode bersama untuk memanggil OpenAI
- `package.json` : konfigurasi project

## Setting di Vercel

Tambahkan Environment Variables di **Settings → Environment Variables**:

| Nama | Isi |
| --- | --- |
| `OPENAI_API_KEY` | API key OpenAI (wajib) |
| `OPENAI_MODEL` | Model OpenAI (opsional, default `gpt-4o-mini`) |

Setelah menambah env, lakukan **Redeploy**.

## Catatan

- Jangan menulis API key di `index.html` atau file lain di repo.
- Ukuran foto maksimal 4 MB.
