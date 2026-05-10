// 음성 녹음 + Whisper 전사 훅 (§8.2 학습 모드).
// expo-av 는 native binding 이 필요 — Jest 환경에선 require 실패.
// dynamic require + try/catch 로 폴백 (테스트에선 noop 동작).

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

let AudioModule: typeof import("expo-av")["Audio"] | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const av = require("expo-av") as typeof import("expo-av");
  AudioModule = av.Audio;
} catch {
  AudioModule = null;
}

type Recorder = unknown;

export type VoiceState = "idle" | "recording" | "processing" | "ready" | "error";

export type VoiceResult = {
  state: VoiceState;
  transcript: string | null;
  start: () => Promise<void>;
  stop: () => Promise<string | null>;
  reset: () => void;
};

export function useVoiceRecorder(): VoiceResult {
  const [state, setState] = useState<VoiceState>("idle");
  const [recording, setRecording] = useState<Recorder | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);

  const start = useCallback(async () => {
    if (!AudioModule) {
      setState("error");
      return;
    }
    try {
      const perm = await AudioModule.requestPermissionsAsync();
      if (!perm.granted) {
        setState("error");
        return;
      }
      await AudioModule.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const r = new AudioModule.Recording();
      await r.prepareToRecordAsync(AudioModule.RecordingOptionsPresets.HIGH_QUALITY);
      await r.startAsync();
      setRecording(r as Recorder);
      setState("recording");
      setTranscript(null);
    } catch {
      setState("error");
    }
  }, []);

  const stop = useCallback(async (): Promise<string | null> => {
    if (!recording) return null;
    setState("processing");
    try {
      const r = recording as InstanceType<NonNullable<typeof AudioModule>["Recording"]>;
      await r.stopAndUnloadAsync();
      const uri = r.getURI();
      setRecording(null);
      if (!uri) {
        setState("error");
        return null;
      }
      const form = new FormData();
      // RN에서 file URI 를 Blob 로 첨부
      form.append("audio", {
        uri,
        name: "audio.m4a",
        type: "audio/m4a",
      } as unknown as Blob);

      const { data, error } = await supabase.functions.invoke("srs-stt", {
        body: form,
      });
      if (error) {
        setState("error");
        return null;
      }
      const text = (data as { transcript?: string })?.transcript ?? "";
      setTranscript(text);
      setState("ready");
      return text;
    } catch {
      setState("error");
      return null;
    }
  }, [recording]);

  const reset = useCallback(() => {
    setRecording(null);
    setTranscript(null);
    setState("idle");
  }, []);

  return { state, transcript, start, stop, reset };
}
