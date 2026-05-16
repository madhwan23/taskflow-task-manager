import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/client";
import { unwrapResults } from "../../utils/format";

export default function TaskForm({ task, onSaved }) {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    due_date: task?.due_date || "",
    assigned_user: task?.assigned_user || "",
    project: task?.project || "",
    status: task?.status || "todo"
  });

  useEffect(() => {
    Promise.all([api.get("/users/"), api.get("/projects/")]).then(([u, p]) => {
      setUsers(unwrapResults(u.data));
      setProjects(unwrapResults(p.data));
    });
  }, []);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      if (task?.id) await api.patch(`/tasks/${task.id}/`, form);
      else await api.post("/tasks/", form);
      toast.success("Task saved");
      onSaved?.();
    } catch (error) {
      toast.error(error.response?.data?.non_field_errors?.[0] || "Could not save task");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
      <input className="input md:col-span-2" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <textarea className="input md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <select className="input" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} required>
        <option value="">Select project</option>
        {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
      </select>
      <select className="input" value={form.assigned_user} onChange={(e) => setForm({ ...form, assigned_user: e.target.value })} required>
        <option value="">Assign user</option>
        {users.map((user) => <option key={user.id} value={user.id}>{user.full_name}</option>)}
      </select>
      <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <input className="input" type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} required />
      <button className="btn-primary md:col-span-2" disabled={saving}>{saving ? "Saving..." : "Save task"}</button>
    </form>
  );
}
