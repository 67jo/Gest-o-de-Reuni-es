export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white py-10 text-center">
      <p className="text-slate-500">{message}</p>
    </div>
  );
}