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

  function reset() {
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
            <div key={`${i}`}>
              <input
                type="text"
                onChange={(e) => update(i, e.target.value)}
                value={group.name}
                className="w-full appearance-none outline-none bg-bgdim-light dark:bg-bgdim-dark py-2 rounded-xl text-center"
              />
              <div className="flex flex-row items-center mb-6">
                <div className="grow">
                  <table>
                    <tbody>
                      {Object.entries(History.transformGroup(group)).map(
                        ([name, amounts], k) => (
                          <tr key={name} className={k != 0 ? "border-t" : ""}>
                            <td className="w-40 truncate border-r pr-4 text-right">
                              {name}
                            </td>
                            <td className="pr-4"></td>
                            {amounts.map((amount, j) => (
                              <td key={j} className="w-8 text-left">
                                {amount}
                              </td>
                            ))}
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
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
              <br />
            </div>
          ))
        )}
        <button
          className="p-4 mx-2 mt-20 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
          onClick={() => reset()}
        >
          New Game
        </button>
      </div>
    </>
  );
}

const HistoryWithErrorBoundary = withErrorBoundary(HistoryPage, {
  FallbackComponent: StorageErrorComponent,
});

export default function Page() {
  return <HistoryWithErrorBoundary />;
}
