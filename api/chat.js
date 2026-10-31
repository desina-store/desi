// api/chat.js — Gemini proxy for the DeSinaHub assistant.
// Without GEMINI_API_KEY the route answers 503 and the client keeps its local bilingual fallback.

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const MAX_MESSAGE_LENGTH = 1200;
const REQUEST_TIMEOUT_MS = 12000;

const buckets = new Map();
const RATE_LIMIT_MAX = Number(process.env.CHAT_RATE_LIMIT_MAX || 20);
const RATE_LIMIT_WINDOW_MS = Number(process.env.CHAT_RATE_LIMIT_WINDOW_MS || 60000);

function clientKey(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function isRateLimited(req) {
  const key = clientKey(req);
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const hits = (buckets.get(key) || []).filter((at) => at > windowStart);
  if (hits.length >= RATE_LIMIT_MAX) {
    buckets.set(key, hits);
    return true;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [bucketKey, bucketHits] of buckets) {
      const fresh = bucketHits.filter((at) => at > windowStart);
      if (fresh.length) buckets.set(bucketKey, fresh);
      else buckets.delete(bucketKey);
    }
  }
  return false;
}

const SYSTEM_PROMPT = [
  "You are the DeSinaHub assistant. DeSinaHub is an Egyptian multi-department store",
  "(mobiles, computers and genuine software, home appliances, outlet, sportswear, fashion,",
  "plus industrial and tourism desks) delivering across Egypt in EGP.",
  "Answer only about the store, its products, shipping, payment, returns and orders.",
  "Never invent prices, stock, order statuses or reviews. If unsure, say you do not know",
  "and point to WhatsApp support or the relevant page.",
  "Reply in the language the customer wrote in (Arabic or English), in plain text.",
].join(" ");

function readReply(payload) {
  const candidate = payload?.candidates?.[0];
  if (!candidate || candidate.finishReason && candidate.finishReason !== "STOP") return null;
  const text = (candidate.content?.parts || [])
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .join("")
    .trim();
  if (!text) return null;
  return text.slice(0, 1800);
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  if (isRateLimited(req)) {
    res.setHeader("Retry-After", String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)));
    return res.status(429).json({ error: "too_many_requests" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "assistant_not_configured" });
  }

  const body = req.body || {};
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: "invalid_message" });
  }
  const lang = body.lang === "ar" || body.lang === "en" ? body.lang : null;

  try {
    const response = await fetch(
      `${ENDPOINT}?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [{ text: message.slice(0, MAX_MESSAGE_LENGTH) }],
            },
          ],
          generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
        }),
      },
    );

    if (!response.ok) {
      // The provider rejected or failed the call: let the client use its local answer.
      return res.status(502).json({ error: "assistant_upstream_unavailable" });
    }

    const payload = await response.json().catch(() => null);
    const reply = readReply(payload);
    if (!reply) return res.status(502).json({ error: "assistant_empty_reply" });

    return res.status(200).json({ reply, lang });
  } catch {
    return res.status(502).json({ error: "assistant_unavailable" });
  }
}
