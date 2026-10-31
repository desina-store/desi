// Thin Next.js Pages API bridge to the preserved Vercel handler at /api/checkout.js.
// The original handler is intentionally left untouched.
export { default } from "../../../api/checkout.js";

export const config = {
  maxDuration: 30,
};
