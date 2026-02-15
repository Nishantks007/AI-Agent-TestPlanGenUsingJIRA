import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

JIRA_BASE_URL = os.getenv("JIRA_BASE_URL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")
JIRA_EMAIL = os.getenv("JIRA_EMAIL", "nishant@ai-vault.com") # Default/Fallback if not in .env

if not JIRA_BASE_URL or not JIRA_API_TOKEN:
    print("❌ Error: Missing JIRA credentials in .env")
    exit(1)

auth = (JIRA_EMAIL, JIRA_API_TOKEN)
headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
}

try:
    # Build the URL - remove trailing slash if present to avoid double slashes
    base_url = JIRA_BASE_URL.rstrip('/')
    url = f"{base_url}/rest/api/3/myself"
    
    print(f"Testing connection to: {url}")
    response = requests.get(url, auth=auth, headers=headers, timeout=10)

    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success! Connected as: {data.get('displayName')} ({data.get('emailAddress')})")
    else:
        print(f"❌ Failed: Status Code {response.status_code}")
        print(f"Response: {response.text}")

except Exception as e:
    print(f"❌ Exception occurred: {str(e)}")
