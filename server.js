var express = require('express');
var app = express();
var server = require('http'); //创建服务器
server = server.createServer(app);
var io = require('socket.io').listen(server); //socket监听服务器
var port = process.env.PORT || 233;
server.listen(port, function () { //服务器监听端口
  console.log('Server listening at port %d', port);
});
app.use(express.static('./static'));
app.get('/', function (req, res) { //创建主页
  res.sendFile(__dirname + "/" + "index.html");
});

let done_left = 0;
let done_top = 0;
let total_width = -300;


io.on('connection', function (socket) {
  socket.on("init", function (data) {
    console.log("链接成功")
    total_width += data;
    socket.arg = {'width':data}
    socket.arg.done_top = done_top;
    socket.arg.before_width = 0;
    for(let i in io.sockets.sockets){
      socket.arg.before_width += io.sockets.sockets[i].arg.width;
    }
    socket.arg.before_width -= data;
    socket.arg.done_left = done_left - socket.arg.before_width
    socket.emit('connected', socket.arg);
  });
  socket.on('window_resize', function (data) {
    return
  })
  
  socket.on("move_ball", function (data) {
    done_left = data.done_left + socket.arg.before_width;
    if(socket.arg.before_width == 0 & done_left < 0){
      done_left = 0;
    }
    if(done_left > total_width){
      done_left = total_width;
    }
    done_top = data.done_top;

    for(let i in io.sockets.sockets){
      soc = io.sockets.sockets[i];
      soc.arg.done_top = done_top;
      soc.arg.done_left = done_left - soc.arg.before_width;
      soc.emit('move_ball', soc.arg);
    }
  });
  socket.on('disconnect', function (data) {
    total_width -= socket.arg.width;
    done_left -= socket.arg.width;
    for(let i in io.sockets.sockets){
      soc = io.sockets.sockets[i];
      if(soc.arg.before_width > socket.arg.before_width){
        soc.arg.before_width -= socket.arg.width;
      }
      soc.arg.done_left = done_left - soc.arg.before_width;
      soc.emit('move_ball', soc.arg);
    }
  })
})

