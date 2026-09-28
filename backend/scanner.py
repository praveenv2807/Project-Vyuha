import time
from mock_data import MOCK_VULNERABILITIES

def run_security_scan(target_url: str):
    # Simulates automated AST/DAST scan delay
    time.sleep(1)
    return {
        "target": target_url,
        "scan_time": "2026-09-27T00:00:00Z",
        "total_vulnerabilities": len(MOCK_VULNERABILITIES),
        "security_score": 68,
        "vulnerabilities": MOCK_VULNERABILITIES
    }