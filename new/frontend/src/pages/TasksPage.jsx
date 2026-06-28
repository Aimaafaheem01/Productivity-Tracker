import { useState, useEffect } from "react";
import TaskList from "../features/tasks/components/TaskList";
import { api } from "../lib/api";
import { Plus, X } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [inputTitle, setInputTitle] = useState("");

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

  const handleAddOrUpdate = async () => {
    if (!inputTitle.trim()) return;
    try {
      if (taskToEdit) {
        const updated = await api.updateTask(taskToEdit._id, { title: inputTitle });
        setTasks(tasks.map((t) => (t._id === updated._id ? updated : t)));
        setTaskToEdit(null);
      } else {
        const created = await api.createTask({ title: inputTitle });
        setTasks([...tasks, created]);
      }
      setInputTitle("");
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Could not save task");
    }
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setInputTitle(task.title);
    setShowForm(true);
  };

  const deleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message || "Could not delete task");
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;
    try {
      const updated = await api.updateTask(id, { completed: !task.completed });
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message || "Could not update task");
    }
  };

  const completed = tasks.filter((t) => t.completed);
  const remaining = tasks.filter((t) => !t.completed);

  if (loading) {
    return <div className="p-6 text-deep-700/60 text-sm">Loading your tasks...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-deep-800">Tasks</h1>
          <p className="text-sm text-deep-700/50 mt-1">
            {remaining.length} remaining · {completed.length} done
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setTaskToEdit(null);
            setInputTitle("");
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-ocean-500 hover:bg-ocean-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add task
        </button>
      </div>

      {error && (
        <p className="text-sm text-coral-600 bg-coral-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {showForm && (
        <div className="flex gap-2 bg-white border border-mist-200 rounded-xl p-3">
          <input
            type="text"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddOrUpdate()}
            placeholder={taskToEdit ? "Edit task..." : "New task title..."}
            autoFocus
            className="flex-1 px-3 py-2 border border-mist-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300"
          />
          <button
            onClick={handleAddOrUpdate}
            className="px-4 py-2 bg-ocean-500 hover:bg-ocean-600 text-white text-sm rounded-lg font-medium transition-colors"
          >
            {taskToEdit ? "Update" : "Add"}
          </button>
          <button
            onClick={() => {
              setShowForm(false);
              setTaskToEdit(null);
              setInputTitle("");
            }}
            className="px-3 py-2 bg-mist-100 hover:bg-mist-200 text-deep-700/60 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-mist-200 p-2">
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onEdit={handleEditClick}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}