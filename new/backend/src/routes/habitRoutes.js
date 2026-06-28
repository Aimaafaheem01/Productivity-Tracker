const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getHabits,
  createHabit,
  toggleHabitCompletion,
  deleteHabit,
} = require("../controllers/habitController");

router.use(protect);

router.get("/", getHabits);
router.post("/", createHabit);
router.put("/:id/toggle", toggleHabitCompletion);
router.delete("/:id", deleteHabit);

module.exports = router;