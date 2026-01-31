require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("./models/Task");
const sampleData = require("./sample_data.json");

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Cleaning existing tasks...");
    await Task.deleteMany({});

    console.log("Converting date strings to Date objects...");
    const tasksWithDates = sampleData.map(task => ({
      ...task,
      createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
      completedAt: task.completedAt ? new Date(task.completedAt) : null
    }));

    console.log("Inserting sample tasks...");
    await Task.insertMany(tasksWithDates);

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
