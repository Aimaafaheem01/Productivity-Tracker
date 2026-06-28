import { useState, useEffect } from "react";

export default function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Format time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4">
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </h1>

      <div className="flex gap-3">
        <button
          onClick={() => setIsRunning(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Start
        </button>

        <button
          onClick={() => setIsRunning(false)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Pause
        </button>

        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(25 * 60);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}