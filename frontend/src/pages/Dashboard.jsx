import { AlertTriangle, CheckCircle2, FolderKanban, ListTodo } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api/client";
import Spinner from "../components/ui/Spinner";
import StatCard from "../components/ui/StatCard";
import { prettyStatus } from "../utils/format";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard/stats/").then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <Spinner label="Loading analytics" />;
  const statusData = stats.tasks_by_status.map((item) => ({ name: prettyStatus(item.status), value: item.count }));
  const priorityData = stats.tasks_by_priority.map((item) => ({ name: prettyStatus(item.priority), count: item.count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Live project health, workload, and recent movement.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FolderKanban} label="Total projects" value={stats.total_projects} />
        <StatCard icon={ListTodo} label="Total tasks" value={stats.total_tasks} />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed_tasks} tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdue_tasks} tone="bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <section className="panel p-5">
          <h2 className="font-bold text-slate-950 dark:text-white">Productivity</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel p-5">
          <h2 className="font-bold text-slate-950 dark:text-white">Completion rate</h2>
          <div className="mt-4 flex items-center gap-5">
            <div className="h-52 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={statusData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78}>{statusData.map((_, i) => <Cell key={i} fill={["#0ea5e9", "#f59e0b", "#10b981"][i % 3]} />)}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-4xl font-black text-slate-950 dark:text-white">{stats.completion_rate}%</p>
          </div>
        </section>
      </div>
      <section className="panel p-5">
        <h2 className="font-bold text-slate-950 dark:text-white">Recent activity</h2>
        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {stats.recent_activity.map((item) => <div key={item.id} className="py-3 text-sm text-slate-600 dark:text-slate-300"><b>{item.user?.full_name || "System"}</b> {item.action}</div>)}
        </div>
      </section>
    </div>
  );
}
