import os
import requests
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

def test_groq():
    print("\n--- Testing Groq API ---")
    if not GROQ_API_KEY:
        print("❌ SKIPPED: Missing GROQ_API_KEY in .env")
        return

    try:
        client = Groq(api_key=GROQ_API_KEY)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": "Hello, are you working?",
                }
            ],
            model="llama-3.3-70b-versatile", # Updated to current supported model
        )
        print(f"✅ Groq Success! Response: {chat_completion.choices[0].message.content[:50]}...")
    except Exception as e:
        print(f"❌ Groq Failed: {str(e)}")

def test_ollama():
    print("\n--- Testing Ollama API ---")
    try:
        url = f"{OLLAMA_BASE_URL}/api/tags"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            models = response.json().get('models', [])
            model_names = [m['name'] for m in models]
            print(f"✅ Ollama Success! Found {len(models)} models: {', '.join(model_names[:3])}...")
        else:
            print(f"❌ Ollama Failed: Status {response.status_code}")
    except Exception as e:
        print(f"❌ Ollama Connection Error: {str(e)}")
        print("   (Make sure Ollama is running: `ollama serve`)")

if __name__ == "__main__":
    test_groq()
    test_ollama()
