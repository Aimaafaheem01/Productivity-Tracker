const Habit = require("../models/Habit");


const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createHabit = async (req, res) => {
  try {
    const { name, frequency } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Habit name is required" });
    }

    const habit = await Habit.create({ userId: req.userId, name, frequency });
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleHabitCompletion = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ message: "date is required" });

    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const existing = habit.completions.find((c) => c.date === date);
    if (existing) {
      existing.done = !existing.done;
    } else {
      habit.completions.push({ date, done: true });
    }

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getHabits, createHabit, toggleHabitCompletion, deleteHabit };