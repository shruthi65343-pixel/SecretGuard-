from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from enum import Enum
from datetime import datetime

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class FindingStatus(str, Enum):
    DETECTED = "DETECTED"
    REMEDIATED = "REMEDIATED"
    VERIFIED = "VERIFIED"
    REQUIRES_ATTENTION = "REQUIRES ATTENTION"

class SignalBreakdown(BaseModel):
    pattern_score: float = 0.0
    entropy_score: float = 0.0
    context_score: float = 0.0
    file_type_score: float = 0.0
    type_severity_score: float = 0.0
    details: List[str] = []

class Finding(BaseModel):
    id: str
    secret_type: str
    file_path: str
    relative_path: str
    line_number: int
    line_content_masked: str
    secret_length: int
    fingerprint: str
    confidence_score: float
    risk_level: str
    blast_radius: str
    blast_radius_explanation: str
    signals: SignalBreakdown
    remediation_recommendation: str
    safe_replacement_example: str
    status: str = FindingStatus.DETECTED.value
    detected_at: str

class ScanRequest(BaseModel):
    target_path: Optional[str] = "demo_project"

class ScanResponse(BaseModel):
    scan_id: str
    timestamp: str
    target_path: str
    files_scanned: int
    secrets_detected: int
    low_risk: int
    medium_risk: int
    high_risk: int
    critical_risk: int
    findings: List[Finding]
    scan_status: str

class RiskSummary(BaseModel):
    total_findings: int
    risk_counts: Dict[str, int]
    category_counts: Dict[str, int]
    average_confidence: float
    highest_risk_level: str

class ComplianceReport(BaseModel):
    total_scans: int
    clean_scans: int
    findings_detected: int
    findings_remediated: int
    findings_verified: int
    compliance_score: float
    verification_rate: float
    remediation_rate: float
    disclaimer: str

class RemediateRequest(BaseModel):
    finding_id: str

class VerifyRequest(BaseModel):
    target_path: Optional[str] = "demo_project"
