"use client";

import { Component, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { GameData, GameStorage, Score } from "../history";

type PlayerProps = {
  index: number;
  update: (i: number, score: Score) => void;
  load_score: Score;
};

function Player({ index, update, load_score }: PlayerProps) {
  const [name, nameSetter] = useState("");
  const [score, scoreSetter] = useState(0);

  // Fix hydration errors
  useEffect(() => {
    nameSetter(load_score.name);
    scoreSetter(load_score.score);
  }, []);

  useEffect(() => {
    update(index, { name: name, score: score });
  }, [score, name]);

  // TODO; align + and - buttons https://stackoverflow.com/a/51526649
  return (
    <div key={`player${index}`} className="flex flex-col items-center">
      <div className="flex flex-row items-center">
        <div className="text-9xl">{score}</div>
        <div className="flex flex-col items-center">
          <button
            className="h-10 w-10 m-1 rounded-full text-xl bg-bgdim-light dark:bg-bgdim-dark active:border-2 hover:border-2 active:border-accent-light active:dark:border-accent-dark hover:border-accent-light hover:dark:border-accent-dark"
            onClick={() => scoreSetter(score + 1)}
          >
            +
          </button>
          <button
            className="h-10 w-10 m-1 rounded-full text-xl bg-bgdim-light dark:bg-bgdim-dark active:border-2 hover:border-2 active:border-accent-light active:dark:border-accent-dark hover:border-accent-light hover:dark:border-accent-dark"
            onClick={() => scoreSetter(score - 1)}
          >
            -
          </button>
        </div>
      </div>
      <input
        type="text"
        onChange={(e) => nameSetter(e.target.value)}
        value={name}
        className="flex appearance-none outline-none bg-bgdim-light dark:bg-bgdim-dark py-2 rounded-xl text-center"
      />
    </div>
  );
}

class Game extends Component<{ reset: () => void }, GameData> {
  constructor(props: any) {
    super(props);

    let load = GameStorage.read();
    if (load) this.state = load;
    else {
      this.state = {
        id: nanoid(),
        scores: [],
      };
      this.state.scores.push(this.getNewScore());
      this.state.scores.push(this.getNewScore());
    }
  }

  getNewScore(): Score {
    return {
      name: `player ${this.state.scores.length}`,
      score: 0,
    };
  }
  addPlayer() {
    let state: GameData = { ...this.state };
    state.scores.push(this.getNewScore());
    this.setState(state);
    GameStorage.store(this.state);
  }

  update(i: number, score: Score) {
    let state = { ...this.state };
    state.scores[i] = score;

    this.setState(state);
    GameStorage.store(this.state);
  }

  next() {
    // TODO; add to history store
    this.props.reset();
  }

  render() {
    return (
      <>
        <div className="flex flex-wrap justify-center gap-2">
          {this.state.scores.map((score, i) => (
            <Player
              index={i}
              update={(i, s) => this.update(i, s)}
              load_score={score}
              key={i}
            />
          ))}
          <button
            className="h-15 w-15 m-1 rounded-full text-xl bg-bgdim-light dark:bg-bgdim-dark active:border-2 hover:border-2 active:border-accent-light active:dark:border-accent-dark hover:border-accent-light hover:dark:border-accent-dark"
            onClick={() => this.addPlayer()}
          >
            +
          </button>
        </div>
        <div>
          <button
            className="p-4 mx-2 mt-20 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
            onClick={() => this.props.reset()}
          >
            Reset
          </button>
          <button
            className="p-4 mx-2 mt-20 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
            onClick={() => this.next()}
          >
            Next
          </button>
        </div>
      </>
    );
  }
}

export default function Page() {
  const [key, keySetter] = useState(0);

  function reset() {
    keySetter(key + 1);
  }

  // Changing the key wipes the state - resetting it
  return <Game key={key} reset={reset} />;
}
