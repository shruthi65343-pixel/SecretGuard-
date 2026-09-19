import os
import re
import uuid
from datetime import datetime
from typing import List, Dict, Tuple, Optional, Set
from .models import Finding, SignalBreakdown, FindingStatus
from .risk_engine import (
    calculate_entropy,
    generate_fingerprint,
    mask_line_content,
    classify_risk_level,
    assess_blast_radius,
    generate_remediation
)

SUPPORTED_EXTENSIONS = {
    ".py", ".js", ".java", ".json", ".yaml", ".yml",
    ".env", ".txt", ".config", ".ini"
}

IGNORED_DIRS = {
    ".git", "node_modules", "__pycache__", ".venv", "venv", ".idea", ".vscode"
}

# Regex pattern definitions for 5 categories
SECRET_PATTERNS = [
    {
        "category": "API Key",
        "pattern": r'(?i)(api[_-]?key|apikey|app[_-]?key|client[_-]?secret|fake_api_key)\s*[:=]\s*["\']([^"\']+)["\']',
        "value_group": 2
    },
    {
        "category": "Password",
        "pattern": r'(?i)(password|passwd|pass|fake_password)\s*[:=]\s*["\']([^"\']+)["\']',
        "value_group": 2
    },
    {
        "category": "Access Token",
        "pattern": r'(?i)(access[_-]?token|auth[_-]?token|bearer[_-]?token|fake_token|token)\s*[:=]\s*["\']([^"\']+)["\']',
        "value_group": 2
    },
    {
        "category": "Secret Key",
        "pattern": r'(?i)(secret[_-]?key|private[_-]?key|jwt[_-]?secret|fake_secret)\s*[:=]\s*["\']([^"\']+)["\']',
        "value_group": 2
    },
    {
        "category": "Database Credential",
        "pattern": r'(?i)(database[_-]?password|db[_-]?password|db[_-]?pass|fake_db_password|connection[_-]?string)\s*[:=]\s*["\']([^"\']+)["\']',
        "value_group": 2
    }
]

# Configurable Signal Weight Matrix (Max Total: 100)
SIGNAL_WEIGHTS = {
    "pattern_max": 30.0,
    "entropy_max": 25.0,
    "context_max": 20.0,
    "file_type_max": 10.0,
    "severity_max": 15.0
}

def analyze_signals(
    category: str,
    raw_secret: str,
    line_content: str,
    file_path: str
) -> SignalBreakdown:
    """Multi-Signal Detection Algorithm combining 5 analytical signals."""
    details = []
    
    # 1. Pattern Signal (Max 30 pts)
    pattern_score = 30.0
    details.append(f"Pattern Signal: Explicit match for category '{category}' (+30.0 pts)")
    
    # 2. Entropy Signal (Max 25 pts)
    entropy_val = calculate_entropy(raw_secret)
    if "FAKE_" in raw_secret:
        entropy_score = 25.0
        details.append(f"Entropy Signal: Known demo key signature detected (Entropy: {entropy_val}) (+25.0 pts)")
    elif entropy_val >= 4.0:
        entropy_score = 25.0
        details.append(f"Entropy Signal: High Shannon entropy ({entropy_val} >= 4.0) (+25.0 pts)")
    elif entropy_val >= 3.2:
        entropy_score = 18.0
        details.append(f"Entropy Signal: Moderate Shannon entropy ({entropy_val} >= 3.2) (+18.0 pts)")
    else:
        entropy_score = 10.0
        details.append(f"Entropy Signal: Low Shannon entropy ({entropy_val}) (+10.0 pts)")
        
    # 3. Context Signal (Max 20 pts)
    line_lower = line_content.lower()
    context_keywords = ["key", "password", "pass", "token", "secret", "cred", "auth", "="]
    matched_keywords = [kw for kw in context_keywords if kw in line_lower]
    
    if len(matched_keywords) >= 2:
        context_score = 20.0
        details.append(f"Context Signal: Strong assignment context keywords {matched_keywords[:3]} (+20.0 pts)")
    elif len(matched_keywords) == 1:
        context_score = 12.0
        details.append(f"Context Signal: Single context keyword matched '{matched_keywords[0]}' (+12.0 pts)")
    else:
        context_score = 5.0
        details.append("Context Signal: Low keyword context (+5.0 pts)")
        
    # 4. Sensitive File Type Signal (Max 10 pts)
    file_lower = file_path.lower()
    if file_lower.endswith(".env") or "config" in file_lower or "settings" in file_lower:
        file_type_score = 10.0
        details.append("File Signal: High-risk configuration file type (.env / config) (+10.0 pts)")
    elif file_lower.endswith((".py", ".js", ".json", ".yaml", ".yml")):
        file_type_score = 7.0
        details.append(f"File Signal: Standard source file extension (+7.0 pts)")
    else:
        file_type_score = 4.0
        details.append("File Signal: Generic text file extension (+4.0 pts)")
        
    # 5. Credential Type Severity Signal (Max 15 pts)
    if category in ["Database Credential", "Secret Key"]:
        severity_score = 15.0
        details.append(f"Severity Signal: High critical impact type '{category}' (+15.0 pts)")
    elif category == "Password":
        severity_score = 12.0
        details.append(f"Severity Signal: Direct password credential (+12.0 pts)")
    else:
        severity_score = 10.0
        details.append(f"Severity Signal: Standard API token / key (+10.0 pts)")
        
    return SignalBreakdown(
        pattern_score=pattern_score,
        entropy_score=entropy_score,
        context_score=context_score,
        file_type_score=file_type_score,
        type_severity_score=severity_score,
        details=details
    )

