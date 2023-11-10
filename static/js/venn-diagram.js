document.addEventListener('DOMContentLoaded', function() {
    var radios = document.querySelectorAll('input[type="radio"][name="setCount"]');
    radios.forEach(function(radio) {
        radio.addEventListener('change', function(event) {
            var count = event.target.value;
            var setTitleBoxes = document.getElementById('setTitleBoxes');
            setTitleBoxes.innerHTML = ''; // Clear previous textboxes
            for (var i = 0; i < count; i++) {
                var input = document.createElement('input');
                input.type = 'text';
                input.placeholder = 'Give this set a title';
                setTitleBoxes.appendChild(input);
            }
        });
    });
});
