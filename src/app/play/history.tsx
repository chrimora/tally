import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

type Score = {
  name: string;
  score: number;
};

export class Game {
  static key = "game";

  id: string;
  scores: Score[];

  constructor() {
    this.id = nanoid();
    this.scores = [
      { name: "player 1", score: 0 },
      { name: "player 2", score: 0 },
    ];
  }

  static get(): Game {
    if (typeof window == "undefined") return new Game(); // Server side

    const data = localStorage.getItem(Game.key);
    if (data) {
      return this.deserialize(data);
    } else {
      return new Game();
    }
  }

  reset() {
    // Wiping localStorage would reset names as well
    // Perform manually
    this.id = nanoid();
    for (let s of this.scores) {
      s.score = 0;
    }
    this.store();

    // Refresh page - rereads localStorage
    location.reload();
  }
  next() {
    History.add(this);
    this.reset();
  }

  scoreComponent(i: number) {
    const [score, scoreSetter] = useState(0);
    const [name, nameSetter] = useState("");

    // Stops hydration errors - set state initial value from localStorage
    useEffect(() => {
      scoreSetter(this.scores[i].score);
      nameSetter(this.scores[i].name);
    }, []);

    useEffect(() => {
      this.scores[i].score = score;
      this.scores[i].name = name;
      this.store();
    }, [score, name]);

    // TODO; align + and - buttons https://stackoverflow.com/a/51526649
    return (
      <div key={`score${i}`} className="flex flex-col items-center">
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
  getScoreComponents() {
    return [this.scores.map((_, i) => this.scoreComponent(i))];
  }

  store() {
    localStorage.setItem(Game.key, this.serialize());
  }
  serialize(): string {
    return JSON.stringify(this);
  }
  static deserialize(json: string): Game {
    const obj: Game = JSON.parse(json);

    let g = new Game();
    g.id = obj.id;
    g.scores = obj.scores;

    return g;
  }
}

export class History {
  static key = "history";

  games: Game[];

  constructor() {
    this.games = [];
  }

  static get(): History {
    if (typeof window == "undefined") return new History(); // Server side

    const data = localStorage.getItem(History.key);
    if (data) {
      return this.deserialize(data);
    } else {
      return new History();
    }
  }

  static add(game: Game) {
    let history = this.get();
    history.games.push(game);
    localStorage.setItem(History.key, history.serialize());
  }

  static wipe() {
    if (
      confirm(
        "This will reset all game data, there is no backup. Do you want to continue?",
      )
    ) {
      localStorage.removeItem(History.key);
      // Refresh page
      location.reload();
    }
  }

  serialize(): string {
    return JSON.stringify(this);
  }
  static deserialize(json: string): History {
    const obj: History = JSON.parse(json);

    let h = new History();
    h.games = obj.games;
    // TODO; games are not Game instances

    return h;
  }
}
