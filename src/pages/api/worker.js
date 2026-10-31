// Vercel Cron entry point, delegated to the preserved worker implementation.
export { default } from "../../../api/worker.js";

export const config = {
  maxDuration: 60,
};
