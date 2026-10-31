// Thin bridge to the original AI chat handler. The client also has an offline fallback.
export { default } from "../../../api/chat.js";

export const config = {
  maxDuration: 30,
};
