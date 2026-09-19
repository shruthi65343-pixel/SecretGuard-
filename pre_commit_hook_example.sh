#!/usr/bin/env bash
# SecretGuard Pre-Commit Hook Example (.git/hooks/pre-commit)
# Prevents accidental commits containing hardcoded API keys, passwords, or tokens.

echo "Running SecretGuard Pre-Commit Scanner..."

# Execute SecretGuard CLI scanner on repository
python -m backend.cli demo_project

SCAN_RESULT=$?

if [ $SCAN_RESULT -ne 0 ]; then
    echo "--------------------------------------------------------"
    echo "ERROR: SecretGuard detected hardcoded credentials!"
    echo "Commit BLOCKED. Please remove or remediate secrets."
    echo "--------------------------------------------------------"
    exit 1
fi

echo "SecretGuard check passed. Proceeding with commit."
exit 0
