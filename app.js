const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

let socketsConnected = new Set(); //saving the socket id in a set

io.on("connection", onConnected);

function onConnected(socket) {
  //console.log(socket.id);
  socketsConnected.add(socket.id); //adding the clients id in a the set

  io.emit("clients-total", socketsConnected.size); //emitting the totoal count of clients on the frontend

  socket.on("disconnect", () => {
    //after disconnecting of clients the count will change with a message
    //console.log("Socket disconnected", socket.id);
    socketsConnected.delete(socket.id);
    io.emit("clients-total", socketsConnected.size);
  });

  socket.on("message", (data) => {
    //console.log(data);
    socket.broadcast.emit('chat-message', data);
  });

  socket.on('feedback',(data)=>{
    socket.broadcast.emit('feedback',data)
  })
}
