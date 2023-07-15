"use client";

export default function Game() {
  function wipeStorage() {
    if (
      confirm(
        "This will reset all game data, there is no backup. Do you want to continue?",
      )
    ) {
      localStorage.clear();
    }
  }

  return (
    <>
      TODO; Read history from local store
      <br />
      <br />
      <button
        className="p-4 m-8 border-2 border-accent-light dark:border-accent-dark active:bg-accent-light active:dark:bg-accent-dark hover:bg-accent-light hover:dark:bg-accent-dark"
        onClick={wipeStorage}
      >
        Reset
      </button>
    </>
  );
}
