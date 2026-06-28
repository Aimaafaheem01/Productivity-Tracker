import { useState, useEffect } from "react";

export default function FocusTimer() {
  const [time, setTime] = useState(1500);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval;

    if (running) {
      interval = setInterval(() => {
        setTime((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-4 border border-gray-100">
      <h2 className="font-bold mb-2">Focus Timer</h2>

      <div className="text-2xl font-mono mb-3">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      <button
        onClick={() => setRunning(!running)}
        className="px-3 py-1 text-sm bg-indigo-500 text-white rounded"
      >
        {running ? "Pause" : "Start"}
      </button>
    </div>
  );
}