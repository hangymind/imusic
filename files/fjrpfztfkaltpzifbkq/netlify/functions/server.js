const http = require('http');
const socketIo = require('socket.io');

// 创建HTTP服务器
const server = http.createServer();
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 存储在线用户
const users = new Map();
// 用户计数器
let userCounter = 0;

io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);
  
  // 用户加入聊天
  socket.on('join', (username) => {
    // 为用户分配编号
    userCounter++;
    const numberedUsername = `喜欢芙宁娜的${userCounter}号`;
    users.set(socket.id, numberedUsername);
    // 向该用户发送分配的用户名
    socket.emit('assigned-username', numberedUsername);
    // 广播用户加入消息
    socket.broadcast.emit('user-joined', numberedUsername);
    // 发送在线用户列表
    io.emit('users-list', Array.from(users.values()));
  });
  
  // 处理聊天消息
  socket.on('chat-message', (data) => {
    const username = users.get(socket.id) || '未知用户';
    io.emit('chat-message', {
      username: username,
      message: data.message,
      timestamp: new Date().toLocaleTimeString()
    });
  });
  
  // 处理用户断开连接
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      console.log('用户断开连接:', username);
      // 广播用户离开消息
      socket.broadcast.emit('user-left', username);
      // 更新在线用户列表
      io.emit('users-list', Array.from(users.values()));
    }
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Socket.IO服务器运行在端口 ${port}`);
});
