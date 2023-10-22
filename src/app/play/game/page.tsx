"use client";

import { useEffect, useState } from "react";
import { GameData, History, Score, Storage } from "../history";

type PlayerProps = {
  index: number;
  update: (i: number, score: Score) => void;
  score: Score;
};

function Player({ index, update, score }: PlayerProps) {
  function scoreSetter(n: number) {
    update(index, { name: score.name, amount: score.amount + n });
  }
  function nameSetter(name: string) {
    update(index, { name: name, amount: score.amount });
  }

  // TODO; align + and - buttons https://stackoverflow.com/a/51526649
  return (
    <div key={`player${index}`} className="flex flex-col items-center">
      <div className="flex flex-row items-center">
        <div className="text-9xl">{score.amount}</div>
        <div className="flex flex-col items-center">
          <button
            className="h-10 w-10 m-1 rounded-full text-xl bg-bgdim-light dark:bg-bgdim-dark active:border-2 hover:border-2 active:border-accent-light active:dark:border-accent-dark hover:border-accent-light hover:dark:border-accent-dark"
            onClick={() => scoreSetter(+1)}
          >
            +
          </button>
          <button
            className="h-10 w-10 m-1 rounded-full text-xl bg-bgdim-light dark:bg-bgdim-dark active:border-2 hover:border-2 active:border-accent-light active:dark:border-accent-dark hover:border-accent-light hover:dark:border-accent-dark"
            onClick={() => scoreSetter(-1)}
          >
            -
          </button>
        </div>
      </div>
      <input
        type="text"
        onChange={(e) => nameSetter(e.target.value)}
        value={score.name}
        className="flex appearance-none outline-none bg-bgdim-light dark:bg-bgdim-dark py-2 rounded-xl text-center"
      />
    </div>
  );
}

type GameProps = {
  state_reset: () => void;
};

function Game({ state_reset }: GameProps) {
  function addPlayer() {
    scoresSetter([
      ...scores,
      {
        name: `player ${scores.length}`,
        amount: 0,
      },
    ]);
  }

  const storage = new Storage<GameData>("game");
  const [scores, scoresSetter] = useState<Score[]>([]);

  // Fix hydration errors
  useEffect(() => {
    // Init to two players
    addPlayer();

    let load = storage.read();
    if (load) {
      scoresSetter(load.scores);
    }
  }, []);

  function update(i: number, score: Score) {
    let new_scores = [...scores];
    new_scores[i] = score;

    scoresSetter(new_scores);
    storage.store({ scores: scores });
  }

  function reset() {
    storage.wipe();
    state_reset();
  }
  function next() {
    // TODO; add to history store and reset keeping players
    History.create({ scores: scores });
    reset();
  }

  return (
    <>
      <div className="flex flex-row flex-wrap justify-center items-center gap-3">
        {scores.map((score, i) => (
          <Player
            index={i}
            update={(i, s) => update(i, s)}
            score={score}
            key={i}
          />
        ))}
        <div className="">
          <button
            className="font-black text-5xl text-bgdim-light dark:text-bgdim-dark h-20 w-20 rounded-full active:border-2 hover:border-2 active:border-accent-light active:dark:border-accent-dark hover:border-accent-light hover:dark:border-accent-dark"
            onClick={() => addPlayer()}
          >
            +
          </button>
        </div>
      </div>
      <div>
        <button
          className="p-4 mx-2 mt-20 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
          onClick={() => reset()}
        >
          Reset
        </button>
        <button
          className="p-4 mx-2 mt-20 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
          onClick={() => next()}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default function Page() {
  const [key, keySetter] = useState(0);

  function reset() {
    keySetter(key + 1);
  }

  // Changing the key wipes the state - resetting it
  return <Game key={key} state_reset={reset} />;
}
