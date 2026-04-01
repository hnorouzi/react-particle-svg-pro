# 🎨 react-particle-svg-pro

[![npm version](https://badge.fury.io/js/react-particle-svg-pro.svg)](https://www.npmjs.com/package/react-particle-svg-pro)
[![npm downloads](https://img.shields.io/npm/dm/react-particle-svg-pro.svg)](https://www.npmjs.com/package/react-particle-svg-pro)
[![license](https://img.shields.io/npm/l/react-particle-svg-pro.svg)](https://github.com/hnorouzi/react-particle-svg-pro/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/hnorouzi/react-particle-svg-pro)](https://github.com/hnorouzi/react-particle-svg-pro/stargazers)

**Turn any SVG logo into thousands of animated particles with professional effects** ✨

Transform your SVG logos into stunning particle animations with explode, fade, and mouse interaction effects. Perfect for landing pages, portfolio showcases, and interactive backgrounds.

---

## ✨ Features

### 🎯 Core
- 🔄 Convert any SVG into thousands of moving particles
- 💥 Explode animation with realistic physics effects
- 🌊 Gradual fade-out animation
- 🖱️ Mouse interaction (repel/attract particles)

### 🎨 Visual
- 🌈 3 color modes: Single, Rainbow, Heat
- ⚪ 4 particle shapes: Circle, Square, Triangle, Star
- ✨ Random glow effect on particles
- 🎭 4 animation modes: Morph, Vortex, Wave, Bounce

### 🎮 Export
- 📸 Screenshot capture and download
- 🎥 Video recording (MP4)
- 💾 Save/load state to localStorage
- 🔊 Optional sound effects

---

## 📦 Installation

npm install react-particle-svg-pro

or with yarn:

yarn add react-particle-svg-pro

---

## 🚀 Quick Start

import React, { useRef } from 'react';
import ParticleSVG from 'react-particle-svg-pro';

const myLogo = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="black"/></svg>`;

function App() {
  const particleRef = useRef();
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ParticleSVG
        ref={particleRef}
        svgString={myLogo}
        particleCount={2500}
        colorMode="rainbow"
        animationMode="vortex"
        onComplete={() => console.log('Logo formed!')}
      />
      
      <button onClick={() => particleRef.current?.explode()}>💥 Explode</button>
      <button onClick={() => particleRef.current?.reset()}>🔄 Reset</button>
    </div>
  );
}

---

## 📖 Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| svgString | string | required | SVG content as string |
| particleCount | number | 2000 | Number of particles (500-5000) |
| particleColor | string | #ff6b6b | Particle color |
| backgroundColor | string | #0a0a0a | Background color |
| animationDuration | number | 2500 | Formation animation duration (ms) |
| explodeDuration | number | 800 | Explode animation duration (ms) |
| fadeDuration | number | 2000 | Fade out duration (ms) |
| colorMode | string | single | single, rainbow, heat |
| animationMode | string | morph | morph, vortex, wave, bounce |
| particleShape | string | circle | circle, square, triangle, star |
| mouseEffect | boolean | true | Enable/disable mouse interaction |
| mouseEffectType | string | repel | repel or attract |
| autoStart | boolean | true | Auto-start animation on load |

---

## 🎮 Ref Methods

| Method | Description |
|--------|-------------|
| explode() | Trigger explode animation |
| reset() | Reset to initial state |
| downloadScreenshot(filename) | Download screenshot as PNG |
| downloadVideo(filename, duration) | Download animation as MP4 |
| getProgress() | Get current progress (0-100) |
| isAnimating() | Check if animation is running |
| saveState() | Save current state to localStorage |
| loadState() | Load saved state from localStorage |

---

## 🎯 Callbacks

| Callback | Description |
|----------|-------------|
| onReady | Called when component is ready |
| onStart | Called when animation starts |
| onProgress | Called with progress (0-100) |
| onComplete | Called when formation completes |
| onExplodeStart | Called when explode starts |
| onExplodeComplete | Called when explode completes |
| onFadeComplete | Called when fade completes |

---

## 🎨 Example with Controls

import React, { useRef, useState } from 'react';
import ParticleSVG from 'react-particle-svg-pro';

function Example() {
  const ref = useRef();
  const [progress, setProgress] = useState(0);
  
  return (
    <div>
      <ParticleSVG
        ref={ref}
        svgString={myLogo}
        particleCount={3000}
        colorMode="rainbow"
        onProgress={setProgress}
      />
      
      <div>
        <button onClick={() => ref.current?.explode()}>💥 Explode</button>
        <button onClick={() => ref.current?.reset()}>🔄 Reset</button>
        <button onClick={() => ref.current?.downloadScreenshot()}>📸 Screenshot</button>
        <div>Progress: {progress}%</div>
      </div>
    </div>
  );
}

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

---

## 📄 License

MIT © Hamidreza Norouzi

---

## ⭐ Support

If you like this project, please give it a star on GitHub! ⭐
