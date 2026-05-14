# The Syndicate Protocol — Frontend Specification

> Pass this entire document to Claude in a new React project repo and say: **"Build the complete React frontend based on this specification."**

---

## 1. PRODUCT OVERVIEW

**The Syndicate Protocol** is a premium, mob-themed daily habit tracker SaaS. Users track a fixed set of daily habits (seeded from the backend), mark them complete, and earn ranks based on their completion rate.

### Brand Identity

- **Theme:** "The Mob" / Mafia culture — discipline, hierarchy, loyalty
- **Tone:** Dark, premium, masculine. Think: a don reviewing his day's work
- **Color Palette:**
  - Gold (Don Status): `#C9A84C`
  - Dark Green (Associate): `#1e8c5a`
  - Blue (Made Man): `#2563a8`
  - Red (Back to Work): `#c0392b`
  - Purple (Growth): `#9b59b6`
  - Background: near-black `#0D0D0D` or dark slate `#111827`
  - Surface cards: `#1a1a2e` or `#1F2937`
  - Text: off-white `#F9FAFB`, muted `#9CA3AF`
  - Border: `rgba(255,255,255,0.08)`

### Ranking Tiers

| Rank | Threshold | Color |
|------|-----------|-------|
| Don Status | ≥ 90% | `#C9A84C` (Gold) |
| Made Man | ≥ 75% | `#2563a8` (Blue) |
| Associate | ≥ 60% | `#1e8c5a` (Green) |
| Back to Work | < 60% | `#c0392b` (Red) |

---

## 2. TECH STACK

```
React 18+             (Vite or CRA)
TypeScript            (strict mode)
TailwindCSS           (utility-first styling)
React Query (TanStack) (server state, caching, mutations)
Zustand               (lightweight client state — auth tokens, UI)
React Router v6       (client-side routing)
Axios                 (HTTP client with interceptors for JWT refresh)
date-fns              (date manipulation)
Recharts              (charts — bar chart for weekly, ring for categories)
React Hot Toast       (notifications)
Lucide React          (icons)
```

---

## 3. ENVIRONMENT CONFIG

Create a `.env` at the project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 4. API INTEGRATION

### 4.1 Base Axios Client

```typescript
// src/lib/axios.ts
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`,
          { refresh: refreshToken }
        );
        useAuthStore.getState().setTokens(data.access, data.refresh ?? refreshToken);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 4.2 Auth Store (Zustand)

```typescript
// src/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
      setUser: (user) => set({ user }),
      logout: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "syndicate-auth",
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        user: state.user,
        // Do NOT persist accessToken — fetch fresh on load
      }),
    }
  )
);
```

---

## 5. ALL API ENDPOINTS

**Base URL:** `http://localhost:8000/api/v1`

All protected endpoints require:
```
Authorization: Bearer <access_token>
```

---

### 5.1 Authentication

#### Register
```
POST /auth/register/
Auth: None

Body:
{
  "username": "tony_soprano",
  "email": "tony@soprano.com",
  "password": "password123",
  "password_confirm": "password123"
}

Response 201:
{
  "access": "<jwt_access_token>",
  "refresh": "<jwt_refresh_token>",
  "user": {
    "id": 1,
    "username": "tony_soprano",
    "email": "tony@soprano.com",
    "first_name": "",
    "last_name": "",
    "date_joined": "2026-05-14T10:00:00Z"
  }
}
```

#### Login
```
POST /auth/login/
Auth: None

Body:
{
  "email": "tony@soprano.com",
  "password": "password123"
}

Response 200:
{
  "access": "<jwt_access_token>",
  "refresh": "<jwt_refresh_token>",
  "user": { ...UserSerializer }
}
```

#### Refresh Token
```
POST /auth/token/refresh/
Auth: None

Body:
{
  "refresh": "<jwt_refresh_token>"
}

Response 200:
{
  "access": "<new_access_token>",
  "refresh": "<new_refresh_token>"   // token rotation — store this new refresh token
}
```

#### Logout
```
POST /auth/logout/
Auth: Bearer

Body:
{
  "refresh": "<jwt_refresh_token>"
}

Response 204: (no content)
```

