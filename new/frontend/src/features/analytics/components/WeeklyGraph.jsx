import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const getWeeklyData = (tasks) => {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  sunday.setHours(0, 0, 0, 0);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days.map((day, i) => {
    const dayStart = new Date(sunday);
    dayStart.setDate(sunday.getDate() + i);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    const dayTasks = tasks.filter((task) => {
      if (!task.date) return false;
      const d = new Date(task.date);
      return d >= dayStart && d < dayEnd;
    });

    const completed = dayTasks.filter((t) => t.completed).length;
    const pending = dayTasks.length - completed;
    const energy =
      dayTasks.length === 0
        ? 0
        : Math.round((completed / dayTasks.length) * 100);

    return { day, completed, pending, energy };
  });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: <span className="font-medium">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function WeeklyGraph({ tasks = [] }) {
  const data = getWeeklyData(tasks);

  const totalCompleted = data.reduce((sum, d) => sum + d.completed, 0);
  const totalPending = data.reduce((sum, d) => sum + d.pending, 0);
  const avgEnergy = Math.round(
    data.reduce((sum, d) => sum + d.energy, 0) / 7
  );

  return (
    <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Weekly Overview</h2>
        <span className="text-xs text-gray-400">This week</span>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 mb-5">
        <div className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          {totalCompleted} Completed
        </div>
        <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
          {totalPending} Pending
        </div>
        <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
          {avgEnergy}% Avg Energy
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#22c55e"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#22c55e" }}
            activeDot={{ r: 6 }}
            name="Completed"
          />
          <Line
            type="monotone"
            dataKey="pending"
            stroke="#a78bfa"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#a78bfa" }}
            activeDot={{ r: 6 }}
            name="Pending"
          />
          <Line
            type="monotone"
            dataKey="energy"
            stroke="#fb923c"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: "#fb923c" }}
            activeDot={{ r: 5 }}
            name="Energy %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}