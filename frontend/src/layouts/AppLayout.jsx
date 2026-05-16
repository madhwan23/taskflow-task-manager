import { FolderKanban, LayoutDashboard, ListTodo, LogOut, Menu, Moon, Sun, Users, UserCog, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Projects", "/projects", FolderKanban],
  ["Tasks", "/tasks", ListTodo],
  ["Team", "/team", Users],
  ["Profile", "/profile", UserCog]
];

export default function AppLayout() {
  const { user, logout, dark, setDark } = useAuth();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <NavLink to="/dashboard" className="text-xl font-black tracking-tight text-slate-950 dark:text-white">TaskFlow</NavLink>
        <button className="btn-secondary p-2 lg:hidden" onClick={() => setOpen(false)}><X className="h-4 w-4" /></button>
      </div>
      <div className="mt-8 space-y-1">
        {nav.map(([label, path, Icon]) => (
          <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"}`}>
            <Icon className="h-4 w-4" /> {label}
          </NavLink>
        ))}
      </div>
      <div className="mt-auto rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
        <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.full_name}</p>
        <p className="text-xs uppercase tracking-wide text-slate-500">{user?.role}</p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">{sidebar}</div>
      {open && <div className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"><div className="h-full">{sidebar}</div></div>}
      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex items-center justify-between">
            <button className="btn-secondary p-2 lg:hidden" onClick={() => setOpen(true)}><Menu className="h-4 w-4" /></button>
            <div className="hidden text-sm font-semibold text-slate-500 lg:block">Collaborative team task manager</div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary p-2" onClick={() => setDark(!dark)}>{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
              <button className="btn-secondary" onClick={logout}><LogOut className="h-4 w-4" /> Logout</button>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
