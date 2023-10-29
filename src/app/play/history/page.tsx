"use client";

import { useEffect, useState } from "react";
import { History, HistoryData } from "../storage";
import Link from "next/link";

export default function Page() {
  const [history, historySetter] = useState<HistoryData>({ groups: [] });

  useEffect(() => {
    const h = History.get();
    if (h) {
      historySetter(h);
    }
  }, []);

  return (
    <>
      <div className="mx-auto text-sm sm:text-lg">
        {history.groups.map((group, i) => (
          <div key={`${group.name}${i}`} className="flex">
            <table>
              <tbody>
                {Object.entries(History.transformGroup(group)).map(
                  ([name, amounts], k) => (
                    <tr key={name} className={k != 0 ? "border-t" : ""}>
                      <td className="border-r pr-4 mr-4">{name}</td>
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
            <Link
              href={`/play/game/load/${i}`}
              className="font-black text-5xl text-bgdim-light dark:text-bgdim-dark h-20 w-20 rounded-full active:border-2 hover:border-2 active:border-accent-light active:dark:border-accent-dark hover:border-accent-light hover:dark:border-accent-dark"
            >
              +
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
