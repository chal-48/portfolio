@echo off
cd /d "%~dp0"
if not exist "node_modules\vite\bin\vite.js" (
  echo Dependencies are missing. Install them with pnpm install first.
  pause
  exit /b 1
)
node "node_modules\vite\bin\vite.js" --host 127.0.0.1 --port 5173 --open
if errorlevel 1 pause
