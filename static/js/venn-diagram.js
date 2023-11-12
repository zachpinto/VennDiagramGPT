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

    // In your JavaScript file, modify the loop that creates text fields
    for (var i = 0; i < count; i++) {
        var textarea = document.createElement('textarea');
        textarea.placeholder = `Title for set ${i + 1}`;
        textarea.className = 'form-control my-2'; // Bootstrap class for styling
        textFieldsContainer.appendChild(textarea);
    }
}
