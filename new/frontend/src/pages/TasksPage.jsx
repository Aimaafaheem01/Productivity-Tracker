import { useState, useEffect } from "react";
import TaskList from "../features/tasks/components/TaskList";
import QuickAddTask from "../features/tasks/components/QuickAddTask";
import { api } from "../lib/api";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await api.getTasks();
        setTasks(data);
      } catch (err) {
        setError("Could not load tasks. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  const addTask = async (title) => {
    try {
      const created = await api.createTask({ title });
      setTasks((prev) => [...prev, created]);
    } catch (err) {
      setError(err.message || "Could not add task");
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;
    try {
      const updated = await api.updateTask(id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message || "Could not update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message || "Could not delete task");
    }
  };

  const duplicateTask = async (id) => {
    try {
      const copy = await api.duplicateTask(id);
      setTasks((prev) => [...prev, copy]);
    } catch (err) {
      setError(err.message || "Could not duplicate task");
    }
  };

  const handleTaskUpdate = (updated) => {
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  };

  const remaining = tasks.filter((t) => !t.completed).length;

  if (loading) {
    return <div className="p-6 text-deep-700/50 text-sm">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-baseline justify-between mb-5">
        <h1 className="text-lg font-medium text-deep-800">Tasks</h1>
        <span className="text-sm text-deep-700/40">{remaining} remaining</span>
      </div>

      {error && (
        <p className="text-sm text-coral-600 bg-coral-50 px-3 py-2 rounded-lg mb-3">{error}</p>
      )}

      <QuickAddTask onAdd={addTask} />
      <div className="h-px bg-mist-200 my-1" />

      <TaskList
        tasks={tasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onDuplicate={duplicateTask}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
}