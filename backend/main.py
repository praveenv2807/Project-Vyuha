from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import requests
import urllib3
from datetime import datetime

# Disable SSL verification warnings for quick live scanning
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = FastAPI(title="Vyuha Security Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanRequest(BaseModel):
    url: Optional[str] = None
    target_url: Optional[str] = None
    target: Optional[str] = None

class RemediateRequest(BaseModel):
    title: str
    description: str
    code_snippet: Optional[str] = None
    location: Optional[str] = None

def perform_live_security_audit(target_url: str):
    vulnerabilities = []
    
    # Fix: Corrected variable name from targetUrl to target_url
    if not target_url.startswith(('http://', 'https://')):
        target_url = 'https://' + target_url

    try:
        response = requests.get(target_url, timeout=10, verify=False)
        headers = response.headers

        # Check 1: Missing Strict-Transport-Security (HSTS)
        if 'Strict-Transport-Security' not in headers:
            vulnerabilities.append({
                "id": "VYUHA-HDR-001",
                "cve": "CWE-523",
                "title": "Missing HTTP Strict Transport Security (HSTS) Header",
                "severity": "HIGH",
                "cvss": "7.5",
                "category": "Network & Header Security",
                "location": f"Response Headers ({target_url})",
                "description": "The server does not enforce encrypted connections via HSTS headers, leaving connections vulnerable to Man-in-the-Middle (MitM) packet inspection.",
                "code_snippet": f"HTTP/1.1 {response.status_code}\n" + "\n".join([f"{k}: {v}" for k, v in list(headers.items())[:3]])
            })

        # Check 2: Missing Content Security Policy (CSP)
        if 'Content-Security-Policy' not in headers:
            vulnerabilities.append({
                "id": "VYUHA-HDR-002",
                "cve": "CWE-1021",
                "title": "Missing Content Security Policy (CSP)",
                "severity": "MEDIUM",
                "cvss": "6.1",
                "category": "Client-Side Protection",
                "location": "HTTP Header / Meta Tag",
                "description": "Content Security Policy (CSP) is absent. The application lacks protection against Cross-Site Scripting (XSS) and data injection attacks.",
                "code_snippet": "Header 'Content-Security-Policy' is missing from server response."
            })

        # Check 3: Missing X-Frame-Options (Clickjacking Risk)
        if 'X-Frame-Options' not in headers:
            vulnerabilities.append({
                "id": "VYUHA-HDR-003",
                "cve": "CWE-1021",
                "title": "Missing X-Frame-Options (Clickjacking Risk)",
                "severity": "MEDIUM",
                "cvss": "5.4",
                "category": "UI Redirection & Framing",
                "location": f"Response Headers ({target_url})",
                "description": "Target site can be embedded inside an <iframe>, enabling Clickjacking attacks.",
                "code_snippet": "Missing X-Frame-Options: DENY or SAMEORIGIN"
            })

        # Check 4: Insecure Cookie Flags
        for cookie in response.cookies:
            if not cookie.secure:
                vulnerabilities.append({
                    "id": f"VYUHA-CK-{cookie.name}",
                    "cve": "CWE-614",
                    "title": f"Insecure Cookie Flag on '{cookie.name}'",
                    "severity": "HIGH",
                    "cvss": "7.2",
                    "category": "Session Management",
                    "location": f"Set-Cookie: {cookie.name}",
                    "description": "Sensitive session cookie transmitted without the 'Secure' attribute over plaintext channels.",
                    "code_snippet": f"Set-Cookie: {cookie.name}={cookie.value}"
                })

    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to reach target URL: {str(e)}")

    score = max(20, 100 - (len(vulnerabilities) * 18))

    return {
        "target": target_url,
        "security_score": score,
        "scan_time": datetime.utcnow().isoformat(),
        "vulnerabilities": vulnerabilities
    }

@app.post("/api/scan")
async def scan_endpoint(payload: ScanRequest):
    target = payload.url or payload.target_url or payload.target
    if not target:
        raise HTTPException(status_code=422, detail="Missing required target parameter ('url', 'target_url', or 'target')")
    
    return perform_live_security_audit(target)

@app.post("/api/remediate")
async def remediate_endpoint(payload: RemediateRequest):
    # Generates custom remediation patch based on vulnerability
    patch = f"""// VYUHAAI AUTOMATED SECURITY REMEDIATION PATCH
// Target Vulnerability: {payload.title}
// Location: {payload.location or 'System Configuration'}

// Recommended Code Fix:
# FastApi / Uvicorn Header Middleware Enforcement:
@app.middleware("http")
add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self';"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    return response
"""
    return {"patch": patch}