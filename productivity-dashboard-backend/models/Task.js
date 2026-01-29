const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: "pending" },
    assignedTo: { type: String },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now } // si quieres trackear completados
});

TaskSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Task', TaskSchema);