#### Get Current User
```
GET /auth/me/
Auth: Bearer

Response 200:
{
  "id": 1,
  "username": "tony_soprano",
  "email": "tony@soprano.com",
  "first_name": "Tony",
  "last_name": "Soprano",
  "date_joined": "2026-05-14T10:00:00Z"
}
```

#### Update Profile
```
PATCH /auth/me/update/
Auth: Bearer

Body (all optional):
{
  "username": "new_name",
  "first_name": "Tony",
  "last_name": "Soprano"
}

Response 200: { ...UserSerializer }
```

---

### 5.2 Categories

#### List Categories
```
GET /categories/
Auth: Bearer

Response 200:
[
  {
    "id": 1,
    "name": "Morning",
    "color": "#C9A84C",
    "order": 1,
    "habit_count": 6
  },
  {
    "id": 2,
    "name": "Prayer",
    "color": "#1e8c5a",
    "order": 2,
    "habit_count": 5
  },
  {
    "id": 3,
    "name": "Work",
    "color": "#2563a8",
    "order": 3,
    "habit_count": 3
  },
  {
    "id": 4,
    "name": "Growth",
    "color": "#9b59b6",
    "order": 4,
    "habit_count": 3
  },
  {
    "id": 5,
    "name": "Personal",
    "color": "#c0392b",
    "order": 5,
    "habit_count": 5
  }
]
```

#### Create Category
```
POST /categories/
Auth: Bearer
Body: { "name": str, "color": str (hex), "order": int }
Response 201: { ...CategorySerializer }
```

#### Update Category
```
PATCH /categories/{id}/
Auth: Bearer
Body: { "name"?, "color"?, "order"? }
Response 200: { ...CategorySerializer }
```

#### Delete Category
```
DELETE /categories/{id}/
Auth: Bearer
Response 204: (no content)
```

---

### 5.3 Habits

#### List Habits
```
GET /habits/
Auth: Bearer
Query: ?is_active=true&category=1&search=fajr&ordering=order

Response 200:
[
  {
    "id": 1,
    "slug": "fajr",
    "label": "Fajr prayer",
    "category": 2,
    "category_name": "Prayer",
    "category_color": "#1e8c5a",
    "time": "5:15 AM",
    "order": 1,
    "is_active": true,
    "created_at": "2026-05-14T10:00:00Z",
    "updated_at": "2026-05-14T10:00:00Z"
  },
  ...
]
```

#### Seed Default Habits (Call Once on First Login)
```
POST /habits/seed/
Auth: Bearer
Body: (none)

Response 201: [ ...newly created HabitSerializer items ]
Note: Safe to call multiple times (idempotent). Call this after first registration.
```

#### Create Habit
```
POST /habits/
Auth: Bearer
Body:
{
  "slug": "new_habit",
  "label": "New Habit Name",
  "category": 1,
  "time": "7:00 AM",
  "order": 10,
  "is_active": true
}
Response 201: { ...HabitSerializer }
```

#### Update Habit
```
PATCH /habits/{id}/
Auth: Bearer
Body: { any HabitSerializer fields }
Response 200: { ...HabitSerializer }
```

#### Delete Habit
```
DELETE /habits/{id}/
Auth: Bearer
Response 204
```

---

### 5.4 Completions

#### List Completions
```
GET /completions/
Auth: Bearer
Query: ?date=2026-05-14&habit=1&completed=true&date_from=2026-05-01&date_to=2026-05-14

Response 200:
[
  {
    "id": 42,
    "habit": 1,
    "habit_slug": "fajr",
    "habit_label": "Fajr prayer",
    "habit_category": "Prayer",
    "habit_category_color": "#1e8c5a",
    "date": "2026-05-14",
    "completed": true,
    "completed_at": "2026-05-14T05:23:00Z",
    "created_at": "2026-05-14T05:23:00Z",
    "updated_at": "2026-05-14T05:23:00Z"
  }
]
```

#### Toggle Habit Completion (PRIMARY INTERACTION)
```
POST /completions/toggle/
Auth: Bearer

Body:
{
  "habit": 1,
  "date": "2026-05-14"
}

Response 200:
{
  "id": 42,
  "habit": 1,
  "habit_slug": "fajr",
  "habit_label": "Fajr prayer",
  "habit_category": "Prayer",
  "habit_category_color": "#1e8c5a",
  "date": "2026-05-14",
  "completed": true,             // flipped from previous state
  "completed_at": "2026-05-14T05:23:00Z",
  "created_at": "...",
  "updated_at": "..."
}
```

