const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: "pending" },
    assignedTo: { type: String },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now } 
});

TaskSchema.pre('save', function() {
    this.updatedAt = new Date();
});

module.exports = mongoose.model('Task', TaskSchema);