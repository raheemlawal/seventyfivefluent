# 75 Fluent

A language learning habit tracking app inspired by 75 Hard. Track your daily language learning activities for 75 consecutive days.

## Features

- **7 Daily Rules**: Track 60 minutes of study, 5 pages of reading, speaking practice, media consumption, journaling, immersion, and study logging
- **Streak Tracking**: Maintain your streak by completing all 7 rules daily
- **Progress Visualization**: View your completion history, stats, and habit completion rates
- **Timezone Support**: All dates are calculated based on your timezone
- **Modern UI**: Clean, minimal design built with React, TypeScript, Tailwind CSS, and shadcn/ui

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth + Postgres)
- **Routing**: React Router
- **Date Handling**: date-fns + date-fns-tz

## Setup

### Prerequisites

- Node.js 20+ (recommended 20.19.0+)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Create a `.env` file in the root directory:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Run database migrations:
   - In your Supabase dashboard, go to SQL Editor
   - Run the migration files in order from `supabase/migrations/`:
     - `001_initial_schema.sql`
     - `002_rls_policies.sql`
     - `003_streak_function.sql`

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Daily checklist components
│   ├── history/       # History/calendar components
│   ├── layout/        # Layout components (navbar, etc.)
│   ├── progress/     # Progress/stats components
│   └── ui/           # shadcn/ui components
├── contexts/         # React contexts (Auth)
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
├── pages/            # Page components
└── types/            # TypeScript type definitions
```

## Database Schema

### Tables

- **profiles**: User profiles with streak stats
- **daily_logs**: Daily activity logs

See `supabase/migrations/` for full schema details.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT
