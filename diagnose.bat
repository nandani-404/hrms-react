@echo off
echo ========================================
echo HR Portal - Diagnostic Tool
echo ========================================
echo.

echo [1/6] Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo OK
echo.

echo [2/6] Checking npm...
npm --version
if errorlevel 1 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)
echo OK
echo.

echo [3/6] Checking if node_modules exists...
if exist "node_modules" (
    echo OK - node_modules found
) else (
    echo WARNING: node_modules not found
    echo Run: npm install
)
echo.

echo [4/6] Checking .env file...
if exist ".env" (
    echo OK - .env file found
    type .env
) else (
    echo WARNING: .env file not found
    echo Creating .env file...
    echo VITE_API_BASE_URL=http://127.0.0.1:8000/api > .env
    echo Created!
)
echo.

echo [5/6] Checking key files...
if exist "src\App.jsx" (
    echo OK - App.jsx found
) else (
    echo ERROR: App.jsx not found!
)

if exist "src\main.jsx" (
    echo OK - main.jsx found
) else (
    echo ERROR: main.jsx not found!
)

if exist "src\index.css" (
    echo OK - index.css found
) else (
    echo ERROR: index.css not found!
)
echo.

echo [6/6] Checking backend API...
echo Testing: http://127.0.0.1:8000/api/employees
curl -s http://127.0.0.1:8000/api/employees >nul 2>&1
if errorlevel 1 (
    echo WARNING: Backend API not responding
    echo Make sure backend is running: cd ..\backend ^&^& php artisan serve
) else (
    echo OK - Backend API responding
)
echo.

echo ========================================
echo Diagnostic Complete
echo ========================================
echo.
echo If all checks passed, run: npm run dev
echo If issues found, check the warnings above
echo.
pause
