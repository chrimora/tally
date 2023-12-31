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

  function update(i: number, group_name: string) {
    let new_history = { ...history };
    new_history.groups[i].name = group_name;

    historySetter(new_history);
    new Storage<HistoryData>(History.key).store(history);
  }

  function new_game() {
    new Storage<GameData>(GAME_STORE_KEY).wipe();
    new Storage<number>(GROUP_STORE_KEY).wipe();
    router.push(`/play/game`);
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
                <div className="flex-none">
                  <Link
                    href={`/play/game/load?id=${i}`}
                    className="
              relative inline-block
              h-10 w-10 m-1 align-middle rounded-full active:border-2 hover:border-2
              active:border-accent-light dark:active:border-accent-dark hover:border-accent-light dark:hover:border-accent-dark
              before:bg-bgdim-light after:bg-bgdim-light dark:before:bg-bgdim-dark dark:after:bg-bgdim-dark
              before:absolute after:absolute
              before:top-0 after:top-0 before:bottom-0 after:bottom-0 before:left-0 after:left-0 before:right-0 after:right-0
              before:content-[''] after:content-['']
              before:w-1 before:my-2 before:mx-auto
              after:h-1 after:my-auto after:mx-2
              "
                  ></Link>
                </div>
              </div>
              <div className="py-6">
                <table>
                  <tbody>
                    {History.transformGroup(group).map((row, j) => (
                      <tr key={j}>
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className={k != 0 ? "px-2 border-l" : "px-2"}
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
