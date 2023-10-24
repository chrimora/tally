"use client";

import { useEffect, useState } from "react";
import { History, HistoryData } from "../history";

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
        {history.groups.reverse().map((group, i) => (
          <div key={`${group.name}${i}`}>
            <br />
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
                  )
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </>
  );
}
