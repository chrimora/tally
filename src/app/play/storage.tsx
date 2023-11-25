export const GAME_STORE_KEY = "game";
export const GROUP_STORE_KEY = "groupid";

class StorageError extends Error {}

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
  version: string;
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

  static wipeAll() {
    if (typeof window == "undefined") return; // Server side

    localStorage.clear();
  }
}

type aggScores = { [name: string]: number[] };

export class History {
  static key = "history";
  static version = "v3";

  static get(): HistoryData | null {
    const storage = new Storage<HistoryData>(History.key);
    const history = storage.read();

    if (
      history &&
      (!Object.hasOwn(history, "version") ||
        (Object.hasOwn(history, "version") &&
          history.version != History.version))
    )
      throw new StorageError("Legacy history data.");

    return history;
  }

  static create(game: GameData, group: number | null): number {
    let history = History.get();

    if (!history) {
      history = {
        version: History.version,
        groups: [
          {
            name: "group 0",
            games: [game],
          },
        ],
      };
    } else {
      if (group == null) {
        history.groups.push({
          name: `group ${history.groups.length}`,
          games: [game],
        });
      } else {
        history.groups[group].games.push(game);
      }
    }
    new Storage<HistoryData>(History.key).store(history);

    return group || history.groups.length - 1;
  }

  static transformGroup(data: GameGroup): aggScores {
    let x: aggScores = {};

    data.games.map((game) => {
      game.scores.map(({ name, amount }) => {
        if (!(name in x)) x[name] = [];
        // TODO; name uniqueness not enforced - could merge scores
        x[name].push(amount);
      });
    });
    return x;
  }
}

export function StorageErrorComponent({
  error,
  resetErrorBoundary,
}: {
  error: Error & { digest?: string };
  resetErrorBoundary: () => void;
}) {
  function wipe() {
    if (confirm("Note: this will delete all stored data.")) Storage.wipeAll();
    resetErrorBoundary();
  }

  if (error instanceof StorageError) {
    return (
      <div>
        <h2>Error: Legacy history data detected.</h2>
        <p>
          The version of data stored on this device does not match the storage
          version of the application. It will need to be reset.
        </p>
        <button
          className="p-4 mx-2 mt-10 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
          onClick={() => wipe()}
        >
          Reset
        </button>
      </div>
    );
  } else throw error;
}
