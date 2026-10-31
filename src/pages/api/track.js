// Thin bridge to the order tracking handler. Responses are verified server-side.
export { default } from "../../../api/track.js";

export const config = {
  maxDuration: 15,
};
