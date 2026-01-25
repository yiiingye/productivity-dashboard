import { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function Analytics() {
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = () => {
    fetch("http://localhost:5000/analytics")
      .then(res => res.json())
      .then(data => {
        setTaskData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Analytics fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAnalytics();

    socket.on("taskCreated", fetchAnalytics);
    socket.on("taskUpdated", fetchAnalytics);

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
    };
  }, []);

  if (loading || !taskData) return <p>Loading analytics...</p>;

  // --- Chart Data ---
  const barData = {
    labels: taskData.statusCounts.map(s => s.status),
    datasets: [
      {
        label: "Tasks by Status",
        data: taskData.statusCounts.map(s => s.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }
    ]
  };

  const pieData = {
    labels: taskData.assigneeCounts.map(a => a.assignedTo),
    datasets: [
      {
        label: "Tasks by Assignee",
        data: taskData.assigneeCounts.map(a => a.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)"
        ]
      }
    ]
  };

  const createdLineData = {
    labels: taskData.tasksOverTime.map(t => t.date),
    datasets: [
      {
        label: "Tasks Created",
        data: taskData.tasksOverTime.map(t => t.count),
        borderColor: "rgba(153, 102, 255, 0.6)",
        tension: 0.2
      }
    ]
  };

  const completedLineData = {
    labels: taskData.completedOverTime.map(t => t.date),
    datasets: [
      {
        label: "Tasks Completed",
        data: taskData.completedOverTime.map(t => t.count),
        borderColor: "rgba(46, 204, 113, 0.8)",
        tension: 0.2
      }
    ]
  };

  return (
    <div>
      <h2>Analytics Dashboard</h2>

      {/* Completion Rate */}
      <div style={{ margin: "20px 0" }}>
        <h3>Completion Rate</h3>
        <div
          style={{
            background: "#eee",
            height: "20px",
            borderRadius: "10px",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: `${taskData.completionRate}%`,
              background: "#2ecc71",
              height: "100%"
            }}
          ></div>
        </div>
        <p>{taskData.completionRate}% completed</p>
      </div>

      <h3>Tasks by Status</h3>
      <Bar data={barData} />

      <h3>Tasks by Assignee</h3>
      <Pie data={pieData} />

      <h3>Tasks Created Over Time</h3>
      <Line data={createdLineData} />
    </div>
  );
}

export default Analytics;
