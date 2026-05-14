import { useState } from 'react'
import { format, addDays, subDays, isToday, parseISO, startOfWeek } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useWeeklySummary } from '@/hooks/useWeeklySummary'
import { ScoreCard } from '@/components/dashboard/ScoreCard'
import { CategoryRow } from '@/components/dashboard/CategoryRow'
import { HabitList } from '@/components/dashboard/HabitList'
import { WeeklyBarChart } from '@/components/dashboard/WeeklyBarChart'
import { SkeletonCard } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const dateStr = format(selectedDate, 'yyyy-MM-dd')
  const weekStart = format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd')

  const { data: dashboard, isLoading } = useDashboard(dateStr)
  const { data: weekly } = useWeeklySummary(weekStart)

  const prevDay = () => setSelectedDate((d) => subDays(d, 1))
  const nextDay = () => setSelectedDate((d) => addDays(d, 1))
  const goToday = () => setSelectedDate(new Date())
  const isTodaySelected = isToday(selectedDate)

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="flex items-center gap-3">
        <button onClick={prevDay} className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-all">
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-brand-gold" />
          <span className="font-semibold text-text tracking-wide">
            {isTodaySelected ? 'Today, ' : ''}{format(selectedDate, 'EEEE, MMMM d')}
          </span>
        </div>
        <button onClick={nextDay} className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-all">
          <ChevronRight size={18} />
        </button>
        {!isTodaySelected && (
          <Button variant="ghost" size="sm" onClick={goToday}>Today</Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard className="h-64" />
        </div>
      ) : dashboard ? (
        <>
          <ScoreCard score={dashboard.score} />
          <CategoryRow categories={dashboard.categories} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HabitList habits={dashboard.habits} date={dateStr} />
            </div>
            <div>
              {weekly && (
                <WeeklyBarChart
                  data={weekly}
                  selectedDate={dateStr}
                  onDayClick={(date) => setSelectedDate(parseISO(date))}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-text-subtle">
          <p>No data for this date.</p>
        </div>
      )}
    </div>
  )
}
