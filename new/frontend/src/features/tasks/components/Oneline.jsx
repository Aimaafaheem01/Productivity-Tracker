export default function Oneline() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const firstName = user?.name ? user.name.split(" ")[0] : null;

  const greeting = firstName ? `Good morning, ${firstName}` : "Good morning";

  return (
    <div className="mb-1">
      <p className="text-xs font-medium text-ocean-600 uppercase tracking-wide mb-1">
        {today}
      </p>
      <h1 className="text-[22px] font-medium text-deep-800">
        {greeting}
      </h1>
      <p className="text-sm text-deep-700/50 mt-1">
        Track your tasks, stay focused, and build consistency.
      </p>
    </div>
  );
}  