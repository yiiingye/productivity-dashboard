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

  const chartColors = [
    "rgba(255, 147, 182, 0.8)",   // pastel pink
    "rgba(255, 223, 186, 0.8)",   // pastel peach
    "rgba(187, 222, 251, 0.8)",   // pastel blue
    "rgba(204, 153, 255, 0.8)",   // pastel purple
    "rgba(255, 250, 205, 0.8)"    // pastel yellow
  ];

  const barData = {
    labels: taskData.statusCounts.map(s => s.status),
    datasets: [
      {
        label: "Tasks by Status",
        data: taskData.statusCounts.map(s => s.count),
        backgroundColor: chartColors
      }
    ]
  };

  const pieData = {
    labels: taskData.assigneeCounts.map(a => a.assignedTo),
    datasets: [
      {
        label: "Tasks by Assignee",
        data: taskData.assigneeCounts.map(a => a.count),
        backgroundColor: chartColors
      }
    ]
  };

  const createdLineData = {
    labels: taskData.tasksOverTime.map(t => t.date),
    datasets: [
      {
        label: "Tasks Created",
        data: taskData.tasksOverTime.map(t => t.count),
        borderColor: "rgba(255, 147, 182, 0.9)",
        backgroundColor: "rgba(255, 182, 193, 0.2)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: chartColors,
        pointBorderColor: "#fff",
        pointHoverRadius: 5
      }
    ]
  };

  const completedLineData = {
    labels: taskData.completedOverTime.map(t => t.date),
    datasets: [
      {
        label: "Tasks Completed",
        data: taskData.completedOverTime.map(t => t.count),
        borderColor: "rgba(187, 222, 251, 0.9)",
        backgroundColor: "rgba(204, 153, 255, 0.2)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: chartColors,
        pointBorderColor: "#fff",
        pointHoverRadius: 5
      }
    ]
  };

  const titleStyle = { fontFamily: "'Segoe UI', sans-serif", color: "#4a4a4a" };

  const TitleWithIcon = ({ icon, children }) => (
    <h3 style={{ ...titleStyle, display: "inline-flex", alignItems: "center" }}>
      <img
        src={icon}
        alt="Icon"
        style={{ height: "25px", display: "inline-block" }}
      />
      {children}
    </h3>
  );

  return (
    <div>
      <h2 style={titleStyle}>Analytics Dashboard</h2>

      <div style={{ margin: "20px 0" }}>
        <TitleWithIcon icon="./cake.png">Completion Rate</TitleWithIcon>
        <div style={{ background: "#eee", height: "20px", borderRadius: "10px", overflow: "hidden" }}>
          <div
            style={{
              width: `${taskData.completionRate}%`,
              background: "#ff93b6",
              height: "100%",
              transition: "width 0.3s ease"
            }}
          ></div>
        </div>
        <p>{taskData.completionRate}% completed</p>
      </div>

      <TitleWithIcon icon="./cake.png">Tasks by Status</TitleWithIcon>
      <Bar data={barData} />

      <TitleWithIcon icon="./cake.png">Tasks by Assignee</TitleWithIcon>
      <Pie data={pieData} />

      <TitleWithIcon icon="./cake.png">Tasks Created Over Time</TitleWithIcon>
      <Line data={createdLineData} />

      <TitleWithIcon icon="./cake.png">Tasks Completed Over Time</TitleWithIcon>
      <Line data={completedLineData} />
    </div>
  );
}

export default Analytics;