#### Day Score
```
GET /completions/day-score/
Auth: Bearer
Query: ?date=2026-05-14 (optional, defaults to today)

Response 200:
{
  "date": "2026-05-14",
  "done": 15,
  "total": 22,
  "percentage": 68,
  "rank": {
    "label": "Associate",
    "color": "#1e8c5a"
  }
}
```

---

### 5.5 Analytics

#### Weekly Summary (Bar Chart Data)
```
GET /analytics/weekly-summary/
Auth: Bearer
Query: ?week_start=2026-05-12 (optional, defaults to current week Monday)

Response 200:
{
  "week_start": "2026-05-12",
  "days": [
    {
      "day_index": 0,
      "day_name": "Monday",
      "day_short": "Mon",
      "date": "2026-05-12",
      "is_today": false,
      "done": 18,
      "total": 22,
      "percentage": 82
    },
    {
      "day_index": 1,
      "day_name": "Tuesday",
      "day_short": "Tue",
      "date": "2026-05-13",
      "is_today": false,
      "done": 20,
      "total": 22,
      "percentage": 91
    },
    {
      "day_index": 2,
      "day_name": "Wednesday",
      "day_short": "Wed",
      "date": "2026-05-14",
      "is_today": true,
      "done": 15,
      "total": 22,
      "percentage": 68
    },
    // ... days for Thu, Fri, Sat, Sun
  ]
}
```

#### Category Breakdown (Ring/Donut Chart)
```
GET /analytics/category-breakdown/
Auth: Bearer
Query: ?date=2026-05-14 (optional, defaults to today)

Response 200:
{
  "date": "2026-05-14",
  "categories": [
    {
      "name": "Morning",
      "color": "#C9A84C",
      "done": 4,
      "total": 6,
      "percentage": 67
    },
    {
      "name": "Prayer",
      "color": "#1e8c5a",
      "done": 5,
      "total": 5,
      "percentage": 100
    },
    {
      "name": "Work",
      "color": "#2563a8",
      "done": 2,
      "total": 3,
      "percentage": 67
    },
    {
      "name": "Growth",
      "color": "#9b59b6",
      "done": 2,
      "total": 3,
      "percentage": 67
    },
    {
      "name": "Personal",
      "color": "#c0392b",
      "done": 2,
      "total": 5,
      "percentage": 40
    }
  ]
}
```

#### Daily Dashboard (Full Page Data — USE THIS AS THE MAIN DASHBOARD CALL)
```
GET /analytics/daily-dashboard/
Auth: Bearer
Query: ?date=2026-05-14 (optional, defaults to today)

Response 200:
{
  "date": "2026-05-14",
  "score": {
    "done": 15,
    "total": 22,
    "percentage": 68,
    "rank": {
      "label": "Associate",
      "color": "#1e8c5a"
    }
  },
  "categories": [
    {
      "name": "Morning",
      "color": "#C9A84C",
      "done": 4,
      "total": 6,
      "percentage": 67
    }
    // ... all 5 categories
  ],
  "habits": [
    {
      "id": 1,
      "slug": "wakeup",
      "label": "Wake up at 5:00 AM",
      "category": 1,
      "category_name": "Morning",
      "category_color": "#C9A84C",
      "time": "5:00 AM",
      "order": 1,
      "is_active": true,
      "created_at": "...",
      "updated_at": "...",
      "completed": true    // <-- KEY: completion status injected per habit
    },
    // ... all 22 habits
  ]
}
```

---

## 6. PAGES & ROUTING

```
/                   → redirect to /dashboard if authenticated, else /login
/login              → Login page (public)
/register           → Register page (public)
/dashboard          → Daily Dashboard (protected)
/analytics          → Analytics/Progress page (protected)
/habits             → Habit management page (protected)
/settings           → User settings (protected)
```

---

## 7. PAGE DESIGNS

### 7.1 Login Page (`/login`)

