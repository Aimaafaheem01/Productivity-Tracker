import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

const CATEGORIES = ["Work", "Personal", "Health", "Study", "Other"];
const PRIORITIES = ["low", "medium", "high", "critical"];

export default function TaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setCategory(task.category || "Work");
      setPriority(task.priority || "medium");
      setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
      setDeadline(task.deadline ? task.deadline.split("T")[0] : "");
      setSubtasks(task.subtasks || []);
    }
  }, [task]);

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { title: newSubtask.trim(), completed: false }]);
    setNewSubtask("");
  };

  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await onSave({
      title,
      description,
      category,
      priority,
      dueDate: dueDate || null,
      deadline: deadline || null,
      subtasks,
    });
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 bg-deep-900/45 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-mist-100">
          <p className="text-base font-medium text-deep-800">
            {task ? "Edit task" : "New task"}
          </p>
          <button onClick={onClose} className="text-deep-700/40 hover:text-deep-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wide text-deep-700/40 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-deep-700/40 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details (optional)"
              rows={2}
              className="w-full border border-mist-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ocean-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-deep-700/40 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-mist-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wide text-deep-700/40 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-mist-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-deep-700/40 mb-1.5">
                Due date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-mist-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-deep-700/40 mb-1.5">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border border-mist-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-deep-700/40 mb-1.5">
              Subtasks
            </label>
            {subtasks.length > 0 && (
              <div className="flex flex-col gap-1.5 mb-2">
                {subtasks.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-[1.5px] border-deep-700/25 flex-shrink-0" />
                    <span className="text-sm text-deep-800 flex-1">{s.title}</span>
                    <button onClick={() => removeSubtask(i)} className="text-deep-700/30 hover:text-coral-500">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubtask())}
                placeholder="Add a subtask..."
                className="flex-1 border border-dashed border-ocean-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300"
              />
              <button
                onClick={addSubtask}
                className="px-3 rounded-lg border border-dashed border-ocean-200 text-ocean-600 hover:bg-ocean-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-mist-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-mist-100 text-deep-700/70 text-sm font-medium hover:bg-mist-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="flex-1 py-2.5 rounded-lg bg-ocean-500 text-white text-sm font-medium hover:bg-ocean-600 disabled:opacity-50"
          >
            {saving ? "Saving..." : task ? "Save changes" : "Create task"}
          </button>
        </div>
      </div>
    </div>
  );
}