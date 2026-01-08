import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import connectDB from './config/dataBase.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';


//create express and http server
const app = express();
const server = http.createServer(app);

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

