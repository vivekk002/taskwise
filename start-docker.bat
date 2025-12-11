@echo off
echo Checking Docker status...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running! Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker is running. Building and starting the application...
docker compose up --build
pause
