@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed on this computer.
  echo Install Node.js 18 or newer, then double-click this file again.
  start "" https://nodejs.org/
  pause
  exit /b 1
)

start "MATE Server" /D "%~dp0" node server.js
timeout /t 3 /nobreak >nul
start "" http://127.0.0.1:4173
endlocal
