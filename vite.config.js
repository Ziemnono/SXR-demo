// import { defineConfig } from 'vite';

// export default defineConfig({
//   server: {
//     host: true,
//     port: 5173,
//     allowedHosts: ['.ngrok-free.app'], // <- allow any ngrok domain
//   },
//   build: {
//     outDir: 'dist',
//     assetsDir: 'assets',
//   },
//   publicDir: 'public'
// });

import { defineConfig } from 'vite';

export default defineConfig({
  base: '/SXR-demo/', // 👈 REPLACE with your GitHub repo name
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  publicDir: 'public'
});