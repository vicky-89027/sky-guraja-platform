@echo off
title Push Sri Krishna Yadav Youth Guraja to GitHub
cd /d "%~dp0"
echo =======================================================
echo Pushing Sri Krishna Yadav Youth Guraja to GitHub...
echo Repository: https://github.com/venkatasaitejaavula/sky-guraja-platform.git
echo =======================================================
git push -u origin main
echo.
echo =======================================================
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Code pushed to GitHub successfully!
    echo Now open https://vercel.com/new to deploy.
) else (
    echo [NOTICE] If prompted above, please sign in to your GitHub account.
)
echo =======================================================
pause
