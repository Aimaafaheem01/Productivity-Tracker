import { useState, useEffect } from "react";

export default function TaskForm({
  AddTask,
  taskToEdit,
  updateTask,
  setTaskToEdit
}) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, title);
      setTaskToEdit(null);
    } else {
      AddTask({
        id: Date.now(),
        title,
        completed: false
      });
    }

    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task"
        className="flex-1 p-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {taskToEdit ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}