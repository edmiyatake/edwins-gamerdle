import friendsData from "../data/friends.json";
import type { Friend } from "./types";

const friends = friendsData as Friend[];
const START_DATE = new Date("2026-01-01");

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getPuzzleKey(date = new Date()) {
  return toLocalDateKey(date);
}

export function getDailyFriend(date = new Date()): Friend | null {
  if (friends.length === 0) return null;

  const diffMs = date.getTime() - START_DATE.getTime();
  const dayIndex = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const normalizedIndex =
      ((dayIndex % friends.length) + friends.length) % friends.length;

  return friends[normalizedIndex];
}

export function getMsUntilNextPuzzle(now = new Date()) {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}