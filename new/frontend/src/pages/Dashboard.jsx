import { useState, useEffect } from "react";
import StatsCard from "../features/tasks/components/StatsCard";
import Oneline from "../features/tasks/components/Oneline";
import TaskList from "../features/tasks/components/TaskList";
import FocusTimer from "../features/focus/components/FocusTimer";
import { api } from "../lib/api";

import { CheckCircle, Zap, Flame, Hourglass, Plus, X } from "lucide-react";

// TODO(step 6 - AI/scheduling): WeeklyFocus and DailyHabits were imported
// here before but never existed in the project. Build them as real
// components in features/focus and features/habits, then re-add below.

export default function Dashboard({ externalShowForm, onFormHandled }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [inputTitle, setInputTitle] = useState("");

  // Load tasks from the backend once, when the Dashboard first mounts.
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

  useEffect(() => {
    if (externalShowForm) {
      setShowForm(true);
      setTaskToEdit(null);
      setInputTitle("");
      onFormHandled?.();
    }
  }, [externalShowForm]);

  const completedTasks = tasks.filter((t) => t.completed);
  const remainingTasks = tasks.filter((t) => !t.completed);
  const taskDone =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks.length / tasks.length) * 100);
  const energyLevel = taskDone;
  const energyComment =
    energyLevel <= 30 ? "Low energy" : energyLevel <= 70 ? "Good energy" : "High energy";
  const activeDays = new Set(
    tasks.filter((t) => t.completed).map((t) => t.date)
  );
  const streak = activeDays.size;

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

  if (loading) {
    return (
      <div className="p-6 text-deep-700/60 text-sm">Loading your tasks...</div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-5">

      {error && (
        <p className="text-sm text-coral-600 bg-coral-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <Oneline />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          title="Done"
          value={completedTasks.length}
          description={`of ${tasks.length} tasks · ${taskDone}%`}
          icon={<CheckCircle />}
          accent="ocean"
        />
        <StatsCard
          title="Energy"
          value={`${energyLevel}%`}
          description={energyComment}
          icon={<Zap />}
          accent="coral"
        />
        <StatsCard
          title="Streak"
          value={streak}
          description="days running"
          icon={<Flame />}
          accent="azure"
        />
        <StatsCard
          title="Left"
          value={remainingTasks.length}
          description="tasks remaining"
          icon={<Hourglass />}
          accent="ocean"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">

        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-mist-200 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-base font-medium text-deep-800">
              Today's tasks
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-deep-700/50">
                {completedTasks.length}/{tasks.length} done
              </span>
              <button
                onClick={() => {
                  setShowForm(true);
                  setTaskToEdit(null);
                  setInputTitle("");
                }}
                className="flex items-center gap-1 px-3.5 py-1.5 bg-ocean-500 hover:bg-ocean-600 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add task
              </button>
            </div>
          </div>

          {showForm && (
            <div className="flex gap-2 mb-4 flex-shrink-0">
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
                className="px-3.5 py-2 bg-ocean-500 hover:bg-ocean-600 text-white text-xs rounded-lg font-medium transition-colors"
              >
                {taskToEdit ? "Update" : "Add"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setTaskToEdit(null);
                  setInputTitle("");
                }}
                className="px-2.5 py-2 bg-mist-100 hover:bg-mist-200 text-deep-700/60 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto min-h-0">
            <TaskList
              tasks={tasks}
              onToggle={toggleTask}
              onEdit={handleEditClick}
              onDelete={deleteTask}
            />
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col bg-white rounded-xl p-5 border border-mist-200 min-h-0">
          <h2 className="text-base font-medium text-deep-800 mb-4 flex-shrink-0">
            Focus session
          </h2>
          <div className="flex-1 overflow-y-auto min-h-0">
            <FocusTimer />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">

        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-mist-200 min-h-0">
          <h2 className="text-base font-medium text-deep-800 mb-1">
            Weekly focus
          </h2>
          <p className="text-xs text-deep-700/50 mb-4">
            Hours of deep work this week
          </p>
          <p className="text-xs text-deep-700/40 italic">
            Coming in a later step — weekly deep work chart
          </p>
        </div>

        <div className="lg:col-span-1 bg-white rounded-xl p-5 border border-mist-200 min-h-0">
          <h2 className="text-base font-medium text-deep-800 mb-4">
            Daily habits
          </h2>
          <p className="text-xs text-deep-700/40 italic">
            Coming in a later step — today's habit checklist
          </p>
        </div>
      </div>

    </div>
  );
}