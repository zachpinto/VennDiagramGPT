document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[name="setCount"]').forEach(function(radio) {
        radio.addEventListener('change', function(event) {
            var count = parseInt(event.target.value, 10);
            var textFields = document.getElementById('textFields');
            textFields.innerHTML = ''; // Clear previous fields
            for (var i = 0; i < count; i++) {
                var input = document.createElement('input');
                input.type = 'text';
                input.placeholder = `Title for set ${i+1}`;
                input.name = `setTitle${i}`;
                textFields.appendChild(input);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var radios = document.querySelectorAll('input[name="setCount"]');
    radios.forEach(function(radio) {
        radio.addEventListener('change', handleRadioChange);
    });
});

function handleRadioChange(event) {
    var count = event.target.value;
    var textFieldsContainer = document.getElementById('textFields');
    textFieldsContainer.innerHTML = ''; // Clear existing fields

    for (var i = 0; i < count; i++) {
        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Title for set ${i + 1}`;
        input.className = 'form-control my-2'; // Bootstrap class for styling
        textFieldsContainer.appendChild(input);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var radios = document.querySelectorAll('input[name="setCount"]');
    radios.forEach(function(radio) {
        radio.addEventListener('change', function(event) {
            generateVennDiagram(parseInt(event.target.value));
        });
    });
});

function generateVennDiagram(setCount) {
    const colors = [
        "rgba(255, 192, 203, 0.5)", // Light Pink
        "rgba(173, 216, 230, 0.5)", // Light Blue
        "rgba(144, 238, 144, 0.5)", // Light Green
        "rgba(255,242,146,0.5)"    // Light Orange
    ];
    const vennDiagramContainer = document.getElementById('vennDiagramContainer');
    vennDiagramContainer.innerHTML = ''; // Clear the container

    // Create the SVG element
    const svgNS = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute('width', '300');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 300 300');

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
}

function getTextPositions(setCount) {
  // Define the center positions for each circle in the Venn diagrams
  const positions = {
    2: [
      { x: 150, y: 100 }, // Center of circle A
      { x: 250, y: 100 }  // Center of circle B
    ],
    3: [
      { x: 150, y: 75 },  // Center of circle A
      { x: 250, y: 75 },  // Center of circle B
      { x: 200, y: 150 }  // Center of circle C
    ],
    4: [
      { x: 125, y: 125 }, // Center of circle A
      { x: 275, y: 125 }, // Center of circle B
      { x: 125, y: 275 }, // Center of circle C
      { x: 275, y: 275 }  // Center of circle D
    ]
  };

  return positions[setCount];
}

function updateVennDiagram(setCount) {
    // ... existing code to generate the Venn diagram ...

    // Clear any existing text
    let textElements = vennDiagramContainer.querySelectorAll('text');
    textElements.forEach(text => text.remove());

    const textPositions = getTextPositions(setCount);

    // Add new text based on the current number of sets
    for (let i = 0; i < setCount; i++) {
        let input = document.querySelector(`input[name="setTitle${i}"]`);
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

function calculateXPosition(index, setCount) {
    // Calculate the x position based on the index and setCount
    // Placeholder function, implement logic based on Venn diagram layout
    return 150; // Example position
}

function calculateYPosition(index, setCount) {
    // Calculate the y position based on the index and setCount
    // Placeholder function, implement logic based on Venn diagram layout
    return 150; // Example position
}

// Event listener for the form submission
document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const setCount = document.querySelector('input[name="setCount"]:checked').value;
    updateVennDiagram(setCount);
});

// Event listeners for the input fields
document.addEventListener('DOMContentLoaded', function() {
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
});

