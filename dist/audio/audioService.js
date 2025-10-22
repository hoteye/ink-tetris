import { spawn } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { generateTetrisMusicWav, generateBeep } from './musicGenerator.js';
export class AudioService {
    constructor(config = {}) {
        this.currentMusicProcess = null;
        this.config = {
            enabled: true,
            volume: 0.3,
            musicTempo: 120,
            ...config,
        };
        this.audioFilePath = join(tmpdir(), 'tetris_audio_');
    }
    setConfig(config) {
        this.config = { ...this.config, ...config };
        this.stopMusic();
    }
    /**
     * Play background music with given tempo
     */
    playBackgroundMusic(tempo = this.config.musicTempo) {
        if (!this.config.enabled)
            return;
        // Stop any existing music
        this.stopMusic();
        try {
            // Generate WAV file
            const wavBuffer = generateTetrisMusicWav(tempo);
            const filePath = `${this.audioFilePath}${Date.now()}.wav`;
            writeFileSync(filePath, wavBuffer);
            // Try different audio players (platform-dependent)
            this.playAudioFile(filePath);
            // Clean up file after a delay
            setTimeout(() => {
                try {
                    unlinkSync(filePath);
                }
                catch (e) {
                    // File already deleted or error
                }
            }, 5000);
        }
        catch (error) {
            console.error('Error playing background music:', error);
        }
    }
    /**
     * Play a sound effect
     */
    playSoundEffect(frequency = 800, durationMs = 100) {
        if (!this.config.enabled)
            return;
        try {
            const wavBuffer = generateBeep(frequency, durationMs);
            const filePath = `${this.audioFilePath}${Date.now()}_effect.wav`;
            writeFileSync(filePath, wavBuffer);
            this.playAudioFile(filePath);
            // Clean up file after a delay
            setTimeout(() => {
                try {
                    unlinkSync(filePath);
                }
                catch (e) {
                    // File already deleted or error
                }
            }, 3000);
        }
        catch (error) {
            console.error('Error playing sound effect:', error);
        }
    }
    /**
     * Play different sound effects for game events
     */
    playBlockPlaced() {
        this.playSoundEffect(600, 80);
    }
    playLineCleared() {
        this.playSoundEffect(800, 150);
    }
    playGameOver() {
        this.playSoundEffect(400, 200);
    }
    playPause() {
        this.playSoundEffect(1000, 100);
    }
    /**
     * Stop background music
     */
    stopMusic() {
        if (this.currentMusicProcess) {
            try {
                this.currentMusicProcess.kill();
                this.currentMusicProcess = null;
            }
            catch (e) {
                // Process already terminated
            }
        }
    }
    /**
     * Update music tempo (BPM)
     */
    updateMusicTempo(tempo) {
        if (tempo < 60 || tempo > 180)
            return;
        this.config.musicTempo = tempo;
        this.playBackgroundMusic(tempo);
    }
    /**
     * Try to play audio file using available system player
     */
    playAudioFile(filePath) {
        // List of common audio players to try (in order of preference)
        const players = [
            { cmd: 'ffplay', args: ['-nodisp', '-autoexit', '-loglevel', 'quiet'] },
            { cmd: 'aplay', args: [] },
            { cmd: 'paplay', args: [] },
            { cmd: 'mpg123', args: ['-q'] },
            { cmd: 'play', args: ['-q'] }, // from sox
        ];
        for (const player of players) {
            try {
                const args = [...player.args, filePath];
                this.currentMusicProcess = spawn(player.cmd, args, {
                    stdio: 'ignore',
                    detached: true,
                });
                this.currentMusicProcess.on('error', () => {
                    // Player not found or error, continue to next
                });
                return;
            }
            catch (e) {
                // Try next player
                continue;
            }
        }
        // If no player works, silently fail (common in some environments)
        console.debug('No audio player available');
    }
    /**
     * Cleanup resources
     */
    destroy() {
        this.stopMusic();
    }
}
// Global audio service instance
let audioServiceInstance = null;
export function getAudioService(config) {
    if (!audioServiceInstance) {
        audioServiceInstance = new AudioService(config);
    }
    return audioServiceInstance;
}
export function destroyAudioService() {
    if (audioServiceInstance) {
        audioServiceInstance.destroy();
        audioServiceInstance = null;
    }
}
