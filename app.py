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
        responses = {}
        for i in range(len(set_titles)):
            for j in range(i+1, len(set_titles)):
                combined_query = f"{set_titles[i]} and {set_titles[j]}"
                prompt = ("I am creating a venn diagram and I need your help filling in the intersections of the sets."
                          f"Come up with a creative relationship between the two following sets: {combined_query}."
                          "Since this is a venn diagram, it is important that the intersections are relatively brief,"
                          "they should either be a single word or a very short phrase. But they should be creative,"
                          "so try to avoid the obvious answers."
                          "It is very very important that you only give one relationship at a time, and don't "
                          "say anything else other than the relationship itself. Don't give any context, don't, "
                          "precede the output with a description, don't even say the name of the set, "
                          "and don't even precede the output with label. Literally just give the output.")
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": prompt}
                    ]
                )
                response_text = response.choices[0].message.content
                print(f"Response for {combined_query}: {response_text}")  # Log the response
                responses[combined_query] = response_text

        return jsonify(responses)
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500
