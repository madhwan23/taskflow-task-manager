import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-brand-600">404</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-2 text-slate-500">The page you opened does not exist.</p>
        <Link className="btn-primary mt-6" to="/dashboard">Back to dashboard</Link>
      </div>
    </main>
  );
}
