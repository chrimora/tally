"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GameData,
  History,
  Score,
  Storage,
  GAME_STORE_KEY,
  GROUP_STORE_KEY,
} from "../storage";

type PlayerProps = {
  index: number;
  update: (i: number, score: Score) => void;
  score: Score;
  fixNames: boolean;
};

function Player({ index, update, score, fixNames }: PlayerProps) {
  function scoreSetter(n: number) {
    update(index, { name: score.name, amount: score.amount + n });
  }
  function nameSetter(name: string) {
    update(index, { name: name, amount: score.amount });
  }

  return (
    <div key={`player${index}`} className="flex flex-col items-center">
      <div className="flex flex-row items-end">
        <div className="text-9xl">{score.amount}</div>
        <div className="flex flex-col">
          <span
            className="
            relative inline-block
            h-8 w-8 m-1 align-middle rounded-full active:border-2 hover:border-2
            bg-bgdim-light dark:bg-bgdim-dark
            active:border-accent-light dark:active:border-accent-dark hover:border-accent-light dark:hover:border-accent-dark
            before:bg-bg-dark after:bg-bg-dark dark:before:bg-bg-light dark:after:bg-bg-light
            before:absolute after:absolute
            before:top-0 after:top-0 before:bottom-0 after:bottom-0 before:left-0 after:left-0 before:right-0 after:right-0
            before:content-[''] after:content-['']
            before:w-0.5 before:my-2 before:mx-auto
            after:h-0.5 after:my-auto after:mx-2
            "
            onClick={() => scoreSetter(+1)}
          ></span>
          <span
            className="
            relative inline-block
            h-8 w-8 m-1 align-middle rounded-full active:border-2 hover:border-2
            bg-bgdim-light dark:bg-bgdim-dark
            active:border-accent-light dark:active:border-accent-dark hover:border-accent-light dark:hover:border-accent-dark
            after:bg-bg-dark dark:dark:after:bg-bg-light
            after:absolute
            after:top-0 after:bottom-0 after:left-0 after:right-0
            after:content-['']
            after:h-0.5 after:my-auto after:mx-2
            "
            onClick={() => scoreSetter(-1)}
          ></span>
        </div>
      </div>
      <input
        type="text"
        onChange={(e) => nameSetter(e.target.value)}
        value={score.name}
        readOnly={fixNames}
        className="flex appearance-none outline-none bg-bgdim-light dark:bg-bgdim-dark py-2 rounded-xl text-center"
      />
    </div>
  );
}

function Game({ state_reset }: { state_reset: () => void }) {
  function addPlayer() {
    scoresSetter([
      ...scores,
      {
        name: `player ${scores.length}`,
        amount: 0,
      },
    ]);
  }

  const router = useRouter();

  const storage = new Storage<GameData>(GAME_STORE_KEY);
  const [scores, scoresSetter] = useState<Score[]>([]);

  const loadGroup = new Storage<number>(GROUP_STORE_KEY).read();

  // Fix hydration errors
  useEffect(() => {
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
    new Storage<number>(GROUP_STORE_KEY).wipe();
    state_reset();
  }
  function next() {
    const group = History.create({ scores: scores }, loadGroup || undefined);
    router.push(`/play/game/load/${group}`);
  }

  return (
    <>
      <div className="flex flex-row flex-wrap justify-center items-center gap-3">
        {scores.map((score, i) => (
          <Player
            index={i}
            update={(i, s) => update(i, s)}
            score={score}
            fixNames={loadGroup ? true : false}
            key={i}
          />
        ))}
        {!loadGroup && (
          <span
            className="
            relative inline-block
            h-14 w-14 m-1 align-middle rounded-full active:border-2 hover:border-2
            active:border-accent-light dark:active:border-accent-dark hover:border-accent-light dark:hover:border-accent-dark
            before:bg-bg-bgdim-light after:bg-bg-bgdim-light dark:before:bg-bgdim-dark dark:after:bg-bgdim-dark
            before:absolute after:absolute
            before:top-0 after:top-0 before:bottom-0 after:bottom-0 before:left-0 after:left-0 before:right-0 after:right-0
            before:content-[''] after:content-['']
            before:w-2 before:my-2 before:mx-auto
            after:h-2 after:my-auto after:mx-2
            "
            onClick={() => addPlayer()}
          ></span>
        )}
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
