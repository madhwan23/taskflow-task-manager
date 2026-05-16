import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState(user || {});

  async function submit(event) {
    event.preventDefault();
    await api.patch(`/users/${user.id}/`, form);
    toast.success("Profile updated");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div><h1 className="text-3xl font-black text-slate-950 dark:text-white">Profile settings</h1><p className="text-slate-500">Keep your workspace identity current.</p></div>
      <form onSubmit={submit} className="panel grid gap-3 p-5 md:grid-cols-2">
        <input className="input" value={form.first_name || ""} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="First name" />
        <input className="input" value={form.last_name || ""} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="Last name" />
        <input className="input" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
        <input className="input" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
        <input className="input md:col-span-2" value={form.job_title || ""} onChange={(e) => setForm({ ...form, job_title: e.target.value })} placeholder="Job title" />
        <button className="btn-primary md:col-span-2">Save profile</button>
      </form>
    </div>
  );
}
