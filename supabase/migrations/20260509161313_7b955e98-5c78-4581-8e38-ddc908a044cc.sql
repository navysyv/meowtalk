
ALTER TABLE public.speaking_attempts ADD COLUMN IF NOT EXISTS session_id text;
CREATE INDEX IF NOT EXISTS idx_speaking_attempts_session ON public.speaking_attempts(session_id);

CREATE TABLE public.listening_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  test_id text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  band_score numeric,
  answers jsonb,
  mistakes jsonb,
  ai_explanation text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.listening_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone insert listening" ON public.listening_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone select listening" ON public.listening_attempts FOR SELECT USING (true);
CREATE INDEX idx_listening_session ON public.listening_attempts(session_id);

CREATE TABLE public.reading_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  passage_id text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  band_score numeric,
  answers jsonb,
  mistakes jsonb,
  ai_explanation text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.reading_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone insert reading" ON public.reading_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone select reading" ON public.reading_attempts FOR SELECT USING (true);
CREATE INDEX idx_reading_session ON public.reading_attempts(session_id);

CREATE TABLE public.writing_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  task integer NOT NULL,
  prompt text NOT NULL,
  essay text NOT NULL,
  word_count integer,
  band_score numeric,
  task_response numeric,
  coherence numeric,
  lexical numeric,
  grammar numeric,
  feedback text,
  improved_sample text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.writing_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone insert writing" ON public.writing_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone select writing" ON public.writing_attempts FOR SELECT USING (true);
CREATE INDEX idx_writing_session ON public.writing_attempts(session_id);

CREATE TABLE public.mock_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  overall_band numeric,
  listening_band numeric,
  reading_band numeric,
  writing_band numeric,
  speaking_band numeric,
  report jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mock_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone insert mock" ON public.mock_results FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone select mock" ON public.mock_results FOR SELECT USING (true);
CREATE INDEX idx_mock_session ON public.mock_results(session_id);

CREATE TABLE public.user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  skill text NOT NULL,
  score numeric,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone insert skills" ON public.user_skills FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone select skills" ON public.user_skills FOR SELECT USING (true);
CREATE INDEX idx_user_skills_session ON public.user_skills(session_id);
