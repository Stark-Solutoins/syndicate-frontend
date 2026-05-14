export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  date_joined: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user: User
}

export interface Category {
  id: number
  name: string
  color: string
  order: number
  habit_count: number
}

export interface Habit {
  id: number
  slug: string
  label: string
  category: number
  category_name: string
  category_color: string
  time: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DashboardHabit extends Habit {
  completed: boolean
}

export interface HabitCompletion {
  id: number
  habit: number
  habit_slug: string
  habit_label: string
  habit_category: string
  habit_category_color: string
  date: string
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type RankLabel = 'Don Status' | 'Made Man' | 'Associate' | 'Back to Work'

export interface Rank {
  label: RankLabel
  color: string
}

export interface DayScore {
  date: string
  done: number
  total: number
  percentage: number
  rank: Rank
}

export interface DashboardCategory {
  name: string
  color: string
  done: number
  total: number
  percentage: number
}

export interface DailyDashboard {
  date: string
  score: DayScore
  categories: DashboardCategory[]
  habits: DashboardHabit[]
}

export interface WeekDay {
  day_index: number
  day_name: string
  day_short: string
  date: string
  is_today: boolean
  done: number
  total: number
  percentage: number
}

export interface WeeklySummary {
  week_start: string
  days: WeekDay[]
}

export interface CategoryBreakdown {
  date: string
  categories: DashboardCategory[]
}
