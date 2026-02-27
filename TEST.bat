@echo off
REM Test script to send a file upload request to the server
REM Make sure the server is running (npm start) before running this

echo Testing File Upload System...
echo.

REM Check if curl is available
where curl >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: curl is not installed or not in PATH
    echo Please install Git Bash or use Windows 10+ which includes curl
    pause
    exit /b 1
)

REM Variables
set SERVER_URL=http://localhost:3000/upload
set RECIPIENT_EMAIL=your-email@gmail.com
set SENDER_NAME=Test User
set TEST_FILE=test.txt

REM Create a test file if it doesn't exist
if not exist "%TEST_FILE%" (
    echo Creating test file...
    echo This is a test file for the File Upload System > %TEST_FILE%
)

echo Sending test request...
echo URL: %SERVER_URL%
echo Recipient: %RECIPIENT_EMAIL%
echo.

REM Send the request
curl -X POST %SERVER_URL% ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -F "file=@%TEST_FILE%" ^
  -F "recipientEmail=%RECIPIENT_EMAIL%" ^
  -F "senderName=%SENDER_NAME%"

echo.
echo.
if %errorlevel% equ 0 (
    echo [✓] Request sent successfully!
    echo Check the server logs and your email inbox.
) else (
    echo [✗] Request failed. Make sure the server is running.
)

pause
