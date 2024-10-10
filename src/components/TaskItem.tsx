import React from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Trash2, Edit2 } from 'lucide-react';

interface Task {
    id: number;
    content: string;
    duration: number;
    progress: number;
    isCompleted: boolean;
}

interface TaskItemProps {
    task: Task;
    deleteTask: (id: number) => void;
    editTask: (id: number, content: string, duration: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = React.memo(({ task, deleteTask, editTask }) => {
    const handleEdit = () => {
        const newContent = prompt('Edit task content:', task.content);
        const newDuration = parseInt(prompt('Edit task duration (minutes):', String(task.duration / 60)) || '0');
        if (newContent && newDuration > 0) {
            editTask(task.id, newContent, newDuration);
        }
    };

    return (
        <div className={`p-2 border rounded ${task.isCompleted ? 'bg-gray-100' : ''}`}>
            <div className="flex justify-between items-center">
                <span className={task.isCompleted ? 'line-through' : ''}>
                    {task.content} ({Math.floor(task.duration / 60)} minutes)
                </span>
                <div>
                    <Button size="icon" variant="ghost" onClick={handleEdit}>
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteTask(task.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <Progress value={task.progress} className="mt-2" />
        </div>
    );
});

export default TaskItem;
