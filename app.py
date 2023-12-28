from flask import Flask, request, jsonify, render_template
import os
import itertools
from openai import OpenAI
from threading import Lock

app = Flask(__name__)

# Fetch the API Key from the environment variable
openai_api_key = os.getenv('OPENAI_API_KEY')
if not openai_api_key:
    raise ValueError("No OPENAI_API_KEY found in environment variables")

# Initialize the OpenAI client with the API Key
client = OpenAI(api_key=openai_api_key)

# Cache for storing responses and lock for handling concurrent requests
response_cache = {}
request_lock = Lock()


@app.route('/')
def index():
    return render_template('index.html')


def get_combinations(set_titles):
    """Generate predefined combinations based on the number of set titles."""
    if len(set_titles) == 2:
        # Venn diagram with 2 sets
        return [(set_titles[0], set_titles[1])]
    elif len(set_titles) == 3:
        # Venn diagram with 3 sets
        return [(set_titles[0], set_titles[1]),
                (set_titles[0], set_titles[2]),
                (set_titles[1], set_titles[2]),
                (set_titles[0], set_titles[1], set_titles[2])]
    else:
        return []


@app.route('/generate-text', methods=['POST'])
def generate_text():
    data = request.json
    set_titles = data.get('setTitles')

    # Check for None or empty values in set_titles
    if (not set_titles or not all(set_titles) or not isinstance(set_titles, list) or
            len(set_titles) < 2 or len(set_titles) > 4):
        print("Invalid input:", set_titles)
        return jsonify({"error": "Invalid input. Set titles must be a list with 2 to 4 non-empty elements."}), 400
    try:
        # Acquire lock to handle concurrent requests
        with request_lock:
            # Generate a response for each unique combination
            responses = {}
            combinations = get_combinations(set_titles)
            print("Generated combinations:", combinations)

            for combination in combinations:
                combined_query = ' and '.join(combination)
                if combined_query not in response_cache:  # Check if the combination is already in the cache
                    prompt = ("I need a creative relationship between these sets: " + combined_query +
                              ". It is vital that the relationship is brief: "
                              "either one word or at most a very short phrase.")
                    response = client.chat.completions.create(
                        model="gpt-3.5-turbo",
                        messages=[
                            {"role": "system", "content": "You are a helpful assistant."},
                            {"role": "user", "content": prompt}
                        ]
                    )
                    response_text = response.choices[0].message.content.strip()
                    response_cache[combined_query] = response_text  # Store response in cache
                    print(f"API Response for '{combined_query}': {response_text}")
                    responses[combined_query] = response_text
                else:
                    print(f"Returning cached response for '{combined_query}'")
                    responses[combined_query] = response_cache[combined_query]  # Return cached response

        return jsonify(responses)
    except Exception as e:
        print("Error during API call:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
