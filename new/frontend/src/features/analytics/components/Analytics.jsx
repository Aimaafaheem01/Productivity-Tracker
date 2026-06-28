import React from "react";
import WeeklyGraph from "./WeeklyGraph";

function Analytics({ tasks = [] }) {
     const completedTasks = tasks.filter((t) => t.completed);
     const taskDone =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks.length / tasks.length) * 100);
      const energyLevel = taskDone;
      const energyComment =
      energyLevel <= 30 ? "Low energy" : energyLevel <= 70 ? "Good energy" : "High energy";
      const activeDays = new Set(
      tasks.filter((t) => t.completed).map((t) => t.date)
      );
      const streak = activeDays.size;

     const getHeatMapData = (tasks) =>{
        const today = new Date();
        const map = {};
        
        tasks.forEach(task => {
            if( !task.date) return; 
            const d = new Date(task.Date).toDateString;
            map [d] = (map[d] || 0) + (task.completed ? 1 : 0);
        })
    }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-slate-800">Analytics</h1>
      <WeeklyGraph tasks={tasks} />
    </div>
  );
}

export default Analytics;