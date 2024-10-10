import { useState, useEffect, useCallback } from "react";
import CountdownSettings from "./CountdownSettings";
import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm";

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
  const [remainingTime, setRemainingTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);

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

  const startCountdown = useCallback(() => {
    if (hours === 0 && minutes === 0 && seconds === 0) return;
    const total = hours * 3600 + minutes * 60 + seconds;
    setTotalTime(total);
    setRemainingTime(total);
    setIsRunning(true);
  }, [hours, minutes, seconds]);

  const stopCountdown = useCallback(() => setIsRunning(false), []);
  const resetCountdown = useCallback(() => {
    setIsRunning(false);
    setRemainingTime(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTasks([]);
  }, []);

  const addTask = useCallback((task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  }, []);

  const deleteTask = useCallback((id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  const editTask = useCallback(
    (id: number, newContent: string, newDuration: number) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? { ...task, content: newContent, duration: newDuration * 60 }
            : task,
        ),
      );
    },
    [],
  );

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Countdown Task Manager</h1>
      <div className="w-full flex gap-4">
        <CountdownSettings
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          setHours={setHours}
          setMinutes={setMinutes}
          setSeconds={setSeconds}
          startCountdown={startCountdown}
          stopCountdown={stopCountdown}
          resetCountdown={resetCountdown}
          isRunning={isRunning}
          remainingTime={remainingTime}
        />
        <AddTaskForm addTask={addTask} />
      </div>
      <TaskList
        tasks={tasks}
        deleteTask={deleteTask}
        editTask={editTask}
        setTasks={setTasks}
      />
    </div>
  );
}
