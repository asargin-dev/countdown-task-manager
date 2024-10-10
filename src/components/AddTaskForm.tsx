import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AddTaskFormProps {
    addTask: (task: { id: number; content: string; duration: number; progress: number; isCompleted: boolean }) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = React.memo(({ addTask }) => {
    const [newTaskContent, setNewTaskContent] = useState('');
    const [newTaskDuration, setNewTaskDuration] = useState(0);

    const handleAddTask = () => {
        if (newTaskContent && newTaskDuration > 0) {
            addTask({
                id: Date.now(),
                content: newTaskContent,
                duration: newTaskDuration * 60,
                progress: 0,
                isCompleted: false,
            });
            setNewTaskContent('');
            setNewTaskDuration(0);
        }
    };

    return (
        <div className="w-full p-4 border rounded mb-4">
            <h2 className="text-xl font-semibold mb-2">Add Task</h2>
            <div className="space-y-2">
                <div>
                    <Label htmlFor="taskContent">Task Content</Label>
                    <Input
                        id="taskContent"
                        value={newTaskContent}
                        onChange={(e) => setNewTaskContent(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="taskDuration">Duration (minutes)</Label>
                    <Input
                        id="taskDuration"
                        type="number"
                        value={newTaskDuration || ''}
                        onChange={(e) => setNewTaskDuration(parseInt(e.target.value) || 0)}
                        min="1"
                    />
                </div>
                <Button onClick={handleAddTask}>Add Task</Button>
            </div>
        </div>
    );
});

export default AddTaskForm;
