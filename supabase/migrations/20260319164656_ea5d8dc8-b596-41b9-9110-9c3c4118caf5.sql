CREATE TABLE public.daily_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL DEFAULT (gen_random_uuid())::text,
  practice_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, practice_date)
);

ALTER TABLE public.daily_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert streaks" ON public.daily_streaks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can read streaks" ON public.daily_streaks FOR SELECT TO public USING (true);