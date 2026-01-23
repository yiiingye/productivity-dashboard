import { useEffect, useState } from "react";

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
                        <p>Status: {task.status}</p>
                        <p>Assigned To: {task.assignedTo}</p>
                    </li>))}
            </ul>
        </div>
    );

}
export default TaskList;