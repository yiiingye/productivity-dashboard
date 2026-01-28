import AddTask from "./components/AddTask";
import Analytics from "./components/Analytics";
import TaskList from "./components/TaskList";
import "./App.css";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("dashboard"); // "dashboard" o "newTask"

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));

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
    setView("dashboard"); // volver a la vista principal después de agregar
  };

  return (
    <div className="App">
      <div className="header">

        <div className="title" style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
          <img src="./mylogo.png" alt="Logo" style={{ height: "50px" }} />
          <h1>Productivity Dashboard</h1>
        </div>
        {view === "dashboard" && (
          <button
            className="addTask"
            onClick={() => setView("newTask")}
            style={{ height: "40px" }}
          >
            Add Task
          </button>
        )}
      </div>

      {view === "dashboard" && (
        <>
          <TaskList tasks={tasks} />
          <Analytics />
        </>
      )}

      {view === "newTask" && (
        <AddTask onTaskAdded={handleTaskAdded} onCancel={() => setView("dashboard")} />
      )}
    </div>
  );
}

export default App;