**Layout:** Full-screen, centered card on dark background

**Elements:**
- App logo/wordmark: "THE SYNDICATE PROTOCOL" in caps, gold color, serif-style or monospace
- Tagline: *"Discipline is the real don."*
- Email input
- Password input
- "Sign In" button (gold/amber gradient)
- Link: "Don't have an account? → Register"
- Error toast on failed login

**On success:**
1. Store `access` token in memory (Zustand)
2. Store `refresh` token in localStorage (via Zustand persist)
3. Store `user` object
4. Redirect to `/dashboard`

---

### 7.2 Register Page (`/register`)

**Layout:** Same as login page

**Elements:**
- Username, Email, Password, Confirm Password fields
- "Create Account" button
- Link: "Already a member? → Sign In"
- Validation: passwords must match, email format

**On success:**
1. Store tokens + user (same as login)
2. Call `POST /habits/seed/` to initialize the user's habits
3. Redirect to `/dashboard`

---

### 7.3 Dashboard Page (`/dashboard`) — MAIN PAGE

**Data source:** `GET /analytics/daily-dashboard/?date=YYYY-MM-DD`
**Additional data:** `GET /analytics/weekly-summary/`

**Layout:** Sidebar + main content area

```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR (left, fixed, 240px)    │  MAIN CONTENT            │
│  ─────────────────────────────   │  ─────────────────────── │
│  Logo: "THE SYNDICATE"           │  [Date Navigation Bar]   │
│                                  │                           │
│  Nav Items:                      │  [Score Card]             │
│  📊 Dashboard  ← active          │                           │
│  📈 Analytics                    │  [Category Progress Bar]  │
│  ⚙️  Habits                      │                           │
│  👤 Settings                     │  [Habit List]             │
│                                  │                           │
│  ─────────────────────────────   │  [Weekly Bar Chart]       │
│  User card at bottom             │                           │
│  [Avatar] Tony S.                │                           │
│  [Logout]                        │                           │
└─────────────────────────────────────────────────────────────┘
```

#### Date Navigation Bar
- Previous day `<` button | "Today, Wednesday May 14" | Next day `>` button
- "Today" jump button if not on today
- Clicking a day in the weekly chart navigates to that date

#### Score Card
```
┌────────────────────────────────────────┐
│  TODAY'S STATUS                        │
│                                        │
│  [Circular progress ring, large]       │
│       68%                              │
│   15 of 22 habits                      │
│                                        │
│  Rank: [colored badge] ASSOCIATE       │
│  "Keep pushing, you're close."         │
└────────────────────────────────────────┘
```

Dynamic message by rank:
- Don Status: *"Respect. The don runs his empire."*
- Made Man: *"Solid. You've earned your place."*
- Associate: *"Close. Don't let the family down."*
- Back to Work: *"Disappointing. Get back in line."*

#### Category Progress Section
- Horizontal list of category cards
- Each card: category name, color dot, `done/total`, mini progress bar

```
[Morning ████░░ 4/6]  [Prayer ████████ 5/5]  [Work ██████░ 2/3]
```

#### Habit List
- Grouped by category (Morning, Prayer, Work, Growth, Personal)
- Each habit row:
  ```
  [✓ checkbox] Fajr prayer          5:15 AM   [timestamp if done]
  ```
- Checkbox click → `POST /completions/toggle/` → optimistic update
- Completed habits: dimmed text, strike-through or checkmark
- Category header shows colored bar + category name + `4/6`
- Animate checkbox with a satisfying "check" animation on completion

#### Weekly Bar Chart (Bottom or Side)
- 7 bars for Mon–Sun
- Bar height = percentage completed
- Color: rank color for that day's percentage
- Current day: highlighted/glowing
- Clicking a bar navigates the date view to that day
- Data from `GET /analytics/weekly-summary/`

---

### 7.4 Analytics Page (`/analytics`)

**Data sources:**
- `GET /analytics/weekly-summary/`
- `GET /analytics/category-breakdown/`

**Layout:** Grid of cards

