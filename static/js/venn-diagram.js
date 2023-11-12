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
