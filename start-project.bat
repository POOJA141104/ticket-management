@echo off
title TMS Runner
echo ========================================================
echo Starting Ticket Management System (TMS)...
echo ========================================================

echo 1. Starting Backend API on http://localhost:5000...
start "TMS Backend (Port 5000)" cmd /k "cd /d "%~dp0ticket-management\backend" && npm start"

ping 127.0.0.1 -n 3 >nul

echo 2. Starting Web Frontend on http://localhost:3000...
start "TMS Web (Port 3000)" cmd /k "cd /d "%~dp0ticket-management\frontend-web" && node serve.js"

ping 127.0.0.1 -n 3 >nul

echo 3. Starting Expo Mobile on http://localhost:8081...
start "TMS Expo (Port 8081)" cmd /k "cd /d "%~dp0ticket-management\frontend" && node --max-old-space-size=2048 .\node_modules\expo\bin\cli start"

ping 127.0.0.1 -n 3 >nul

echo 4. Opening Web in Browser...
start http://localhost:3000/login

echo ========================================================
echo All services running!
echo Web:    http://localhost:3000/login
echo API:    http://localhost:5000
echo Mobile: http://localhost:8081
echo ========================================================
pause
