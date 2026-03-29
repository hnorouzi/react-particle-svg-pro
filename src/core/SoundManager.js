// سیستم صداگذاری
export class SoundManager {
  constructor(options = {}) {
    this.enabled = options.enabled || false;
    this.volume = options.volume || 0.5;
    this.sounds = {};
    this.loaded = false;
    
    // صداهای پیش‌فرض (با Web Audio API)
    this.initWebAudio();
  }
  
  initWebAudio() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.audioContext.destination);
  }
  
  // تولید صدای انفجار با Web Audio
  playExplode() {
    if (!this.enabled) return;
    
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 80;
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    
    oscillator.start(now);
    oscillator.stop(now + 0.8);
    
    // صدای دوم
    const oscillator2 = this.audioContext.createOscillator();
    oscillator2.type = 'square';
    oscillator2.frequency.value = 120;
    oscillator2.connect(gain);
    oscillator2.start(now + 0.1);
    oscillator2.stop(now + 0.6);
  }
  
  // صدای تکمیل انیمیشن
  playComplete() {
    if (!this.enabled) return;
    
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 440;
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    
    oscillator.start(now);
    oscillator.stop(now + 0.5);
  }
  
  // صدای برخورد ذرات
  playParticleCollision() {
    if (!this.enabled) return;
    if (Math.random() > 0.1) return; // کاهش تعداد صداها
    
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 800 + Math.random() * 400;
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }
  
  // صدای محو شدن
  playFade() {
    if (!this.enabled) return;
    
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 200;
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
    
    oscillator.start(now);
    oscillator.stop(now + 1.5);
  }
  
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
  }
  
  enable() {
    this.enabled = true;
    // resume audio context (نیاز به تعامل کاربر)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
  
  disable() {
    this.enabled = false;
  }
}