const Task = require('../models/Task.js');

//Getting all tasks

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Adding a Task
exports.addTask = async (req, res) => {
    const { title, description, assignedTo } = req.body;
    const newTask = new Task({ title, description, assignedTo });

    try {
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}