import { Pencil, Trash2, Check } from "lucide-react";

export default function TaskList({ tasks = [], onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-sm text-deep-700/40">No tasks yet — add your first one above.</p>
      </div>
    );
  }

  const priorityStyles = {
    high: "bg-coral-50 text-coral-700",
    medium: "bg-azure-50 text-azure-700",
    low: "bg-ocean-50 text-ocean-700",
  };

  return (
    <ul className="divide-y divide-mist-100">
      {tasks.map((task) => (
        <li
          key={task._id}
          className="group flex items-center gap-3 py-2.5 px-1 hover:bg-mist-50 rounded-lg transition-colors"
        >
          <button
            onClick={() => onToggle?.(task._id)}
            className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
              ${task.completed ? "bg-ocean-500" : "border-[1.5px] border-deep-700/30 hover:border-ocean-500"}`}
          >
            {task.completed && <Check className="w-3 h-3 text-white" />}
          </button>

          <span
            className={`flex-1 text-sm truncate ${
              task.completed ? "text-deep-700/40 line-through" : "text-deep-800"
            }`}
          >
            {task.title}
          </span>

          {task.priority && (
            <span className={`text-[11px] px-2 py-0.5 rounded-full flex-shrink-0 ${priorityStyles[task.priority] || priorityStyles.medium}`}>
              {task.priority}
            </span>
          )}

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-md text-deep-700/40 hover:bg-mist-100 hover:text-deep-700"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(task._id)}
                className="p-1.5 rounded-md text-deep-700/40 hover:bg-coral-50 hover:text-coral-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}