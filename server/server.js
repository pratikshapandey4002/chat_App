import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import connectDB from './config/dataBase.js';


//create express and http server
const app = express();
const server = http.createServer(app);

//middleware setup
app.use(express.json({limit: "4mb"}));
app.use(cors());

app.use("/api/status", (req , res) => {
    res.send("server is live");
})

const port = process.env.PORT || 5000;

connectDB();

server.listen(port , () => {
    console.log("Server is running on PORT:" + port);
})

