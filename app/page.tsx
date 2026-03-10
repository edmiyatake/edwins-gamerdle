"use client";

import { useEffect, useMemo, useState } from "react";
import friendsData from "../data/friends.json";
import { GameHeader } from "@/components/GameHeader";
import { GameStatus } from "@/components/GameStatus";
import { GuessBoard } from "@/components/GuessBoard";
import { SearchBox } from "@/components/SearchBox";
import { getDailyFriend, getPuzzleKey } from "@/lib/dailyFriend";
import { evaluateGuess } from "@/lib/evaluateGuess";
import type { Friend, GuessResult, SavedGameState } from "@/lib/types";

const friends = friendsData as Friend[];
const friendMap = new Map(friends.map((friend) => [friend.name, friend]));

const GUESS_LIMIT = 8;
const STORAGE_PREFIX = "frienddle-progress";

type GuessRowData = {
    friend: Friend;
    result: GuessResult;
    animate?: boolean;
};

function buildGuessRows(names: string[], answer: Friend): GuessRowData[] {
    return names
        .map((name) => friendMap.get(name))
        .filter((friend): friend is Friend => Boolean(friend))
        .map((friend) => ({
            friend,
            result: evaluateGuess(friend, answer),
            animate: false,
        }));
}

function buildShareText(
    puzzleKey: string,
    guesses: GuessRowData[],
    solved: boolean
) {
    const score = solved ? `${guesses.length}/${GUESS_LIMIT}` : `X/${GUESS_LIMIT}`;

    const rows = guesses
        .map(({ result }) =>
            [
                result.gender,
                result.playsValorant,
                result.playsLeague,
                result.employed,
                result.hasSiblings,
                result.divergent,
                result.boosted,
                result.single,
            ]
                .map((cell) => (cell === "correct" ? "🟩" : "🟥"))
                .join("")
        )
        .join("\n");

    return rows
        ? `Frienddle ${puzzleKey} ${score}\n${rows}`
        : `Frienddle ${puzzleKey} ${score}`;
}

function formatTodayLabel(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

export default function HomePage() {
    const [clientNow, setClientNow] = useState<Date | null>(null);
    const [query, setQuery] = useState("");
    const [guesses, setGuesses] = useState<GuessRowData[]>([]);
    const [gameWon, setGameWon] = useState(false);
    const [gameLost, setGameLost] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const [restoreError, setRestoreError] = useState("");

    useEffect(() => {
        setClientNow(new Date());
    }, []);

    const answer = useMemo(() => {
        return clientNow ? getDailyFriend(clientNow) : null;
    }, [clientNow]);

    const puzzleKey = useMemo(() => {
        return clientNow ? getPuzzleKey(clientNow) : "";
    }, [clientNow]);

    const todayLabel = useMemo(() => {
        return clientNow ? formatTodayLabel(clientNow) : "Loading...";
    }, [clientNow]);

    useEffect(() => {
        if (!answer || !puzzleKey) return;

        const storageKey = `${STORAGE_PREFIX}:${puzzleKey}`;

        try {
            const raw = window.localStorage.getItem(storageKey);

            if (!raw) {
                setHydrated(true);
                return;
            }

            const saved = JSON.parse(raw) as SavedGameState;

            const guessedNames = Array.isArray(saved.guessedNames)
                ? saved.guessedNames.filter(
                    (name): name is string => typeof name === "string"
                )
                : [];

            const restoredRows = buildGuessRows(guessedNames, answer);
            const solved =
                restoredRows.some(({ friend }) => friend.name === answer.name) ||
                Boolean(saved.gameWon);
            const lost =
                !solved &&
                (Boolean(saved.gameLost) || restoredRows.length >= GUESS_LIMIT);

            setGuesses(restoredRows);
            setGameWon(solved);
            setGameLost(lost);
        } catch {
            setRestoreError("Could not restore today's progress.");
        } finally {
            setHydrated(true);
        }
    }, [answer, puzzleKey]);

    useEffect(() => {
        if (!hydrated || !puzzleKey) return;

        const storageKey = `${STORAGE_PREFIX}:${puzzleKey}`;

        const savedState: SavedGameState = {
            guessedNames: guesses.map((guess) => guess.friend.name),
            gameWon,
            gameLost,
        };

        window.localStorage.setItem(storageKey, JSON.stringify(savedState));
    }, [guesses, gameWon, gameLost, hydrated, puzzleKey]);

    const filteredFriends = friends
        .filter((friend) => {
            const alreadyGuessed = guesses.some(
                (guess) => guess.friend.name === friend.name
            );

            return (
                !alreadyGuessed &&
                friend.name.toLowerCase().includes(query.toLowerCase())
            );
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    const shareText = useMemo(() => {
        return buildShareText(puzzleKey, guesses, gameWon);
    }, [puzzleKey, guesses, gameWon]);

    function handleGuess(friend: Friend) {
        if (!answer || !hydrated || gameWon || gameLost) return;

        const alreadyGuessed = guesses.some(
            (guess) => guess.friend.name === friend.name
        );

        if (alreadyGuessed) return;

        const result = evaluateGuess(friend, answer);
        const solved = friend.name === answer.name;
        const nextGuessCount = guesses.length + 1;
        const lost = !solved && nextGuessCount >= GUESS_LIMIT;

        setGuesses((prev) => [
            ...prev,
            {
                friend,
                result,
                animate: true,
            },
        ]);
        setQuery("");
        setGameWon(solved);
        setGameLost(lost);
    }

    if (!clientNow || !answer) {
        return (
            <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b_0%,_#0f172a_35%,_#020617_100%)] px-4 py-8 text-slate-100">
                <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur-xl shadow-2xl">
                    <h1 className="text-3xl font-black">Frienddle</h1>
                    <p className="mt-3 text-slate-300">Loading today&apos;s friend...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b_0%,_#0f172a_35%,_#020617_100%)] px-4 py-8 text-slate-100">
            <div className="mx-auto max-w-7xl">
                <GameHeader
                    guessesCount={guesses.length}
                    guessLimit={GUESS_LIMIT}
                    friendsLeft={Math.max(friends.length - guesses.length, 0)}
                    gameWon={gameWon}
                    gameLost={gameLost}
                    answerName={answer.name}
                    todayLabel={todayLabel}
                />

                <div className="mb-6">
                    <SearchBox
                        query={query}
                        setQuery={setQuery}
                        filteredFriends={filteredFriends}
                        onSelectFriend={handleGuess}
                        disabled={!hydrated || gameWon || gameLost}
                    />
                </div>

                {restoreError && (
                    <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                        {restoreError}
                    </div>
                )}

                <GameStatus
                    solved={gameWon}
                    lost={gameLost}
                    answerName={answer.name}
                    guessesCount={guesses.length}
                    guessLimit={GUESS_LIMIT}
                    shareText={shareText}
                />

                <GuessBoard guesses={guesses} />
            </div>
        </main>
    );
}