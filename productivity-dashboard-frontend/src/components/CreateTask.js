import { useState } from 'react';

function CreateTask({ onTaskAdded }) {
    const [addTask, setAddTask] = useState(false);
    if (!addTask) {
        return (
            <div className="createTask">
                <button onClick={() => setAddTask(true)}>Create Task</button>
            </div>
        );
    }
}