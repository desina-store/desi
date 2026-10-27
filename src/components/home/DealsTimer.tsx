'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { pick } from '@/lib/brand-copy';

function endOfCurrentWeek(): Date {
  const now = new Date();
  const target = new Date(now);
  const daysUntilSunday = (7 - now.getDay()) % 7;
  target.setDate(now.getDate() + daysUntilSunday);
  target.setHours(23, 59, 59, 999);
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 7);
  return target;
}

const pad = (value: number) => String(value).padStart(2, '0');

export function DealsTimer({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const { lang } = useLanguage();
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = endOfCurrentWeek().getTime();
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const days = remaining ? Math.floor(remaining / 86400000) : 0;
  const hours = remaining ? Math.floor((remaining / 3600000) % 24) : 0;
  const minutes = remaining ? Math.floor((remaining / 60000) % 60) : 0;
  const seconds = remaining ? Math.floor((remaining / 1000) % 60) : 0;

  return (
    <span className={`deals-timer${variant === 'light' ? ' deals-timer--light' : ''}`}>
      <Clock aria-hidden="true" />
      {remaining === null
        ? pick(lang, 'Ends soon', 'ينتهي قريباً')
        : `${pick(lang, 'Ends in', 'ينتهي خلال')}${days > 0 ? ` ${days}d` : ''} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`}
    </span>
  );
}
