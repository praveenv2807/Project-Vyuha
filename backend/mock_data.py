MOCK_VULNERABILITIES = [
    {
        "id": "VULN-101",
        "title": "SQL Injection in User Login Endpoint",
        "severity": "CRITICAL",
        "score": 9.8,
        "cve": "CVE-2023-3456",
        "location": "backend/auth.py:42",
        "description": "User input passed directly into raw SQL query without sanitization or parameterized inputs.",
        "code_snippet": "query = f\"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'\""
    },
    {
        "id": "VULN-102",
        "title": "Stored Cross-Site Scripting (XSS)",
        "severity": "HIGH",
        "score": 8.2,
        "cve": "CVE-2023-8912",
        "location": "frontend/components/Comments.jsx:15",
        "description": "User comments rendered using dangerouslySetInnerHTML without HTML sanitization.",
        "code_snippet": "<div dangerouslySetInnerHTML={{ __html: comment.body }} />"
    },
    {
        "id": "VULN-103",
        "title": "Hardcoded Secret Key in Repository",
        "severity": "MEDIUM",
        "score": 6.5,
        "cve": "CVE-2022-1044",
        "location": "backend/config.py:8",
        "description": "JWT Signing Secret hardcoded in source control.",
        "code_snippet": "JWT_SECRET = 'super_secret_key_12345!'"
    }
]