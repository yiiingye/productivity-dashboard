const Task = require("../models/Task");

// CREATE
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    req.io.emit("taskCreated", task);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

// READ ALL
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// UPDATE
exports.updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    req.io.emit("taskUpdated", updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// DELETE
exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);

    req.io.emit("taskDeleted", deleted);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};
