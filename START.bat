@echo off
echo.
echo ========================================
echo   File Upload System - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js found
echo.

REM Check if npm dependencies are installed
if not exist "node_modules\" (
    echo [!] Installing npm packages...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo [✓] Dependencies installed
) else (
    echo [✓] Dependencies already installed
)

echo.
echo ========================================
echo   Starting File Upload Server...
echo ========================================
echo.
echo Server will run on: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call npm start
pause
