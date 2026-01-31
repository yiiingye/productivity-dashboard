import AddTask from "./components/AddTask";
import Analytics from "./components/Analytics";
import TaskList from "./components/TaskList";
import "./App.css";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("tasks"); // "tasks", "charts", "newTask"

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));

    socket.on("taskCreated", (task) => setTasks(prev => [...prev, task]));
    socket.on("taskUpdated", (task) => setTasks(prev => prev.map(t => (t._id === task._id ? task : t))));
    socket.on("taskDeleted", (task) => setTasks(prev => prev.filter(t => t._id !== task._id)));

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  return (
    <div className="App">
      <div className="header">
        <div className="title" style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
          <img src="./mylogo.png" alt="Logo" style={{ height: "50px" }} />
          <h1>HelloKitty Productivity Monitor</h1>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {view === "tasks" && (
            <button
              className="addTask"
              onClick={() => setView("charts")}
              style={{ height: "40px", backgroundColor: "rgb(150, 105, 80)" }}
            >
              Charts
            </button>
          )}
          {view === "charts" && (
            <button
              className="addTask"
              onClick={() => setView("tasks")}
              style={{ height: "40px", backgroundColor: "rgb(150, 105, 80)" }}
            >
              All Tasks
            </button>
          )}

          {/* Botón Add Task / Go Back */}
          <button
            className="addTask"
            onClick={() => setView(view === "newTask" ? "tasks" : "newTask")}
            style={{
              height: "40px",
              backgroundColor: view === "newTask" ? "rgba(140, 138, 138, 1)" : "rgb(255, 147, 182)",
              color: "#fff"
            }}
          >
            {view === "newTask" ? "Go Back" : "Add Task"}
          </button>
        </div>
      </div>

      {view === "tasks" && <TaskList tasks={tasks} />}
      {view === "charts" && <Analytics />}
      {view === "newTask" && <AddTask onCancel={() => setView("tasks")} />}
    </div>
  );
}

export default App;
