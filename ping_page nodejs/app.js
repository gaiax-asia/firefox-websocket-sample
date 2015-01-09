var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var WebSocketServer = require('ws').Server;
var wss             = new WebSocketServer({port: 8080});

wss.broadcast = function broadcast(data) {
  console.log(this.clients)
  for(var i in this.clients) {
    console.log(i);
    console.log(data);
    this.clients[i].send(data);
  }
};

var clients = {}

wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    try {
      message = JSON.parse(message);
      switch (message.type) {
        case "CONNECT":
          console.log("Server: Connecting client %s", message.user_id)
          clients[message.user_id] = ws
          break;
        case "SENDTO":
          if (clients[message.to_username]) {
            console.log("Server: Send to client %s", message.to_username)
            console.log(clients[message.to_username]);
            clients[message.to_username].send(JSON.stringify({
              loc: message.loc,
              coords: message.coords
            }));
          } else {
            ws.send(JSON.stringify({
              type: "ERROR",
              message: "User is not connected"
            }))
          }
          break;
      }
      console.log("clients => %s", clients);
    } catch (e) {
      console.log("Error: %s", e)
      console.log("From client: %s", message);
    }
  });
  ws.send("Server: Connection Successful");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
