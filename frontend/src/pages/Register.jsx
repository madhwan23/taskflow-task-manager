import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: "", last_name: "", username: "", email: "", password: "", role: "member" });

  async function submit(event) {
    event.preventDefault();
    try {
      await register(form);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.username?.[0] || "Registration failed");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-slate-950">
      <form onSubmit={submit} className="panel w-full max-w-xl p-6">
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">Create your account</h1>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="First name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          <input className="input" placeholder="Last name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          <input className="input" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input md:col-span-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button className="btn-primary md:col-span-2">Register</button>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">Already have an account? <Link className="font-bold text-brand-600" to="/login">Login</Link></p>
      </form>
    </main>
  );
}
