const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
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
} = require("../controllers/taskController");

router.use(protect);

router.get("/", getTasks);
router.get("/archived", getArchivedTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.post("/:id/duplicate", duplicateTask);
router.put("/:id", updateTask);
router.put("/:id/archive", archiveTask);
router.put("/:id/restore", restoreTask);
router.put("/:id/subtasks/:subtaskId/toggle", toggleSubtask);
router.delete("/:id", deleteTask);

module.exports = router;