const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Conteo de tareas por status
    const statusCounts = await Task.aggregate([
      { $match: { status: { $in: ["pending", "in progress", "completed"] } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Conteo de tareas por persona asignada
    const assigneeCounts = await Task.aggregate([
      { $match: { assignedTo: { $nin: [null, ""] } } },
      { $group: { _id: "$assignedTo", count: { $sum: 1 } } }
    ]);

    // Tareas creadas por día
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
      { $match: { status: "completed", completedAt: { $ne: null } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);



    // Tareas pendientes por día
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

    // Conteo de tareas por prioridad
    const tasksByPriority = await Task.aggregate([
      { $match: { priority: { $in: ["low", "medium", "high"] } } },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    // Respuesta JSON
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
