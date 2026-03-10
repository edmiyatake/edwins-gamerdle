import type { Friend, GuessResult, MatchResult } from "./types";

function compareString(a: string, b: string): MatchResult {
    return a === b ? "correct" : "wrong";
}

export function evaluateGuess(guess: Friend, answer: Friend): GuessResult {
    return {
        name: compareString(guess.name, answer.name),
        gender: compareString(guess.gender, answer.gender),
        playsValorant: compareString(guess.playsValorant, answer.playsValorant),
        playsLeague: compareString(guess.playsLeague, answer.playsLeague),
        employed: compareString(guess.employed, answer.employed),
        hasSiblings: compareString(guess.hasSiblings, answer.hasSiblings),
        divergent: compareString(guess.divergent, answer.divergent),
        boosted: compareString(guess.boosted, answer.boosted),
        single: compareString(guess.single, answer.single),
    };
}