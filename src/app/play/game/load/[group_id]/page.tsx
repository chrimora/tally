"use client";

import {
  GAME_STORE_KEY,
  GROUP_STORE_KEY,
  GameData,
  History,
  Storage,
} from "../../../storage";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { group_id: number } }) {
  const loadGroup = params.group_id;
  const router = useRouter();

  new Storage<number>(GROUP_STORE_KEY).store(loadGroup);

  const history = History.get();
  if (!history) {
    return <p>Whatcha doing?!</p>;
  }

  // Collect names from group history
  let game: GameData = { scores: [] };
  history.groups[loadGroup].games[0].scores.map((score) => {
    game.scores.push({ name: score.name, amount: 0 });
  });

  new Storage<GameData>(GAME_STORE_KEY).store(game);

  router.push("/play/game");
  return;
}
