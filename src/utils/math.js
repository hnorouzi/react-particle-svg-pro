// ابزارهای ریاضی پیشرفته
export const math = {
  // ایزینگ functions
  easeInOutCubic: (x) => {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  },
  
  easeOutElastic: (x) => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  },
  
  easeOutBounce: (x) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (x < 1 / d1) {
      return n1 * x * x;
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  },
  
  // محدود کردن عدد بین min و max
  clamp: (value, min, max) => Math.min(max, Math.max(min, value)),
  
  // مپ کردن عدد از یک محدوده به محدوده دیگر
  map: (value, fromMin, fromMax, toMin, toMax) => {
    return ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin;
  },
  
  // فاصله بین دو نقطه
  distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  
  // زاویه بین دو نقطه
  angle: (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1),
  
  // عدد تصادفی بین min و max
  random: (min, max) => Math.random() * (max - min) + min,
  
  // نویز ساده برای حرکت طبیعی
  noise: (seed) => {
    return Math.sin(seed) * 0.5 + 0.5;
  }
};