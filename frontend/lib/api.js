// Talks to the Express backend (Railway). Only used on the server (actions, pages).
const BASE = process.env.MYSQL_API_URL

export async function api(path, { token, body, method = 'GET' } = {}) {
  try {
    const res = await fetch(BASE + path, {
      method,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body && { body: JSON.stringify(body) }),
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, data }
  } catch (err) {
    console.error(`[api] Cannot reach backend at ${BASE}${path}:`, err.cause?.code || err.message)
    return { ok: false, data: { error: 'Cannot reach the backend. Is it running?' } }
  }
}
