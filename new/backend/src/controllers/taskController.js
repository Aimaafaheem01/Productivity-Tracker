const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId, archived: false }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getArchivedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId, archived: true }).sort({ updatedAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const {
      title, description, priority, status, dueDate, deadline,
      category, estimatedMinutes, tags, subtasks,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      priority,
      status,
      dueDate,
      deadline,
      category,
      estimatedMinutes,
      tags,
      subtasks,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.completed === true) {
      updates.completedAt = new Date();
      updates.status = "completed";
    } else if (updates.completed === false) {
      updates.completedAt = null;
      if (updates.status === undefined) updates.status = "pending";
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleSubtask = async (req, res) => {
  try {
    const { subtaskId } = req.params;
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });

    subtask.completed = !subtask.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const archiveTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { archived: true },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const restoreTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { archived: false },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const duplicateTask = async (req, res) => {
  try {
    const original = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!original) return res.status(404).json({ message: "Task not found" });

    const copy = await Task.create({
      userId: req.userId,
      title: `${original.title} (copy)`,
      description: original.description,
      priority: original.priority,
      status: "pending",
      dueDate: original.dueDate,
      deadline: original.deadline,
      category: original.category,
      estimatedMinutes: original.estimatedMinutes,
      tags: original.tags,
      subtasks: original.subtasks.map((s) => ({ title: s.title, completed: false })),
      completed: false,
    });

    res.status(201).json(copy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTasks,
  getArchivedTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleSubtask,
  archiveTask,
  restoreTask,
  duplicateTask,
  deleteTask,
};