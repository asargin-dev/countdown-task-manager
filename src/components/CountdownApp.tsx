import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Card } from './ui/card';
import { Trash2, Edit2 } from 'lucide-react';

interface Task {
    id: number;
    content: string;
    duration: number;
    progress: number;
    isCompleted: boolean;
}

export default function CountdownApp() {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskContent, setNewTaskContent] = useState('');
    const [newTaskDuration, setNewTaskDuration] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && remainingTime > 0) {
            interval = setInterval(() => {
                setRemainingTime((prevTime) => {
                    const newTime = prevTime - 1;
                    updateTaskProgress(newTime);
                    return newTime;
                });
            }, 1000);
        } else if (remainingTime === 0) {
            setIsRunning(false);
        }
        return () => clearInterval(interval);
    }, [isRunning, remainingTime]);

    const startCountdown = () => {
        if (hours === 0 && minutes === 0 && seconds === 0) return;
        const total = hours * 3600 + minutes * 60 + seconds;
        setTotalTime(total);
        setRemainingTime(total);
        setIsRunning(true);
    };

    const stopCountdown = () => {
        setIsRunning(false);
    };

    const resetCountdown = () => {
        setIsRunning(false);
        setRemainingTime(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setTasks([]);
    };

    const addTask = () => {
        if (newTaskContent && newTaskDuration > 0) {
            setTasks([
                ...tasks,
                {
                    id: Date.now(),
                    content: newTaskContent,
                    duration: newTaskDuration * 60,
                    progress: 0,
                    isCompleted: false,
                },
            ]);
            setNewTaskContent('');
            setNewTaskDuration(0);
        }
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const editTask = (id: number, content: string, duration: number) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, content, duration: duration * 60 } : task
            )
        );
    };

    const updateTaskProgress = (currentTime: number) => {
        let elapsedTime = totalTime - currentTime;
        setTasks((prevTasks) => {
            return prevTasks.map((task) => {
                if (elapsedTime > 0 && !task.isCompleted) {
                    const taskProgress = Math.min(elapsedTime, task.duration);
                    const newProgress = (taskProgress / task.duration) * 100;
                    elapsedTime -= taskProgress;
                    return {
                        ...task,
                        progress: newProgress,
                        isCompleted: newProgress >= 100,
                    };
                }
                return task;
            });
        });
    };

    const formatTime = (time: number): string => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Countdown Task Manager</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                    <h2 className="text-xl font-semibold mb-2">Set Countdown</h2>
                    <div className="flex space-x-2 mb-4">
                        <div>
                            <Label htmlFor="hours">Hours</Label>
                            <Input
                                id="hours"
                                type="number"
                                value={hours}
                                onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                                min="0"
                            />
                        </div>
                        <div>
                            <Label htmlFor="minutes">Minutes</Label>
                            <Input
                                id="minutes"
                                type="number"
                                value={minutes}
                                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                                min="0"
                                max="59"
                            />
                        </div>
                        <div>
                            <Label htmlFor="seconds">Seconds</Label>
                            <Input
                                id="seconds"
                                type="number"
                                value={seconds}
                                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                                min="0"
                                max="59"
                            />
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button onClick={startCountdown} disabled={isRunning}>
                            Start
                        </Button>
                        <Button onClick={stopCountdown} disabled={!isRunning}>
                            Stop
                        </Button>
                        <Button onClick={resetCountdown}>Reset</Button>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Remaining Time:</h3>
                        <p className="text-3xl font-bold">{formatTime(remainingTime)}</p>
                    </div>
                </Card>
                <Card className="p-4">
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
                                value={newTaskDuration}
                                onChange={(e) => setNewTaskDuration(parseInt(e.target.value) || 0)}
                                min="1"
                            />
                        </div>
                        <Button onClick={addTask}>Add Task</Button>
                    </div>
                </Card>
            </div>
            <Card className="mt-4 p-4">
                <h2 className="text-xl font-semibold mb-2">Tasks</h2>
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`p-2 border rounded ${
                                task.isCompleted ? 'bg-gray-100' : ''
                            }`}
                        >
                            <div className="flex justify-between items-center">
                <span className={task.isCompleted ? 'line-through' : ''}>
                  {task.content} ({Math.floor(task.duration / 60)} minutes)
                </span>
                                <div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {
                                            const newContent = prompt('Edit task content:', task.content);
                                            const newDuration = parseInt(
                                                prompt('Edit task duration (minutes):', String(task.duration / 60)) || '0'
                                            );
                                            if (newContent && newDuration > 0) {
                                                editTask(task.id, newContent, newDuration);
                                            }
                                        }}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>

                                </div>
                            </div>
                            <Progress value={task.progress} className="mt-2" />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}