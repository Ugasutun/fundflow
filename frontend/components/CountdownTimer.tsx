'use client';

import { useEffect, useState } from 'react';

function formatCountdown(deadline: number, now: number) {
  const remainingMs = new Date(deadline * 1000).getTime() - now;

  if (remainingMs <= 0) {
    return { text: 'Deadline passed', urgent: true };
  }

  const totalMinutes = Math.floor(remainingMs / 60_000);
  const days = Math.floor(totalMinutes / 1_440);
  const hours = Math.floor((totalMinutes % 1_440) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (parts.length === 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);

  return {
    text: `${parts.join(' ')} remaining`,
    urgent: remainingMs <= 24 * 60 * 60 * 1000,
  };
}

export function CountdownTimer({ deadline }: { deadline: number }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, [deadline]);

  const { text, urgent } = formatCountdown(deadline, now);

  return (
    <span className={`font-mono text-xs ${urgent ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
      {text}
    </span>
  );
}
