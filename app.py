from flask import Flask, request, jsonify, render_template
from openai import OpenAI
import os

app = Flask(__name__)

# Fetch the API Key from the environment variable
openai_api_key = os.getenv('OPENAI_API_KEY')
if not openai_api_key:
    raise ValueError("No OPENAI_API_KEY found in environment variables")

# Initialize the OpenAI client with the API Key
client = OpenAI(api_key=openai_api_key)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-text', methods=['POST'])
def generate_text():
    data = request.json
    set_titles = data['setTitles']
    print("Received request:", set_titles)

    try:
        # Construct the message array for the API call
        messages = [{"role": "system", "content": "You are a helpful assistant."}]
        for title in set_titles:
            messages.append({"role": "user", "content": title})

        # Make the API call
        chat_completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        print("API Response:", chat_completion)
        return jsonify({"text": chat_completion.choices[0].message['content']})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
