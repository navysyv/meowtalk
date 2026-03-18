/**
 * Audio preprocessing utilities for speech recording.
 * Converts recorded audio to mono 16kHz WAV for optimal transcription.
 */

export async function processAudioBlob(blob: Blob): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new AudioContext({ sampleRate: 16000 });

  let audioBuffer: AudioBuffer;
  try {
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch {
    // If decoding fails, return original blob
    audioContext.close();
    return blob;
  }

  // Mix down to mono
  const numberOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const monoData = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (let ch = 0; ch < numberOfChannels; ch++) {
      sum += audioBuffer.getChannelData(ch)[i];
    }
    monoData[i] = sum / numberOfChannels;
  }

  // Trim silence from start and end (threshold-based)
  const threshold = 0.01;
  let start = 0;
  let end = monoData.length - 1;

  while (start < monoData.length && Math.abs(monoData[start]) < threshold) start++;
  while (end > start && Math.abs(monoData[end]) < threshold) end--;

  // Keep a small buffer around speech
  start = Math.max(0, start - 1600); // 100ms at 16kHz
  end = Math.min(monoData.length - 1, end + 1600);

  const trimmedData = monoData.slice(start, end + 1);

  // Encode as WAV
  const wavBlob = encodeWAV(trimmedData, 16000);

  audioContext.close();
  return wavBlob;
}

function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  // WAV header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * 2, true);

  // Convert float to int16
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
