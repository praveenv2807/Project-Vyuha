import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

def generate_ai_fix(vulnerability_details: str, source_code: str = "") -> str:
    if not client:
        return "Error: GEMINI_API_KEY is missing in backend .env file."
        
    prompt = f"""
You are an expert Application Security Engineer specializing in secure code remediation.

Vulnerability Details:
{vulnerability_details}

Original Source Code (if available):
{source_code if source_code else "Not provided. Generate a secure implementation pattern."}

Task:
1. Explain the security risk concisely.
2. Provide a production-ready, secure code patch.
3. Briefly explain why the patch resolves the issue.

Format the output clearly in Markdown.
"""
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text
    except Exception as e:
        return f"Error generating AI remediation patch: {str(e)}"          