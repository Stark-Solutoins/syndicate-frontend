import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { RankLabel } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercent(n: number) {
  return `${Math.round(n)}%`
}

export function getRankMessage(label: RankLabel): string {
  const messages: Record<RankLabel, string> = {
    'Don Status': 'Respect. The don runs his empire.',
    'Made Man': "Solid. You've earned your place.",
    'Associate': "Close. Don't let the family down.",
    'Back to Work': 'Disappointing. Get back in line.',
  }
  return messages[label]
}

export function recalculateScore(habits: Array<{ id: number; completed: boolean }>, toggledId: number) {
  const updated = habits.map((h) => (h.id === toggledId ? { ...h, completed: !h.completed } : h))
  const done = updated.filter((h) => h.completed).length
  const total = updated.length
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0
  const rank = percentageToRank(percentage)
  return { done, total, percentage, rank }
}

export function percentageToRank(pct: number): { label: RankLabel; color: string } {
  if (pct >= 90) return { label: 'Don Status', color: '#C9A84C' }
  if (pct >= 75) return { label: 'Made Man', color: '#2563a8' }
  if (pct >= 60) return { label: 'Associate', color: '#1e8c5a' }
  return { label: 'Back to Work', color: '#c0392b' }
}
