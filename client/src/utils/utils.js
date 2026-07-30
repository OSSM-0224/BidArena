import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";


export function cn(...inputs){
    return twMerge(clsx(inputs));
}

function formatDuration(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export default function useCountdown(targetTime) {
  const [msLeft, setMsLeft] = useState(() =>
    targetTime ? new Date(targetTime).getTime() - Date.now() : 0
  );
 
  useEffect(() => {
    if (!targetTime) return;
    const id = setInterval(() => {
      setMsLeft(new Date(targetTime).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [targetTime]);
 
  return { label: formatDuration(msLeft), isExpired: msLeft <= 0 };
}