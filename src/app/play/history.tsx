export type Score = {
  name: string;
  amount: number;
};

export type GameData = {
  scores: Score[];
};

export type GameGroup = {
  name: string;
  games: GameData[];
};

export type HistoryData = {
  groups: GameGroup[];
};

export class Storage<Type> {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  read(): Type | null {
    if (typeof window == "undefined") return null; // Server side

    const data = localStorage.getItem(this.key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  store(data: Type) {
    let json = JSON.stringify(data);
    localStorage.setItem(this.key, json);
  }

  wipe() {
    localStorage.removeItem(this.key);
  }
}

export class History {
  static key = "history";

  games: GameData[];

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

  static add(game: GameData) {
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
