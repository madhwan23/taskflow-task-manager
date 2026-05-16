import { ArrowRight, CheckCircle2, Kanban, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden px-6 py-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.28),transparent_34%),linear-gradient(135deg,#020617,#0f172a_48%,#111827)]" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="text-xl font-black">TaskFlow</Link>
          <div className="flex items-center gap-2">
            <Link className="btn-secondary border-white/15 bg-white/10 text-white hover:bg-white/15" to="/login">Login</Link>
            <Link className="btn-primary" to="/register">Sign up</Link>
          </div>
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 pb-20 pt-24 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-md border border-white/15 px-3 py-1 text-sm text-sky-100">Production-ready Django + React task management</p>
            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-normal sm:text-6xl">TaskFlow Team Manager</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Plan projects, assign work, monitor progress, and keep role-based workflows clear for admins and members.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary" to="/login">Open dashboard <ArrowRight className="h-4 w-4" /></Link>
              <span className="btn-secondary border-white/15 bg-white/10 text-white">Demo admin: admin / Admin@12345</span>
            </div>
          </div>
          <div className="panel border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="grid gap-3">
              {["Website Redesign", "Mobile App Launch", "Internal Ops Portal"].map((item, index) => (
                <div key={item} className="rounded-md border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{item}</p>
                    <span className="rounded-md bg-sky-500/15 px-2 py-1 text-xs text-sky-200">{[72, 38, 89][index]}%</span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-sky-400" style={{ width: `${[72, 38, 89][index]}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-4 pb-8 md:grid-cols-3">
          {[["Role security", Shield], ["Kanban-ready tasks", Kanban], ["Progress tracking", CheckCircle2]].map(([label, Icon]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-5"><Icon className="mb-3 h-5 w-5 text-sky-300" /><p className="font-bold">{label}</p></div>
          ))}
        </div>
      </section>
    </main>
  );
}