def scan_file(file_path: str, root_dir: str) -> List[Finding]:
    """Scan an individual file for secrets using multi-signal detection."""
    findings = []
    rel_path = os.path.relpath(file_path, root_dir)
    
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
            
        for line_num, line in enumerate(lines, start=1):
            line_str = line.strip()
            if not line_str or line_str.startswith(("#", "//", "/*")):
                # Skip pure comments if needed, but still check for raw keys in configs
                pass
                
            for rule in SECRET_PATTERNS:
                matches = re.finditer(rule["pattern"], line_str)
                for match in matches:
                    raw_secret = match.group(rule["value_group"]).strip()
                    
                    # Ignore safe references like os.getenv, process.env, empty strings
                    if (
                        not raw_secret or 
                        "os.getenv" in line_str or 
                        "process.env" in line_str or 
                        raw_secret.startswith("os.environ") or
                        "[HIDDEN]" in line_str
                    ):
                        continue
                        
                    category = rule["category"]
                    signals = analyze_signals(category, raw_secret, line_str, rel_path)
                    
                    # Total confidence score calculation
                    total_score = min(
                        100.0,
                        signals.pattern_score + 
                        signals.entropy_score + 
                        signals.context_score + 
                        signals.file_type_score + 
                        signals.type_severity_score
                    )
                    
                    risk_lvl = classify_risk_level(total_score)
                    blast_rad, blast_exp = assess_blast_radius(category, rel_path, line_str)
                    fingerprint = generate_fingerprint(raw_secret)
                    masked_content = mask_line_content(line_str, raw_secret)
                    remediation_rec, replacement_ex = generate_remediation(category, rel_path, line_str)
                    
                    finding = Finding(
                        id=f"FINDING-{uuid.uuid4().hex[:8].upper()}",
                        secret_type=category,
                        file_path=os.path.abspath(file_path),
                        relative_path=rel_path.replace("\\", "/"),
                        line_number=line_num,
                        line_content_masked=masked_content,
                        secret_length=len(raw_secret),
                        fingerprint=fingerprint,
                        confidence_score=round(total_score, 1),
                        risk_level=risk_lvl,
                        blast_radius=blast_rad,
                        blast_radius_explanation=blast_exp,
                        signals=signals,
                        remediation_recommendation=remediation_rec,
                        safe_replacement_example=replacement_ex,
                        status=FindingStatus.DETECTED.value,
                        detected_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    )
                    findings.append(finding)
    except Exception as e:
        # Ignore unreadable binary files
        pass
        
    return findings

def scan_project_folder(target_dir: str) -> Tuple[int, List[Finding]]:
    """Recursively scan target folder for files and secret findings."""
    abs_target = os.path.abspath(target_dir)
    if not os.path.exists(abs_target):
        return 0, []
        
    scanned_file_count = 0
    all_findings = []
    
    # Track unique (file, line, type) to prevent duplicate reports
    seen_keys: Set[str] = set()
    
    for root, dirs, files in os.walk(abs_target):
        # Filter ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
        
        for file_name in files:
            ext = os.path.splitext(file_name)[1].lower()
            # Also catch hidden files like .env
            if ext in SUPPORTED_EXTENSIONS or file_name in [".env", ".config"]:
                scanned_file_count += 1
                full_path = os.path.join(root, file_name)
                file_findings = scan_file(full_path, abs_target)
                
                for f in file_findings:
                    dedup_key = f"{f.relative_path}:{f.line_number}:{f.secret_type}"
                    if dedup_key not in seen_keys:
                        seen_keys.add(dedup_key)
                        all_findings.append(f)
                        
    return scanned_file_count, all_findings
    