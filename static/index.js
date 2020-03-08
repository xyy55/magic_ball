//生成客户端唯一的标识
// function guid() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//         var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
//         return v.toString(16);
//     });
// }
//生成球
function create_ball() {
  // id = uuid || guid();
  let ball = document.createElement("div");
  // ball.id = id
  ball.className = "ball";
  ball.style.position = "fixed";
  // ball.style.left = "0px";
  // ball.style.top = "0px";
  ball.addEventListener("mousedown", function (event) {
    let orign_mouse_position_left = event.clientX;  //初始鼠标的位置
    let orign_mouse_position_top = event.clientY;   //初始鼠标位置
    let orign_ball_position_left = parseInt(ball.style.left);  //初始球的位置
    let orign_ball_position_top = parseInt(ball.style.top);    //初始球的位置

    document.onmousemove = function (e) {
      let relative_left = e.clientX - orign_mouse_position_left;
      let relative_top = e.clientY - orign_mouse_position_top;
      let done_left = orign_ball_position_left + relative_left;
      let done_top = orign_ball_position_top + relative_top;
      if (done_top < 0) {
        done_top = 0;
      }
      if (done_top > window.innerHeight - ball.offsetHeight) {
        done_top = window.innerHeight - ball.offsetHeight
      }
      socketClient.emit('move_ball', { done_left, done_top });
      // $.post("/send_position/", {"done_left":done_left,"done_top":done_top,"user_id":id})
      // ball.style.left = orign_ball_position_left + done_left + "px";
      // ball.style.top = orign_ball_position_top + done_top + "px";

    }
  });
  ball.addEventListener("mouseup", function () {
    document.onmousemove = null;
  })
  ball.addEventListener("touchstart", function (event) {
    event.preventDefault();
    let orign_touch_position_left = event.touches[0].clientX;  //初始触摸的位置
    let orign_touch_position_top = event.touches[0].clientY;   //初始触摸位置
    let orign_ball_position_left = parseInt(ball.style.left);  //初始球的位置
    let orign_ball_position_top = parseInt(ball.style.top);    //初始球的位置
    ball.addEventListener("touchmove", function (e) {
      let relative_left = e.touches[0].clientX - orign_touch_position_left;
      let relative_top = e.touches[0].clientY - orign_touch_position_top;
      let done_left = orign_ball_position_left + relative_left;
      let done_top = orign_ball_position_top + relative_top;
      if (done_top < 0) {
        done_top = 0;
      }
      if (done_top > window.innerHeight - ball.offsetHeight) {
        done_top = window.innerHeight - ball.offsetHeight
      }
      socketClient.emit('move_ball', { done_left, done_top });
      // $.post("/send_position/", {"done_left":done_left,"done_top":done_top,"user_id":id})
      // ball.style.left = orign_ball_position_left + done_left + "px";
      // ball.style.top = orign_ball_position_top + done_top + "px";
    }, false)
  })
  // document.body.append(ball)
  return ball
}

// let uuid = guid();
let ball = create_ball();
let init_width = window.innerWidth;


socketClient = io('http://192.168.1.4:233/', {
  reconnection: false
}); //发起连接
socketClient.emit('init', init_width);
//系统监听-连接完成创建球
socketClient.on('connected', function (socket) {
  ball.style.left = socket.done_left + "px";
  ball.style.top = socket.done_top + "px";
  document.body.append(ball);
});

socketClient.on("move_ball", function (data) {
  console.log(data)
  ball.style.left = data.done_left + "px";
  ball.style.top = data.done_top + "px";
})
window.onresize = function () {
  socketClient.emit('window_resize', window.innerWidth);
}