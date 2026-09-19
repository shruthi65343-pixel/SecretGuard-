import os
import uuid
from datetime import datetime
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .models import (
    ScanRequest, ScanResponse, Finding, RiskSummary, ComplianceReport,
    RemediateRequest, VerifyRequest, FindingStatus
)
from .scanner import scan_project_folder

app = FastAPI(
    title="SecretGuard API",
    description="Intelligent Secret Detection & Prevention Platform (Defensive Prototype)",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage state for prototype
GLOBAL_STATE: Dict = {
    "current_findings": [],
    "scan_history": [],
    "total_scans": 0,
    "clean_scans": 0,
    "last_target_path": "demo_project"
}

@app.get("/")
def read_root():
    return {
        "service": "SecretGuard API",
        "description": "Intelligent Secret Detection & Prevention Platform",
        "status": "OPERATIONAL",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/scan", response_model=ScanResponse)
def run_scan(request: ScanRequest):
    target = request.target_path or "demo_project"
    
    # Resolve target directory (handle relative to project root)
    if not os.path.isabs(target):
        # Look relative to project root (parent of backend folder)
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        target_abs = os.path.join(base_dir, target)
        if not os.path.exists(target_abs):
            # Try current working directory
            target_abs = os.path.abspath(target)
    else:
        target_abs = target
        
    if not os.path.exists(target_abs):
        raise HTTPException(
            status_code=404, 
            detail=f"Target directory '{target}' not found at path '{target_abs}'"
        )
        
    scanned_count, fresh_findings = scan_project_folder(target_abs)
    
    # Update global state findings while preserving status of existing findings if still present
    existing_by_dedup = {
        f"{f.relative_path}:{f.line_number}:{f.secret_type}": f 
        for f in GLOBAL_STATE["current_findings"]
    }
    
    merged_findings = []
    low_cnt = medium_cnt = high_cnt = critical_cnt = 0
    
    for f in fresh_findings:
        dedup_key = f"{f.relative_path}:{f.line_number}:{f.secret_type}"
        if dedup_key in existing_by_dedup:
            # Preserve existing status (e.g., REMEDIATED)
            existing_f = existing_by_dedup[dedup_key]
            f.status = existing_f.status
            
        merged_findings.append(f)
        
        # Risk stats
        if f.risk_level == "CRITICAL":
            critical_cnt += 1
        elif f.risk_level == "HIGH":
            high_cnt += 1
        elif f.risk_level == "MEDIUM":
            medium_cnt += 1
        else:
            low_cnt += 1

    GLOBAL_STATE["current_findings"] = merged_findings
    GLOBAL_STATE["last_target_path"] = target
    GLOBAL_STATE["total_scans"] += 1
    
    scan_status = "FAILED" if len(merged_findings) > 0 else "PASSED"
    if scan_status == "PASSED":
        GLOBAL_STATE["clean_scans"] += 1
        
    scan_record = {
        "scan_id": f"SCAN-{uuid.uuid4().hex[:8].upper()}",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "target_path": target,
        "files_scanned": scanned_count,
        "secrets_detected": len(merged_findings),
        "low_risk": low_cnt,
        "medium_risk": medium_cnt,
        "high_risk": high_cnt,
        "critical_risk": critical_cnt,
        "findings": merged_findings,
        "scan_status": scan_status
    }
    
    GLOBAL_STATE["scan_history"].insert(0, scan_record)
    return scan_record

@app.get("/findings", response_model=List[Finding])
def get_findings(
    status: Optional[str] = Query(None, description="Filter by status (DETECTED, REMEDIATED, VERIFIED)"),
    risk: Optional[str] = Query(None, description="Filter by risk (CRITICAL, HIGH, MEDIUM, LOW)")
):
    findings = GLOBAL_STATE["current_findings"]
    if status:
        findings = [f for f in findings if f.status.upper() == status.upper()]
    if risk:
        findings = [f for f in findings if f.risk_level.upper() == risk.upper()]
    return findings

@app.get("/risk-summary", response_model=RiskSummary)
def get_risk_summary():
    findings = GLOBAL_STATE["current_findings"]
    risk_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
    category_counts = {
        "API Key": 0,
        "Password": 0,
        "Access Token": 0,
        "Secret Key": 0,
        "Database Credential": 0
    }
    
    total_conf = 0.0
    highest_lvl = "LOW"
    risk_hierarchy = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}
    
    for f in findings:
        risk_counts[f.risk_level] = risk_counts.get(f.risk_level, 0) + 1
        category_counts[f.secret_type] = category_counts.get(f.secret_type, 0) + 1
        total_conf += f.confidence_score
        
        if risk_hierarchy.get(f.risk_level, 0) > risk_hierarchy.get(highest_lvl, 0):
            highest_lvl = f.risk_level
            
    avg_conf = round(total_conf / len(findings), 1) if findings else 0.0
    
    return RiskSummary(
        total_findings=len(findings),
        risk_counts=risk_counts,
        category_counts=category_counts,
        average_confidence=avg_conf,
        highest_risk_level=highest_lvl if findings else "NONE"
    )

@app.get("/compliance", response_model=ComplianceReport)
def get_compliance():
    findings = GLOBAL_STATE["current_findings"]
    tot_findings = len(findings)
    remediated_cnt = sum(1 for f in findings if f.status == FindingStatus.REMEDIATED.value)
    verified_cnt = sum(1 for f in findings if f.status == FindingStatus.VERIFIED.value)
    
    total_scans = GLOBAL_STATE["total_scans"]
    clean_scans = GLOBAL_STATE["clean_scans"]
    
    remediation_rate = round((remediated_cnt + verified_cnt) / tot_findings * 100, 1) if tot_findings > 0 else 100.0
    verification_rate = round(verified_cnt / tot_findings * 100, 1) if tot_findings > 0 else 100.0
    clean_rate = round(clean_scans / total_scans * 100, 1) if total_scans > 0 else 100.0
    
    # Calculate weighted compliance score
    comp_score = round(clean_rate * 0.3 + remediation_rate * 0.4 + verification_rate * 0.3, 1)
    
    return ComplianceReport(
        total_scans=total_scans,
        clean_scans=clean_scans,
        findings_detected=tot_findings,
        findings_remediated=remediated_cnt,
        findings_verified=verified_cnt,
        compliance_score=comp_score,
        verification_rate=verification_rate,
        remediation_rate=remediation_rate,
        disclaimer="Prototype compliance estimation for demonstration purposes only. Not an official security certification."
    )

@app.get("/scan-history")
def get_scan_history():
    return GLOBAL_STATE["scan_history"]

@app.post("/findings/{finding_id}/remediate")
def remediate_finding(finding_id: str):
    for f in GLOBAL_STATE["current_findings"]:
        if f.id == finding_id:
            f.status = FindingStatus.REMEDIATED.value
            return {
                "message": f"Finding {finding_id} successfully marked as REMEDIATED.",
                "finding": f
            }
    raise HTTPException(status_code=404, detail=f"Finding ID '{finding_id}' not found.")

@app.post("/verify")
def verify_remediation(request: VerifyRequest):
    target = request.target_path or GLOBAL_STATE.get("last_target_path", "demo_project")
    
    # Resolve target directory
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_abs = os.path.join(base_dir, target) if not os.path.isabs(target) else target
    if not os.path.exists(target_abs):
        target_abs = os.path.abspath(target)
        
    scanned_count, fresh_findings = scan_project_folder(target_abs)
    fresh_keys = {
        f"{f.relative_path}:{f.line_number}:{f.secret_type}" 
        for f in fresh_findings
    }
    
    updated_records = []
    for f in GLOBAL_STATE["current_findings"]:
        dedup_key = f"{f.relative_path}:{f.line_number}:{f.secret_type}"
        if dedup_key not in fresh_keys:
            # Finding has been removed / resolved in code!
            f.status = FindingStatus.VERIFIED.value
        else:
            if f.status == FindingStatus.REMEDIATED.value:
                # Marked remediated in UI, but file still contains raw secret!
                f.status = FindingStatus.REQUIRES_ATTENTION.value
        updated_records.append(f)
        
    GLOBAL_STATE["current_findings"] = updated_records
    
    return {
        "status": "VERIFICATION_COMPLETE",
        "target_path": target,
        "active_secrets_remaining": len(fresh_findings),
        "findings": updated_records
    }
