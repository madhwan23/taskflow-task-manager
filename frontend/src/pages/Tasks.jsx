import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/client";
import TaskForm from "../components/forms/TaskForm";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";
import { prettyStatus, unwrapResults } from "../utils/format";

export default function Tasks() {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState(null);
  const [filters, setFilters] = useState({ search: "", status: "", priority: "" });
  const [showForm, setShowForm] = useState(false);

  function load() {
    const params = new URLSearchParams(filters).toString();
    api.get(`/tasks/?${params}`).then(({ data }) => setTasks(unwrapResults(data)));
  }

  useEffect(load, [filters]);

  async function updateStatus(task, status) {
    await api.post(`/tasks/${task.id}/status/`, { status });
    toast.success("Status updated");
    load();
  }

  if (!tasks) return <Spinner label="Loading tasks" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-3xl font-black text-slate-950 dark:text-white">Tasks</h1><p className="text-slate-500">Search, filter, and update assigned work.</p></div>
        {isAdmin && <button className="btn-primary" onClick={() => setShowForm(!showForm)}>Create task</button>}
      </div>
      {showForm && <section className="panel p-5"><TaskForm onSaved={() => { setShowForm(false); load(); }} /></section>}
      <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input className="input pl-9" placeholder="Search tasks" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /></div>
        <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All status</option><option value="todo">Todo</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select>
        <select className="input" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}><option value="">All priority</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
      </div>
      <section className="panel overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900"><tr><th className="p-4">Task</th><th>Project</th><th>Owner</th><th>Priority</th><th>Due</th><th>Status</th></tr></thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.map((task) => (
              <tr key={task.id} className={task.is_overdue ? "bg-rose-50/60 dark:bg-rose-500/5" : ""}>
                <td className="p-4"><p className="font-bold text-slate-950 dark:text-white">{task.title}</p><p className="text-xs text-slate-500">{task.description}</p></td>
                <td>{task.project_detail?.title}</td>
                <td>{task.assigned_user_detail?.full_name}</td>
                <td>{prettyStatus(task.priority)}</td>
                <td>{task.due_date}{task.is_overdue && <span className="ml-2 text-xs font-bold text-rose-600">Overdue</span>}</td>
                <td><select className="input max-w-40" value={task.status} onChange={(e) => updateStatus(task, e.target.value)}><option value="todo">Todo</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
