import { useState } from "react";

function AddTask({ onTaskAdded }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [assignedTo, setAssignedTo] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const res = await fetch("http://localhost:5000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description, status, assignedTo }),
        });

        if (res.ok) {
            onTaskAdded(await res.json());
            alert("Task added successfully!");
            setTitle("");
            setDescription("");
            setStatus("pending");
            setAssignedTo("");

        } else {
            alert("Failed to add task.");
        }
    
    }
    return (
        <div>
            <h2>Add New Task</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label>Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div>
                    <label>Assigned To:</label>
                    <input
                        type="text"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                    />
                </div>
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
}

export default AddTask;