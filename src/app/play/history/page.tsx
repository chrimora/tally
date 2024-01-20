"use client";

import { useEffect, useState } from "react";
import {
  Storage,
  StorageErrorComponent,
  History,
  HistoryData,
  GameData,
  GROUP_STORE_KEY,
  GAME_STORE_KEY,
} from "../storage";
import { withErrorBoundary, useErrorBoundary } from "react-error-boundary";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

function HistoryPage() {
  const router = useRouter();
  const { showBoundary } = useErrorBoundary();

  const [history, historySetter] = useState<HistoryData>({
    version: "",
    groups: [],
  });

  useEffect(() => {
    let h;

    try {
      h = History.get();
    } catch (error) {
      showBoundary(error);
    }

    if (h) {
      historySetter(h);
    }
  }, []);

  function new_game() {
    new Storage<GameData>(GAME_STORE_KEY).wipe();
    new Storage<number>(GROUP_STORE_KEY).wipe();
    router.push(`/play/game`);
  }

  function update(i: number, group_name: string) {
    let new_history = { ...history };
    new_history.groups[i].name = group_name;

    historySetter(new_history);
    new Storage<HistoryData>(History.key).store(history);
  }

  function delete_group(i: number) {
    if (confirm("Are you sure you want delete this game group?")) {
      let new_history = { ...history };
      new_history.groups.splice(i, 1);

      historySetter(new_history);
      new Storage<HistoryData>(History.key).store(history);

      // index will have changed - wipe current game to avoid issues
      new Storage<GameData>(GAME_STORE_KEY).wipe();
      new Storage<number>(GROUP_STORE_KEY).wipe();
    }
  }

  return (
    <>
      <div className="mx-auto text-sm sm:text-lg">
        {history.groups.length == 0 ? (
          <p>No games yet. Go play!</p>
        ) : (
          history.groups.map((group, i) => (
            <div key={i}>
              <div className="flex flex-row items-center">
                <input
                  type="text"
                  onChange={(e) => update(i, e.target.value)}
                  value={group.name}
                  className="w-full appearance-none outline-none bg-bgdim-light dark:bg-bgdim-dark py-2 rounded-xl text-center"
                />
                <button onClick={() => delete_group(i)}>
                  <FontAwesomeIcon icon={faTrashCan} className="p-2 text-2xl" />
                </button>
                <Link href={`/play/game/load?id=${i}`}>
                  <FontAwesomeIcon icon={faPlus} className="p-2 text-2xl" />
                </Link>
              </div>
              <div className="py-6">
                <table>
                  <tbody>
                    {History.transformGroup(group).map((row, j) => (
                      <tr key={j}>
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className={`px-2
                            ${k != 0 ? "border-l" : ""}
                            ${j == 0 ? "border-b" : ""}
                            ${j == group.games.length ? "border-b" : ""}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
        <button
          className="p-4 mx-2 my-10 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
          onClick={() => new_game()}
        >
          New Game
        </button>
      </div>
      <p className="text-xs">
        All data is stored on your device so don&apos;t lose it!
      </p>
    </>
  );
}

const HistoryWithErrorBoundary = withErrorBoundary(HistoryPage, {
  FallbackComponent: StorageErrorComponent,
});

export default function Page() {
  return <HistoryWithErrorBoundary />;
}
