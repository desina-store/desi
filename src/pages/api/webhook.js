// Vercel preserves the raw request body for Stripe signature verification.
// This bridge recreates that contract without modifying the original webhook handler.
import handler from "../../../api/webhook.js";

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 60,
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

export default async function webhookBridge(req, res) {
  if (req.method === "POST") {
    try {
      const raw = await readRawBody(req);
      req.rawBody = raw;
      try {
        req.body = raw ? JSON.parse(raw) : {};
      } catch {
        req.body = raw;
      }
    } catch (error) {
      return res.status(400).json({ error: "Unable to read webhook payload", detail: error.message });
    }
  }

  return handler(req, res);
}
