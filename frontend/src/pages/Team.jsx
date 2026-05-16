import { useEffect, useState } from "react";
import { api } from "../api/client";
import Spinner from "../components/ui/Spinner";
import { unwrapResults } from "../utils/format";

export default function Team() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    api.get("/users/").then(({ data }) => setUsers(unwrapResults(data)));
  }, []);

  if (!users) return <Spinner label="Loading team" />;

  return (
    <div className="space-y-5">
      <div><h1 className="text-3xl font-black text-slate-950 dark:text-white">Team members</h1><p className="text-slate-500">People available for project assignment.</p></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {users.map((user) => (
          <article key={user.id} className="panel p-5">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-md bg-brand-50 font-black text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">{user.full_name?.[0] || user.username[0]}</div>
              <div><h2 className="font-black text-slate-950 dark:text-white">{user.full_name}</h2><p className="text-sm text-slate-500">{user.job_title || user.email}</p></div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm"><span>{user.email}</span><span className="rounded-md bg-slate-100 px-2 py-1 font-bold uppercase dark:bg-slate-800">{user.role}</span></div>
          </article>
        ))}
      </div>
    </div>
  );
}
