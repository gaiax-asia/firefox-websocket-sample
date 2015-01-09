document.addEventListener("DOMContentLoaded", function() {
  try {
    ws = new WebSocket('ws://192.168.254.115:8080');
    ws.onopen = function() {
      console.log("Connection opened");
      ws.send(JSON.stringify({
        user_id: "jmjm"
      }));
    };
    console.log('hmm2')
    ws.onmessage =  function(data, flags) {
      console.log("MESSAGE!", data, flags);
    };
  } catch(e) {
    console.log(e);
  }

  document.onmousedown = function(e) {
    var x = e.x;
    var y = e.y;
    console.log(e);
    ws.send(JSON.stringify({x: x, y: y}));
  }
})