import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import connectDB from './config/dataBase.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';


//create express and http server
const app = express();
const server = http.createServer(app);

//Initialize socket.io server
export const io = new Server(server, {cors : {origin: "*"}})

//store online users
export const userSocketMap = {}; //{userId : socketId}

//socket.io connection Handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("user connected", userId);

    if(userId) userSocketMap[userId] = socket.userId

    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect" , () => {
        console.log("user disconnected", userId);
    })
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

})

//middleware setup
app.use(express.json({limit: "4mb"}));
app.use(cors());

app.use("/api/status", (req , res) => {
    res.send("server is live");
})
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

const port = process.env.PORT || 5000;

connectDB();

server.listen(port , () => {
    console.log("Server is running on PORT:" + port);
})

