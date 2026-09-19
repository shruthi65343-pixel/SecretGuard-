@echo off
:: SecretGuard Windows Pre-Commit Hook Example (.git/hooks/pre-commit.bat)
:: Prevents accidental commits containing hardcoded credentials.

echo Running SecretGuard Pre-Commit Scanner...

py -m backend.cli demo_project

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================================
    echo ERROR: SecretGuard detected hardcoded credentials!
    echo Commit BLOCKED. Please remove or remediate secrets.
    echo ========================================================
    exit /b 1
)

echo SecretGuard check passed. Proceeding with commit.
exit /b 0
