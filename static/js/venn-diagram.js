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
        input.className = 'form-control my-2'; // Bootstrap class for styling
        input.setAttribute('name', `setTitle${i}`);
        textFieldsContainer.appendChild(input);
    }
}

// Modify the setupInputListeners function
function setupInputListeners(vennDiagramContainer, setCount) {
    let inputs = document.querySelectorAll('#textFields input');
    inputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            let textElement = vennDiagramContainer.querySelector(`text[data-set-index="${index}"]`);
            if (!textElement) {
                textElement = document.createElementNS(svgNS, "text");
                textElement.setAttribute('data-set-index', index);
                textElement.setAttribute('font-size', '10');
                textElement.setAttribute('text-anchor', 'middle');
                textElement.setAttribute('dominant-baseline', 'middle');
                textElement.setAttribute('fill', '#333');
                vennDiagramContainer.querySelector('svg').appendChild(textElement);
            }
            textElement.textContent = input.value;
            textElement.setAttribute('x', calculateXPosition(index, setCount));
            textElement.setAttribute('y', calculateYPosition(index, setCount));
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
            generateVennDiagram(parseInt(event.target.value), vennDiagramContainer, textFieldsContainer);
        });
    });

    setupInputListeners(vennDiagramContainer);
});


// Generates the Venn diagram based on the selected number of sets
// Generates the Venn diagram based on the selected number of sets
function generateVennDiagram(setCount, vennDiagramContainer, textFieldsContainer) {
    const colors = [
        "rgba(255, 192, 203, 0.5)", // Light Pink
        "rgba(173, 216, 230, 0.5)", // Light Blue
        "rgba(144, 238, 144, 0.5)", // Light Green
        "rgba(255,242,146,0.5)"     // Light Yellow
    ];

    // Check if the SVG element already exists
    let svg = vennDiagramContainer.querySelector('svg');
    if (!svg) {
        // Create the SVG element if it doesn't exist
        svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 300 300');

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

        // Add circles to the SVG element
        circleConfigs[setCount].forEach((circle, index) => {
            let circleEl = document.createElementNS(svgNS, "circle");
            circleEl.setAttribute('cx', circle.cx);
            circleEl.setAttribute('cy', circle.cy);
            circleEl.setAttribute('r', circle.r);
            circleEl.setAttribute('fill', colors[index % colors.length]);
            svg.appendChild(circleEl);
        });

        // Append the SVG to the container
        vennDiagramContainer.appendChild(svg);
    }

    // Call updateVennDiagram to place text elements
    setupInputListeners(vennDiagramContainer, setCount);
    updateVennDiagram(setCount, textFieldsContainer, vennDiagramContainer, svg);
}

// Updates the Venn diagram with text labels
function updateVennDiagram(setCount, textFieldsContainer, vennDiagramContainer, svg) {
    // Clear any existing text
    let textElements = vennDiagramContainer.querySelectorAll('text');
    textElements.forEach(text => text.remove());

    // Calculate positions and add new text elements
    for (let i = 0; i < setCount; i++) {
        let input = textFieldsContainer.querySelector(`input[name="setTitle${i}"]`);
        if (input && input.value) {
            let text = document.createElementNS(svgNS, "text");
            text.textContent = input.value;
            text.setAttribute('x', calculateXPosition(i, setCount)); // You need to define this function
            text.setAttribute('y', calculateYPosition(i, setCount)); // You need to define this function
            text.setAttribute('font-size', '10'); // Adjust as needed
            text.setAttribute('text-anchor', 'middle'); // Center the text
            text.setAttribute('dominant-baseline', 'middle'); // Center vertically
            text.setAttribute('fill', '#333'); // Text color
            svg.appendChild(text);
        }
    }

    // After updating, setup input listeners for the new inputs
    setupInputListeners(vennDiagramContainer);
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
        return 190;
    } else { // setCount === 4
        if (index === 0) return 80;
        if (index === 1) return 150;
        if (index === 2) return 220;
        return 150;
    }
}

