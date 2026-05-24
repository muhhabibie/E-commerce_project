"use client";

import { useEffect, useState } from "react";

const ONE_SECOND = 1000;
const ONE_DAY_SECONDS = 24 * 60 * 60;

export function useCountdown(initialSeconds: number = ONE_DAY_SECONDS) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, ONE_SECOND);

    return () => clearInterval(id);
  }, [secondsLeft]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const label = `${hours} jam ${minutes} menit ${seconds} detik`;

  return { secondsLeft, hours, minutes, seconds, label };
}
