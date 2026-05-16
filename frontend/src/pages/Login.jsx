import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "admin", password: "Admin@12345" });

  async function submit(event) {
    event.preventDefault();
    try {
      await login(form);
      navigate("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-slate-950">
      <form onSubmit={submit} className="panel w-full max-w-md p-6">
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Login with the seeded admin or member account.</p>
        <div className="mt-6 space-y-3">
          <input className="input" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn-primary w-full">Login</button>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">No account? <Link className="font-bold text-brand-600" to="/register">Register</Link></p>
      </form>
    </main>
  );
}
