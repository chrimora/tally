import { nanoid } from "nanoid";

type Game = {
  name: string;
  score: number;
};

export default class HistoryStore {
  static key = "history";

  static get(): { gameID: string; gameObj: [Game, Game] }[] {
    if (typeof window == "undefined") return [];

    let history = [];

    const data = localStorage.getItem(this.key);
    if (data) {
      history = JSON.parse(data);
    }
    return history;
  }

  static addGame(game: [Game, Game]) {
    let history = this.get();
    history.push({ gameID: nanoid(), gameObj: game });

    localStorage.setItem(this.key, JSON.stringify(history));
  }
}
