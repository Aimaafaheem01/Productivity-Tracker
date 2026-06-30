const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    dueDate: { type: Date },
    deadline: { type: Date },
    category: { type: String, default: "" },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    estimatedMinutes: { type: Number },
    tags: [{ type: String }],
    subtasks: [subtaskSchema],
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, archived: 1 });

module.exports = mongoose.model("Task", taskSchema);