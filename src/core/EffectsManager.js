import { math } from '../utils/math';
import { colorUtils } from '../utils/color';

// مدیریت افکت‌های پیشرفته
export class EffectsManager {
  constructor(engine) {
    this.engine = engine;
    this.currentEffect = 'none';
    this.effectIntensity = 0.5;
    this.time = 0;
  }
  
  // اعمال افکت روی ذرات
  applyEffect(particles, effectName, intensity = 0.5) {
    this.currentEffect = effectName;
    this.effectIntensity = intensity;
    
    switch(effectName) {
      case 'vortex':
        this.vortexEffect(particles);
        break;
      case 'wave':
        this.waveEffect(particles);
        break;
      case 'gravity':
        this.gravityEffect(particles);
        break;
      case 'wind':
        this.windEffect(particles);
        break;
      case 'magnetic':
        this.magneticEffect(particles);
        break;
      case 'firework':
        this.fireworkEffect(particles);
        break;
      case 'ripple':
        this.rippleEffect(particles);
        break;
      case 'twist':
        this.twistEffect(particles);
        break;
      case 'breathe':
        this.breatheEffect(particles);
        break;
      case 'spiral':
        this.spiralEffect(particles);
        break;
    }
  }
  
  // افکت گردابی
  vortexEffect(particles) {
    const centerX = this.engine.width / 2;
    const centerY = this.engine.height / 2;
    const strength = this.effectIntensity * 0.05;
    
    for (let p of particles) {
      const dx = p.x - centerX;
      const dy = p.y - centerY;
      const angle = Math.atan2(dy, dx);
      const radius = Math.sqrt(dx * dx + dy * dy);
      const force = strength * (1 - radius / this.engine.width);
      
      p.x += Math.cos(angle + Math.PI / 2) * force;
      p.y += Math.sin(angle + Math.PI / 2) * force;
    }
  }
  
  // افکت موجی
  waveEffect(particles) {
    const strength = this.effectIntensity * 2;
    this.time += 0.02;
    
    for (let p of particles) {
      p.x += Math.sin(p.y * 0.02 + this.time) * strength;
      p.y += Math.cos(p.x * 0.02 + this.time) * strength * 0.5;
    }
  }
  
  // افکت جاذبه
  gravityEffect(particles) {
    const centerX = this.engine.width / 2;
    const centerY = this.engine.height / 2;
    const strength = this.effectIntensity * 0.1;
    
    for (let p of particles) {
      const dx = centerX - p.x;
      const dy = centerY - p.y;
      p.x += dx * strength;
      p.y += dy * strength;
    }
  }
  
  // افکت باد
  windEffect(particles) {
    const strength = this.effectIntensity * 1.5;
    this.time += 0.01;
    
    for (let p of particles) {
      p.x += Math.sin(this.time) * strength;
      p.y += Math.cos(this.time * 0.7) * strength * 0.3;
    }
  }
  
  // افکت مغناطیسی (جذب به موس)
  magneticEffect(particles) {
    if (!this.engine.mouseX) return;
    
    const strength = this.effectIntensity * 0.2;
    
    for (let p of particles) {
      const dx = this.engine.mouseX - p.x;
      const dy = this.engine.mouseY - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = strength * (1 - distance / 150);
        p.x += dx * force;
        p.y += dy * force;
      }
    }
  }
  
  // افکت آتش‌بازی
  fireworkEffect(particles) {
    const strength = this.effectIntensity * 3;
    
    for (let p of particles) {
      if (Math.random() > 0.95) {
        p.vx += (Math.random() - 0.5) * strength;
        p.vy += (Math.random() - 0.5) * strength - 1;
      }
      p.x += p.vx;
      p.y += p.vy;
    }
  }
  
  // افکت ریپل
  rippleEffect(particles) {
    this.time += 0.05;
    const centerX = this.engine.width / 2;
    const centerY = this.engine.height / 2;
    const strength = this.effectIntensity * 2;
    
    for (let p of particles) {
      const dx = p.x - centerX;
      const dy = p.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const ripple = Math.sin(distance * 0.05 - this.time * 5) * strength;
      const angle = Math.atan2(dy, dx);
      p.x += Math.cos(angle) * ripple;
      p.y += Math.sin(angle) * ripple;
    }
  }
  
  // افکت پیچشی
  twistEffect(particles) {
    const centerX = this.engine.width / 2;
    const centerY = this.engine.height / 2;
    const strength = this.effectIntensity * 0.02;
    
    for (let p of particles) {
      const dx = p.x - centerX;
      const dy = p.y - centerY;
      const angle = Math.atan2(dy, dx);
      const radius = Math.sqrt(dx * dx + dy * dy);
      const twist = radius * strength;
      
      p.x = centerX + Math.cos(angle + twist) * radius;
      p.y = centerY + Math.sin(angle + twist) * radius;
    }
  }
  
  // افکت تنفس (بزرگ و کوچک شدن)
  breatheEffect(particles) {
    this.time += 0.02;
    const scale = 1 + Math.sin(this.time) * this.effectIntensity * 0.2;
    
    for (let p of particles) {
      p.size = (p.originalSize || p.size) * scale;
    }
  }
  
  // افکت مارپیچ
  spiralEffect(particles) {
    const centerX = this.engine.width / 2;
    const centerY = this.engine.height / 2;
    const strength = this.effectIntensity * 0.03;
    this.time += 0.02;
    
    for (let p of particles) {
      const dx = p.x - centerX;
      const dy = p.y - centerY;
      const angle = Math.atan2(dy, dx);
      const radius = Math.sqrt(dx * dx + dy * dy);
      const newAngle = angle + radius * strength * Math.sin(this.time);
      
      p.x = centerX + Math.cos(newAngle) * radius;
      p.y = centerY + Math.sin(newAngle) * radius;
    }
  }
  
  // رنگ‌آمیزی پیشرفته
  applyColorMode(particle, mode, progress = 0) {
    const x = particle.x;
    const y = particle.y;
    
    switch(mode) {
      case 'rainbow':
        return colorUtils.rainbow(x, y, this.time);
      case 'heat':
        return colorUtils.heat(particle.alpha);
      case 'fire':
        return colorUtils.fire(particle.alpha);
      case 'ice':
        return colorUtils.ice(particle.alpha);
      case 'magic':
        return colorUtils.magic(x, y, this.time);
      case 'gradient':
        const ratio = (x / this.engine.width + y / this.engine.height) / 2;
        return `hsl(${200 + ratio * 160}, 80%, 60%)`;
      case 'pulse':
        const pulse = Math.sin(this.time * 5) * 0.5 + 0.5;
        return `hsl(${particle.hue || 0}, 80%, ${50 + pulse * 30}%)`;
      default:
        return null;
    }
  }
}