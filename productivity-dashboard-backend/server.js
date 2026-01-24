// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const http = require('http');
const server = http.createServer(app);

//Create socket.io 

const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", //frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"] //CRUD methods
    }
});

io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected: ' + socket.id);
    });
});

app.set('io', io);
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log('MongoDB connected'))
.catch(err => console.log("Error: " + err));


// Start server
const PORT = process.env.PORT || 5000;

const tasksRoutes = require('./routes/taskRoutes');
app.use('/tasks', tasksRoutes);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});