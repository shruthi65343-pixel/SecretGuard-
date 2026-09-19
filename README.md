# SecretGuard — Intelligent Secret Detection & Prevention Platform

> **Defensive Developer-Security Hackathon Prototype**  
> SecretGuard intercepts accidentally exposed credentials (API keys, passwords, access tokens, secret keys, database credentials) in source code and configuration files before they reach Git repositories.

---

## 1. Executive Summary & Problem Statement

Accidental credential exposure in source control is one of the leading causes of security incidents worldwide. Developers frequently hardcode API keys or database passwords during rapid prototyping and accidentally commit them to public or shared repositories.

**SecretGuard** acts as an intelligent developer-side defensive shield. It combines multi-signal pattern analysis, Shannon entropy metrics, code context heuristics, and privacy-safe zero-disclosure fingerprinting to detect secrets locally, calculate potential blast radius impact, block unsafe Git commits, and guide developers toward safe environment-variable remediation.

---

## 2. Core Architecture & Workflow

```
┌─────────────────┐       ┌────────────────────────┐       ┌──────────────────────┐
│  Demo Project   │ ───►  │  Multi-Signal Scanner  │ ───►  │ Risk & Blast Engine  │
└─────────────────┘       └────────────────────────┘       └──────────────────────┘
                                                                       │
┌─────────────────┐       ┌────────────────────────┐                   ▼
│ React Dashboard │ ◄───  │  FastAPI Backend REST  │ ◄───  │  Zero-Disclosure     │
└─────────────────┘       └────────────────────────┘       │  Privacy Fingerprint │
                                                           └──────────────────────┘
```

### Complete End-to-End Flow:
1. **DEMO PROJECT**: Targeted source directory containing code or configuration files.
2. **PYTHON SECRET SCANNER**: Recursive scanner supporting `.py`, `.js`, `.java`, `.json`, `.yaml`, `.yml`, `.env`, `.txt`, `.config`, `.ini`.
3. **MULTI-SIGNAL DETECTION**: Combines Regex Patterns, Shannon Entropy, Surrounding Context, File Sensitivity, and Credential Severity.
4. **RISK INTELLIGENCE**: Converts scores into 4 risk tiers (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) and estimates Blast Radius impact.
5. **DECISION & PRE-COMMIT BLOCK**: Exits CLI with status code `1` (`SCAN FAILED`) to halt unsafe Git commits.
6. **REMEDIATION & VERIFICATION**: Provides safe `os.getenv(...)` code replacements and rescans code to verify `SAFE` status.
7. **FASTAPI REST BACKEND & REACT DASHBOARD**: Real-time web UI dashboard and interactive terminal simulator.

---

## 3. How Multi-Signal Detection Works

SecretGuard does **not** rely solely on basic regex. It evaluates 5 combined analytical signals (configurable total max score: 100):

| Detection Signal | Max Points | Description |
| :--- | :---: | :--- |
| **A. Pattern Signal** | **30 pts** | Matches known credential structures across 5 categories (API Key, Password, Access Token, Secret Key, Database Credential). |
| **B. Entropy Signal** | **25 pts** | Calculates Shannon Entropy \( H(X) = -\sum P(x_i) \log_2 P(x_i) \) to distinguish random strings/hashes from standard code variables. |
| **C. Context Signal** | **20 pts** | Analyzes surrounding code assignment syntax (`=`, `:`) and variable naming hints (`apiKey`, `pass`, `token`, `secret`, `cred`). |
| **D. Sensitive File** | **10 pts** | Assigns higher weight to configuration files (`.env`, `config`, `settings.json`, `.ini`). |
| **E. Credential Severity** | **15 pts** | Weights critical credentials (Database Passwords, Secret Keys) higher than standard scoped tokens. |

### Risk Level Classification:
- `0 – 24` → **LOW RISK**
- `25 – 49` → **MEDIUM RISK**
- `50 – 74` → **HIGH RISK**
- `75 – 100` → **CRITICAL RISK**

---

## 4. Secret Privacy & Zero Disclosure Guarantee

