import { useNavigate } from "react-router-dom";
import { Search, Bell, Menu, LogOut } from "lucide-react";

function Header({ toggleSidebar, tasks = [] }) {
  const navigate = useNavigate();
  const today = new Date().toDateString();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-mist-200 px-6 py-4">
      <div className="flex items-center justify-between">

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-deep-700/60 hover:bg-mist-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="hidden md:block text-[11px] text-deep-700/40 font-medium">
            {today}
          </h1>
        </div>

        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-700/40" />
            <input
              type="text"
              placeholder="Search your tasks"
              className="w-full pl-10 pr-4 py-2.5 bg-mist-50 border border-mist-200 rounded-xl text-deep-800 placeholder-deep-700/40 focus:outline-none focus:ring-2 focus:ring-ocean-300 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">

          <button className="relative p-2.5 rounded-xl text-deep-700/60 hover:bg-mist-100 transition-colors">
            <Bell className="w-5 h-5" />
            {tasks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral-500 text-white text-xs rounded-full flex items-center justify-center">
                {tasks.length}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-3 pl-3 ml-1 border-l border-mist-200">
            <div className="w-8 h-8 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-700 text-xs font-medium">
              {initials}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-deep-800 truncate max-w-[120px]">
                {user?.name || "Account"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="p-2 rounded-lg text-deep-700/50 hover:bg-coral-50 hover:text-coral-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Header;