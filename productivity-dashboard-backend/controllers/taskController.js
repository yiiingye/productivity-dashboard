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
  const { title, description, assignedTo, status } = req.body;
  const newTask = new Task({ title, description, status, assignedTo });

  try {
    const savedTask = await newTask.save();

    // Emit event
    const io = req.app.get('io');
    io.emit('taskCreated', savedTask);

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    const io = req.app.get('io');
    io.emit('taskUpdated', updated);

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);

    const io = req.app.get('io');
    io.emit('taskDeleted', deleted);

    res.json({ message: 'Task deleted', task: deleted });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
