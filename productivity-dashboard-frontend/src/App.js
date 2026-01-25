import AddTask from "./components/AddTask";
import Analytics from "./components/Analytics";
import TaskList from "./components/TaskList";
import "./App.css";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Load tasks from backend on refresh
    fetch("http://localhost:5000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));

    // Real-time: task created
    socket.on("taskCreated", (task) => {
      setTasks(prev => [...prev, task]);
    });

    // Real-time: task updated
    socket.on("taskUpdated", (task) => {
      setTasks(prev =>
        prev.map(t => (t._id === task._id ? task : t))
      );
    });

    // Real-time: task deleted
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
  };

  return (
    <div className="App">
      <h1 className="KPD">Kitty's Productivity Dashboard</h1>
      <AddTask onTaskAdded={handleTaskAdded} />
      <TaskList tasks={tasks} />
      <Analytics />
    </div>
  );
}

export default App;
