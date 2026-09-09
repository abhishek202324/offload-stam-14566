/**
 * Saksham Speech Service (Upgraded)
 * Soft, gentle, natural voice synthesis with acoustic harmonic chimes & Web Speech Recognition
 */

class SpeechService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis || null;
    this.isListening = false;
    this.isMuted = false;
    this.selectedVoice = null;
    this.rate = 0.92; // Calm, gentle, unhurried pace
    this.pitch = 1.0; // Warm, natural tone
    this.audioCtx = null;

    this.initRecognition();
    this.initVoices();
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-IN'; // Default to Indian English, fallback en-US / hi-IN
    }
  }

  initVoices() {
    if (!this.synthesis) return;

    const findSoftVoice = () => {
      const voices = this.synthesis.getVoices();
      if (!voices || voices.length === 0) return;

      // Priority list of soft, natural, human-sounding voices
      const softVoiceNames = [
        "Google हिन्दी", "Google UK English Female", "Samantha", "Karen", 
        "Serena", "Moira", "Veena", "Heera", "Rishi", "Google US English", "en-IN"
      ];

      for (const name of softVoiceNames) {
        const found = voices.find(v => v.name.includes(name) || v.lang.includes(name));
        if (found) {
          this.selectedVoice = found;
          break;
        }
      }

      if (!this.selectedVoice) {
        // Find any female or calm English/Hindi voice
        this.selectedVoice = voices.find(v => v.lang.startsWith("en") || v.lang.startsWith("hi")) || voices[0];
      }
    };

    findSoftVoice();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = findSoftVoice;
    }
  }

  getAvailableVoices() {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices().filter(v => v.lang.startsWith("en") || v.lang.startsWith("hi"));
  }

  setVoiceByName(name) {
    if (!this.synthesis) return;
    const voices = this.synthesis.getVoices();
    const match = voices.find(v => v.name === name);
    if (match) this.selectedVoice = match;
  }

  setRate(r) {
    this.rate = parseFloat(r) || 0.92;
  }

  setPitch(p) {
    this.pitch = parseFloat(p) || 1.0;
  }

  /**
   * Play a gentle, soothing chime using Web Audio API
   */
  playGentleChime(type = "receive") {
    if (!this.audioCtx || this.isMuted) return;

    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      const now = this.audioCtx.currentTime;

      if (type === "send") {
        // Soft ascending chime (C5 -> E5)
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "receive") {
        // Soothing warm harmonic chime (E5 -> G5)
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.18);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      // Ignore audio context errors silently
    }
  }

  startListening(onResultCallback, onEndCallback, onErrorCallback) {
    if (!this.recognition) {
      if (onErrorCallback) onErrorCallback("Speech recognition is not available in this browser. Please type your message.");
      return;
    }

    try {
      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onResultCallback) onResultCallback(transcript);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (onErrorCallback) onErrorCallback(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEndCallback) onEndCallback();
      };

      this.recognition.start();
    } catch (e) {
      console.warn("Speech recognition error:", e);
      if (onErrorCallback) onErrorCallback(e.message);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text, onEndCallback) {
    if (!this.synthesis || this.isMuted) return;

    // Clean markdown asterisks, hashtags, urls or tags before speaking
    const cleanText = text
      .replace(/[*_#`~🚨🛡️🔒🌸💼⚖️•\n]/g, ' ')
      .replace(/\[.*?\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    this.synthesis.cancel(); // Stop previous utterance

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    
    // Soft, soothing, empathetic voice parameters
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = 0.9;

    if (onEndCallback) {
      utterance.onend = onEndCallback;
    }

    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSpeaking();
    }
    return this.isMuted;
  }
}

// Global instance
window.speechService = new SpeechService();
