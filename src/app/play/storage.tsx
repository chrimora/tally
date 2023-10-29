export const GAME_STORE_KEY = "game";
export const GROUP_STORE_KEY = "groupid";

// TODO; restructure data - move names to GameGroup
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
  // TODO; migrate to using indexedDB
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
    if (typeof window == "undefined") return; // Server side

    let json = JSON.stringify(data);
    localStorage.setItem(this.key, json);
  }

  wipe() {
    if (typeof window == "undefined") return; // Server side

    localStorage.removeItem(this.key);
  }
}

type aggScores = { [name: string]: number[] };

export class History {
  static key = "history";

  static get(): HistoryData | null {
    const storage = new Storage<HistoryData>(History.key);
    return storage.read();
  }

  static create(game: GameData, group?: number): number {
    let history = History.get();

    if (!history) {
      history = {
        groups: [
          {
            name: "group 0",
            games: [game],
          },
        ],
      };
    } else {
      if (!group) {
        history.groups.push({
          name: `group ${history.groups.length}`,
          games: [game],
        });
      } else {
        history.groups[group].games.push(game);
      }
    }
    const storage = new Storage<HistoryData>(History.key);
    storage.store(history);

    return group || history.groups.length - 1;
  }

  static transformGroup(data: GameGroup): aggScores {
    let x: aggScores = {};

    data.games.map((game) => {
      game.scores.map(({ name, amount }) => {
        if (!(name in x)) x[name] = [];
        x[name].push(amount);
      });
    });
    return x;
  }
}
