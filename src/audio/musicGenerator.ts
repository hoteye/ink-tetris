// Tetris Classic Music Generator (Korobeiniki)
// Generates WAV file data for the classic Tetris theme

interface Note {
  frequency: number; // Hz
  duration: number; // ms
}

// Classic Tetris theme (Korobeiniki) - simplified version
// Frequencies in Hz for musical notes
const NOTES = {
  E4: 329.63,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5,
};

// Tetris melody (first part of Korobeiniki)
export function getTetrisMelody(tempo: number = 120): Note[] {
  const beatDuration = (60000 / tempo) * 2; // 2 beats = quarter note

  return [
    // Main melody - simplified version
    { frequency: NOTES.E4, duration: beatDuration },
    { frequency: NOTES.B4, duration: beatDuration },
    { frequency: NOTES.C5, duration: beatDuration },
    { frequency: NOTES.D5, duration: beatDuration },

    { frequency: NOTES.E5, duration: beatDuration * 2 },
    { frequency: NOTES.D5, duration: beatDuration },
    { frequency: NOTES.C5, duration: beatDuration },

    { frequency: NOTES.B4, duration: beatDuration },
    { frequency: NOTES.A4, duration: beatDuration },
    { frequency: NOTES.A4, duration: beatDuration },
    { frequency: NOTES.C5, duration: beatDuration },

    { frequency: NOTES.E5, duration: beatDuration * 2 },
    { frequency: NOTES.D5, duration: beatDuration },
    { frequency: NOTES.C5, duration: beatDuration },

    { frequency: NOTES.B4, duration: beatDuration },
    { frequency: NOTES.C5, duration: beatDuration },
    { frequency: NOTES.D5, duration: beatDuration * 2 },
  ];
}

// Generate sine wave audio buffer
export function generateSineWave(
  frequency: number,
  durationMs: number,
  sampleRate: number = 44100,
  volume: number = 0.3
): number[] {
  const samples: number[] = [];
  const numSamples = (sampleRate * durationMs) / 1000;
  const angleIncrement = (2 * Math.PI * frequency) / sampleRate;
  let angle = 0;

  for (let i = 0; i < numSamples; i++) {
    const sample = Math.sin(angle) * volume;
    samples.push(sample);
    angle += angleIncrement;
  }

  return samples;
}

// Add envelope (fade in/out) to samples
export function applyEnvelope(samples: number[], durationMs: number, sampleRate: number = 44100): number[] {
  const result = [...samples];
  const totalSamples = result.length;
  const attackSamples = Math.floor((sampleRate * Math.min(durationMs * 0.1, 50)) / 1000); // 50ms max attack
  const releaseSamples = Math.floor((sampleRate * Math.min(durationMs * 0.2, 100)) / 1000); // 100ms max release

  // Attack
  for (let i = 0; i < attackSamples && i < totalSamples; i++) {
    result[i] *= i / attackSamples;
  }

  // Release
  for (let i = Math.max(0, totalSamples - releaseSamples); i < totalSamples; i++) {
    const releaseProgress = (i - (totalSamples - releaseSamples)) / releaseSamples;
    result[i] *= 1 - releaseProgress;
  }

  return result;
}

// Convert float samples to 16-bit PCM
export function floatToPCM(floats: number[]): Int16Array {
  const pcm = new Int16Array(floats.length);
  for (let i = 0; i < floats.length; i++) {
    const sample = floats[i];
    pcm[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return pcm;
}

// Create WAV file header
export function createWavHeader(
  audioLength: number,
  sampleRate: number = 44100,
  numChannels: number = 1,
  bitsPerSample: number = 16
): ArrayBuffer {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // "RIFF" chunk descriptor
  view.setUint8(0, 0x52); // 'R'
  view.setUint8(1, 0x49); // 'I'
  view.setUint8(2, 0x46); // 'F'
  view.setUint8(3, 0x46); // 'F'

  // File length - 8 (will update later)
  view.setUint32(4, 36 + audioLength, true);

  // "WAVE" format
  view.setUint8(8, 0x57); // 'W'
  view.setUint8(9, 0x41); // 'A'
  view.setUint8(10, 0x56); // 'V'
  view.setUint8(11, 0x45); // 'E'

  // "fmt " subchunk
  view.setUint8(12, 0x66); // 'f'
  view.setUint8(13, 0x6d); // 'm'
  view.setUint8(14, 0x74); // 't'
  view.setUint8(15, 0x20); // ' '

  // Subchunk1Size (16 for PCM)
  view.setUint32(16, 16, true);

  // Audio format (1 = PCM)
  view.setUint16(20, 1, true);

  // Number of channels
  view.setUint16(22, numChannels, true);

  // Sample rate
  view.setUint32(24, sampleRate, true);

  // Byte rate
  view.setUint32(28, (sampleRate * numChannels * bitsPerSample) / 8, true);

  // Block align
  view.setUint16(32, (numChannels * bitsPerSample) / 8, true);

  // Bits per sample
  view.setUint16(34, bitsPerSample, true);

  // "data" subchunk
  view.setUint8(36, 0x64); // 'd'
  view.setUint8(37, 0x61); // 'a'
  view.setUint8(38, 0x74); // 't'
  view.setUint8(39, 0x61); // 'a'

  // Subchunk2Size
  view.setUint32(40, audioLength, true);

  return header;
}

// Generate complete WAV file buffer
export function generateTetrisMusicWav(tempo: number = 120, sampleRate: number = 44100): Buffer {
  const melody = getTetrisMelody(tempo);
  let allSamples: number[] = [];

  // Generate all notes
  for (const note of melody) {
    const samples = generateSineWave(note.frequency, note.duration, sampleRate);
    const withEnvelope = applyEnvelope(samples, note.duration, sampleRate);
    allSamples = allSamples.concat(withEnvelope);
  }

  // Convert to PCM
  const pcm = floatToPCM(allSamples);
  const pcmBuffer = Buffer.from(pcm.buffer);

  // Create WAV file
  const header = createWavHeader(pcmBuffer.length, sampleRate, 1, 16);
  const headerBuffer = Buffer.from(header);

  return Buffer.concat([headerBuffer, pcmBuffer]);
}

// Simple beep for sound effects
export function generateBeep(frequency: number = 800, durationMs: number = 100, sampleRate: number = 44100): Buffer {
  const samples = generateSineWave(frequency, durationMs, sampleRate, 0.2);
  const withEnvelope = applyEnvelope(samples, durationMs, sampleRate);
  const pcm = floatToPCM(withEnvelope);
  const pcmBuffer = Buffer.from(pcm.buffer);

  const header = createWavHeader(pcmBuffer.length, sampleRate, 1, 16);
  const headerBuffer = Buffer.from(header);

  return Buffer.concat([headerBuffer, pcmBuffer]);
}
