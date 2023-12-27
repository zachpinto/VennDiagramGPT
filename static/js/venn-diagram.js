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
        textFieldsContainer.appendChild(input);

    console.log("New input fields added:", textFieldsContainer.innerHTML);

    }
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
        });
    });

    setupInputListeners(vennDiagramContainer);
    document.getElementById('generateButton').addEventListener('click', onGenerateClicked);

    const generateButton = document.getElementById('generateButton');
    if (generateButton) {
        generateButton.addEventListener('click', handleGenerateButtonClick);
    } else {
        console.error("Generate button not found");
    }
});


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
        4: [{ cx: 150, cy: 110, r: 60 },
            { cx: 110, cy: 150, r: 60 },
            { cx: 150, cy: 190, r: 60 },
            { cx: 190, cy: 150, r: 60 }]
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


// Assuming onGenerateClicked function looks something like this
function onGenerateClicked() {
    const inputs = document.querySelectorAll('.set-title-input');
    let setTitles = [];

    for (let input of inputs) {
        if (input.value.trim() === "") {
            alert('Please enter titles for all sets.');
            return;
        }
        setTitles.push(input.value.trim());
    }

    console.log("Collected setTitles in onGenerateClicked:", setTitles); // Debugging line

    if (setTitles.length >= 2) {
        const intersections = calculateIntersections(setTitles);
        generateAndDisplayText(intersections, setTitles);
    } else {
        alert('Please enter titles for at least two sets.');
    }
}


// Assuming you have a function to make the POST request and fetch the responses
function generateAndDisplayText(intersections, setTitles) {
    console.log("Received setTitles:", setTitles);
    console.log("Intersections:", intersections);

    intersections.forEach(intersectionIndices => {
        let intersectionTitles = intersectionIndices.map(index => setTitles[index]);
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
                for (let key in data) {
                    let intersectionKey = key.split(", ");
                    displayTextAtIntersection(intersectionKey, data[key], intersectionTitles.length, setTitles);
                }
            } else {
                console.error("Error received from API:", data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    });
}


// Displays the text at the intersection
function displayTextAtIntersection(intersection, text, setCount, setTitles) {
    const vennDiagramContainer = document.getElementById('vennDiagramContainer');
    const svg = vennDiagramContainer.querySelector('svg');

    const key = intersection.join(', ');
    const positions = getPositionsForSetCount(setCount, setTitles);

    console.log("Displaying text at position:", positions[key]);


    if (positions && positions[key]) {
        const position = positions[key];
        const textElement = document.createElementNS(svgNS, "text");
        textElement.setAttribute('x', position.x);
        textElement.setAttribute('y', position.y);
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('dominant-baseline', 'middle');
        textElement.textContent = text;
        svg.appendChild(textElement);
    } else {
        console.log("Position not found for intersection: ", key);

    }
}


// Get positions for set count
function getPositionsForSetCount(setCount, setTitles) {
    let positions = {};

    if (!setTitles || setTitles.length === 0) {
    console.error("No set titles provided for position calculation");
    return positions;
    }

    if (setCount === 2) {
        positions[`${setTitles[0]}, ${setTitles[1]}`] = { x: 150, y: 150 };
    } else if (setCount === 3) {
        positions[`${setTitles[0]}, ${setTitles[1]}`] = { x: 100, y: 100 };
        positions[`${setTitles[0]}, ${setTitles[2]}`] = { x: 200, y: 100 };
        positions[`${setTitles[1]}, ${setTitles[2]}`] = { x: 150, y: 200 };
        positions[`${setTitles[0]}, ${setTitles[1]}, ${setTitles[2]}`] = { x: 150, y: 150 };
    } else if (setCount === 4) {
        positions[`${setTitles[0]}, ${setTitles[1]}`] = { x: 100, y: 75 };
        // ... and so on for other combinations
        // Add more positions as needed
    }
    console.log("Positions:", positions);
    return positions;
}


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
