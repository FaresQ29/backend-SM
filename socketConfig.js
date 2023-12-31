const { Server } = require("socket.io");

function connectSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT"],
    },
  });

  io.on("connection", (socket) => {
    //console.log("User connected with id: " + socket.id);

    socket.on("connect-users", (data) => {
      const {
        emittedUserObj: { username, connectionId },
      } = data;
      socket.join(connectionId);
      socket.username = username;
      socket.chatroom = connectionId;
      console.log("User: " + username + " joined room: " + connectionId);
    });

    socket.on("disconnect", () => {
      io.emit("user disconnected");
      // socket.broadcast.to(socket.chatroom).emit('user disconnect', socket.username);
      console.log("User disconnected...");
    });
  });
}

module.exports = { connectSocket };

/*
  io.on("connection", (socket) => {
    console.log("User connected with id: " + socket.id);
    socket.on("join_room", (data) => {
      socket.join(data.roomId);
      socket.username = data.name;
      socket.chatroom = data.roomId;
      console.log("User: " + data.name + " joined room: " + data.roomId);
    });
    socket.on("leave_room", (data) => {
      socket.leave(data);
    });
    socket.on("send_message", (msgData) => {
      io.to(msgData.room).emit("receive_message", msgData);
    });

    socket.on("get_num_users", (data) => {
      const clients = io.sockets.adapter.rooms.get(data);
      const numClients = clients ? clients.size : 0; //how many users are in room
      io.to(data).emit("send_num_users", numClients);
    });
    socket.on("get_num", (data) => {
      const clients = io.sockets.adapter.rooms.get(data);
      const clientUsernames = [];
      if (clients) {
        for (const clientId of clients) {
          const clientSocket = io.sockets.sockets.get(clientId);
          clientUsernames.push(clientSocket.username);
        }
      }
      io.to(data).emit("send_num", clientUsernames);
    });
    socket.on("disconnect", () => {
      io.emit("user disconnected");
      // socket.broadcast.to(socket.chatroom).emit('user disconnect', socket.username);
      console.log("User disconnected...");
    });
  });

*/
