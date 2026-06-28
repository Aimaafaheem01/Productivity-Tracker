import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children, onAddTaskClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <div className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden`}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* ✅ Header gets the callback */}
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onAddTaskClick={onAddTaskClick}
        />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;