```
┌───────────────────────────────────────────────────────┐
│  WEEKLY PERFORMANCE                                   │
│  [Full-width bar chart, 7 days, percentage bars]      │
│  Navigation: < Week 19 (May 12-18) >                  │
└───────────────────────────────────────────────────────┘

┌─────────────────────────┐  ┌──────────────────────────┐
│  CATEGORY BREAKDOWN     │  │  RANK DISTRIBUTION        │
│  [Donut/Pie chart]      │  │  [Stacked bar or list]    │
│  Morning  ████░░ 67%    │  │  Don Status: X days       │
│  Prayer   ████████ 100% │  │  Made Man:   X days       │
│  Work     ██████░ 67%   │  │  Associate:  X days       │
│  Growth   ██████░ 67%   │  │  Back to Work: X days     │
│  Personal ████░░░░ 40%  │  │                           │
└─────────────────────────┘  └──────────────────────────┘

┌───────────────────────────────────────────────────────┐
│  BEST PERFORMING CATEGORIES                            │
│  [Sorted list of categories by % this week]           │
└───────────────────────────────────────────────────────┘
```

**Controls:**
- Date picker / week navigator for weekly chart
- Date picker for category breakdown

---

### 7.5 Habits Management Page (`/habits`)

**Data sources:**
- `GET /habits/`
- `GET /categories/`

**Layout:** Table with filters + inline editing

```
┌──────────────────────────────────────────────────────────┐
│  HABITS MANAGEMENT                          [+ New Habit] │
│                                                           │
│  Filter: [All Categories ▼]  [Active Only ☑]             │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Label          │ Category │ Time     │ Status │ ... │  │
│  ├────────────────────────────────────────────────────┤  │
│  │ Fajr prayer    │ Prayer   │ 5:15 AM  │ ● Active│ ⋮ │  │
│  │ Wake up 5 AM   │ Morning  │ 5:00 AM  │ ● Active│ ⋮ │  │
│  │ Deep Work #1   │ Work     │ 9:00 AM  │ ● Active│ ⋮ │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  [Seed Defaults] button → POST /habits/seed/              │
└──────────────────────────────────────────────────────────┘
```

**Actions per habit (via `⋮` menu):**
- Edit (slide-out drawer or inline)
- Toggle active/inactive
- Delete (confirm dialog)

**Create/Edit Modal:**
- Label field
- Category dropdown
- Time field
- Order number
- Active toggle

---

### 7.6 Settings Page (`/settings`)

**Data source:** `GET /auth/me/`

**Layout:** Stacked settings sections

```
┌────────────────────────────────────────┐
│  PROFILE                               │
│  First Name: [input]                   │
│  Last Name:  [input]                   │
│  Username:   [input]                   │
│  Email:      tony@soprano.com (static) │
│  [Save Changes]                        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  ACCOUNT                               │
│  Member since: May 14, 2026            │
│  [Logout] (red/danger button)          │
└────────────────────────────────────────┘
```

---

## 8. COMPONENT STRUCTURE

```
src/
├── main.tsx
├── App.tsx                      # Router setup, QueryClientProvider
│
├── stores/
│   └── authStore.ts             # Zustand: tokens, user, setTokens, logout
│
├── lib/
│   ├── axios.ts                 # Axios instance with JWT interceptors
│   └── utils.ts                 # cn(), formatDate(), formatPercent()
│
├── hooks/                       # React Query hooks (one per resource)
│   ├── useAuth.ts               # login, register, logout, me mutations/queries
│   ├── useDashboard.ts          # daily-dashboard query
│   ├── useWeeklySummary.ts      # weekly-summary query
│   ├── useCategoryBreakdown.ts  # category-breakdown query
│   ├── useHabits.ts             # habits CRUD queries
│   ├── useCategories.ts         # categories CRUD queries
│   └── useToggle.ts             # toggle completion mutation
│
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── HabitsPage.tsx
│   └── SettingsPage.tsx
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx        # Sidebar + main content wrapper
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   └── TopBar.tsx           # Date navigation bar
│   │
│   ├── dashboard/
│   │   ├── ScoreCard.tsx        # Circular progress + rank badge
│   │   ├── CategoryRow.tsx      # Horizontal category progress bars
│   │   ├── HabitList.tsx        # Full habit list grouped by category
│   │   ├── HabitItem.tsx        # Single habit row with checkbox
│   │   └── WeeklyBarChart.tsx   # Bar chart (Recharts)
│   │
│   ├── analytics/
│   │   ├── WeeklyChart.tsx      # Full weekly bar chart with navigation
│   │   └── CategoryDonut.tsx    # Donut chart (Recharts PieChart)
│   │
│   ├── habits/
│   │   ├── HabitTable.tsx
│   │   ├── HabitModal.tsx       # Create/edit modal
│   │   └── HabitFilters.tsx
│   │
│   └── ui/                      # Reusable primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Badge.tsx            # Rank badge with color
│       ├── ProgressBar.tsx
│       ├── CircularProgress.tsx
│       ├── Modal.tsx
│       ├── Checkbox.tsx         # Animated habit checkbox
│       └── LoadingSpinner.tsx
```

