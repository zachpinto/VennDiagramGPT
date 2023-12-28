// Global SVG namespace
const svgNS = "http://www.w3.org/2000/svg";


// Handles changes to the radio buttons
function handleRadioChange(event, textFieldsContainer) {
    const count = parseInt(event.target.value, 10);
    textFieldsContainer.innerHTML = ''; // Clear existing fields

    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Title for set ${i + 1}`;
        input.className = 'form-control my-2 set-title-input'; // Add a class for easy selection
        input.name = `setTitle${i}`; // Assign name attribute
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
            setupInputListeners(vennDiagramContainer, parseInt(event.target.value)); // Corrected
        });
    });

    document.getElementById('generateButton').addEventListener('click', handleGenerateButtonClick);
});


// Populates the positions object based on the number of sets and their titles
function populatePositions(setCount, setTitles) {
    positions = {};
    if (setCount === 2) {
        positions[`${setTitles[0]} and ${setTitles[1]}`] = { x: 150, y: 150 }; // Central intersection point for 2 sets
    } else if (setCount === 3) {
        // Example positions for 3-set intersections
        positions[`${setTitles[0]} and ${setTitles[1]}`] = { x: 100, y: 150 }; // Changed format to 'and'
        positions[`${setTitles[0]} and ${setTitles[2]}`] = { x: 200, y: 150 }; // Changed format to 'and'
        positions[`${setTitles[1]} and ${setTitles[2]}`] = { x: 150, y: 200 }; // Changed format to 'and'
        // Position for all three
        positions[`${setTitles[0]} and ${setTitles[1]} and ${setTitles[2]}`] = { x: 150, y: 150 }; // Changed format to 'and'
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
        // Clear previous circles if they exist
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
            let text = document.createElementNS(svgNS, "text");
            text.textContent = input.value;
            text.setAttribute('x', calculateXPosition(i, setCount));
            text.setAttribute('y', calculateYPosition(i, setCount));
            text.setAttribute('font-size', '10');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', '#333');
            vennDiagramContainer.querySelector('svg').appendChild(text);
        }
    }
}


// Calculates the intersections based on the set titles
function calculateIntersections(setTitles) {
    let intersections = [];
    for (let i = 0; i < setTitles.length; i++) {
        for (let j = i + 1; j < setTitles.length; j++) {
            intersections.push([i, j]);
        }
    }
    // Add combination for all sets in case of three sets
    if (setTitles.length === 3) {
        intersections.push([0, 1, 2]); // Intersection of all three sets
    }
    console.log("Calculated intersections in calculateIntersections:", intersections);
    return intersections;
}


// Calculates the X position of the text based on the index and setCount
function calculateXPosition(index, setCount) {
    // Simple example logic, needs refinement based on actual Venn diagram layout
    if (setCount === 2) {
        return index === 0 ? 80 : 220;
    } else if (setCount === 3) {
        if (index === 0) return 80;
        if (index === 1) return 220;
        return 150;
    } else { // setCount === 4
        if (index === 0) return 150;
        if (index === 1) return 80;
        if (index === 2) return 150;
        return 220;
    }
}


// Calculates the Y position of the text based on the index and setCount
function calculateYPosition(index, setCount) {
    // Simple example logic, needs refinement based on actual Venn diagram layout
    if (setCount === 2) {
        return 150; // Middle for both
    } else if (setCount === 3) {
        if (index === 0 || index === 1) return 110;
        return 220;
    } else { // setCount === 4
        if (index === 0) return 80;
        if (index === 1) return 150;
        if (index === 2) return 220;
        return 150;
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


// Assuming you have a function to make the POST request and fetch the responses
function generateAndDisplayText(intersections, setTitles) {
    console.log("Received setTitles:", setTitles);
    console.log("Intersections:", intersections);

    const setCount = setTitles.length; // Number of sets

    intersections.forEach(intersectionIndices => {
        let intersectionTitles = intersectionIndices.map(index => setTitles[index]);
        let intersectionKey = intersectionIndices.map(i => i.toString()).join(' and ');
        console.log("Processing intersection:", intersectionTitles);

        // Check for null or empty titles
        if (intersectionTitles.some(title => !title)) {
            console.error("Invalid intersection format: One or more titles are empty", intersectionTitles);
            return;
        }

        // Proceed with valid intersections
        fetch('/generate-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ setTitles: intersectionTitles })
        })
        .then(response => response.json())
        .then(data => {
            if (data && !data.error) {
                // Ensure the correct key is used for displaying text
                const responseKey = intersectionTitles.join(' and ');
                displayTextDirectly(data[responseKey], setCount, intersectionKey);
            } else {
                console.error("Error received from API:", data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    });
}


// Function to display text directly
function displayTextDirectly(text, setCount, intersectionKey) {
    const vennDiagramContainer = document.getElementById('vennDiagramContainer');
    const svg = vennDiagramContainer.querySelector('svg');
    const textElement = document.createElementNS(svgNS, "text");

    let xPosition, yPosition;
    if (setCount === 2) {
        xPosition = 150; yPosition = 150; // Central position for 2 sets
    } else if (setCount === 3) {
        // Adjust positions based on intersection key
        switch (intersectionKey) {
            case '0 and 1': xPosition = 100; yPosition = 180; break;
            case '0 and 2': xPosition = 200; yPosition = 180; break;
            case '1 and 2': xPosition = 150; yPosition = 90; break;
            case '0 and 1 and 2': xPosition = 150; yPosition = 150; break; // Central position for all three sets
            default: xPosition = 150; yPosition = 150; // Fallback position
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


// Global variable for positions (if needed)
let positions = {};


// Handles the Generate button click
function handleGenerateButtonClick() {
    const inputs = document.querySelectorAll('.set-title-input');
    let setTitles = [];

    for (let input of inputs) {
        console.log("Input value:", input.value); // Add this line for debugging
        if (input.value.trim() === "") {
            alert('Please enter titles for all sets.');
            return;
        }
        setTitles.push(input.value.trim());
    }

    console.log("Collected setTitles:", setTitles); // Debugging line

    if (setTitles.length >= 2) {
        const intersections = calculateIntersections(setTitles);
        generateAndDisplayText(intersections, setTitles);
    } else {
        alert('Please enter titles for at least two sets.');
    }
}
