export function StatCard({
                             label,
                             value,
                         }: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                {label}
            </p>
            <p className="mt-3 wrap-break-word text-2xl font-black tracking-tight text-white">
                {value}
            </p>
        </div>
    );
}