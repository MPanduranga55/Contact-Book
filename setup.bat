@echo off
echo Setting up Contact Book Application...

echo.
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

echo.
echo Setup complete! 
echo.
echo To start the application:
echo 1. Open a terminal and run: cd backend && npm start
echo 2. Open another terminal and run: cd frontend && npm start
echo 3. Open http://localhost:3000 in your browser
echo.
pause
