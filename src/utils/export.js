// ابزارهای خروجی گرفتن
import html2canvas from 'html2canvas';

// بررسی وجود gif.js (اختیاری)
let GIF;
try {
  GIF = require('gif.js');
} catch(e) {
  console.warn('gif.js not installed, GIF capture disabled');
}

export const exportUtils = {
  // گرفتن اسکرین‌شات
  captureScreenshot: async (canvas, format = 'png', quality = 1) => {
    if (!canvas) return null;
    
    try {
      const dataURL = canvas.toDataURL(`image/${format}`, quality);
      return dataURL;
    } catch (error) {
      console.error('Screenshot failed:', error);
      return null;
    }
  },
  
  // دانلود تصویر
  downloadImage: (dataURL, filename = 'particle-svg.png') => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  
  // گرفتن ویدئو
  captureVideo: async (canvas, duration = 3000, fps = 30) => {
    if (!canvas) return null;
    
    try {
      const stream = canvas.captureStream(fps);
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      
      return new Promise((resolve) => {
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);
          resolve(url);
        };
        
        recorder.start();
        setTimeout(() => recorder.stop(), duration);
      });
    } catch (error) {
      console.error('Video capture failed:', error);
      return null;
    }
  },
  
  // دانلود ویدئو
  downloadVideo: async (canvas, filename = 'particle-animation.mp4', duration = 3000) => {
    try {
      const url = await exportUtils.captureVideo(canvas, duration);
      if (url) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      console.error('Video download failed:', error);
    }
  },
  
  // گرفتن GIF (با fallback)
  captureGIF: async (canvas, duration = 3000, fps = 15, width = null, height = null) => {
    if (!GIF) {
      console.warn('GIF capture requires gif.js. Install with: npm install gif.js');
      return null;
    }
    
    return new Promise((resolve) => {
      try {
        const gif = new GIF({
          workers: 2,
          quality: 10,
          width: width || canvas.width,
          height: height || canvas.height,
          workerScript: 'gif.js.worker.js'
        });
        
        const frames = Math.floor(duration / (1000 / fps));
        let frameCount = 0;
        
        const captureFrame = () => {
          if (frameCount >= frames) {
            gif.on('finished', (blob) => {
              const url = URL.createObjectURL(blob);
              resolve(url);
            });
            gif.render();
            return;
          }
          
          gif.addFrame(canvas, { delay: 1000 / fps, copy: true });
          frameCount++;
          setTimeout(captureFrame, 1000 / fps);
        };
        
        captureFrame();
      } catch (error) {
        console.error('GIF capture failed:', error);
        resolve(null);
      }
    });
  },
  
  // ذخیره وضعیت به localStorage
  saveState: (key, state) => {
    try {
      localStorage.setItem(`particle-svg-${key}`, JSON.stringify(state));
      return true;
    } catch (e) {
      console.error('Failed to save state:', e);
      return false;
    }
  },
  
  // بازیابی وضعیت
  loadState: (key) => {
    try {
      const data = localStorage.getItem(`particle-svg-${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load state:', e);
      return null;
    }
  },
  
  // خروجی JSON از تنظیمات
  exportConfig: (config) => {
    try {
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'particle-config.json';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Export config failed:', error);
    }
  },
  
  // ایمپورت تنظیمات
  importConfig: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          resolve(config);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  },
  
  // اضافه: گرفتن اسکرین‌شات با html2canvas (برای کل صفحه)
  captureFullPage: async (element, format = 'png') => {
    if (!html2canvas) {
      console.warn('html2canvas not available');
      return null;
    }
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: null,
        logging: false
      });
      return canvas.toDataURL(`image/${format}`);
    } catch (error) {
      console.error('Full page capture failed:', error);
      return null;
    }
  },
  
  // دانلود با کیفیت بالا
  downloadHighQuality: async (canvas, filename = 'particle-svg-hq.png', scale = 2) => {
    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width * scale;
      tempCanvas.height = canvas.height * scale;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
      
      const dataURL = tempCanvas.toDataURL('image/png', 1);
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('High quality download failed:', error);
    }
  }
};