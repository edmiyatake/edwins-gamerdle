"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { Friend, GuessResult, MatchResult } from "@/lib/types";

function backFaceClass(result: MatchResult) {
    return result === "correct"
        ? "border-emerald-400 bg-emerald-500 text-white"
        : "border-rose-400 bg-rose-500 text-white";
}

function FlipSquare({
                        result,
                        label,
                        value,
                        delay,
                        animate = true,
                    }: {
    result: MatchResult;
    label: string;
    value: string;
    delay: number;
    animate?: boolean;
}) {
    const [revealed, setRevealed] = useState(!animate);

    useEffect(() => {
        if (!animate) {
            setRevealed(true);
            return;
        }

        setRevealed(false);

        const timer = window.setTimeout(() => {
            setRevealed(true);
        }, delay);

        return () => window.clearTimeout(timer);
    }, [animate, delay]);

    return (
        <div
            title={`${label}: ${value}`}
            aria-label={`${label}: ${value}`}
            className="aspect-square w-full perspective-[1000px]"
        >
            <div
                className="relative h-full w-full rounded-2xl transition-transform duration-500 ease-in-out [transform-style:preserve-3d]"
                style={{
                    transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-slate-500 bg-slate-500/80 px-1 text-center text-[10px] font-bold uppercase leading-tight text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] [backface-visibility:hidden] sm:text-xs">
                    ?
                </div>

                <div
                    className={`absolute inset-0 flex items-center justify-center rounded-2xl border px-1 text-center text-[10px] font-bold leading-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] [backface-visibility:hidden] sm:text-xs ${backFaceClass(
                        result
                    )}`}
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <span className="wrap-break-word">{value}</span>
                </div>
            </div>
        </div>
    );
}

function FriendTile({ friend }: { friend: Friend }) {
    const [imageError, setImageError] = useState(false);

    const initials = useMemo(() => {
        return friend.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }, [friend.name]);

    return (
        <div className="flex h-full min-h-21 items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-3 sm:min-h-[96px] lg:min-h-[100px]">
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-800 text-sm font-bold text-slate-200">
                {!imageError ? (
                    <Image
                        src={friend.image}
                        alt={friend.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <span>{initials}</span>
                )}
            </div>

            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white sm:text-base">
                    {friend.name}
                </p>
            </div>
        </div>
    );
}

export function GuessRow({
                             friend,
                             result,
                             animate = true,
                         }: {
    friend: Friend;
    result: GuessResult;
    animate?: boolean;
}) {
    const baseDelay = 120;

    return (
        <>
            <FriendTile friend={friend} />

            <FlipSquare
                result={result.gender}
                label="Gender"
                value={friend.gender}
                delay={0}
                animate={animate}
            />
            <FlipSquare
                result={result.playsValorant}
                label="Plays Valorant"
                value={friend.playsValorant}
                delay={baseDelay}
                animate={animate}
            />
            <FlipSquare
                result={result.playsLeague}
                label="Plays League"
                value={friend.playsLeague}
                delay={baseDelay * 2}
                animate={animate}
            />
            <FlipSquare
                result={result.employed}
                label="Employed"
                value={friend.employed}
                delay={baseDelay * 3}
                animate={animate}
            />
            <FlipSquare
                result={result.hasSiblings}
                label="Has Siblings"
                value={friend.hasSiblings}
                delay={baseDelay * 4}
                animate={animate}
            />
            <FlipSquare
                result={result.divergent}
                label="Divergent"
                value={friend.divergent}
                delay={baseDelay * 5}
                animate={animate}
            />
            <FlipSquare
                result={result.boosted}
                label="Boosted"
                value={friend.boosted}
                delay={baseDelay * 6}
                animate={animate}
            />
            <FlipSquare
                result={result.single}
                label="Single"
                value={friend.single}
                delay={baseDelay * 7}
                animate={animate}
            />
        </>
    );
}