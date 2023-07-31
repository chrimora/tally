"use client";

import { Game } from "../history";

export default function Page() {
  let g = Game.get();

  const scores = g.getScoreComponents();
  const names = g.getNameComponents();

  return (
    <>
      <div>{scores}</div>
      <div className="flex justify-center text-lg">{names}</div>
      <div>
        <button
          className="p-4 mx-2 mt-20 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
          onClick={() => g.reset()}
        >
          Reset
        </button>
        <button
          className="p-4 mx-2 mt-20 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
          onClick={() => g.next()}
        >
          Next
        </button>
      </div>
    </>
  );
}
