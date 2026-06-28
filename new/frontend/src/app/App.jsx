import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "../shared/layout/Sidebar";
import Header from "../shared/layout/Header";
import Dashboard from "../pages/Dashboard";
import TaskListPage from "../pages/TasksPage";
import Analytics from "../features/analytics/components/Analytics";
import Login from "../features/auth/components/Login";
import Signup from "../features/auth/components/Signup";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import HabitsPage from "../features/habits/components/HabitsPage";

function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-mist-50">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const toggleTask = (id) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTask = (id) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell>
              <Dashboard
                tasks={tasks}
                setTasks={setTasks}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
                taskToEdit={taskToEdit}
                setTaskToEdit={setTaskToEdit}
              />
            </AppShell>
          </ProtectedRoute>
        }
      />
   
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <AppShell>
              <TaskListPage
                tasks={tasks}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
                setTaskToEdit={setTaskToEdit}
              />
            </AppShell>
          </ProtectedRoute>
        }
      />
<Route
  path="/habits"
  element={
    <ProtectedRoute>
      <AppShell>
        <HabitsPage />
      </AppShell>
    </ProtectedRoute>
  }

/>
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AppShell>
              <Analytics tasks={tasks} />
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>

    
  );
}

export default App;