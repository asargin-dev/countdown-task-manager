import React, { useState } from 'react';
import TaskItem from './TaskItem';

interface Task {
    id: number;
    content: string;
    duration: number;
    progress: number;
    isCompleted: boolean;
}

interface TaskListProps {
    tasks: Task[];
    deleteTask: (id: number) => void;
    editTask: (id: number, content: string, duration: number) => void;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskList: React.FC<TaskListProps> = React.memo(({ tasks, deleteTask, editTask, setTasks }) => {
    const [draggingTaskIndex, setDraggingTaskIndex] = useState<number | null>(null);
    const [dragOverTaskIndex, setDragOverTaskIndex] = useState<number | null>(null);

    const onDragStart = (index: number) => {
        setDraggingTaskIndex(index);
    };

    const onDragOver = (index: number) => {
        setDragOverTaskIndex(index);
    };

    const onDrop = () => {
        if (draggingTaskIndex !== null && dragOverTaskIndex !== null) {
            // Reorder the tasks based on the dragging positions
            const updatedTasks = [...tasks];
            const [movedTask] = updatedTasks.splice(draggingTaskIndex, 1);
            updatedTasks.splice(dragOverTaskIndex, 0, movedTask);
            setTasks(updatedTasks);
        }
        // Reset dragging state
        setDraggingTaskIndex(null);
        setDragOverTaskIndex(null);
    };

    const onDragLeave = () => {
        setDragOverTaskIndex(null);
    };

    return (
        <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">Tasks</h2>
            <div className="space-y-4">
                {tasks.map((task, index) => (
                    <div
                        key={task.id}
                        draggable
                        onDragStart={() => onDragStart(index)}
                        onDragOver={(e) => {
                            e.preventDefault(); // Allow drop
                            onDragOver(index);
                        }}
                        onDrop={onDrop}
                        onDragLeave={onDragLeave}
                        className={`p-2 border rounded ${task.isCompleted ? 'bg-gray-100' : ''} ${
                            dragOverTaskIndex === index ? 'bg-blue-100' : ''
                        }`}
                    >
                        <TaskItem task={task} deleteTask={deleteTask} editTask={editTask} />
                    </div>
                ))}
            </div>
        </div>
    );
});

export default TaskList;
