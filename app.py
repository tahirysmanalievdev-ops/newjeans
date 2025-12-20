from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from huggingface_hub import InferenceClient
import os

# 1. TELL FLASK TO SERVE FILES FROM CURRENT FOLDER
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

HF_KEY = os.environ.get("HF_API_KEY")
MODEL = "Qwen/Qwen2.5-72B-Instruct"

client = InferenceClient(api_key=HF_KEY)

# 2. THE HOMEPAGE ROUTE (This shows your website)
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

# 3. THE AI ROUTE (This handles the chat)
@app.route("/ai", methods=["POST"])
def ai():
    data = request.json
    msg = data.get("message", "")

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": msg}],
            max_tokens=150,
            temperature=0.7,
            top_p=0.9
        )
        ai_reply = response.choices[0].message.content
        return jsonify([{"generated_text": msg + "\n" + ai_reply}])

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    # Local testing logic
    app.run(port=5001, debug=True)