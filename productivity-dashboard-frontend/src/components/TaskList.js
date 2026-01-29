import { useState } from "react";

function TaskList({ tasks }) {

    const handleDelete = async (id) => {
        await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
    };

    const handleStatusChange = async (id, newStatus) => {
        await fetch(`http://localhost:5000/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
    };

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const titleStyle = { fontFamily: "'Segoe UI', sans-serif", color: "#4a4a4a" };

    const TitleWithIcon = ({ icon, children }) => (
        <h3 style={{ ...titleStyle, display: "inline-flex", alignItems: "center" }}>
            <img src={icon} alt="Icon" style={{ height: "25px", display: "inline-block" }} />
            {children}
        </h3>
    );

    return (

            <div className="Tasks">
                {tasks.map(task => (
                    <div className="Task" key={task._id}>
                        <h3>
                            <img src="./apple.png" alt="Task Icon" style={{ height: "15px", margin: "0 5px 0 0" }} />
                            {task.title}
                        </h3>
                        <p>{task.description}</p>
                        <p><strong>Status:</strong> {task.status}</p>
                        <p><strong>Assigned To:</strong> {task.assignedTo}</p>

                        <select
                            value={task.status}
                            className="statusSelect"
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <button type="submit" className="deleteTask" onClick={() => handleDelete(task._id)}>
                            <strong>Delete</strong>
                        </button>
                    </div>
                ))}
            </div>
    );
}

export default TaskList;
