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
    socket.on("taskDeleted", fetchAnalytics);
    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  if (loading || !taskData) return <p>Loading analytics...</p>;

  const chartColors = [
    "rgba(255, 147, 182, 0.8)",
    "rgba(255, 223, 186, 0.8)",
    "rgba(187, 222, 251, 0.8)",
    "rgba(204, 153, 255, 0.8)",
    "rgba(255, 250, 205, 0.8)",
    "rgba(178, 255, 178, 0.8)",
    "rgba(255, 220, 182, 0.8)",
    "rgba(221, 130, 50, 0.8)",
    "rgba(106, 139, 150, 0.8)",
    "rgba(167, 127, 167, 0.8)"
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } }
  };

  const barData = {
    labels: (taskData.statusCounts || []).map(s => s.status),
    datasets: [{
      label: "Tasks by Status",
      data: (taskData.statusCounts || []).map(s => s.count),
      backgroundColor: chartColors
    }]
  };

  const pieData = {
    labels: (taskData.assigneeCounts || []).map(a => a.assignedTo),
    datasets: [{
      label: "Tasks by Assignee",
      data: (taskData.assigneeCounts || []).map(a => a.count),
      backgroundColor: chartColors
    }]
  };

  const createdLineData = {
    labels: (taskData.tasksOverTime || []).map(t => t.date),
    datasets: [{
      label: "Tasks Created",
      data: (taskData.tasksOverTime || []).map(t => t.count),
      borderColor: "rgba(255, 147, 182, 0.9)",
      backgroundColor: "rgba(255, 182, 193, 0.2)",
      fill: true,
      tension: 0.3
    }]
  };

  const completedLineData = {
    labels: (taskData.completedOverTime || []).map(t => t.date),
    datasets: [{
      label: "Tasks Completed",
      data: (taskData.completedOverTime || []).map(t => t.count),
      borderColor: "rgba(187, 222, 251, 0.9)",
      backgroundColor: "rgba(204, 153, 255, 0.2)",
      fill: true,
      tension: 0.3
    }]
  };

  const tasksByPriorityData = {
    labels: (taskData.tasksByPriority || []).map(p => p.priority),
    datasets: [{
      label: "Tasks by Priority",
      data: (taskData.tasksByPriority || []).map(p => p.count),
      backgroundColor: chartColors
    }]
  };

  const totalTasks = (taskData.statusCounts || []).reduce((sum, s) => sum + s.count, 0);
  const completedTasks = (taskData.statusCounts || []).find(s => s.status === "completed")?.count || 0;

  const completionRateData = {
    labels: ["Completed", "Remaining"],
    datasets: [{
      data: [completedTasks, totalTasks - completedTasks],
      backgroundColor: [
        "rgba(187, 222, 251, 0.9)",
        "rgba(255, 223, 186, 0.6)"
      ]
    }]
  };

  const titleStyle = { fontFamily: "'Segoe UI', sans-serif", color: "#4a4a4a" };
  const TitleWithIcon = ({ icon, children }) => (
    <h3 style={{ ...titleStyle, display: "inline-flex", alignItems: "center" }}>
      <img src={icon} alt="Icon" style={{ height: "25px", marginRight: "8px" }} />
      {children}
    </h3>
  );

  return (
    <div className="charts">
      <div className="chartContainer">
        <TitleWithIcon icon="./cake.png">Tasks by Status</TitleWithIcon>
        <div className="chartBox"><Bar data={barData} options={chartOptions} /></div>
      </div>

      <div className="chartContainer">
        <TitleWithIcon icon="./cake.png">Tasks by Assignee</TitleWithIcon>
        <div className="chartBox"><Pie data={pieData} options={chartOptions} /></div>
      </div>

      <div className="chartContainer">
        <TitleWithIcon icon="./cake.png">Tasks Created Over Time</TitleWithIcon>
        <div className="chartBox"><Line data={createdLineData} options={chartOptions} /></div>
      </div>

      <div className="chartContainer">
        <TitleWithIcon icon="./cake.png">Tasks Completed Over Time</TitleWithIcon>
        <div className="chartBox"><Line data={completedLineData} options={chartOptions} /></div>
      </div>

      <div className="chartContainer">
        <TitleWithIcon icon="./cake.png">Completion Rate</TitleWithIcon>
        <div className="chartBox"><Pie data={completionRateData} options={chartOptions} /></div>
      </div>

      <div className="chartContainer">
        <TitleWithIcon icon="./cake.png">Tasks by Priority</TitleWithIcon>
        <div className="chartBox"><Bar data={tasksByPriorityData} options={chartOptions} /></div>
      </div>
    </div>
  );
}

export default Analytics;
