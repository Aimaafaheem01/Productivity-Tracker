import { Trash2 } from "lucide-react";
import { getHabitIcon } from "../../../shared/utils/habitIcons";

const accentMap = {
  ocean: { bg: "bg-ocean-500", soft: "bg-ocean-50", text: "text-ocean-600", border: "border-ocean-200" },
  azure: { bg: "bg-azure-500", soft: "bg-azure-50", text: "text-azure-600", border: "border-azure-200" },
  coral: { bg: "bg-coral-500", soft: "bg-coral-50", text: "text-coral-600", border: "border-coral-200" },
};

export default function HabitsCard({
  title = "Title",
  streak = 0,
  doneToday = false,
  accent = "ocean",
  onToggle,
  onDelete,
  onOpenHeatmap,
}) {
  const colors = accentMap[accent] || accentMap.ocean;
  const Icon = getHabitIcon(title);

  return (
    <div className="bg-white rounded-xl p-5 border border-mist-200 flex flex-col gap-3">
      <button
        onClick={onOpenHeatmap}
        className="flex items-center justify-between gap-3 min-w-0 text-left"
      >
        <span className="flex items-center gap-3 min-w-0">
          <span
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
              ${doneToday ? colors.bg + " text-white" : colors.soft + " " + colors.text}`}
          >
            <Icon className="w-5 h-5" />
          </span>

          <span className="min-w-0">
            <p className="text-sm font-medium text-deep-800 truncate">{title}</p>
            <p className={`text-xs mt-0.5 ${colors.text}`}>
              {streak} day{streak === 1 ? "" : "s"} streak
            </p>
          </span>
        </span>

        <span
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded-lg text-deep-700/30 hover:bg-coral-50 hover:text-coral-600 transition-colors flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </span>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`w-full py-2 rounded-lg text-xs font-medium border transition-colors
          ${doneToday
            ? colors.bg + " text-white border-transparent"
            : colors.soft + " " + colors.text + " " + colors.border + " border-dashed hover:" + colors.bg + " hover:text-white"}`}
      >
        {doneToday ? "✓ Done today" : "Mark as done today"}
      </button>
    </div>
  );
}