// Global SVG namespace
const svgNS = "http://www.w3.org/2000/svg";

// Handles changes to the radio buttons
function handleRadioChange(event, textFieldsContainer) {
    var count = parseInt(event.target.value, 10);
    textFieldsContainer.innerHTML = ''; // Clear existing fields

    for (var i = 0; i < count; i++) {
        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Title for set ${i + 1}`;
        input.className = 'form-control my-2'; // Bootstrap class for styling
        input.setAttribute('name', `setTitle${i}`);
        textFieldsContainer.appendChild(input);
    }
}

// Event listeners for the input fields
function setupInputListeners(vennDiagramContainer) {
    // Get all input elements
    let inputs = document.querySelectorAll('#textFields input');
    inputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            // Update the text in the Venn diagram
            let textElement = vennDiagramContainer.querySelector(`text:nth-child(${index + 1})`);
            if (textElement) {
                textElement.textContent = input.value;
            }
        });
    });
}

// DOMContentLoaded event to set up initial event listeners
document.addEventListener('DOMContentLoaded', function() {
    var radios = document.querySelectorAll('input[name="setCount"]');
    var textFieldsContainer = document.getElementById('textFields');
    var vennDiagramContainer = document.getElementById('vennDiagramContainer');

    radios.forEach(function(radio) {
        radio.addEventListener('change', function(event) {
            handleRadioChange(event, textFieldsContainer);
            generateVennDiagram(parseInt(event.target.value), vennDiagramContainer, textFieldsContainer);
        });
    });

    setupInputListeners(vennDiagramContainer);
});


// Generates the Venn diagram based on the selected number of sets
function generateVennDiagram(setCount, vennDiagramContainer, textFieldsContainer) {
    // Define the colors for the circles
    const colors = [
        "rgba(255, 192, 203, 0.5)", // Light Pink
        "rgba(173, 216, 230, 0.5)", // Light Blue
        "rgba(144, 238, 144, 0.5)", // Light Green
        "rgba(255,242,146,0.5)"     // Light Yellow
    ];

    // Clear the container
    vennDiagramContainer.innerHTML = '';

    // Create the SVG element
    let svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute('width', '100%'); // Set width to 100% to fill the container
    svg.setAttribute('height', '100%'); // Set height to 100% to fill the container
    svg.setAttribute('viewBox', '0 0 300 300'); // Set viewBox to match the design

    // Define the positions and radii for the circles
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

    // Call updateVennDiagram to place text elements
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
    // Placeholder function, implement logic based on Venn diagram layout
    return 150; // Example position
}

// Calculates the Y position of the text based on the index and setCount
function calculateYPosition(index, setCount) {
    // Placeholder function, implement logic based on Venn diagram layout
    return 150; // Example position
}

