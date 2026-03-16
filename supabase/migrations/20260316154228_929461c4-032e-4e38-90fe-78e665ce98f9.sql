
-- Create speaking_attempts table for progress tracking
CREATE TABLE public.speaking_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  part INTEGER NOT NULL CHECK (part IN (1, 2, 3)),
  question_text TEXT NOT NULL,
  transcript TEXT,
  improved_answer TEXT,
  band_score NUMERIC(2,1),
  fluency_feedback TEXT,
  vocabulary_feedback TEXT,
  grammar_feedback TEXT,
  pronunciation_feedback TEXT,
  suggestions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.speaking_attempts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert and read (no auth required for MVP)
CREATE POLICY "Anyone can insert attempts" ON public.speaking_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read attempts" ON public.speaking_attempts FOR SELECT USING (true);

-- Index for faster queries
CREATE INDEX idx_speaking_attempts_created ON public.speaking_attempts(created_at DESC);
CREATE INDEX idx_speaking_attempts_part ON public.speaking_attempts(part);
