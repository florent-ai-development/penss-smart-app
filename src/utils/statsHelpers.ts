import type { AppEvent } from '../types';

// ─── Date range helpers ───────────────────────────────────────────────────────

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

// ─── French labels ────────────────────────────────────────────────────────────

const FR_DAYS_SHORT = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const FR_MONTHS_SHORT = [
  'jan.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];

// ─── groupEventsByPeriod ──────────────────────────────────────────────────────

export function groupEventsByPeriod(
  events: AppEvent[],
  period: 'week' | 'month' | 'year',
): { label: string; count: number }[] {
  const now = new Date();

  if (period === 'week') {
    const monday = startOfWeek(now);
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(monday, i);
      const count = events.filter(e => isSameDay(new Date(e.createdAt), day)).length;
      // Monday = index 1, so dayOfWeek for Monday is 1
      const dayOfWeek = (i + 1) % 7; // Mon=1..Sun=0, but we start from Monday
      // Just use day label from the actual date
      return { label: FR_DAYS_SHORT[day.getDay()], count };
    });
  }

  if (period === 'month') {
    const total = daysInMonth(now);
    return Array.from({ length: total }, (_, i) => {
      const day = new Date(now.getFullYear(), now.getMonth(), i + 1, 0, 0, 0, 0);
      const count = events.filter(e => isSameDay(new Date(e.createdAt), day)).length;
      return { label: String(i + 1), count };
    });
  }

  // year
  return Array.from({ length: 12 }, (_, i) => {
    const count = events.filter(e => {
      const d = new Date(e.createdAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === i;
    }).length;
    return { label: FR_MONTHS_SHORT[i], count };
  });
}

// ─── countEmotions ────────────────────────────────────────────────────────────

export function countEmotions(
  events: AppEvent[],
): { emotionId: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const event of events) {
    for (const emotion of event.emotions) {
      counts[emotion.emotionId] = (counts[emotion.emotionId] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([emotionId, count]) => ({ emotionId, count }))
    .sort((a, b) => b.count - a.count);
}
