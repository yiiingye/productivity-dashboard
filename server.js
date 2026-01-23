// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log('MongoDB connected'))
.catch(err => console.log("Error: " + err));


// Start server
const PORT = process.env.PORT || 5000;

const tasksRoutes = require('./routes/taskRoutes');
app.use('/tasks', tasksRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});