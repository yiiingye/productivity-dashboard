import { useEffect, useState } from "react";
import {io} from "socket.io-client";

const socket = io("http://localhost:5000");
function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    //Render once component is mounted
    useEffect(() => {
        fetch("http://localhost:5000/tasks")
            .then(response => response.json())
            .then(data => {
                console.log("DATA FROM API:", data);

                setTasks(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching tasks:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        socket.on("taskCreated", (newTask) => {
            setTasks(prevTasks => [...prevTasks, newTask]);
        }   ); 
        socket.on("taskUpdated", (updatedTask) => {
            setTasks(prevTasks => prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task));
        });
        socket.on("taskDeleted", (deletedTaskId) => {
            setTasks(prevTasks => prevTasks.filter(task => task._id !== deletedTaskId));
        });

        return () => {
            socket.off("taskCreated");
            socket.off("taskUpdated");
            socket.off("taskDeleted");
        };
    }, []);
console.log("TASKS STATE:", tasks);

    if (loading) {
        return <p>Loading tasks...</p>;
    }

    return (
        <div>
            <h2>Task List</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Status: {task.completed ? "Completed" : "Pending"}</p>
                    </li>
                ))}
            </ul>
        </div>
    );

}
export default TaskList;