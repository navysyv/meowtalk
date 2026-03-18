import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { processAudioBlob, blobToBase64 } from "@/lib/audioUtils";
import { useToast } from "@/hooks/use-toast";
import { playPurr } from "@/lib/sounds";

type RecordingState = "idle" | "recording" | "processing" | "done" | "error";

interface UseVoiceRecorderOptions {
  onTranscript: (transcript: string) => void;
  onError?: (msg: string) => void;
}

const TRANSCRIPTION_TIMEOUT_MS = 60_000;

export function useVoiceRecorder({ onTranscript, onError }: UseVoiceRecorderOptions) {
  const { toast } = useToast();
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
      stopRecording();
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
          sampleRate: 16000,
        },
      });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      // Collect data every second for reliability
      recorder.start(1000);
      setRecordingState("recording");
      playPurr();
    } catch {
      const msg = "Microphone access denied. Please allow microphone access.";
      toast({ title: "Microphone Error", description: msg, variant: "destructive" });
      onError?.(msg);
    }
  }, [toast, onError]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      recorder.stream.getTracks().forEach((t) => t.stop());
    }
    mediaRecorderRef.current = null;
  }, []);

  const stopAndTranscribe = useCallback(async () => {
    return new Promise<void>((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        // Already stopped, process what we have
        processAndSend().then(resolve);
        return;
      }

      recorder.onstop = () => {
        recorder.stream.getTracks().forEach((t) => t.stop());
        mediaRecorderRef.current = null;
        processAndSend().then(resolve);
      };
      recorder.stop();
    });

    async function processAndSend() {
      if (isUnmountedRef.current) return;

      const chunks = audioChunksRef.current;
      if (chunks.length === 0) {
        toast({ title: "No speech detected", description: "Please try again and speak clearly.", variant: "destructive" });
        setRecordingState("error");
        onTranscript("");
        return;
      }

      setRecordingState("processing");

      try {
        const rawBlob = new Blob(chunks, { type: chunks[0].type });

        // Preprocess audio: mono, 16kHz, trim silence
        const processedBlob = await processAudioBlob(rawBlob);
        const base64 = await blobToBase64(processedBlob);

        // Send to transcription with timeout
        abortRef.current = new AbortController();
        const timeoutId = setTimeout(() => abortRef.current?.abort(), TRANSCRIPTION_TIMEOUT_MS);

        let transcript = "";
        let retried = false;

        const doTranscribe = async (): Promise<string> => {
          const { data, error } = await supabase.functions.invoke("transcribe-audio", {
            body: {
              audioBase64: base64,
              mimeType: processedBlob.type,
            },
          });

          if (error) throw error;
          if (data.empty) return "";
          return data.transcript || "";
        };

        try {
          transcript = await Promise.race([
            doTranscribe(),
            new Promise<string>((_, reject) => {
              abortRef.current?.signal.addEventListener("abort", () =>
                reject(new Error("Transcription timed out"))
              );
            }),
          ]);
        } catch (e: any) {
          if (!retried && e.message?.includes("timed out")) {
            retried = true;
            // Retry once
            abortRef.current = new AbortController();
            const retryTimeout = setTimeout(() => abortRef.current?.abort(), TRANSCRIPTION_TIMEOUT_MS);
            try {
              transcript = await doTranscribe();
            } catch {
              transcript = "";
            }
            clearTimeout(retryTimeout);
          } else {
            throw e;
          }
        }

        clearTimeout(timeoutId);

        if (isUnmountedRef.current) return;

        if (!transcript.trim()) {
          toast({ title: "No speech detected", description: "Please try again and speak clearly.", variant: "destructive" });
          setRecordingState("error");
          onTranscript("");
          return;
        }

        setRecordingState("done");
        onTranscript(transcript.trim());
      } catch (e: any) {
        console.error("Transcription error:", e);
        if (isUnmountedRef.current) return;
        const msg = e.message || "Transcription failed. Please try again.";
        toast({ title: "Transcription Error", description: msg, variant: "destructive" });
        setRecordingState("error");
        onTranscript("");
      }
    }
  }, [toast, onTranscript]);

  const reset = useCallback(() => {
    stopRecording();
    abortRef.current?.abort();
    audioChunksRef.current = [];
    setRecordingState("idle");
  }, [stopRecording]);

  return {
    recordingState,
    isRecording: recordingState === "recording",
    isProcessing: recordingState === "processing",
    startRecording,
    stopAndTranscribe,
    reset,
  };
}
