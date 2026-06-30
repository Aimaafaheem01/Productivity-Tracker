import { useState } from "react";
import { Check, ChevronUp, ChevronDown, Calendar, Flag, Tag, Plus, Trash2, Copy } from "lucide-react";
import { api } from "../../../lib/api";

const CATEGORIES = ["Work", "Personal", "Health", "Study", "Other"];
const PRIORITIES = ["low", "medium", "high", "critical"];

function TaskRow({ task, onToggle, onDelete, onDuplicate, onTaskUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [description, setDescription] = useState(task.description || "");
  const [newSubtask, setNewSubtask] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const subtasks = task.subtasks || [];

  const saveField = async (updates) => {
    const updated = await api.updateTask(task._id, updates);
    onTaskUpdate(updated);
    return updated;
  };

  const handleDescriptionBlur = () => {
    if (description !== (task.description || "")) {
      saveField({ description });
    }
  };

  const addSubtask = async () => {
    if (!newSubtask.trim()) return;
    await saveField({
      subtasks: [...subtasks, { title: newSubtask.trim(), completed: false }],
    });
    setNewSubtask("");
  };

  const toggleSubtask = async (subtaskId) => {
    const updated = await api.toggleSubtask(task._id, subtaskId);
    onTaskUpdate(updated);
  };

 const getDeadlineInfo = () => {
  if (!task.dueDate || task.completed) return null;

  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (due.getTime() < today.getTime()) {
    return { label: "Overdue", style: "bg-coral-50 text-coral-700" };
  }
  if (due.getTime() === today.getTime()) {
    return { label: "Due today", style: "bg-azure-50 text-azure-700" };
  }
  return {
    label: due.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    style: "text-deep-700/40",
  };
};

const deadlineInfo = getDeadlineInfo();

  return (
    <div className="border-b border-mist-100 last:border-0">
      <div className="group flex items-center gap-3 py-2.5">
        <button
          onClick={() => onToggle(task._id)}
          className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0
            ${task.completed ? "bg-ocean-500" : "border-[1.5px] border-deep-700/30"}`}
        >
          {task.completed && <Check className="w-2.5 h-2.5 text-white" />}
        </button>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 flex items-center gap-2 text-left min-w-0"
        >
          <span className={`text-sm truncate ${task.completed ? "text-deep-700/35 line-through" : "text-deep-800"}`}>
            {task.title}
          </span>
        </button>

       {deadlineInfo && !expanded && (
  <span className={`text-[11px] px-2 py-0.5 rounded-full flex-shrink-0 ${deadlineInfo.style}`}>
    {deadlineInfo.label}
  </span>
)}
        {subtasks.length > 0 && !expanded && (
          <span className="text-xs text-deep-700/40 flex-shrink-0">{subtasks.length} subtasks</span>
        )}

        <button onClick={() => setExpanded((v) => !v)} className="text-deep-700/30 flex-shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100" />}
        </button>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onDuplicate(task._id)}
            className="p-1.5 rounded text-deep-700/30 hover:text-deep-700/70"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          onClick={() => onDelete(task._id)}
          className="p-1.5 rounded text-deep-700/30 hover:text-coral-600 flex-shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-mist-100 bg-mist-50/60 rounded-lg px-4 py-4 mb-2 flex flex-col gap-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Add a description"
            rows={2}
            className="text-sm text-deep-700 bg-transparent border-none outline-none resize-none placeholder:text-deep-700/35"
          />

          <div className="grid grid-cols-3 gap-2">
            <div className="relative">
              <button
                onClick={() => setShowDateInput((v) => !v)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-deep-700/70 bg-white border border-mist-200 rounded-lg py-1.5"
              >
               <Calendar className="w-3.5 h-3.5" /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Date"}
              </button>
              {showDateInput && (
                <input
                  type="date"
                  autoFocus
                  defaultValue={task.dueDate ? task.dueDate.split("T")[0] : ""}
                  onBlur={(e) => {
                    saveField({ dueDate: e.target.value || null });
                    setShowDateInput(false);
                  }}
                  className="absolute top-9 left-0 z-10 border border-mist-200 rounded-lg px-2 py-1 text-xs bg-white shadow-sm"
                />
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowPriorityMenu((v) => !v)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-deep-700/70 bg-white border border-mist-200 rounded-lg py-1.5 capitalize"
              >
                <Flag className="w-3.5 h-3.5" /> {task.priority || "Priority"}
              </button>
              {showPriorityMenu && (
                <div className="absolute top-9 left-0 z-10 bg-white border border-mist-200 rounded-lg shadow-sm py-1 w-28">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      onClick={() => { saveField({ priority: p }); setShowPriorityMenu(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs capitalize text-deep-700 hover:bg-mist-50"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowCategoryMenu((v) => !v)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-deep-700/70 bg-white border border-mist-200 rounded-lg py-1.5"
              >
                <Tag className="w-3.5 h-3.5" /> {task.category || "Category"}
              </button>
              {showCategoryMenu && (
                <div className="absolute top-9 left-0 z-10 bg-white border border-mist-200 rounded-lg shadow-sm py-1 w-28">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => { saveField({ category: c }); setShowCategoryMenu(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-deep-700 hover:bg-mist-50"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-deep-700/40 mb-2">Subtasks</p>
            {subtasks.length > 0 && (
              <div className="flex flex-col gap-2 mb-2">
                {subtasks.map((s) => (
                  <button
                    key={s._id}
                    onClick={() => toggleSubtask(s._id)}
                    className="flex items-center gap-2.5 text-left"
                  >
                    <span
                      className={`w-[15px] h-[15px] rounded-full flex items-center justify-center flex-shrink-0
                        ${s.completed ? "bg-ocean-500" : "border-[1.5px] border-deep-700/25"}`}
                    >
                      {s.completed && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                    <span className={`text-sm ${s.completed ? "text-deep-700/35 line-through" : "text-deep-800"}`}>
                      {s.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSubtask()}
                placeholder="Add subtask"
                className="flex-1 text-sm border-none outline-none bg-transparent placeholder:text-deep-700/30"
              />
              <button onClick={addSubtask} className="text-ocean-600 flex-shrink-0">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TaskList({ tasks = [], onToggle, onDelete, onDuplicate, onTaskUpdate }) {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-24">
        <p className="text-sm text-deep-700/35">No tasks yet</p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskRow
          key={task._id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onTaskUpdate={onTaskUpdate}
        />
      ))}
    </div>
  );
}