var from_username_textarea = document.getElementById('from_username');
var to_username_textarea = document.getElementById('to_username');
var connect_button = document.getElementById('connect_button');
var ping_button = document.getElementById('ping_button');

connect_button.addEventListener('click', function() {
  self.port.emit('connect', from_username_textarea.value)
}, false)

ping_button.addEventListener('click', function() {
  self.port.emit('mark_page', to_username_textarea.value);
}, false)