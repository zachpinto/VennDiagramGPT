# VennDiagramGPT

## Description
VennDiagramGPT is a web-based application that leverages OpenAI's GPT-4 to generate creative and insightful relationships between different sets in a Venn diagram. This project combines Flask for backend operations with advanced JavaScript and SVG manipulation for frontend interactivity, offering users a unique and fun tool to create comparisons between different topics!

## Features
- **Interactive Venn Diagram**: Users can choose between a 2-set or 3-set Venn diagram.
- **GPT-4 Integration**: Utilizes OpenAI's GPT-4 to generate textual content for each intersection in the Venn diagram.
- **Customizable Input**: Users can input their own set titles and see them reflected in the diagram.
- **Dynamic Text Wrapping**: Long titles are wrapped for better readability.
- **Responsive Design**: Optimized for a seamless experience across various devices.

## Technologies Used
- **Backend**: Flask
- **AI Model**: OpenAI GPT-4
- **Frontend**: HTML, CSS, JavaScript (with SVG manipulation)

## Installation and Setup
To run this project locally:

1. Clone the repository:
```
git clone https://github.com/pintoza/VennDiagramGPT.git
```
2. Navigate to the project directory:
```
cd VennDiagramGPT
```
3. Install the required dependencies:
```
pip install -r requirements.txt
```
4. Set the `OPENAI_API_KEY` environment variable with your OpenAI API key.
  - Recommended: use python-dotenv and place the API key as OPENAI_API_KEY=KEY in a .env file
5. Run the Flask application:
```
python app.py
```

## Usage
After starting the application, visit `http://localhost:5000` in your web browser. Choose the number of sets for your Venn diagram, input titles for each set, and click 'Generate Venn Diagram'. The app will contact GPT-4 to generate text for each intersection, which will then be displayed on the diagram.

## Contributing
Contributions, issues, and feature requests are welcome. Feel free to check [issues page](https://github.com/pintoza/VennDiagramGPT/issues) for open issues or create a new one.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- OpenAI for providing the GPT-4 API.
- All contributors who participate in this project.
