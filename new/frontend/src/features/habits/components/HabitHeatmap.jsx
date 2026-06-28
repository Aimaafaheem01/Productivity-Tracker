  import { useState, useMemo, useRef, useEffect } from "react";
import { X, ChevronDown, Flame, Calendar } from "lucide-react";

const accentScale = {
  ocean: ["bg-mist-100", "bg-ocean-200", "bg-ocean-400", "bg-ocean-600"],
  azure: ["bg-mist-100", "bg-azure-200", "bg-azure-400", "bg-azure-600"],
  coral: ["bg-mist-100", "bg-coral-200", "bg-coral-400", "bg-coral-600"],
};

const accentSolid = {
  ocean: "text-ocean-700",
  azure: "text-azure-700",
  coral: "text-coral-700",
};

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function toDateStr(d) {
  return d.toISOString().split("T")[0];
}

function buildYearGrid(year) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const weeks = [];
  let cursor = new Date(gridStart);

  while (cursor <= end) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const inYear = cursor.getFullYear() === year;
      week.push({
        date: new Date(cursor),
        dateStr: toDateStr(cursor),
        inYear,
        month: cursor.getMonth(),
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function getMonthLabelPositions(weeks) {
  const positions = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstInYearDay = week.find((d) => d.inYear);
    if (firstInYearDay && firstInYearDay.month !== lastMonth) {
      positions.push({ weekIndex: i, label: MONTH_LABELS[firstInYearDay.month] });
      lastMonth = firstInYearDay.month;
    }
  });
  return positions;
}

export default function HabitHeatmap({ habit, onClose }) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [yearMenuOpen, setYearMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const menuRef = useRef(null);

  const completedDates = useMemo(
    () => (habit.completions || []).filter((c) => c.done).map((c) => c.date),
    [habit.completions]
  );
  const logSet = useMemo(() => new Set(completedDates), [completedDates]);
  const colors = accentScale[habit.accent] || accentScale.ocean;
  const solidText = accentSolid[habit.accent] || accentSolid.ocean;

  const availableYears = useMemo(() => {
    const years = new Set([currentYear]);
    completedDates.forEach((d) => years.add(new Date(d).getFullYear()));
    for (let y = currentYear - 1; y >= currentYear - 2; y--) years.add(y);
    return Array.from(years).sort((a, b) => b - a);
  }, [completedDates, currentYear]);

  const weeks = useMemo(() => buildYearGrid(year), [year]);
  const monthLabels = useMemo(() => getMonthLabelPositions(weeks), [weeks]);

  const totalDone = useMemo(
    () => completedDates.filter((d) => new Date(d).getFullYear() === year).length,
    [completedDates, year]
  );

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setYearMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const intensity = (dateStr) => (logSet.has(dateStr) ? 3 : 0);

  return (
    <div
      className="fixed inset-0 bg-deep-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-mist-100">
          <div>
            <h2 className="text-lg font-semibold text-deep-800">{habit.name}</h2>
            <p className={`text-sm mt-0.5 flex items-center gap-1.5 ${solidText}`}>
              <Flame className="w-3.5 h-3.5" />
              {totalDone} day{totalDone === 1 ? "" : "s"} completed in {year}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setYearMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-mist-200 text-sm font-medium text-deep-700 hover:bg-mist-50 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                {year}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {yearMenuOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white border border-mist-200 rounded-xl shadow-lg overflow-hidden z-10">
                  {availableYears.map((y) => (
                    <button
                      key={y}
                      onClick={() => {
                        setYear(y);
                        setYearMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors
                        ${y === year ? "bg-mist-50 font-medium text-deep-800" : "text-deep-700/70 hover:bg-mist-50"}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-lg text-deep-700/40 hover:bg-mist-50 hover:text-deep-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="flex ml-8 mb-1">
              {weeks.map((_, wi) => {
                const found = monthLabels.find((m) => m.weekIndex === wi);
                return (
                  <div key={wi} className="w-[14px] text-[10px] text-deep-700/40 flex-shrink-0">
                    {found ? found.label : ""}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-0">
              <div className="flex flex-col gap-[3px] mr-2 flex-shrink-0">
                {WEEKDAY_LABELS.map((label, i) => (
                  <div key={i} className="h-[11px] text-[10px] text-deep-700/40 leading-[11px]">
                    {label}
                  </div>
                ))}
              </div>

              <div className="flex gap-[3px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((day, di) => {
                      if (!day.inYear) {
                        return <div key={di} className="w-[11px] h-[11px]" />;
                      }
                      const done = logSet.has(day.dateStr);
                      const level = intensity(day.dateStr);
                     const isFuture = day.dateStr > toDateStr(new Date());
                      return (
                        <div
                          key={di}
                          onMouseEnter={() => setHovered({ dateStr: day.dateStr, done })}
                          onMouseLeave={() => setHovered(null)}
                          className={`w-[11px] h-[11px] rounded-[3px] cursor-default transition-transform hover:scale-125
                            ${isFuture ? "bg-mist-50" : colors[level]}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 ml-8">
              <div className="text-xs text-deep-700/50 h-4">
                {hovered ? (
                  <span>
                    <span className="font-medium text-deep-800">
                      {new Date(hovered.dateStr).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>{" "}
                    —{" "}
                    {hovered.done ? (
                      <span className={solidText}>Habit done ✓</span>
                    ) : (
                      <span className="text-deep-700/40">Not done</span>
                    )}
                  </span>
                ) : (
                  "Hover a day for details"
                )}
              </div>

              <div className="flex items-center gap-1 text-[10px] text-deep-700/40">
                Less
                {colors.map((c, i) => (
                  <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${c}`} />
                ))}
                More
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}