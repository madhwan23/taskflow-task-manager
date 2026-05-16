import { Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import ProjectForm from "../components/forms/ProjectForm";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";
import { prettyStatus, unwrapResults } from "../utils/format";

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState(null);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  function load() {
    api.get(`/projects/?search=${query}`).then(({ data }) => setProjects(unwrapResults(data)));
  }

  useEffect(load, [query]);

  async function remove(id) {
    if (!confirm("Delete this project?")) return;
    await api.delete(`/projects/${id}/`);
    toast.success("Project deleted");
    load();
  }

  if (!projects) return <Spinner label="Loading projects" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-3xl font-black text-slate-950 dark:text-white">Projects</h1><p className="text-slate-500">Plan, assign, and track team initiatives.</p></div>
        {isAdmin && <button className="btn-primary" onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4" /> New project</button>}
      </div>
      {showForm && <section className="panel p-5"><ProjectForm onSaved={() => { setShowForm(false); load(); }} /></section>}
      <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input className="input pl-9" placeholder="Search projects" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.id} className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <Link to={`/projects/${project.id}`} className="text-lg font-black text-slate-950 hover:text-brand-600 dark:text-white">{project.title}</Link>
              {isAdmin && <button className="rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10" onClick={() => remove(project.id)}><Trash2 className="h-4 w-4" /></button>}
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">{project.description}</p>
            <div className="mt-5 flex items-center justify-between text-sm"><span>{prettyStatus(project.status)}</span><span>{project.deadline}</span></div>
            <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-brand-500" style={{ width: `${project.progress}%` }} /></div>
            <div className="mt-4 flex flex-wrap gap-2">{project.member_details?.map((member) => <span key={member.id} className="rounded-md bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">{member.full_name}</span>)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
