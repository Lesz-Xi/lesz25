// Sound utility for UI interactions
class SoundManager {
  constructor() {
    this.sounds = {};
    this.isEnabled = true;
  }

  // Load a sound with caching
  loadSound(name, src, volume = 0.3) {
    if (!this.sounds[name]) {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.preload = "auto";
      this.sounds[name] = audio;
    }
    return this.sounds[name];
  }

  // Play a sound
  async playSound(name) {
    if (!this.isEnabled) return;

    try {
      const sound = this.sounds[name];
      if (sound) {
        // Reset audio to beginning and play
        sound.currentTime = 0;
        await sound.play();
      }
    } catch (error) {
      // Silently handle autoplay restrictions
      console.log("Audio play prevented:", error.message);
    }
  }

  // Toggle sound on/off
  toggleSound() {
    this.isEnabled = !this.isEnabled;
  }

  // Set volume for all sounds
  setGlobalVolume(volume) {
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = volume;
    });
  }
}

// Create global instance
const soundManager = new SoundManager();

// Load UI sounds
soundManager.loadSound("uiHover", "/audio/uiupd.mp3.mov", 1.0);

// Export functions for components to use
export const playHoverSound = () => soundManager.playSound("uiHover");
export const toggleSounds = () => soundManager.toggleSound();
export const setSoundVolume = (volume) => soundManager.setGlobalVolume(volume);

export default soundManager;
