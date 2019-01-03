/*create an express application*/
var app = require('express')();
/*create Server object, pass event listener - app*/
var http = require('http').Server(app);

var io = require('socket.io')(http);

/*handles requests*/
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  socket.on('chat message', function(from, msg){
    socket.broadcast.emit('chat message', from, msg);
  });
  socket.on('printing', function(who) {
    socket.emit('printing', who);
  });
});


/*listens to the port*/
http.listen(8127, function(){
  console.log('listening on *:8127');
});
