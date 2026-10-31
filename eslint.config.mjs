import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Client components hydrate localStorage, cookies and URL params after mount;
    // reading them during render would desync the server-rendered markup.
    files: ["src/components/**/*.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vercel serverless backend, workers and the service worker are plain-JS
    // runtime code outside the TypeScript app graph; they are checked by build.
    "api/**",
    "lib/**",
    "workers/**",
    "src/pages/api/**",
    "public/sw.js",
    // Inert leftover: no CSS uses Tailwind directives (design truth is src/styles/*.css),
    // and it uses CommonJS require() in an ESM project for a plugin that is not installed.
    "tailwind.config.js",
  ]),
]);

export default eslintConfig;
