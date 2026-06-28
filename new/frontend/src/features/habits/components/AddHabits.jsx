import { useState } from "react";
import { Plus } from "lucide-react";

function AddHabits({ onAddHabit }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await onAddHabit(title);
    setTitle("");
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Add a new habit..."
        className="flex-1 px-3.5 py-2.5 border border-mist-200 rounded-xl text-sm text-deep-800 placeholder-deep-700/40 focus:outline-none focus:ring-2 focus:ring-ocean-300"
      />
      <button
        onClick={handleAdd}
        disabled={loading}
        className="flex items-center gap-1.5 px-4 py-2.5 bg-ocean-500 hover:bg-ocean-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
      >
        <Plus className="w-4 h-4" /> Add
      </button>
    </div>
  );
}

export default AddHabits;