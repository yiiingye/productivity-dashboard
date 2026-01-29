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
    // Obtener tareas iniciales
    fetch("http://localhost:5000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));

    // Suscripción a sockets
    socket.on("taskCreated", (task) => {
      setTasks(prev => [...prev, task]);
    });

    socket.on("taskUpdated", (task) => {
      setTasks(prev => prev.map(t => (t._id === task._id ? task : t)));
    });

    socket.on("taskDeleted", (task) => {
      setTasks(prev => prev.filter(t => t._id !== task._id));
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [...prev, newTask]);
    setView("tasks"); // volver a la vista principal después de agregar
  };

  return (
    <div className="App">
      <div className="header">
        <div
          className="title"
          style={{ display: "flex", alignItems: "center", flexDirection: "row" }}
        >
          <img src="./mylogo.png" alt="Logo" style={{ height: "50px" }} />
          <h1>Productivity Dashboard</h1>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* Botón Charts / All Tasks */}
          {view === "tasks" && (
            <button
              className="addTask"
              onClick={() => setView("charts")}
              style={{ height: "40px" }}
            >
              Charts
            </button>
          )}
          {view === "charts" && (
            <button
              className="addTask"
              onClick={() => setView("tasks")}
              style={{ height: "40px" }}
            >
              All Tasks
            </button>
          )}

          <button
            className="addTask"
            onClick={() => setView("newTask")}
            style={{ height: "40px" }}
          >
            Add Task
          </button>

        </div>
      </div>

      {/* Renderizado condicional */}
      {view === "tasks" && <TaskList tasks={tasks} />}
      {view === "charts" && <Analytics />}
      {view === "newTask" && (
        <AddTask onTaskAdded={handleTaskAdded} onCancel={() => setView("tasks")} />
      )}
    </div>
  );
}

export default App;
