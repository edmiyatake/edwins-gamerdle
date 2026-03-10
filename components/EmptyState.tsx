export function EmptyState() {
    return (
        <div className="col-span-9 rounded-3xl border border-dashed border-white/10 bg-slate-950/40 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-200">No guesses yet</p>
            <p className="mt-2 text-sm text-slate-400">
                Use the search box above to submit your first guess.
            </p>
        </div>
    );
}