import type { ReactNode } from "react";
import type { Friend, GuessResult } from "@/lib/types";
import { EmptyState } from "./EmptyState";
import { GuessRow } from "./GuessRow";

type GuessRowData = {
    friend: Friend;
    result: GuessResult;
    animate?: boolean;
};

function HeaderTile({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 px-2 text-center text-[11px] font-bold uppercase leading-tight tracking-wide text-slate-200 sm:text-sm">
            {children}
        </div>
    );
}

export function GuessBoard({ guesses }: { guesses: GuessRowData[] }) {
    return (
        <section className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl shadow-2xl">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-white">Guess Board</h2>
                <p className="text-sm text-slate-400">
                    Photo shows the guessed friend. Colored squares show whether each
                    attribute matches today’s answer.
                </p>
            </div>

            <div className="overflow-x-auto md:overflow-visible">
                <div className="grid min-w-230 grid-cols-[220px_repeat(8,84px)] gap-3 sm:grid-cols-[220px_repeat(8,96px)] md:min-w-0 md:grid-cols-[220px_repeat(8,minmax(72px,1fr))] lg:grid-cols-[240px_repeat(8,minmax(84px,1fr))]">
                    <HeaderTile>Friend</HeaderTile>
                    <HeaderTile>Gender</HeaderTile>
                    <HeaderTile>Valorant</HeaderTile>
                    <HeaderTile>League</HeaderTile>
                    <HeaderTile>Employed</HeaderTile>
                    <HeaderTile>Siblings</HeaderTile>
                    <HeaderTile>Divergent</HeaderTile>
                    <HeaderTile>Boosted</HeaderTile>
                    <HeaderTile>Single</HeaderTile>

                    {guesses.length === 0 ? (
                        <EmptyState />
                    ) : (
                        guesses.map(({ friend, result, animate }) => (
                            <GuessRow
                                key={friend.id}
                                friend={friend}
                                result={result}
                                animate={animate}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}