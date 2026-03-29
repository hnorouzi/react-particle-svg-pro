import React from 'react';

export type ParticleShape = 'circle' | 'square' | 'triangle' | 'star' | 'diamond';
export type ColorMode = 'single' | 'rainbow' | 'heat' | 'fire' | 'ice' | 'magic' | 'palette' | 'gradient' | 'pulse';
export type ColorPalette = 'sunset' | 'ocean' | 'forest' | 'neon' | 'galaxy';
export type AnimationEasing = 'linear' | 'easeOutCubic' | 'easeOutElastic' | 'easeOutBounce';
export type AnimationMode = 'morph' | 'vortex' | 'wave' | 'bounce' | 'spiral';
export type MouseEffectType = 'repel' | 'attract';
export type EffectType = 'vortex' | 'wave' | 'gravity' | 'wind' | 'magnetic' | 'firework' | 'ripple' | 'twist' | 'breathe' | 'spiral';
export type FadeType = 'linear' | 'exponential';
export type PerformanceMode = 'auto' | 'high' | 'balanced' | 'low';

export interface ParticleSVGProps {
  /** SVG content as string */
  svgString: string;
  
  /** Number of particles (default: 2000) */
  particleCount?: number;
  /** Base particle size (default: 1.5) */
  particleSize?: number;
  /** Particle size variation (default: 0.8) */
  particleSizeVariation?: number;
  /** Particle shape (default: 'circle') */
  particleShape?: ParticleShape;
  
  /** Color mode (default: 'single') */
  colorMode?: ColorMode;
  /** Single color for particles (default: '#231f20') */
  particleColor?: string;
  /** Array of colors for particles */
  particleColors?: string[];
  /** Color palette name (default: 'sunset') */
  colorPalette?: ColorPalette;
  
  /** Animation duration in ms (default: 2000) */
  animationDuration?: number;
  /** Animation easing function (default: 'easeOutCubic') */
  animationEasing?: AnimationEasing;
  /** Animation mode (default: 'morph') */
  animationMode?: AnimationMode;
  /** Enable wobble effect (default: true) */
  wobbleEffect?: boolean;
  /** Wobble intensity (default: 1.5) */
  wobbleIntensity?: number;
  
  /** Enable explode effect (default: true) */
  explodeEnabled?: boolean;
  /** Explode duration in ms (default: 800) */
  explodeDuration?: number;
  /** Explode distance (default: 400) */
  explodeDistance?: number;
  /** Explode gravity (default: 0.5) */
  explodeGravity?: number;
  /** Enable rotation during explode (default: true) */
  explodeRotation?: boolean;
  
  /** Enable fade effect (default: true) */
  fadeEnabled?: boolean;
  /** Fade duration in ms (default: 2000) */
  fadeDuration?: number;
  /** Fade delay in ms (default: 0) */
  fadeDelay?: number;
  /** Fade type (default: 'linear') */
  fadeType?: FadeType;
  
  /** Enable mouse effect (default: true) */
  mouseEffect?: boolean;
  /** Mouse effect type (default: 'repel') */
  mouseEffectType?: MouseEffectType;
  /** Mouse effect radius (default: 100) */
  mouseRadius?: number;
  /** Mouse effect force (default: 3) */
  mouseForce?: number;
  
  /** Array of active effects */
  effects?: EffectType[];
  /** Effect intensity (default: 0.5) */
  effectIntensity?: number;
  
  /** Enable sound effects (default: false) */
  soundEnabled?: boolean;
  /** Sound volume (0-1, default: 0.5) */
  soundVolume?: number;
  
  /** Background color (default: '#FFFFFF') */
  backgroundColor?: string;
  
  /** Performance mode (default: 'auto') */
  performanceMode?: PerformanceMode;
  
  /** Auto start animation (default: true) */
  autoStart?: boolean;
  
  /** Callback when component is ready */
  onReady?: () => void;
  /** Callback when animation starts */
  onStart?: () => void;
  /** Callback for animation progress (0-100) */
  onProgress?: (progress: number) => void;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Callback when explode starts */
  onExplodeStart?: () => void;
  /** Callback when explode completes */
  onExplodeComplete?: () => void;
  /** Callback when fade completes */
  onFadeComplete?: () => void;
  /** Callback when particle is clicked */
  onParticleClick?: (particle: any) => void;
  
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

export interface ParticleSVGRef {
  /** Trigger explode animation */
  explode: () => void;
  /** Reset animation to initial state */
  reset: () => void;
  /** Pause animation */
  pause: () => void;
  /** Resume animation */
  resume: () => void;
  
  /** Check if animating */
  isAnimating: () => boolean;
  /** Check if exploding */
  isExploding: () => boolean;
  /** Check if fading */
  isFading: () => boolean;
  /** Get current progress (0-1) */
  getProgress: () => number;
  /** Get all particles */
  getParticles: () => any[];
  /** Get performance stats */
  getStats: () => { fps: number; particlesCount: number; renderTime: number };
  
  /** Set particle count and reset */
  setParticleCount: (count: number) => void;
  /** Set color mode */
  setColorMode: (mode: ColorMode) => void;
  /** Set active effect */
  setEffect: (effect: EffectType, intensity?: number) => void;
  /** Set animation mode */
  setAnimationMode: (mode: AnimationMode) => void;
  
  /** Set sound volume */
  setVolume: (volume: number) => void;
  /** Enable sound */
  enableSound: () => void;
  /** Disable sound */
  disableSound: () => void;
  
  /** Capture screenshot and return dataURL */
  captureScreenshot: (format?: 'png' | 'jpeg') => Promise<string | null>;
  /** Download screenshot */
  downloadScreenshot: (filename?: string) => Promise<void>;
  /** Capture video and return URL */
  captureVideo: (duration?: number) => Promise<string | null>;
  /** Download video */
  downloadVideo: (filename?: string, duration?: number) => Promise<void>;
  /** Export current config as JSON */
  exportConfig: () => void;
  
  /** Save current state to localStorage */
  saveState: () => void;
  /** Load state from localStorage */
  loadState: () => void;
}

declare const ParticleSVG: React.ForwardRefExoticComponent<
  ParticleSVGProps & React.RefAttributes<ParticleSVGRef>
>;

export default ParticleSVG;

// Utility exports
export const exportUtils: {
  captureScreenshot: (canvas: HTMLCanvasElement, format?: string, quality?: number) => Promise<string | null>;
  downloadImage: (dataURL: string, filename?: string) => void;
  captureVideo: (canvas: HTMLCanvasElement, duration?: number, fps?: number) => Promise<string>;
  downloadVideo: (canvas: HTMLCanvasElement, filename?: string, duration?: number) => Promise<void>;
  exportConfig: (config: any) => void;
  saveState: (key: string, state: any) => boolean;
  loadState: (key: string) => any;
};

export const colorUtils: {
  hexToRgb: (hex: string) => { r: number; g: number; b: number };
  rainbow: (x: number, y: number, time?: number) => string;
  heat: (intensity: number) => string;
  palettes: Record<string, string[]>;
};

export const math: {
  easeInOutCubic: (x: number) => number;
  easeOutElastic: (x: number) => number;
  clamp: (value: number, min: number, max: number) => number;
  map: (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) => number;
  distance: (x1: number, y1: number, x2: number, y2: number) => number;
  random: (min: number, max: number) => number;
};