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
            drawVennDiagram(parseInt(event.target.value));
        });
    });
});

function drawVennDiagram(numberOfSets) {
    // Clear the previous diagram
    var vennDiagramContainer = document.getElementById('vennDiagramContainer');
    vennDiagramContainer.innerHTML = '';

    // Define sets
    var sets = createSets(numberOfSets);

    // Create the Venn diagram
    var chart = venn.VennDiagram();
    d3.select(vennDiagramContainer).datum(sets).call(chart);

    // Apply custom colors if necessary
    // ...
}

function createSets(numberOfSets) {
    // This function should return an array of sets and their relationships
    // The content will depend on the number of sets and how they overlap
    // Here's an example for 2 sets:
    if (numberOfSets === 2) {
        return [
            {sets: ['A'], size: 12},
            {sets: ['B'], size: 12},
            {sets: ['A','B'], size: 2}
        ];
    }

    if (numberOfSets === 3) {
        return [
            {sets: ['A'], size: 12},
            {sets: ['B'], size: 12},
            {sets: ['C'], size: 12},
            {sets: ['A','B'], size: 2},
            {sets: ['A','C'], size: 2},
            {sets: ['B','C'], size: 2},
            {sets: ['A','B','C'], size: 2}
        ];
    }

    if (numberOfSets === 4) {
        return [
            {sets: ['A'], size: 12},
            {sets: ['B'], size: 12},
            {sets: ['C'], size: 12},
            {sets: ['D'], size: 12},
            {sets: ['A','B'], size: 2},
            {sets: ['A','C'], size: 2},
            {sets: ['A','D'], size: 2},
            {sets: ['B','C'], size: 2},
            {sets: ['B','D'], size: 2},
            {sets: ['C','D'], size: 2},
            {sets: ['A','B','C'], size: 2},
            {sets: ['A','B','D'], size: 2},
            {sets: ['A','C','D'], size: 2},
            {sets: ['B','C','D'], size: 2},
            {sets: ['A','B','C','D'], size: 2}
        ];
    }
    // Extend the logic for 3 and 4 sets as needed

    // You'll need to write the logic to generate the sets and their sizes/intersections
    // This is a non-trivial task and would be unique to your application
}

// Please note that this code is simplified and assumes the use of the venn.js library.
// The actual implementation may vary depending on the specific requirements and how the venn.js library is used.