---

## 9. KEY IMPLEMENTATION DETAILS

### 9.1 JWT Token Flow

```
1. User logs in → GET back {access, refresh, user}
2. Store access token in Zustand memory state (not localStorage — security)
3. Store refresh token in Zustand persisted state (localStorage)
4. Every API request: Axios interceptor adds Authorization: Bearer <access>
5. On 401: Axios interceptor calls POST /auth/token/refresh/ with stored refresh
6. On success: update both tokens, retry original request
7. On refresh failure: call logout(), redirect to /login
8. On logout: call POST /auth/logout/ with refresh token, clear all state
```

### 9.2 Optimistic Updates for Habit Toggle

The toggle endpoint is the core interaction. Make it feel instant:

```typescript
// In useToggle.ts
const toggleMutation = useMutation({
  mutationFn: ({ habitId, date }: { habitId: number; date: string }) =>
    api.post("/completions/toggle/", { habit: habitId, date }),

  onMutate: async ({ habitId, date }) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["dashboard", date] });

    // Snapshot current state
    const previous = queryClient.getQueryData(["dashboard", date]);

    // Optimistically update the cache
    queryClient.setQueryData(["dashboard", date], (old: DashboardData) => ({
      ...old,
      habits: old.habits.map((h) =>
        h.id === habitId ? { ...h, completed: !h.completed } : h
      ),
      score: recalculateScore(old.habits, habitId),
    }));

    return { previous };
  },

  onError: (_err, { date }, context) => {
    // Rollback on error
    queryClient.setQueryData(["dashboard", date], context?.previous);
    toast.error("Failed to update habit");
  },

  onSettled: (_data, _err, { date }) => {
    // Always refetch to sync with server
    queryClient.invalidateQueries({ queryKey: ["dashboard", date] });
  },
});
```

### 9.3 Seeding on First Register

After successful registration, call seed to initialize habits:

```typescript
// In RegisterPage.tsx
const onSubmit = async (data) => {
  const { access, refresh, user } = await authService.register(data);
  setTokens(access, refresh);
  setUser(user);

  // Seed default habits for this user
  try {
    await api.post("/habits/seed/");
  } catch {
    // Non-fatal — habits can be seeded later
  }

  navigate("/dashboard");
};
```

### 9.4 Date Navigation

Use `date-fns` for date manipulation:

```typescript
import { format, addDays, subDays, startOfWeek, isToday } from "date-fns";

// Current selected date state (stored in URL param or Zustand)
const [selectedDate, setSelectedDate] = useState(new Date());

const formattedDate = format(selectedDate, "yyyy-MM-dd"); // for API calls
const displayDate = format(selectedDate, "EEEE, MMMM d"); // "Wednesday, May 14"

const prevDay = () => setSelectedDate(subDays(selectedDate, 1));
const nextDay = () => setSelectedDate(addDays(selectedDate, 1));
const goToToday = () => setSelectedDate(new Date());
```

### 9.5 Query Keys Convention

```typescript
// Consistent query key patterns for cache invalidation
["dashboard", "2026-05-14"]           // daily dashboard
["weekly-summary", "2026-05-12"]      // weekly chart (by week start)
["category-breakdown", "2026-05-14"]  // category donut
["habits"]                            // habit list
["habits", { category: 1, active: true }]  // filtered
["categories"]                        // category list
["me"]                                // current user
```

### 9.6 Protected Route Wrapper

