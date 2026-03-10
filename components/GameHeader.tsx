import { StatCard } from "./StatCard";

function LegendChip({
                        label,
                        tone,
                    }: {
    label: string;
    tone: "correct" | "wrong";
}) {
    const classes =
        tone === "correct"
            ? "border-emerald-400/30 bg-emerald-500/20 text-emerald-100"
            : "border-rose-400/30 bg-rose-500/20 text-rose-100";

    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${classes}`}
        >
      {label}
    </span>
    );
}

export function GameHeader({
                               guessesCount,
                               guessLimit,
                               friendsLeft,
                               gameWon,
                               gameLost,
                               answerName,
                               todayLabel,
                           }: {
    guessesCount: number;
    guessLimit: number;
    friendsLeft: number;
    gameWon: boolean;
    gameLost: boolean;
    answerName: string;
    todayLabel: string;
}) {
    const status = gameWon ? "Solved" : gameLost ? "Missed" : "Playing";
    const target = gameWon || gameLost ? answerName : "Hidden";

    return (
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-stretch">
            <section className="flex-1 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-2xl">
                <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">
                            Daily Guess Game
                        </p>
                        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                            Frienddle
                        </h1>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-right">
                        <p className="text-xs uppercase tracking-widest text-slate-400">
                            Today
                        </p>
                        <p className="text-sm font-semibold text-slate-100">
                            {todayLabel}
                        </p>
                    </div>
                </div>

                <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                    Guess the friend of the day by comparing attributes. Green means the
                    value matches exactly. Red means it does not.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                    <LegendChip label="Match" tone="correct" />
                    <LegendChip label="No Match" tone="wrong" />
                </div>
            </section>

            <section className="grid min-w-[280px] grid-cols-2 gap-3 lg:w-[320px]">
                <StatCard label="Guesses" value={`${guessesCount}/${guessLimit}`} />
                <StatCard label="Friends Left" value={String(friendsLeft)} />
                <StatCard label="Status" value={status} />
                <StatCard label="Target" value={target} />
            </section>
        </div>
    );
}