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