```typescript
// src/components/layout/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { refreshToken } = useAuthStore();
  if (!refreshToken) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
```

---

## 10. UI DESIGN SYSTEM

### Colors (Tailwind Custom Config)

```js
// tailwind.config.js
colors: {
  brand: {
    gold: "#C9A84C",
    green: "#1e8c5a",
    blue: "#2563a8",
    red: "#c0392b",
    purple: "#9b59b6",
  },
  bg: {
    DEFAULT: "#0D0D0D",
    surface: "#1a1a2e",
    card: "#1F2937",
    elevated: "#243047",
  },
  text: {
    DEFAULT: "#F9FAFB",
    muted: "#9CA3AF",
    subtle: "#6B7280",
  },
  border: "rgba(255,255,255,0.08)",
}
```

### Typography

- **Display/Headings:** Uppercase, letter-spacing wide — feel authoritative
- **Body:** Regular weight, off-white
- **Muted text:** `#9CA3AF`
- **Mono elements (scores/numbers):** Use a monospace or tabular-nums font

### Component Styles

**Card:**
```css
background: #1F2937;
border: 1px solid rgba(255,255,255,0.08);
border-radius: 12px;
padding: 24px;
```

**Habit Checkbox (completed):**
```css
background: category-color (e.g., #1e8c5a for Prayer);
border: none;
checkmark: white;
```

**Rank Badge:**
```css
background: rank-color with 20% opacity;
border: 1px solid rank-color;
color: rank-color;
border-radius: 999px;
padding: 4px 12px;
font-size: 12px;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.1em;
```

**Progress Bar:**
```css
background: rgba(255,255,255,0.08);  /* track */
fill: category-color;                /* fill */
border-radius: 999px;
height: 6px;
```

**Primary Button:**
```css
background: linear-gradient(135deg, #C9A84C, #b8903a);
color: #0D0D0D;
font-weight: 700;
letter-spacing: 0.05em;
```

---

## 11. FIRST-RUN EXPERIENCE

1. User lands on `/register`
2. Fills in username, email, password
3. On success: tokens stored, `POST /habits/seed/` called
4. Redirect to `/dashboard`
5. Dashboard shows all 22 habits, all unchecked
6. User starts checking off habits for the day

---

## 12. ERROR HANDLING

### API Error Response Format

Django REST Framework returns errors as:
```json
// Field errors
{
  "email": ["This field is required."],
  "password": ["Ensure this field has at least 8 characters."]
}

// Non-field errors
{
  "non_field_errors": ["Invalid email or password."]
}

// Detail
{
  "detail": "Authentication credentials were not provided."
}
```

### Error Handling Strategy

```typescript
// In API calls, catch and display errors
try {
  await loginMutation.mutateAsync(data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    const errors = error.response?.data;
    if (errors?.non_field_errors) {
      toast.error(errors.non_field_errors[0]);
    } else if (errors?.detail) {
      toast.error(errors.detail);
    } else {
      // Field-level errors — set in react-hook-form
      Object.entries(errors).forEach(([field, messages]) => {
        form.setError(field, { message: messages[0] });
      });
    }
  }
}
```

---

## 13. SAMPLE API SERVICE LAYER

```typescript
// src/services/auth.ts
import api from "@/lib/axios";

export const authService = {
  register: (data) => api.post("/auth/register/", data).then(r => r.data),
  login: (data) => api.post("/auth/login/", data).then(r => r.data),
  logout: (refresh) => api.post("/auth/logout/", { refresh }),
  me: () => api.get("/auth/me/").then(r => r.data),
  updateMe: (data) => api.patch("/auth/me/update/", data).then(r => r.data),
  refreshToken: (refresh) => api.post("/auth/token/refresh/", { refresh }).then(r => r.data),
};

// src/services/analytics.ts
export const analyticsService = {
  dailyDashboard: (date?: string) =>
    api.get("/analytics/daily-dashboard/", { params: { date } }).then(r => r.data),
  weeklySummary: (weekStart?: string) =>
    api.get("/analytics/weekly-summary/", { params: { week_start: weekStart } }).then(r => r.data),
  categoryBreakdown: (date?: string) =>
    api.get("/analytics/category-breakdown/", { params: { date } }).then(r => r.data),
};

// src/services/completions.ts
export const completionsService = {
  toggle: (habitId: number, date: string) =>
    api.post("/completions/toggle/", { habit: habitId, date }).then(r => r.data),
  dayScore: (date?: string) =>
    api.get("/completions/day-score/", { params: { date } }).then(r => r.data),
};

// src/services/habits.ts
export const habitsService = {
  list: (params?) => api.get("/habits/", { params }).then(r => r.data),
  seed: () => api.post("/habits/seed/").then(r => r.data),
  create: (data) => api.post("/habits/", data).then(r => r.data),
  update: (id, data) => api.patch(`/habits/${id}/`, data).then(r => r.data),
  delete: (id) => api.delete(`/habits/${id}/`),
};
```

