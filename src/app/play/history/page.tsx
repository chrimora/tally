"use client";

import { History } from "../history";

export default function Page() {
  return (
    <>
      <div className="mx-auto text-sm sm:text-lg">
        {History.get()
          .games.reverse()
          .map((g) => (
            <div key={`${g.id}`} className="flex border-b">
              <div className="p-1 basis-0 grow text-right">
                {g.scores[0].name}
              </div>
              <div className="p-1 basis-8 text-right">{g.scores[0].amount}</div>
              <div className="p-1 basis-8 text-left">{g.scores[1].amount}</div>
              <div className="p-1 basis-0 grow text-left">
                {g.scores[1].name}
              </div>
            </div>
          ))}
      </div>
      <button
        className="p-4 m-8 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
        onClick={History.wipe}
      >
        Reset
      </button>
    </>
  );
}
