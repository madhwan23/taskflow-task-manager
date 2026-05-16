import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import TaskForm from "../components/forms/TaskForm";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";
import { prettyStatus, unwrapResults } from "../utils/format";

export default function ProjectDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  function load() {
    Promise.all([api.get(`/projects/${id}/`), api.get(`/tasks/?project=${id}`)]).then(([projectRes, taskRes]) => {
      setProject(projectRes.data);
      setTasks(unwrapResults(taskRes.data));
    });
  }

  useEffect(load, [id]);

  if (!project) return <Spinner label="Loading project" />;

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div><h1 className="text-3xl font-black text-slate-950 dark:text-white">{project.title}</h1><p className="mt-2 max-w-3xl text-slate-500">{project.description}</p></div>
          <span className="rounded-md bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">{prettyStatus(project.status)}</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div><p className="text-sm text-slate-500">Deadline</p><p className="font-bold">{project.deadline}</p></div>
          <div><p className="text-sm text-slate-500">Progress</p><p className="font-bold">{project.progress}%</p></div>
          <div><p className="text-sm text-slate-500">Members</p><p className="font-bold">{project.member_details?.length || 0}</p></div>
        </div>
      </section>
      {isAdmin && <section className="panel p-5"><h2 className="mb-4 font-bold">Create task</h2><TaskForm onSaved={load} /></section>}
      <section className="panel overflow-hidden">
        <div className="border-b border-slate-100 p-5 font-bold dark:border-slate-800">Project tasks</div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {tasks.map((task) => (
            <div key={task.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
              <div><p className="font-bold text-slate-950 dark:text-white">{task.title}</p><p className="text-sm text-slate-500">{task.assigned_user_detail?.full_name}</p></div>
              <span className="text-sm">{prettyStatus(task.priority)}</span>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800">{prettyStatus(task.status)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
