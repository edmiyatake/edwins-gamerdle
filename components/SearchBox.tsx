import type { Friend } from "@/lib/types";

export function SearchBox({
                              query,
                              setQuery,
                              filteredFriends,
                              onSelectFriend,
                              disabled,
                          }: {
    query: string;
    setQuery: (value: string) => void;
    filteredFriends: Friend[];
    onSelectFriend: (friend: Friend) => void;
    disabled: boolean;
}) {
    return (
        <section className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col gap-4">
                <div>
                    <label
                        htmlFor="friend-search"
                        className="mb-2 block text-sm font-semibold text-slate-200"
                    >
                        Make a guess
                    </label>

                    <div className="relative">
                        <input
                            id="friend-search"
                            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-base text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                            placeholder="Type a friend name..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={disabled}
                        />

                        {query && !disabled && (
                            <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl">
                                {filteredFriends.length > 0 ? (
                                    filteredFriends.map((friend) => (
                                        <button
                                            key={friend.name}
                                            onClick={() => onSelectFriend(friend)}
                                            className="block w-full border-b border-white/5 px-4 py-3 text-left text-slate-100 transition hover:bg-white/10 last:border-b-0"
                                        >
                                            {friend.name}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-slate-400">No matches found.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}