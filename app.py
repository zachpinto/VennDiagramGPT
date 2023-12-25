from flask import Flask, request, jsonify, render_template
import openai
from dotenv import load_dotenv
import os

app = Flask(__name__)

load_dotenv()
openai.api_key = os.getenv('API_KEY')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-text', methods=['POST'])
def generate_text():
    data = request.json
    set_titles = data['setTitles']

    try:
        # Use the Chat Completions API
        response = openai.ChatCompletion.create(
            model=os.getenv('OPENAI_MODEL', 'gpt-4'),
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": " ".join(set_titles)}
            ]
        )
        return jsonify({"text": response.choices[0].message['content']})
    except Exception as e:
        app.logger.error(f'Error generating text: {e}')
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
