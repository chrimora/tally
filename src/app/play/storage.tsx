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

export type DatedGameData = GameData & { createdAt: number };

export type GameGroup = {
  name: string;
  games: DatedGameData[];
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

type scoreTable = any[][];

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
    let datedGame: DatedGameData = Object.assign(
      { createdAt: Date.now() },
      game,
    );

    let history = History.get();

    if (!history) {
      history = {
        version: History.version,
        groups: [
          {
            name: "group 0",
            games: [datedGame],
          },
        ],
      };
    } else {
      if (group == null) {
        history.groups.push({
          name: `group ${history.groups.length}`,
          games: [datedGame],
        });
      } else {
        history.groups[group].games.push(datedGame);
      }
    }
    new Storage<HistoryData>(History.key).store(history);

    if (group == null) return history.groups.length - 1;
    else return group;
  }

  static transformGroup(data: GameGroup): scoreTable {
    let y: scoreTable = [];

    data.games.map((game, i) => {
      if (i == 0) y.push(["Date"]); // First loop prepend the Date header
      game.scores
        .sort((a, b) => (a.name > b.name ? 1 : -1)) // Sort so names in each game are same order
        .map((score, j) => {
          if (i == 0) y.push([score.name]); // First loop add the name headers
          y[j + 1].push(score.amount);
        });
      y[0].push(
        new Date(game.createdAt).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
      );
    });

    // Transpose before return
    return y[0].map((_, colIndex) => y.map((row) => row[colIndex]));
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
