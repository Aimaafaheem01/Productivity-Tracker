import { Settings, LayoutDashboard, ListChecks, Timer, BarChart3, CalendarCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ sidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

 const navItems = [
  { to: "/", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { to: "/tasks", icon: <ListChecks size={18} />, label: "Task list" },
  { to: "/habits", icon: <CalendarCheck size={18} />, label: "Habits" },
  { to: "/analytics", icon: <BarChart3 size={18} />, label: "Analytics" },
];

  return (
    <div
      className={`h-screen sticky top-0 bg-mist-50 border-r border-mist-200 transition-all duration-300 ease-in-out flex flex-col flex-shrink-0
      ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
    >
      <div className="p-6 border-b border-mist-200">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-ocean-500 rounded-lg flex items-center justify-center">
            <ListChecks className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-medium text-deep-800">Trackly</h1>
            <p className="text-xs text-deep-700/40">Productivity hub</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon, label }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left
             ${location.pathname === to
              ? "bg-ocean-50 text-ocean-700 font-medium"
              : "text-deep-700/70 hover:bg-mist-100"
              }`}
          >
            {icon}
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;  