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
      { name: "anne", score: 0 },
      { name: "bob", score: 0 },
    ];
  }

  static get(): Game {
    if (typeof window == "undefined") return new Game(); // Server side

    const data = localStorage.getItem(this.key);
    if (data) {
      return this.deserialize(data);
    } else {
      return new Game();
    }
  }

  reset() {
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

  nameComponent(i: number) {
    const [name, nameSetter] = useState("");

    // Stops hydration errors - set state initial value from localStorage
    useEffect(() => {
      nameSetter(this.scores[i].name);
    }, []);

    useEffect(() => {
      this.scores[i].name = name;
      this.store();
    }, [name]);

    return (
      <input
        key={`name${i}`}
        type="text"
        onChange={(e) => nameSetter(e.target.value)}
        value={name}
        className="min-w-0 appearance-none bg-bgdim-light dark:bg-bgdim-dark mx-2 my-5 py-2 rounded-xl text-center focus:outline-none"
      />
    );
  }
  scoreComponent(i: number) {
    const [score, scoreSetter] = useState(0);

    // Stops hydration errors - set state initial value from localStorage
    useEffect(() => {
      scoreSetter(this.scores[i].score);
    }, []);

    useEffect(() => {
      this.scores[i].score = score;
      this.store();
    }, [score]);

    return (
      <button
        key={`score${i}`}
        className="p-5 m-2 text-9xl rounded-xl hover:bg-bgdim-light hover:dark:bg-bgdim-dark active:bg-bgdim-light active:dark:bg-bgdim-dark"
        onClick={() => scoreSetter(score + 1)}
      >
        {score}
      </button>
    );
  }
  getScoreComponents() {
    return [this.scores.map((_, i) => this.scoreComponent(i))];
  }
  getNameComponents() {
    return [this.scores.map((_, i) => this.nameComponent(i))];
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

    const data = localStorage.getItem(this.key);
    if (data) {
      return this.deserialize(data);
    } else {
      return new History();
    }
  }

  static add(game: Game) {
    let history = this.get();
    history.games.push(game);
    localStorage.setItem(this.key, history.serialize());
  }

  static wipe() {
    if (
      confirm(
        "This will reset all game data, there is no backup. Do you want to continue?"
      )
    ) {
      localStorage.removeItem(this.key);
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
