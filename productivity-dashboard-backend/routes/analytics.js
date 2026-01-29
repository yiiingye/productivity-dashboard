const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const statusCounts = await Task.aggregate([
      { $match: { status: { $in: ["pending", "in-progress", "completed"] } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const assigneeCounts = await Task.aggregate([
      { $match: { assignedTo: { $nin: [null, ""] } } }, 
      { $group: { _id: "$assignedTo", count: { $sum: 1 } } }
    ]);

    const tasksOverTime = await Task.aggregate([
      { $match: { createdAt: { $exists: true } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const completedOverTime = await Task.aggregate([
      { $match: { status: "completed", updatedAt: { $exists: true } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const pendingOverTime = await Task.aggregate([
      { $match: { status: "pending", createdAt: { $exists: true } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const tasksByPriority = await Task.aggregate([
      { $match: { priority: { $in: ["low", "medium", "high"] } } },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    res.json({
      statusCounts: statusCounts.map(s => ({ status: s._id, count: s.count })),
      assigneeCounts: assigneeCounts.map(a => ({ assignedTo: a._id || "Unassigned", count: a.count })),
      tasksOverTime: tasksOverTime.map(t => ({ date: t._id, count: t.count })),
      completedOverTime: completedOverTime.map(t => ({ date: t._id, count: t.count })),
      pendingOverTime: pendingOverTime.map(t => ({ date: t._id, count: t.count })),
      tasksByPriority: tasksByPriority.map(p => ({ priority: p._id, count: p.count }))
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to compute analytics" });
  }
});

module.exports = router;
