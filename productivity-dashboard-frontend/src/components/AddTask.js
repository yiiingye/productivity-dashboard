import { useState } from "react";
function AddTask({ onTaskAdded, onCancel }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [assignedTo, setAssignedTo] = useState("");
    const [priority, setPriority] = useState("medium");
    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:5000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description, status, assignedTo, priority }),
        });

        if (res.ok) {
            onTaskAdded(await res.json());
            setTitle("");
            setDescription("");
            setStatus("pending");
            setAssignedTo("");
        } else {
            alert("Failed to add task.");
        }
    };

    return (
        <div className="addTaskContainer">
            <div className="newTask">
                <h2> <img src="./apple.png" alt="Add Icon" style={{ height: "20px", margin: "0 5px 0 0" }}></img> 
                    Create New Task</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title: </label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="description">
                        <label>Description:</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div>
                        <label>Status: </label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label>Priority: </label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div>
                        <label>Assigned To: </label>
                        <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
                        <button type="submit" className="addTask">Add Task</button>
                        <button type="button" className="deleteTask" style={{ marginLeft: "10px" }} onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default AddTask;
