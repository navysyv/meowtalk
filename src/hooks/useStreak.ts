import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "talkie_ielts_session_id";

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [justIncreased, setJustIncreased] = useState(false);

  const calculateStreak = useCallback(async () => {
    const sessionId = getSessionId();
    const { data } = await supabase
      .from("daily_streaks")
      .select("practice_date")
      .eq("session_id", sessionId)
      .order("practice_date", { ascending: false })
      .limit(365);

    if (!data || data.length === 0) {
      setStreak(0);
      return;
    }

    // Calculate consecutive days from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dates = data.map(d => {
      const date = new Date(d.practice_date + "T00:00:00");
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    // Remove duplicates and sort descending
    const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);
    
    let count = 0;
    const dayMs = 86400000;
    const todayMs = today.getTime();
    
    // Check if practiced today or yesterday
    if (uniqueDates[0] !== todayMs && uniqueDates[0] !== todayMs - dayMs) {
      setStreak(0);
      return;
    }

    let expected = uniqueDates[0];
    for (const d of uniqueDates) {
      if (d === expected) {
        count++;
        expected -= dayMs;
      } else {
        break;
      }
    }

    setStreak(count);
  }, []);

  const recordPractice = useCallback(async () => {
    const sessionId = getSessionId();
    const today = new Date().toISOString().split("T")[0];
    
    const { error } = await supabase
      .from("daily_streaks")
      .insert({ session_id: sessionId, practice_date: today })
      .select();
    
    // Unique constraint violation means already recorded today - that's fine
    if (error && !error.message?.includes("duplicate")) {
      console.error("Streak insert error:", error);
    }

    const prevStreak = streak;
    await calculateStreak();
    
    // Check if streak increased
    if (streak > prevStreak) {
      setJustIncreased(true);
      setTimeout(() => setJustIncreased(false), 3000);
    }
  }, [calculateStreak, streak]);

  useEffect(() => {
    calculateStreak();
  }, [calculateStreak]);

  return { streak, recordPractice, justIncreased };
}
