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
  base: '/SXR-demo/', // 👈 your GitHub repo name
  server: {
    host: '192.168.1.119', // 👈 your local IP
    port: 5173
  },
  build: {
    outDir: 'docs', // 👈 must be 'docs' for GitHub Pages
    assetsDir: 'assets'
  },
  publicDir: 'public'
});