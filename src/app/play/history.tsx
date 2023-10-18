export type Score = {
  name: string;
  amount: number;
};

export type GameData = {
  id: string;
  scores: Score[];
};

export class GameStorage {
  static key = "game";

  static read(): GameData | null {
    if (typeof window == "undefined") return null; // Server side

    const data = localStorage.getItem(GameStorage.key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  static store(data: GameData) {
    let json = JSON.stringify(data);
    localStorage.setItem(GameStorage.key, json);
  }

  static wipe() {
    localStorage.removeItem(GameStorage.key);
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
