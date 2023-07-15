"use client";

import { useState, useEffect } from "react";

function Score(key: string) {
  const [score, scoreSetter] = useState(0);
  const [name, nameSetter] = useState(key);

  // Collect localStorage and set values if available - every render
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem(key));
    if (items) {
      scoreSetter(items.score);
      nameSetter(items.name);
    }
  }, []);

  // Save items to localStorage - when name/score change
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify({ score: score, name: name }));
  }, [score, name]);

  return [
    <button
      className="p-5 m-2 text-9xl rounded-xl hover:bg-bgdim-light hover:dark:bg-bgdim-dark active:bg-bgdim-light active:dark:bg-bgdim-dark"
      onClick={() => scoreSetter(score + 1)}
    >
      {score}
    </button>,
    <input
      type="text"
      onChange={(e) => nameSetter(e.target.value)}
      value={name}
      className="min-w-0 appearance-none bg-bgdim-light dark:bg-bgdim-dark mx-2 my-5 py-2 rounded-xl text-center focus:outline-none"
    />,
  ];
}

export default function Game() {
  const keyA = "anne";
  const keyB = "bob";
  const [scoreA, nameA] = Score(keyA);
  const [scoreB, nameB] = Score(keyB);

  function nextGame() {
    console.log("next game");
    // Write current game to the history
    // TODO

    // Reset current game
    localStorage.removeItem(keyA);
    localStorage.removeItem(keyB);

    // Refresh page
    location.reload();
  }

  return (
    <>
      <div>
        {scoreA}
        {scoreB}
      </div>
      <div className="flex justify-center text-lg">
        {nameA}
        {nameB}
      </div>
      <div>
        <button
          className="p-4 mt-20 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
          onClick={nextGame}
        >
          Next
        </button>
      </div>
    </>
  );
}
