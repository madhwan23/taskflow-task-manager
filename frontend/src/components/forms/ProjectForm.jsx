import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/client";
import { unwrapResults } from "../../utils/format";

export default function ProjectForm({ project, onSaved }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    deadline: project?.deadline || "",
    status: project?.status || "planning",
    members: project?.members || []
  });

  useEffect(() => {
    api.get("/users/").then(({ data }) => setUsers(unwrapResults(data)));
  }, []);

  async function submit(event) {
    event.preventDefault();
    const payload = { ...form, members: form.members.map(Number) };
    try {
      if (project?.id) await api.patch(`/projects/${project.id}/`, payload);
      else await api.post("/projects/", payload);
      toast.success("Project saved");
      onSaved?.();
    } catch {
      toast.error("Could not save project");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <input className="input" placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <textarea className="input" placeholder="Project description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <div className="grid gap-3 md:grid-cols-2">
        <input className="input" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
        <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="on_hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <select className="input min-h-28" multiple value={form.members.map(String)} onChange={(e) => setForm({ ...form, members: Array.from(e.target.selectedOptions, (option) => option.value) })}>
        {users.map((user) => <option key={user.id} value={user.id}>{user.full_name} - {user.role}</option>)}
      </select>
      <button className="btn-primary">Save project</button>
    </form>
  );
}
