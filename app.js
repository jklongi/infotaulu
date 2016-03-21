var express = require('express');
var app = express();
var http = require('http').Server(app);
//var io = require('socket.io')(http);
//var client = require("socket.io-client")('http://83.145.232.209:8080');


app.use('/', express.static(__dirname + '/'));
app.use('/extra', express.static(__dirname + '/dist/'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use('/public', express.static(__dirname + '/public/'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

/*
client.on("connect", function(){
	console.log("Connected to API");

	client.emit('&nodeapp;somepass type:1&');
	client.send('&nodeapp;somepass type:1&');

    client.on('message', function(data){
        console.log(data);
    });
});


io.set('transports', [ 'websocket' ]);

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

});
*/

http.listen(8080, function () {
  console.log('This app is listening on port 8080!');
});
