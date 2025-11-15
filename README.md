# MunicipaLogic

AI-powered municipal intelligence platform for modern municipalities.

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Brand Colors

The project uses the MunicipaLogic brand color palette:

- **Government Blue** (`#0F3D91`) - Primary actions, trust
- **Civic Teal** (`#2AA9A1`) - Accents, highlights
- **Charcoal Gray** (`#1E1E1E`) - Backgrounds
- **Fiscal Gold** (`#D6A329`) - Special highlights
- **Logic Mint** (`#C9F1E1`) - Subtle accents
- **Soft Slate** (`#E5EAF0`) - Text on dark backgrounds

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Landing page
│   └── globals.css     # Global styles with Tailwind
├── tailwind.config.ts  # Tailwind configuration with brand colors
└── package.json        # Dependencies
```

## Setup

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase (required for auth and data storage)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (required for GPT-5.1 budget scoring)
OPENAI_API_KEY=your-openai-api-key

# Optional: Site URL for auth redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note**: 
- The pilot form will work without Supabase (it logs to console in development), but you'll need Supabase to actually store submissions.
- OpenAI is required for advanced budget analysis. Without it, the system will use fallback heuristics.

### Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Run this SQL in the Supabase SQL editor:

```sql
-- pilot_requests table
create table public.pilot_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text,
  city text,
  state text,
  notes text,
  user_agent text,
  referer text,
  created_at timestamptz not null default now()
);

-- budget_analyses table
create table public.budget_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  city_name text,
  fiscal_year text,
  health_score integer,
  health_label text,
  is_demo boolean default false,
  file_name text,
  rows_analyzed integer,
  currency text default 'USD',
  raw_result jsonb not null,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.pilot_requests enable row level security;
alter table public.budget_analyses enable row level security;

-- Policies for pilot_requests
create policy "allow inserts for authenticated users"
  on public.pilot_requests
  for insert
  to authenticated
  with check (true);

-- Policies for budget_analyses
create policy "user can see own analyses"
  on public.budget_analyses
  for select
  to authenticated
  using (auth.uid() = user_id or is_demo = true);

create policy "user can insert own analyses"
  on public.budget_analyses
  for insert
  to authenticated
  with check (auth.uid() = user_id);
```

3. Add your Supabase credentials to `.env.local`

4. **Important**: In your Supabase dashboard, go to Authentication > URL Configuration and add your callback URL to "Redirect URLs":
   - For local development: `http://localhost:3000/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`

## Next Steps

1. **Supabase Setup**: Set up Supabase to store pilot form submissions (see above)

2. **Footer Links**: Update the footer links to point to actual pages (Security, Privacy, Contact)

3. **Analytics**: Add your analytics tracking code

4. **Deployment**: Deploy to Vercel, Netlify, or your preferred hosting platform

5. **OpenAI Setup**: Add your OpenAI API key to `.env.local` to enable GPT-5.1 budget scoring and advanced council prep features

6. **Real Analysis**: The budget analysis pipeline is implemented! It:
   - Parses CSV/XLSX files with heuristic header detection
   - Runs numeric heuristics (department totals, YoY changes, risks)
   - Calls GPT-5.1 for advanced council prep (if OpenAI key is configured)
   - Stores all analyses in Supabase for history and detail pages

## Build for Production

```bash
npm run build
npm start
```

