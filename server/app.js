import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User has been connected", socket.id);

  socket.emit("greeting", "Hello, welcome to the socket.io");

  socket.on("greeting2", (data) => {
    console.log(data);
  });

  socket.on("message", ({ userId, message }) => {
    console.log("userId", userId);
    console.log("message", message);
    socket.emit("receivedMessage", message);
    socket.to(userId).emit("receivedMessage", message);
  });

  socket.on("joinRoom", (roomName) => {
    console.log("User has joined romm - ", roomName);
    socket.join(roomName);
  });

  socket.on("disconnect", () => {
    console.log("User has been disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
