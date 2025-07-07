# 🚀 Windows Setup Guide for University Network

## Quick Setup (5 minutes):

### 1. Download ngrok
- Go to: https://ngrok.com/download
- Download **Windows (64-bit)** ZIP file
- Extract `ngrok.exe` to `C:\ngrok\` (or any folder you prefer)

### 2. Open Command Prompt
- Press `Win + R`, type `cmd`, press Enter
- Navigate to your ngrok folder: `cd C:\ngrok`

### 3. Start the tunnel
```cmd
ngrok http 5173
```

### 4. Get your public URL
- ngrok will show something like: `https://abc123.ngrok-free.app`
- Copy this URL

### 5. Access from your phone
- Open your phone's browser
- Go to the ngrok URL (like `https://abc123.ngrok-free.app`)
- Your app will work perfectly!

# 🚀 Remote Control System - Deployment & Access Guide

## 🧪 Local Development Setup

1. **Start the Vite development server**
   ```bash
   npm run dev
   ```

   This will expose the app at:
   ```
   http://192.168.x.x:5173/
   ```

2. **Set the local IP in your frontend code**

   In `app.js`, replace:
   ```js
   const serverURL = window.location.origin;
   ```
   with:
   ```js
   const serverURL = 'http://192.168.x.x:3000'; // Use your local IP
   this.socket = io(serverURL, {
     transports: ['websocket']
   });
   ```

## 🔐 Enable HTTPS for Microphone (Voice Commands) via Ngrok

1. **Start an HTTPS tunnel with ngrok**
   ```bash
   ngrok http 5173
   ```

   You’ll receive a public HTTPS URL like:
   ```
   https://abc123.ngrok-free.app
   ```

2. **Update socket URL in `app.js`**
   ```js
   const serverURL = window.location.origin;
   this.socket = io(serverURL, {
     transports: ['websocket'],
     secure: true
   });
   ```

3. **Update `vite.config.js` to allow ngrok**
   ```js
   import { defineConfig } from 'vite';

   export default defineConfig({
     server: {
       host: '0.0.0.0',
       port: 5173,
       allowedHosts: ['.ngrok-free.app']
     },
     base: '/SXR-demo/', // Use your GitHub repo name
     build: {
       outDir: 'docs',
       assetsDir: 'assets'
     },
     publicDir: 'public'
   });
   ```

---

## 🌍 Deploy to GitHub Pages

1. **Ensure correct `base` in `vite.config.js`**
   ```js
   base: '/SXR-demo/', // Your GitHub repo name
   ```

2. **Build the app**
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

4. **GitHub Pages settings**
   - Go to your repo → Settings → Pages
   - Choose `main` branch and `/docs` folder

---

## ✅ Access Summary

- Local Development:
  ```
  http://192.168.x.x:5173/SXR-demo/
  ```

- HTTPS via Ngrok:
  ```
  https://abc123.ngrok-free.app
  ```

- GitHub Pages (static only, no screen share or socket):
  ```
  https://ziemnono.github.io/SXR-demo/
  ```

---
