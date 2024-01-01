// Global SVG namespace
const svgNS = "http://www.w3.org/2000/svg";


// Handles changes to the radio buttons
function handleRadioChange(event, textFieldsContainer) {
    const count = parseInt(event.target.value, 10);
    textFieldsContainer.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Title for set ${i + 1}`;
        input.className = 'form-control my-2 set-title-input';
        input.name = `setTitle${i}`;
        textFieldsContainer.appendChild(input);
    }

    console.log("New input fields added:", textFieldsContainer.innerHTML);
}


// Modify the setupInputListeners function
function setupInputListeners(vennDiagramContainer, setCount) {
    let inputs = document.querySelectorAll('#textFields input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updateVennDiagram(setCount, vennDiagramContainer);
        });
    });
}


// DOMContentLoaded event to set up initial event listeners
document.addEventListener('DOMContentLoaded', function() {
    const radios = document.querySelectorAll('input[name="setCount"]');
    const textFieldsContainer = document.getElementById('textFields');
    const vennDiagramContainer = document.getElementById('vennDiagramContainer');

    radios.forEach(function(radio) {
        radio.addEventListener('change', function(event) {
            handleRadioChange(event, textFieldsContainer);
            generateVennDiagram(parseInt(event.target.value), vennDiagramContainer);
            setupInputListeners(vennDiagramContainer, parseInt(event.target.value));
        });
    });

    document.getElementById('generateButton').addEventListener('click', handleGenerateButtonClick);
});


// Populates the positions object based on the number of sets and their titles
function populatePositions(setCount, setTitles) {
    positions = {};
    if (setCount === 2) {
        positions[`${setTitles[0]} and ${setTitles[1]}`] = { x: 150, y: 150 };
    } else if (setCount === 3) {

        positions[`${setTitles[0]} and ${setTitles[1]}`] = { x: 100, y: 150 };
        positions[`${setTitles[0]} and ${setTitles[2]}`] = { x: 200, y: 150 };
        positions[`${setTitles[1]} and ${setTitles[2]}`] = { x: 150, y: 200 };

        positions[`${setTitles[0]} and ${setTitles[1]} and ${setTitles[2]}`] = { x: 150, y: 150 };
    }
}


// Generates the Venn diagram based on the selected number of sets
function generateVennDiagram(setCount, vennDiagramContainer) {
    const colors = [
        "rgba(255, 192, 203, 0.5)", // Light Pink
        "rgba(173, 216, 230, 0.5)", // Light Blue
        "rgba(144, 238, 144, 0.5)", // Light Green
        "rgba(255,242,146,0.5)"     // Light Yellow
    ];

    let svg = vennDiagramContainer.querySelector('svg');
    if (!svg) {
        svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 300 300');
        vennDiagramContainer.appendChild(svg);
    } else {

        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }
    }

    const circleConfigs = {
        2: [{ cx: 110, cy: 150, r: 80 },
            { cx: 190, cy: 150, r: 80 }],
        3: [{ cx: 110, cy: 120, r: 80 },
            { cx: 190, cy: 120, r: 80 },
            { cx: 150, cy: 190, r: 80 }],
    };

    circleConfigs[setCount].forEach((circle, index) => {
        let circleEl = document.createElementNS(svgNS, "circle");
        circleEl.setAttribute('cx', circle.cx);
        circleEl.setAttribute('cy', circle.cy);
        circleEl.setAttribute('r', circle.r);
        circleEl.setAttribute('fill', colors[index % colors.length]);
        svg.appendChild(circleEl);

    setupInputListeners(vennDiagramContainer, setCount)
    updateVennDiagram(setCount, vennDiagramContainer);
    });

    let setTitles = [];
    for (let i = 0; i < setCount; i++) {
        let input = document.querySelector(`input[name="setTitle${i}"]`);
        if (input) {
            setTitles.push(input.value.trim());
        }
    }

    populatePositions(setCount, setTitles);
}


// Updates the Venn diagram based on the set titles
function updateVennDiagram(setCount, vennDiagramContainer) {
    let textElements = vennDiagramContainer.querySelectorAll('text');
    textElements.forEach(text => text.remove());

    for (let i = 0; i < setCount; i++) {
        let input = document.querySelector(`input[name="setTitle${i}"]`);
        if (input && input.value) {
            const textElement = document.createElementNS(svgNS, "text");
            const wrappedText = wrapText(input.value, 80);

            wrappedText.forEach((line, index) => {
                const tspan = document.createElementNS(svgNS, "tspan");
                tspan.setAttribute('x', calculateXPosition(i, setCount));
                tspan.setAttribute('y', calculateYPosition(i, setCount) + (index * 12));
                tspan.textContent = line;
                textElement.appendChild(tspan);
            });

            textElement.setAttribute('font-size', '10');
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('dominant-baseline', 'middle');
            textElement.setAttribute('fill', '#333');
            vennDiagramContainer.querySelector('svg').appendChild(textElement);
        }
    }
}


// Wraps the text based on the max width
function wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = getTextWidth(currentLine + " " + word);
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}


// Gets the width of the text
function getTextWidth(text) {

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "10px Arial";
    return context.measureText(text).width;
}


// Calculates the intersections based on the set titles
function calculateIntersections(setTitles) {
    let intersections = [];
    for (let i = 0; i < setTitles.length; i++) {
        for (let j = i + 1; j < setTitles.length; j++) {
            intersections.push([i, j]);
        }
    }

    if (setTitles.length === 3) {
        intersections.push([0, 1, 2]);
    }
    console.log("Calculated intersections in calculateIntersections:", intersections);
    return intersections;
}


// Calculates the X position of the text based on the index and setCount
function calculateXPosition(index, setCount) {

    if (setCount === 2) {
        return index === 0 ? 75 : 225;
    } else if (setCount === 3) {
        if (index === 0) return 70;
        if (index === 1) return 230;
        return 150;
    }
}


// Calculates the Y position of the text based on the index and setCount
function calculateYPosition(index, setCount) {
    if (setCount === 2) {
        return 150; //
    } else if (setCount === 3) {
        if (index === 0 || index === 1) return 95;
        return 230;
    }
}


// Get combinations
function getCombinations(array, size) {
    if (size > array.length) return [];
    if (size === 1) return array.map(element => [element]);
    return array.reduce((acc, value, index) => {
        const smallerCombinations = getCombinations(array.slice(index + 1), size - 1);
        smallerCombinations.forEach(combination => {
            acc.push([value].concat(combination));
        });
        return acc;
    }, []);
}


// Function to generate and display text on the Venn diagram
function generateAndDisplayText(intersections, setTitles) {
    console.log("Received setTitles:", setTitles);
    console.log("Intersections:", intersections);

    const setCount = setTitles.length;
    const loadingIndicator = document.getElementById('loadingIndicator');

    intersections.forEach(intersectionIndices => {
        let intersectionTitles = intersectionIndices.map(index => setTitles[index]);
        let intersectionKey = intersectionIndices.map(i => i.toString()).join(' and ');
        console.log("Processing intersection:", intersectionTitles);


        if (intersectionTitles.some(title => !title)) {
            console.error("Invalid intersection format: One or more titles are empty", intersectionTitles);
            return;
        }


        loadingIndicator.style.display = 'block';


        fetch('/generate-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ setTitles: intersectionTitles })
        })
        .then(response => response.json())
        .then(data => {

            loadingIndicator.style.display = 'none';

            if (data && !data.error) {

                const responseKey = intersectionTitles.join(' and ');
                displayTextDirectly(data[responseKey], setCount, intersectionKey);
            } else {
                console.error("Error received from API:", data.error);
            }
        })
        .catch(error => {

            loadingIndicator.style.display = 'none';
            console.error('Error:', error)
        });
    });
}


// Function to explicitly display text directly with explicit coordinates
function displayTextDirectly(text, setCount, intersectionKey) {
    const vennDiagramContainer = document.getElementById('vennDiagramContainer');
    const svg = vennDiagramContainer.querySelector('svg');
    const textElement = document.createElementNS(svgNS, "text");

    let xPosition, yPosition;
    if (setCount === 2) {
        xPosition = 150; yPosition = 150; // Central position for 2 sets
    } else if (setCount === 3) {

        switch (intersectionKey) {
            case '0 and 1': xPosition = 150; yPosition = 90; break;
            case '0 and 2': xPosition = 100; yPosition = 180; break;
            case '1 and 2': xPosition = 200; yPosition = 180; break;
            case '0 and 1 and 2': xPosition = 150; yPosition = 150; break;
            default: xPosition = 150; yPosition = 150;
        }
    }

    textElement.setAttribute('x', xPosition);
    textElement.setAttribute('y', yPosition);
    textElement.setAttribute('font-size', '6');
    textElement.setAttribute('text-anchor', 'middle');
    textElement.setAttribute('dominant-baseline', 'middle');
    textElement.setAttribute('fill', '#333');
    textElement.textContent = text;

    svg.appendChild(textElement);
}


// Global variable for positions
let positions = {};


// Handles the Generate button click
function handleGenerateButtonClick() {
    const inputs = document.querySelectorAll('.set-title-input');
    let setTitles = [];

    for (let input of inputs) {
        console.log("Input value:", input.value);
        if (input.value.trim() === "") {
            alert('Please enter titles for all sets.');
            return;
        }
        setTitles.push(input.value.trim());
    }

    console.log("Collected setTitles:", setTitles);

    if (setTitles.length >= 2) {
        const intersections = calculateIntersections(setTitles);
        generateAndDisplayText(intersections, setTitles);
    } else {
        alert('Please enter titles for at least two sets.');
    }
}
