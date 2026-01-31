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

    const handlePriorityChange = async (id, newPriority) => {
        await fetch(`http://localhost:5000/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ priority: newPriority })
        });
    }

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
                        <select
                            value={task.priority}
                            className="prioritySelect"
                            onChange={(e) => handlePriorityChange(task._id, e.target.value)}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
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
