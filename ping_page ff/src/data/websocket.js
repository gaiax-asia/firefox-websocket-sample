var ws;

function destroy_connection(from_username) {
  ws && ws.close && ws.close();
}

function connect(from_username) {
  ws = new WebSocket('ws://192.168.254.115:8080/');
  ws.onmessage = function(res) {
    var data = JSON.parse(res.data)
    console.log(data);
    if (data.type == "ERROR") {

    } else {
      self.port.emit('websocketOnMessage', data);
    }
  }

  ws.onopen = function(event) {
    ws.send('connection successful');
    ws.send(JSON.stringify({
      type: "CONNECT",
      user_id: from_username
    }))
  };

  self.port.on('mouseClick', function(data){
    console.log("Mouse click! => ", data)
    var data = JSON.parse(data);
    data.type = "SENDTO"
    ws.send(JSON.stringify(data));
  });
}

self.port.on('connect', connect)
self.port.on('destroy_connection', destroy_connection)