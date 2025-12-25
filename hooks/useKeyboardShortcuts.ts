"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useKeyboardShortcuts() {
  const router = useRouter();

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // "/" to focus search (if available)
      if (event.key === "/") {
        event.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="text"][placeholder*="Search"], input[type="text"][placeholder*="search"]'
        );
        if (searchInput) {
          searchInput.focus();
        }
      }

      // "g" key starts navigation mode
      if (event.key === "g") {
        const handleNextKey = (nextEvent: KeyboardEvent) => {
          if (nextEvent.key === "s") {
            router.push("/");
          } else if (nextEvent.key === "p") {
            router.push("/picks");
          } else if (nextEvent.key === "a") {
            router.push("/alerts");
          } else if (nextEvent.key === "l") {
            router.push("/learn");
          }
          document.removeEventListener("keydown", handleNextKey);
        };

        document.addEventListener("keydown", handleNextKey);
        // Remove listener after 2 seconds if no second key is pressed
        setTimeout(() => {
          document.removeEventListener("keydown", handleNextKey);
        }, 2000);
      }

      // "?" to show keyboard shortcuts help
      if (event.key === "?" && event.shiftKey) {
        event.preventDefault();
        // TODO: Show keyboard shortcuts modal
        console.log("Keyboard shortcuts help");
      }
    },
    [router]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);
}

