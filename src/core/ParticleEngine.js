import { math } from '../utils/math';
import { colorUtils } from '../utils/color';
import { EffectsManager } from './EffectsManager';
import { SoundManager } from './SoundManager';

export class ParticleEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.options = {
      particleCount: 2000,
      svgString: '',
      backgroundColor: '#FFFFFF',
      colorMode: 'single',
      particleColor: '#231f20',
      particleColors: null,
      colorPalette: 'sunset',
      particleSize: 1.5,
      particleSizeVariation: 0.8,
      particleShape: 'circle',
      animationDuration: 2000,
      animationEasing: 'easeOutCubic',
      animationMode: 'morph',
      wobbleEffect: true,
      wobbleIntensity: 1.5,
      explodeEnabled: true,
      explodeDuration: 800,
      explodeDistance: 400,
      explodeGravity: 0.5,
      explodeRotation: true,
      fadeEnabled: true,
      fadeDuration: 2000,
      fadeDelay: 0,
      fadeType: 'linear',
      mouseEffect: true,
      mouseEffectType: 'repel',
      mouseRadius: 100,
      mouseForce: 3,
      effects: [],
      effectIntensity: 0.5,
      soundEnabled: false,
      soundVolume: 0.5,
      performanceMode: 'auto',
      onProgress: null,
      onComplete: null,
      onExplodeStart: null,
      onExplodeComplete: null,
      onFadeComplete: null,
      onParticleClick: null,
      ...options
    };
    
    this.particles = [];
    this.targetPoints = [];
    this.animating = false;
    this.isExploding = false;
    this.isFading = false;
    this.animationId = null;
    this.width = 0;
    this.height = 0;
    this.startTime = null;
    this.animationProgress = 0;
    this.mouseX = null;
    this.mouseY = null;
    this.time = 0;
    
    this.init();
  }
  
  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    if (this.options.mouseEffect) this.initMouseEffect();
  }
  
  resize() {
  if (!this.canvas) return;
  
  this.width = this.canvas.parentElement?.clientWidth || window.innerWidth;
  this.height = this.canvas.parentElement?.clientHeight || window.innerHeight;
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  
  if (this.ctx) {
    this.ctx = this.canvas.getContext('2d');
  }
}
  
  initMouseEffect() {
  // صبر کنیم تا canvas آماده بشه
  if (!this.canvas) return;
  
  const handleMove = (e) => {
    // بررسی وجود canvas و rect
    if (!this.canvas) return;
    
    const rect = this.canvas.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // بررسی اینکه موس داخل canvas هست
    if (mouseX < 0 || mouseX > rect.width || mouseY < 0 || mouseY > rect.height) {
      return;
    }
    
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    
    if (!this.animating && !this.isExploding && this.particles && this.particles.length > 0) {
      for (let p of this.particles) {
        if (!p) continue;
        
        const dx = p.x - this.mouseX;
        const dy = p.y - this.mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.options.mouseRadius && p.alpha > 0.5) {
          const angle = Math.atan2(dy, dx);
          const force = (this.options.mouseRadius - distance) / this.options.mouseRadius;
          p.x += Math.cos(angle) * force * this.options.mouseForce;
          p.y += Math.sin(angle) * force * this.options.mouseForce;
          
          // محدود کردن به داخل canvas
          p.x = Math.max(5, Math.min(this.width - 5, p.x));
          p.y = Math.max(5, Math.min(this.height - 5, p.y));
        }
      }
      this.draw();
    }
  };
  
  const handleLeave = () => {
    this.mouseX = null;
    this.mouseY = null;
    
    if (!this.particles || this.particles.length === 0) return;
    if (this.animating || this.isExploding) return;
    
    // بازگشت تدریجی
    let interval = setInterval(() => {
      if (!this.particles) {
        clearInterval(interval);
        return;
      }
      
      let allRestored = true;
      for (let p of this.particles) {
        if (Math.abs(p.x - p.targetX) > 0.5 || Math.abs(p.y - p.targetY) > 0.5) {
          allRestored = false;
          p.x += (p.targetX - p.x) * 0.1;
          p.y += (p.targetY - p.y) * 0.1;
        }
      }
      this.draw();
      
      if (allRestored) {
        clearInterval(interval);
      }
    }, 16);
  };
  
  // اضافه کردن event listeners با بررسی وجود canvas
  if (this.canvas) {
    this.canvas.addEventListener('mousemove', handleMove);
    this.canvas.addEventListener('mouseleave', handleLeave);
  }
}
  
  async loadSVG() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svgBlob = new Blob([this.options.svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        // محاسبه سایز مناسب برای لوگو
        const maxWidth = this.width * 0.6;
        const maxHeight = this.height * 0.5;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        const renderWidth = img.width * scale;
        const renderHeight = img.height * scale;
        const offsetX = (this.width - renderWidth) / 2;
        const offsetY = (this.height - renderHeight) / 2;
        
        // ایجاد canvas موقت برای استخراج نقاط
        const offCanvas = document.createElement('canvas');
        offCanvas.width = this.width;
        offCanvas.height = this.height;
        const offCtx = offCanvas.getContext('2d');
        
        // رسم پس‌زمینه سفید
        offCtx.fillStyle = '#FFFFFF';
        offCtx.fillRect(0, 0, this.width, this.height);
        
        // رسم SVG
        offCtx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
        
        // استخراج نقاط تیره
        const imageData = offCtx.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;
        const points = [];
        
        // استپ مناسب برای تعداد ذرات
        const step = Math.max(2, Math.floor(2000 / this.options.particleCount));
        
        console.log('Extracting points from SVG...');
        let pointCount = 0;
        
        for (let y = 0; y < this.height; y += step) {
          for (let x = 0; x < this.width; x += step) {
            const idx = (y * this.width + x) * 4;
            if (idx >= data.length) continue;
            
            const r = data[idx];
            const g = data[idx+1];
            const b = data[idx+2];
            const brightness = (r + g + b) / 3;
            
            // هر چیزی که سفید نباشه (تیره‌تر از 240)
            if (brightness < 240) {
              points.push({ targetX: x, targetY: y });
              pointCount++;
            }
          }
        }
        
        console.log(`Found ${pointCount} points from SVG`);
        
        URL.revokeObjectURL(url);
        
        if (points.length === 0) {
          // اگر نقطه‌ای پیدا نشد، از روش جایگزین استفاده کن
          console.warn('No points found, using fallback method');
          for (let y = 0; y < this.height; y += step) {
            for (let x = 0; x < this.width; x += step) {
              points.push({ targetX: x, targetY: y });
            }
          }
        }
        
        this.targetPoints = points;
        this.createParticles();
        resolve(points);
      };
      
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(new Error("Error loading SVG: " + err));
      };
      
      img.src = url;
    });
  }
  
  createParticles() {
    const targetCount = this.targetPoints.length;
    if (targetCount === 0) {
      console.error('No target points available');
      return;
    }
    
    const step = targetCount / this.options.particleCount;
    this.particles = [];
    
    const shapes = ['circle', 'square', 'triangle', 'star'];
    
    for (let i = 0; i < this.options.particleCount; i++) {
      let targetIndex = Math.floor(i * step);
      if (targetIndex >= targetCount) targetIndex = targetCount - 1;
      const target = this.targetPoints[targetIndex];
      
      // موقعیت شروع از اطراف صفحه
      let startX, startY;
      const side = Math.floor(Math.random() * 4);
      switch(side) {
        case 0: 
          startX = Math.random() * this.width; 
          startY = -Math.random() * this.height * 0.3; 
          break;
        case 1: 
          startX = this.width + Math.random() * this.width * 0.3; 
          startY = Math.random() * this.height; 
          break;
        case 2: 
          startX = Math.random() * this.width; 
          startY = this.height + Math.random() * this.height * 0.3; 
          break;
        default: 
          startX = -Math.random() * this.width * 0.3; 
          startY = Math.random() * this.height;
      }
      
      let size = this.options.particleSize + (Math.random() - 0.5) * this.options.particleSizeVariation;
      size = Math.max(0.8, Math.min(3, size));
      
      this.particles.push({
        x: startX, 
        y: startY,
        startX: startX, 
        startY: startY,
        targetX: target.targetX, 
        targetY: target.targetY,
        size: size,
        originalSize: size,
        delay: Math.random() * 0.5,
        alpha: 1,
        explodeX: 0, 
        explodeY: 0,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 0.5,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        glow: Math.random() > 0.9
      });
    }
    
    console.log(`Created ${this.particles.length} particles`);
  }
  
  startAnimation() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.animating = true;
    this.startTime = performance.now();
    this.animate();
  }
  
  animate(timestamp) {
    if (!this.animating) return;
    if (!this.startTime) this.startTime = timestamp;
    
    const elapsed = timestamp - this.startTime;
    let progress = Math.min(1, elapsed / this.options.animationDuration);
    
    // ایزینگ
    progress = 1 - Math.pow(1 - progress, 2);
    
    this.updateParticles(progress);
    this.draw();
    
    if (this.options.onProgress) {
      this.options.onProgress(Math.floor(progress * 100));
    }
    
    if (progress >= 1) {
      this.animating = false;
      if (this.options.onComplete) this.options.onComplete();
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      return;
    }
    
    this.animationId = requestAnimationFrame((t) => this.animate(t));
  }
  
  updateParticles(progress) {
    for (let p of this.particles) {
      let particleProgress = Math.max(0, Math.min(1, (progress - p.delay) / (1 - p.delay)));
      if (progress <= p.delay) particleProgress = 0;
      const t = particleProgress;
      
      // افکت لرزش
      const wobbleX = Math.sin(progress * Math.PI * 3 + p.delay * 10) * (1 - t) * 1.2;
      const wobbleY = Math.cos(progress * Math.PI * 3.5 + p.delay * 8) * (1 - t) * 1.2;
      
      p.x = p.startX + (p.targetX - p.startX) * t + wobbleX;
      p.y = p.startY + (p.targetY - p.startY) * t + wobbleY;
      
      p.rotation += p.rotationSpeed;
    }
  }
  
 draw() {
  if (!this.ctx || !this.canvas) return;
  
  this.ctx.clearRect(0, 0, this.width, this.height);
  this.ctx.fillStyle = this.options.backgroundColor;
  this.ctx.fillRect(0, 0, this.width, this.height);
  
  if (!this.particles) return;
  
  for (let p of this.particles) {
    if (!p || p.alpha < 0.01) continue;
    
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation || 0);
    
    // رنگ
    let color = this.options.particleColor;
    if (this.options.colorMode === 'rainbow') {
      const hue = (p.x + p.y + (this.time || 0) * 50) % 360;
      color = `hsl(${hue}, 70%, 60%)`;
    } else if (this.options.colorMode === 'heat') {
      const intensity = Math.min(1, p.alpha * 1.5);
      color = `rgb(${255 * intensity}, ${100 * (1 - intensity)}, 0)`;
    }
    
    this.ctx.fillStyle = color;
    
    // درخشش
    if (p.glow) {
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = `rgba(255, 200, 100, 0.5)`;
    }
    
    // شکل
    const size = p.size || 1.5;
    switch(p.shape) {
      case 'square':
        this.ctx.fillRect(-size/2, -size/2, size, size);
        break;
      case 'triangle':
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size);
        this.ctx.lineTo(size/2, size/2);
        this.ctx.lineTo(-size/2, size/2);
        this.ctx.fill();
        break;
      case 'star':
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size/2;
        this.ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI * 2 * i) / (spikes * 2);
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          if (i === 0) this.ctx.moveTo(x, y);
          else this.ctx.lineTo(x, y);
        }
        this.ctx.fill();
        break;
      default:
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    this.ctx.restore();
  }
  
  this.time = (this.time || 0) + 0.02;
}
  
  explode() {
    if (this.isExploding || this.isFading || this.animating) return;
    if (!this.options.explodeEnabled) return;
    
    this.isExploding = true;
    if (this.options.onExplodeStart) this.options.onExplodeStart();
    
    for (let p of this.particles) {
      const angle = Math.random() * Math.PI * 2;
      const distance = this.options.explodeDistance + Math.random() * 200;
      p.explodeX = p.x + Math.cos(angle) * distance;
      p.explodeY = p.y + Math.sin(angle) * distance;
      p.vx = (Math.random() - 0.5) * 8;
      p.vy = (Math.random() - 0.5) * 8 - 3;
    }
    
    const startTime = performance.now();
    
    const animateExplode = (currentTime) => {
      const elapsed = currentTime - startTime;
      let progress = Math.min(1, elapsed / this.options.explodeDuration);
      
      for (let p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += this.options.explodeGravity * 0.1;
        
        if (progress < 0.3) {
          p.x += (p.explodeX - p.x) * progress * 0.3;
          p.y += (p.explodeY - p.y) * progress * 0.3;
        }
      }
      
      this.draw();
      
      if (progress < 1) {
        requestAnimationFrame(animateExplode);
      } else {
        this.isExploding = false;
        if (this.options.onExplodeComplete) this.options.onExplodeComplete();
        if (this.options.fadeEnabled) this.startFade();
      }
    };
    
    requestAnimationFrame(animateExplode);
  }
  
  startFade() {
    if (!this.options.fadeEnabled) return;
    
    this.isFading = true;
    const startTime = performance.now();
    
    const animateFade = (currentTime) => {
      const elapsed = currentTime - startTime;
      let progress = Math.min(1, elapsed / this.options.fadeDuration);
      
      for (let p of this.particles) {
        p.alpha = Math.max(0, 1 - progress);
        p.size *= 0.98;
      }
      
      this.draw();
      
      if (progress < 1) {
        requestAnimationFrame(animateFade);
      } else {
        this.isFading = false;
        if (this.options.onFadeComplete) this.options.onFadeComplete();
      }
    };
    
    requestAnimationFrame(animateFade);
  }
  
  reset() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.isExploding = false;
    this.isFading = false;
    this.animating = true;
    this.animationProgress = 0;
    this.startTime = null;
    this.createParticles();
    this.startAnimation();
  }
  
  destroy() {
  if (this.animationId) {
    cancelAnimationFrame(this.animationId);
  }
  
  // حذف event listeners
  if (this.canvas) {
    const newCanvas = this.canvas.cloneNode(true);
    this.canvas.parentNode?.replaceChild(newCanvas, this.canvas);
  }
  
  window.removeEventListener('resize', () => this.resize());
  this.ctx = null;
  this.canvas = null;
  this.particles = null;
}
}