SecretGuard adheres to strict defensive security standards:
- **Raw Secret Disguise**: Detected values are **NEVER** returned, displayed, or logged. They are replaced with `[HIDDEN]`.
- **One-Way Fingerprinting**: Generates a privacy-safe SHA-256 fingerprint (e.g. `SG-8F2A91CD`) allowing findings to be tracked across scans without revealing the original credential string.
- **No External Calls**: Zero outbound network calls or credential exploitation attempts are ever performed.

---

## 5. Quick Start & Setup Instructions (Windows)

### Prerequisites
- Python 3.10+ (or Python Launcher `py`)
- Node.js v18+ & npm

### Step 1: Install Backend Dependencies
Open Terminal / PowerShell in the project directory:
```powershell
py -m pip install -r backend/requirements.txt
```

### Step 2: Test Terminal Pre-Commit Scanner CLI
Run the standalone scanner CLI on the unsafe demo project:
```powershell
py -m backend.cli demo_project
```
*Expected Output: Prints detected secrets with `[HIDDEN]` values and exits with `SECRETGUARD SCAN FAILED` (exit code 1).*

Run the CLI on the clean demo project:
```powershell
py -m backend.cli clean_demo_project
```
*Expected Output: Prints `SECRETGUARD SCAN PASSED` (exit code 0).*

### Step 3: Start FastAPI Backend
```powershell
py -m uvicorn backend.main:app --reload --port 8000
```
FastAPI interactive docs will be live at: `http://localhost:8000/docs`

### Step 4: Launch React Web Dashboard
Open a new terminal window inside the `frontend/` directory:
```powershell
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173` to explore the dashboard.

---

## 6. REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check and system operational status. |
| `POST` | `/scan` | Triggers multi-signal scanner on target path (defaults to `demo_project`). |
| `GET` | `/findings` | Returns active findings (supports `?status=` and `?risk=` filters). |
| `GET` | `/risk-summary` | Breakdown counts by risk tier, category, and average confidence. |
| `GET` | `/compliance` | Calculates prototype compliance score %, clean scan ratio, and remediation rate. |
| `GET` | `/scan-history` | Audit log of previous scan executions. |
| `POST` | `/findings/{id}/remediate` | Marks finding status as `REMEDIATED`. |
| `POST` | `/verify` | Rescans source folder; updates status to `VERIFIED` if fixed or `REQUIRES ATTENTION`. |

---

## 7. Live 2-Minute Hackathon Demo Script

1. **Demonstrate Unsafe Code**: Show `demo_project/app.py` containing demo credential `API_KEY = "FAKE_API_KEY_123456"`.
2. **Execute Terminal Scanner**: Run `py -m backend.cli demo_project`. Highlight `SECRETGUARD SCAN FAILED`, exit code 1, and zero disclosure (`Value: [HIDDEN]`, fingerprint `SG-8D8B7828`).
3. **Open Web Dashboard**: Navigate to `http://localhost:5173`. Show overview stats cards, risk breakdown bar chart, and findings table.
4. **Inspect Finding Details**: Click **Inspect** on a finding. Show multi-signal breakdown (Pattern 30, Entropy 25, Context 20), Blast Radius explanation, and safe `os.getenv(...)` code snippet.
5. **Remediate & Rescan**: Click **Remediate** in the UI. Then demonstrate `py -m backend.cli clean_demo_project` to show `SECRETGUARD SCAN PASSED` (exit code 0).
6. **Pre-Commit Simulator Tab**: Switch to the **Pre-Commit CLI** tab in the dashboard to demonstrate live commit interception.

---

## 8. Security Limitations & Disclaimers

- **Synthetic Test Data Only**: This platform is designed exclusively for testing with synthetic, mock, or fake credentials.
- **Prototype Scoring Model**: Risk levels, confidence scores, and compliance percentages are prototype calculations for demonstration purposes.

---

## 9. Future Roadmap & Enhancements

- VS Code & JetBrains IDE extensions for real-time inline secret linting.
- Automated `.git/hooks/pre-commit` installer CLI command (`secretguard install-hook`).
- Custom regex pattern builder interface in web UI.