---

## 14. RESPONSIVE DESIGN

- **Desktop (≥1024px):** Sidebar visible, full layout
- **Tablet (768–1023px):** Sidebar collapses to icon-only rail
- **Mobile (<768px):** Bottom tab navigation, single-column layout

---

## 15. ANIMATIONS & MICRO-INTERACTIONS

- **Habit checkbox:** Spring animation when toggled — satisfying "click"
- **Score circular ring:** Animates from 0 to current % on load
- **Bar chart:** Bars grow from bottom on initial load
- **Rank badge:** Color transition when rank changes
- **Category progress bars:** Smooth width transition on toggle
- **Page transitions:** Subtle fade-in (`opacity: 0 → 1`, 150ms)
- **Loading states:** Skeleton loaders (dark shimmer) for all cards

---

## 16. BACKEND API DOCS

The backend also serves interactive API documentation:

- **Swagger UI:** `http://localhost:8000/api/docs/`
- **ReDoc:** `http://localhost:8000/api/redoc/`
- **OpenAPI JSON:** `http://localhost:8000/api/schema/`

These can be used to explore and test endpoints directly while building the frontend.

---

## 17. COMPLETE TYPE DEFINITIONS

```typescript
// src/types/index.ts

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  order: number;
  habit_count: number;
}

export interface Habit {
  id: number;
  slug: string;
  label: string;
  category: number;
  category_name: string;
  category_color: string;
  time: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: number;
  habit: number;
  habit_slug: string;
  habit_label: string;
  habit_category: string;
  habit_category_color: string;
  date: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Rank {
  label: "Don Status" | "Made Man" | "Associate" | "Back to Work";
  color: string;
}

export interface DayScore {
  date: string;
  done: number;
  total: number;
  percentage: number;
  rank: Rank;
}

export interface DashboardCategory {
  name: string;
  color: string;
  done: number;
  total: number;
  percentage: number;
}

export interface DashboardHabit extends Habit {
  completed: boolean;
}

export interface DailyDashboard {
  date: string;
  score: DayScore;
  categories: DashboardCategory[];
  habits: DashboardHabit[];
}

export interface WeekDay {
  day_index: number;
  day_name: string;
  day_short: string;
  date: string;
  is_today: boolean;
  done: number;
  total: number;
  percentage: number;
}

export interface WeeklySummary {
  week_start: string;
  days: WeekDay[];
}

export interface CategoryBreakdown {
  date: string;
  categories: DashboardCategory[];
}
```

---

## 18. QUICK START PROMPT FOR CLAUDE

When passing this spec to Claude in the frontend repo, use this prompt:

```
Build a complete React + TypeScript + TailwindCSS frontend for "The Syndicate Protocol" 
habit tracker app based on the specification in FRONTEND_SPEC.md.

Requirements:
1. Use Vite + React 18 + TypeScript
2. TailwindCSS for styling (dark theme, mob aesthetic per spec)
3. TanStack Query (React Query) for all server state
4. Zustand for auth state
5. Axios with JWT interceptor for auto-refresh
6. React Router v6 for routing
7. Recharts for the bar chart and donut chart
8. React Hot Toast for notifications
9. Lucide React for icons

Build every page: Login, Register, Dashboard, Analytics, Habits, Settings.
The Dashboard is the most important — it must feel premium and polished.
Implement optimistic updates for habit toggles.
Follow the component structure in section 8 of the spec.
Use the exact API endpoints from section 5.
```
