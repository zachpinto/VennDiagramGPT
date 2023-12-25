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
        # Generate text using GPT-4 (simplified example)
        response = openai.Completion.create(
            model="text-davinci-004",  # or the latest GPT-4 model
            prompt="Generate a coherent text that combines these concepts: " + ", ".join(set_titles),
            max_tokens=150
        )
        return jsonify({"text": response.choices[0].text.strip()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
