@echo off
setlocal
cd /d "%~dp0"

:menu
cls
echo ========================================================
echo     FAIZAN BANK - AI CREDIT CARD PREDICTOR MANAGER
echo ========================================================
echo  [1] Start Development Server (http://localhost:3000)
echo  [2] Build Production Bundle (dist/)
echo  [3] Push Updates to GitHub
echo  [4] Exit
echo ========================================================
set /p choice="Enter option (1-4) [Default 1]: "

if "%choice%"=="" set choice=1
if "%choice%"=="1" goto run_dev
if "%choice%"=="2" goto build_prod
if "%choice%"=="3" goto push_git
if "%choice%"=="4" goto exit_cmd
echo Invalid selection.
timeout /t 2 >nul
goto menu

:run_dev
cls
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
)
echo ========================================================
echo Starting development server on http://localhost:3000 ...
echo ========================================================
call npm run dev
pause
goto menu

:build_prod
cls
echo ========================================================
echo Building optimized production bundle...
echo ========================================================
call npm run build
echo.
echo Build finished! Output directory: dist\
pause
goto menu

:push_git
cls
echo ========================================================
echo Pushing project to GitHub...
echo Target: https://github.com/RahmaniFaizan/ai-credit-card-approval-predictor
echo ========================================================
git push -u origin main
if %errorlevel% equ 0 (
  echo.
  echo [SUCCESS] Code successfully pushed to GitHub!
) else (
  echo.
  echo [INFO] If push failed, make sure you created the repo on GitHub:
  echo https://github.com/new?name=ai-credit-card-approval-predictor
)
pause
goto menu

:exit_cmd
exit /b 0
