export default function Spinner({ label = "Loading" }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      {label}
    </div>
  );
}
