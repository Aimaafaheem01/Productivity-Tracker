import { useState } from "react";
import { CirclePlus } from "lucide-react";

export default function QuickAddTask({ onAdd }) {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");

  const submit = async () => {
    if (!title.trim()) {
      setActive(false);
      return;
    }
    await onAdd(title.trim());
    setTitle("");
  };

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="w-full flex items-center gap-2.5 py-2 text-left"
      >
        <CirclePlus className="w-[18px] h-[18px] text-deep-700/35" />
        <span className="text-sm text-deep-700/45">Add a task</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2.5 py-2">
      <CirclePlus className="w-[18px] h-[18px] text-deep-700/35 flex-shrink-0" />
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        onBlur={submit}
        placeholder="Task title"
        className="flex-1 text-sm border-none outline-none bg-transparent placeholder:text-deep-700/30"
      />
    </div>
  );
}