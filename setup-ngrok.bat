@echo off
echo Installing ngrok for Windows...
echo.
echo Step 1: Download ngrok
echo Go to: https://ngrok.com/download
echo Download the Windows version (ZIP file)
echo.
echo Step 2: Extract and setup
echo 1. Extract ngrok.exe to a folder (like C:\ngrok\)
echo 2. Add that folder to your Windows PATH, or
echo 3. Just run ngrok.exe from that folder
echo.
echo Step 3: Get your auth token (optional but recommended)
echo 1. Sign up at https://ngrok.com (free)
echo 2. Get your auth token from dashboard
echo 3. Run: ngrok config add-authtoken YOUR_TOKEN
echo.
echo Step 4: Start tunnel
echo Run: ngrok http 5173
echo.
pause