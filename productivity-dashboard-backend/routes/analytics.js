const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// GET /analytics
router.get("/", async (req, res) => {
  try {
    // 1. Status counts
    const statusCounts = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 2. Assignee counts
    const assigneeCounts = await Task.aggregate([
      { $group: { _id: "$assignedTo", count: { $sum: 1 } } }
    ]);

    // 3. Tasks created over time
    const tasksOverTime = await Task.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 4. Tasks completed over time
    const completedOverTime = await Task.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 5. Completion rate
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const completionRate =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    res.json({
      statusCounts: statusCounts.map(s => ({
        status: s._id,
        count: s.count
      })),
      assigneeCounts: assigneeCounts.map(a => ({
        assignedTo: a._id || "Unassigned",
        count: a.count
      })),
      tasksOverTime: tasksOverTime.map(t => ({
        date: t._id,
        count: t.count
      })),
      completedOverTime: completedOverTime.map(t => ({
        date: t._id,
        count: t.count
      })),
      completionRate
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to compute analytics" });
  }
});

module.exports = router;
