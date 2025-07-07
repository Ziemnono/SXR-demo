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

## Alternative: PowerShell Method
```powershell
# Download ngrok directly with PowerShell
Invoke-WebRequest -Uri "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip" -OutFile "ngrok.zip"
Expand-Archive -Path "ngrok.zip" -DestinationPath "C:\ngrok"
cd C:\ngrok
.\ngrok.exe http 5173
```

## Why This Works:
- University networks block device-to-device communication
- ngrok creates a secure tunnel through the internet
- Your phone connects through ngrok's servers
- Bypasses all university firewall restrictions

## 🎯 Next Steps:
1. Keep your dev server running: `npm run dev`
2. In a NEW command prompt, run ngrok
3. Use the ngrok URL on your phone
4. Enjoy your remote control app!