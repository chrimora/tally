export default class HistoryStore {
  static key = "history";

  static get() {
    let history = JSON.parse(localStorage.getItem(this.key));
    if (!history) {
      history = [];
    }
    return history;
  }

  static set(obj) {
    localStorage.setItem(this.key, JSON.stringify(obj));
  }

  static addGame(game) {
    let history = this.get();
    history.push(game);
    this.set(history);
  }
}
