import { useState, useEffect } from "react";
import HabitsCard from "./HabitsCard";
import AddHabits from "./AddHabits";
import HabitHeatmap from "./HabitHeatmap";
import { api } from "../../../lib/api";

const accents = ["ocean", "azure", "coral"];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeHabitId, setActiveHabitId] = useState(null);

  useEffect(() => {
    async function loadHabits() {
      try {
        const data = await api.getHabits();
        setHabits(data);
      } catch (err) {
        setError("Could not load habits. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    loadHabits();
  }, []);

  const addHabit = async (title) => {
    try {
      const created = await api.createHabit({ name: title, frequency: "daily" });
      setHabits((prev) => [...prev, created]);
    } catch (err) {
      setError(err.message || "Could not add habit");
    }
  };

  const deleteHabit = async (id) => {
    try {
      await api.deleteHabit(id);
      setHabits((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      setError(err.message || "Could not delete habit");
    }
  };

  const toggleHabit = async (id) => {
    try {
      const updated = await api.toggleHabit(id, todayStr());
      setHabits((prev) => prev.map((h) => (h._id === id ? updated : h)));
    } catch (err) {
      setError(err.message || "Could not update habit");
    }
  };

  // Streak = consecutive days up to today with a completed log
  const getStreak = (completions = []) => {
    const doneDates = new Set(
      completions.filter((c) => c.done).map((c) => c.date)
    );
    let streak = 0;
    let cursor = new Date();
    while (doneDates.has(cursor.toISOString().split("T")[0])) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  };

  const activeHabit = habits.find((h) => h._id === activeHabitId);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <p className="text-sm text-deep-700/50">Loading your habits...</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-deep-800">Habits</h1>
        <p className="text-sm text-deep-700/50 mt-1">
          Small, consistent actions build the biggest results.
        </p>
      </div>

      {error && (
        <p className="text-sm text-coral-700 bg-coral-50 border border-coral-200 px-4 py-2.5 rounded-xl">
          {error}
        </p>
      )}

      <AddHabits onAddHabit={addHabit} />

      {habits.length === 0 ? (
        <div className="bg-white rounded-2xl border border-mist-200 p-10 text-center">
          <p className="text-sm text-deep-700/40">
            No habits yet — add your first one above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit, index) => {
            const doneToday = habit.completions?.some(
              (c) => c.date === todayStr() && c.done
            );
            return (
              <HabitsCard
                key={habit._id}
                title={habit.name}
                streak={getStreak(habit.completions)}
                doneToday={doneToday}
                accent={accents[index % accents.length]}
                onToggle={() => toggleHabit(habit._id)}
                onDelete={() => deleteHabit(habit._id)}
                onOpenHeatmap={() => setActiveHabitId(habit._id)}
              />
            );
          })}
        </div>
      )}

      {activeHabit && (
        <HabitHeatmap
          habit={activeHabit}
          onClose={() => setActiveHabitId(null)}
        />
      )}
    </div>
  );
}

export default HabitsPage;