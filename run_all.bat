@echo off
title SecretGuard Launcher
echo ============================================================
echo         SECRETGUARD DEFENSIVE SECURITY PLATFORM           
echo ============================================================
echo.

echo [1/3] Installing Python dependencies...
py -m pip install -r backend/requirements.txt
echo.

echo [2/3] Starting FastAPI Backend on http://localhost:8000 ...
start "SecretGuard FastAPI Backend" cmd /k "py -m uvicorn backend.main:app --reload --port 8000"

echo [3/3] Starting React Vite Dashboard on http://localhost:5173 ...
cd frontend
start "SecretGuard React Dashboard" cmd /k "npm run dev"

echo.
echo ============================================================
echo SecretGuard is starting!
echo Backend:   http://localhost:8000
echo Dashboard: http://localhost:5173
echo ============================================================
pause
