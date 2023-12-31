"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/tally/sw.js", {
          scope: "/tally/",
        });
      } catch (error) {
        console.error(`Registration failed with ${error}`);
      }
    }
  };

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return <></>;
}
