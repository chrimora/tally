"use client";

import {
  GAME_STORE_KEY,
  GROUP_STORE_KEY,
  GameData,
  History,
  Storage,
} from "../../storage";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const query = useSearchParams();

  // Load ID required
  const id = query.get("id");
  if (!id) return <p>Whatcha doing?!</p>;

  const loadGroup = parseInt(id);
  new Storage<number>(GROUP_STORE_KEY).store(loadGroup);

  // Cannot load without history
  const history = History.get();
  if (!history) return <p>Whatcha doing?!</p>;

  // Collect names from group history
  let game: GameData = { scores: [] };
  history.groups[loadGroup].games[0].scores.map((score) => {
    game.scores.push({ name: score.name, amount: 0 });
  });

  new Storage<GameData>(GAME_STORE_KEY).store(game);

  router.push("/play/game");
}
