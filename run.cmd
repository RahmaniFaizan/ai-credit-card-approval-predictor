@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

rem If node_modules missing, install dependencies
if not exist "node_modules" (
  echo Installing dependencies...
  npm install || goto :error
)

echo Starting dev server on http://localhost:3000
npm run dev

goto :eof
:error
echo Failed to install dependencies. Fix npm errors and re-run this script.
exit /b 1
