function TaskList({ tasks }) {
    const handleDelete = async (id) => {
        await fetch(`http://localhost:5000/tasks/${id}`, {
            method: "DELETE"
        });
    };

    const handleStatusChange = async (id, newStatus) => {
        await fetch(`http://localhost:5000/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
    };

    return (
        <div>
            <h2>Tasks</h2>
            <div className="Tasks">
                {tasks.map(task => (
                    <div className="Task" key={task._id} >
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p><strong>Status:</strong> {task.status}</p>
                        <p><strong>Assigned To:</strong> {task.assignedTo}</p>

                        {/* Edit status */}
                        <select
                            value={task.status}
                            className="statusSelect"

                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        {/* Delete button */}
                        <button type="submit" className="deleteTask" role="button" onClick={() => handleDelete(task._id)}>
                            <span class="text">Delete</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default TaskList;