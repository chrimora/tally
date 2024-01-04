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
  update: (score: Score) => void;
  score: Score;
  fixNames: boolean;
};

function Player({ update, score, fixNames }: PlayerProps) {
  function scoreSetter(n: number) {
    update({ name: score.name, amount: score.amount + n });
  }
  function nameSetter(name: string) {
    update({ name: name, amount: score.amount });
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center">
        <div className="text-8xl">{score.amount}</div>
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
        className="w-full appearance-none outline-none bg-bgdim-light dark:bg-bgdim-dark py-2 rounded-xl text-center"
      />
    </div>
  );
}

function Game({ state_reset }: { state_reset: () => void }) {
  const router = useRouter();

  const storage = new Storage<GameData>(GAME_STORE_KEY);
  const [scores, scoresSetter] = useState<Score[]>([]);

  const loadGroup = new Storage<number>(GROUP_STORE_KEY).read();
  const [groupName, groupNameSetter] = useState("");

  // Fix hydration errors - client operations need to be in Effect
  useEffect(() => {
    addPlayer();

    if (loadGroup != null) groupNameSetter(History.getGroupName(loadGroup));

    let load = storage.read();
    if (load) {
      scoresSetter(load.scores);
    }
  }, []);

  function addPlayer() {
    scoresSetter([
      ...scores,
      {
        name: `player${scores.length}`,
        amount: 0,
      },
    ]);
  }

  function update(i: number, score: Score) {
    let new_scores = [...scores];
    new_scores[i] = score;

    scoresSetter(new_scores);
    storage.store({ scores: scores });
  }

  function new_game() {
    storage.wipe();
    new Storage<number>(GROUP_STORE_KEY).wipe();
    state_reset();
  }
  function next() {
    // TODO; catch storage error here
    const group = History.create({ scores: scores }, loadGroup);
    router.push(`/play/game/load?id=${group}`);
  }

  return (
    <>
      <p className="pb-6 text-xl">{groupName}</p>
      <div className="grid items-center auto-rows-fr grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        {scores.map((score, i) => (
          <Player
            update={(s) => update(i, s)}
            score={score}
            fixNames={loadGroup == null ? false : true}
            key={i}
          />
        ))}
        {loadGroup == null && (
          <div
            className="rounded-md active:border-2 hover:border-2 active:border-accent-light dark:active:border-accent-dark hover:border-accent-light dark:hover:border-accent-dark"
            onClick={() => addPlayer()}
          >
            <span
              className="
            relative inline-block
            h-14 w-14 m-1 align-middle
            before:bg-bgdim-light after:bg-bgdim-light dark:before:bg-bgdim-dark dark:after:bg-bgdim-dark
            before:absolute after:absolute
            before:top-0 after:top-0 before:bottom-0 after:bottom-0 before:left-0 after:left-0 before:right-0 after:right-0
            before:content-[''] after:content-['']
            before:w-2 before:my-2 before:mx-auto
            after:h-2 after:my-auto after:mx-2
            "
            ></span>
            <p className="font-bold">Add Player</p>
          </div>
        )}
      </div>
      <div>
        <button
          className="p-4 mx-2 my-10 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
          onClick={() => new_game()}
        >
          Reset
        </button>
        <button
          className="p-4 mx-2 my-10 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
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
