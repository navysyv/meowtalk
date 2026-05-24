ALTER TABLE public.mock_results        ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.speaking_attempts   ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.writing_attempts    ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.reading_attempts    ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.listening_attempts  ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.daily_streaks       ADD COLUMN IF NOT EXISTS user_id uuid;

CREATE INDEX IF NOT EXISTS idx_mock_results_user_id       ON public.mock_results(user_id);
CREATE INDEX IF NOT EXISTS idx_speaking_attempts_user_id  ON public.speaking_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_writing_attempts_user_id   ON public.writing_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_attempts_user_id   ON public.reading_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_listening_attempts_user_id ON public.listening_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_streaks_user_id      ON public.daily_streaks(user_id);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS premium_until timestamptz;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();