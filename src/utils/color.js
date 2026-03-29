// سیستم رنگ پیشرفته
export const colorUtils = {
  // تبدیل hex به rgb
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 35, g: 31, b: 32 };
  },
  
  // rgb به string
  rgbToString: (r, g, b, alpha = 1) => `rgba(${r}, ${g}, ${b}, ${alpha})`,
  
  // رنگین‌کمان بر اساس موقعیت
  rainbow: (x, y, time = 0) => {
    const hue = (x + y + time * 100) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  },
  
  // گرادیانت حرارتی
  heat: (intensity) => {
    const r = Math.min(255, Math.floor(255 * intensity));
    const g = Math.min(255, Math.floor(100 * (1 - intensity)));
    const b = Math.min(255, Math.floor(50 * (1 - intensity)));
    return `rgb(${r}, ${g}, ${b})`;
  },
  
  // گرادیانت آتش
  fire: (intensity) => {
    const r = 255;
    const g = Math.floor(100 + 155 * intensity);
    const b = Math.floor(50 * (1 - intensity));
    return `rgb(${r}, ${g}, ${b})`;
  },
  
  // گرادیانت یخ
  ice: (intensity) => {
    const r = Math.floor(100 + 55 * (1 - intensity));
    const g = Math.floor(150 + 105 * (1 - intensity));
    const b = 255;
    return `rgb(${r}, ${g}, ${b})`;
  },
  
  // گرادیانت جادویی
  magic: (x, y, time) => {
    const r = Math.sin(x * 0.01 + time) * 127 + 128;
    const g = Math.sin(y * 0.01 + time + 2) * 127 + 128;
    const b = Math.sin((x + y) * 0.01 + time + 4) * 127 + 128;
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
  },
  
  // پالت‌های آماده
  palettes: {
    sunset: ['#FF6B6B', '#FF8E53', '#FFB347', '#FFD93D', '#FFEAA7'],
    ocean: ['#1A535C', '#4ECDC4', '#A8E6CF', '#FFE66D', '#FF6B6B'],
    forest: ['#2D5A27', '#4A7C3C', '#6A9E4A', '#8ABF6A', '#AADF8A'],
    neon: ['#FF00FF', '#00FFFF', '#FF00CC', '#33FF33', '#FFFF00'],
    galaxy: ['#4A00E0', '#6E00FF', '#8E2DE2', '#A020F0', '#C040FF']
  },
  
  // گرفتن رنگ از پالت
  getPaletteColor: (paletteName, index, total) => {
    const palette = colorUtils.palettes[paletteName] || colorUtils.palettes.sunset;
    return palette[Math.floor(index / total * palette.length) % palette.length];
  }
};