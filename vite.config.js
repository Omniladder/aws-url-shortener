import { defineConfig } from 'vite';

/**
 * Lists every HTML page the build should include.
 * Each page has its own file (see docs/arch/0009). Add a new page here when you create its file.
 *
 * In development, set API_ORIGIN to the deployed API (for example
 * https://abc123.execute-api.us-east-1.amazonaws.com). The dev server then
 * forwards /api and /r to it, so sign-in and links work locally.
 */
const apiOrigin = process.env.API_ORIGIN;

export default defineConfig({
  server: apiOrigin
    ? { proxy: { '/api': apiOrigin, '/r': apiOrigin } }
    : {},
  build: {
    rollupOptions: {
      input: {
        login: new URL('./index.html', import.meta.url).pathname,
        dashboard: new URL('./dashboard.html', import.meta.url).pathname,
        create: new URL('./create.html', import.meta.url).pathname,
        redirect: new URL('./redirect.html', import.meta.url).pathname,
      },
    },
  },
});
