@echo off
echo ========================================
echo HR Portal - Installation Script
echo ========================================
echo.

echo [1/3] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo [2/3] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo [3/3] Setup complete!
echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo The portal will be available at:
echo   http://localhost:3000
echo.
echo API endpoint configured:
echo   http://127.0.0.1:8000/api
echo.
pause
