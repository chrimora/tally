"use client";

import HistoryStore from "../history";

export default function History() {
  function wipeStorage() {
    if (
      confirm(
        "This will reset all game data, there is no backup. Do you want to continue?",
      )
    ) {
      localStorage.clear();
      // Refresh page
      location.reload();
    }
  }

  return (
    <>
      <div className="mx-auto text-sm sm:text-lg">
        {HistoryStore.get().map((game) => (
          <div className="flex border-b">
            <div className="p-1 basis-0 grow text-right">{game[0].name}</div>
            <div className="p-1 basis-8 text-right">{game[0].score}</div>
            <div className="p-1 basis-8 text-left">{game[1].score}</div>
            <div className="p-1 basis-0 grow text-left">{game[1].name}</div>
          </div>
        ))}
      </div>
      <button
        className="p-4 m-8 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
        onClick={wipeStorage}
      >
        Reset
      </button>
    </>
  );
}
