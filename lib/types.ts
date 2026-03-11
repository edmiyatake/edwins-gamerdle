export type YesNo = "Yes" | "No";

export type Friend = {
    id: string;
    name: string;
    image: string;
    gender: "Male" | "Female";
    playsValorant: YesNo;
    playsLeague: YesNo;
    employed: YesNo;
    hasSiblings: YesNo;
    divergent: YesNo;
    boosted: YesNo;
    single: YesNo;
};

export type MatchResult = "correct" | "wrong";

export type GuessResult = {
    name: MatchResult;
    gender: MatchResult;
    playsValorant: MatchResult;
    playsLeague: MatchResult;
    employed: MatchResult;
    hasSiblings: MatchResult;
    divergent: MatchResult;
    boosted: MatchResult;
    single: MatchResult;
};

export type SavedGameState = {
    guessedIds: string[];
    gameWon: boolean;
    gameLost: boolean;
};