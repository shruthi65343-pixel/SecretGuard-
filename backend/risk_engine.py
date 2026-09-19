import math
import hashlib
import re
from typing import Tuple, Dict

def calculate_entropy(text: str) -> float:
    """Calculate Shannon entropy for a given string."""
    if not text:
        return 0.0
    prob = [float(text.count(c)) / len(text) for c in dict.fromkeys(list(text))]
    entropy = -sum([p * math.log(p) / math.log(2) for p in prob if p > 0])
    return round(entropy, 2)

def generate_fingerprint(secret_val: str) -> str:
    """Generate a privacy-safe one-way SHA-256 fingerprint for secret tracking."""
    if not secret_val:
        return "SG-00000000"
    hash_obj = hashlib.sha256(secret_val.encode('utf-8'))
    hex_hash = hash_obj.hexdigest().upper()
    return f"SG-{hex_hash[:8]}"

def mask_line_content(line_content: str, raw_secret: str) -> str:
    """Never disclose the actual secret value. Replace with [HIDDEN]."""
    if not raw_secret or not line_content:
        return line_content
    # Safe replacement
    return line_content.replace(raw_secret, "[HIDDEN]")

def classify_risk_level(score: float) -> str:
    """Convert confidence/risk score (0-100) to Risk Level."""
    if score >= 75:
        return "CRITICAL"
    elif score >= 50:
        return "HIGH"
    elif score >= 25:
        return "MEDIUM"
    else:
        return "LOW"

def assess_blast_radius(secret_type: str, file_path: str, line_content: str) -> Tuple[str, str]:
    """Estimate potential impact scope based on secret type and contextual indicators."""
    file_lower = file_path.lower()
    line_lower = line_content.lower()
    
    # Contextual keywords
    is_prod = any(k in file_lower or k in line_lower for k in ["prod", "production", "master", "main", "deploy"])
    is_db = secret_type == "Database Credential" or any(k in file_lower or k in line_lower for k in ["db", "database", "sql", "postgres", "mysql"])
    is_admin = any(k in file_lower or k in line_lower for k in ["admin", "root", "superuser"])
    
    if is_db or (is_prod and is_admin):
        return (
            "CRITICAL",
            "Exposed database or root configuration credential risks full data breach, data corruption, and infrastructure compromise."
        )
    elif secret_type == "Secret Key" or is_prod:
        return (
            "HIGH",
            "Exposed secret keys or production variables allow session forgery, unauthorized encryption access, or privilege escalation."
        )
    elif secret_type in ["API Key", "Password"]:
        return (
            "HIGH" if is_admin else "MEDIUM",
            "Exposed credentials allow unauthorized service calls, quota consumption, or access to linked user resources."
        )
    elif secret_type == "Access Token":
        return (
            "MEDIUM",
            "Access tokens grant temporary authentication scope; impact depends on token permissions and lifespan."
        )
    else:
        return (
            "LOW",
            "Low potential blast radius. Credential appears restricted to localized or developer-scope usage."
        )

def generate_remediation(secret_type: str, file_path: str, line_content: str) -> Tuple[str, str]:
    """Generate safe remediation guidance and safe replacement code snippet."""
    file_lower = file_path.lower()
    is_js = file_lower.endswith(".js") or file_lower.endswith(".ts") or file_lower.endswith(".json")
    
    # Variable extraction if possible
    var_match = re.search(r'([A-Za-z0-9_]+)\s*[:=]', line_content)
    var_name = var_match.group(1) if var_match else "SECRET_VAR"
    
    if is_js:
        example = f"const {var_name} = process.env.{var_name};"
        rec = (
            f"Extract the hardcoded {secret_type} into an environment variable or `.env` file loaded via `dotenv`. "
            f"Never commit secret strings directly into source repositories."
        )
    else:
        example = f"import os\n{var_name} = os.getenv('{var_name}')"
        rec = (
            f"Move the sensitive {secret_type} to an environment variable or local secrets manager (e.g. `.env` file). "
            f"Reference it in code using `os.getenv('{var_name}')`."
        )
    
    # Add standard security revocation notice
    rec += " IMPORTANT: If this credential was real and ever committed to a remote repo, rotate or revoke it immediately."
    return rec, example
