"use client";

import { useEffect } from "react";
import { History, HistoryData } from "../history";

export default function Page() {
  let history: HistoryData = { groups: [] };

  useEffect(() => {
    const h = History.get();
    if (h) {
      history = h;
    }
  }, []);

  return (
    <>
      <div className="mx-auto text-sm sm:text-lg">
        {history.groups.reverse().map((group, i) => (
          <div key={`${group.name}${i}`}>
            <table>
              {group.games.map((game, j) => (
                <tr>
                  {game.scores.map((score) => (
                    <td>{score.amount}</td>
                  ))}
                </tr>
              ))}
            </table>
          </div>
        ))}
      </div>
    </>
  );
}
