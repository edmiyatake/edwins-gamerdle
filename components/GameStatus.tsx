"use client";

import { useEffect, useMemo, useState } from "react";
import { getMsUntilNextPuzzle } from "../lib/dailyFriend";

function formatCountdown(ms: number) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
        2,
        "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
}

export function GameStatus({
                               solved,
                               lost,
                               answerName,
                               guessesCount,
                               guessLimit,
                               shareText,
                           }: {
    solved: boolean;
    lost: boolean;
    answerName: string;
    guessesCount: number;
    guessLimit: number;
    shareText: string;
}) {
    const [countdown, setCountdown] = useState("--:--:--");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const updateCountdown = () => {
            setCountdown(formatCountdown(getMsUntilNextPuzzle()));
        };

        updateCountdown();

        const timer = window.setInterval(updateCountdown, 1000);
        return () => window.clearInterval(timer);
    }, []);

    const guessesRemaining = useMemo(
        () => Math.max(0, guessLimit - guessesCount),
        [guessLimit, guessesCount]
    );

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(shareText);
            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            setCopied(false);
        }
    }

    if (solved) {
        return (
            <section className="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-4 text-emerald-100 shadow-[0_0_40px_rgba(16,185,129,0.12)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-lg font-bold">
                            You got it in {guessesCount}/{guessLimit}.
                        </p>
                        <p className="mt-1 text-sm text-emerald-200/90">
                            The answer was <span className="font-semibold">{answerName}</span>.
                        </p>
                        <p className="mt-2 text-sm text-emerald-200/80">
                            Next friend in {countdown}
                        </p>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="rounded-xl border border-emerald-300/40 bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-400/25"
                    >
                        {copied ? "Copied" : "Copy Result"}
                    </button>
                </div>
            </section>
        );
    }

    if (lost) {
        return (
            <section className="mb-6 rounded-2xl border border-rose-400/30 bg-rose-500/15 px-4 py-4 text-rose-100 shadow-[0_0_40px_rgba(244,63,94,0.10)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-lg font-bold">Out of guesses.</p>
                        <p className="mt-1 text-sm text-rose-200/90">
                            The answer was <span className="font-semibold">{answerName}</span>.
                        </p>
                        <p className="mt-2 text-sm text-rose-200/80">
                            Next friend in {countdown}
                        </p>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="rounded-xl border border-rose-300/40 bg-rose-400/15 px-4 py-2 text-sm font-semibold text-rose-50 transition hover:bg-rose-400/25"
                    >
                        {copied ? "Copied" : "Copy Result"}
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-4 text-cyan-100">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <p className="text-sm">
                    Start typing to search your friend list, then click a name to submit a
                    guess.
                </p>
                <div className="text-sm font-medium text-cyan-200/90">
                    {guessesRemaining} guesses left · Next friend in {countdown}
                </div>
            </div>
        </section>
    );
}