import { CircularProgress } from '@/components/ui/CircularProgress'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { getRankMessage } from '@/lib/utils'
import type { DayScore } from '@/types'

interface ScoreCardProps { score: DayScore }

export function ScoreCard({ score }: ScoreCardProps) {
  return (
    <Card className="flex flex-col sm:flex-row items-center gap-6">
      <CircularProgress percentage={score.percentage} color={score.rank.color} size={140}>
        <div className="text-center">
          <p className="text-3xl font-black text-text tabular-nums">{score.percentage}%</p>
          <p className="text-xs text-text-muted">{score.done}/{score.total}</p>
        </div>
      </CircularProgress>

      <div className="flex-1 text-center sm:text-left">
        <p className="text-xs uppercase tracking-widest text-text-muted mb-2">Today's Status</p>
        <Badge label={score.rank.label} color={score.rank.color} className="mb-3" />
        <p className="text-sm text-text-muted italic mt-2">{getRankMessage(score.rank.label)}</p>
        <p className="text-text-subtle text-xs mt-3">
          {score.total - score.done} habit{score.total - score.done !== 1 ? 's' : ''} remaining
        </p>
      </div>
    </Card>
  )
}
