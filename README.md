# 🎬 Animation Trigger

A simple, lightweight JavaScript library to animate multiple elements with custom animations on a single click. Zero dependencies, works with any framework (React, Vue, Vanilla JS).

[![npm version](https://badge.fury.io/js/animation-trigger.svg)](https://www.npmjs.com/package/animation-trigger)
[![downloads](https://img.shields.io/npm/dm/animation-trigger.svg)](https://www.npmjs.com/package/animation-trigger.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://36kxph.csb.app/)

## ✨ Features

- 🚀 **Simple API** - Just 3 lines of code!
- 🎯 **Custom animations per element** - Each element can have its own animation
- 🎨 **15+ built-in animations** - Exit animations (slide, fade, zoom, rotate) + Enter animations (slide, fade, zoom, rotate, bounce)
- 🔄 **Toggle mode** - Show/hide elements with enter/exit animations
- ⚡ **Zero dependencies** - Lightweight and fast
- 🔧 **Works everywhere** - React, Vue, Angular, or vanilla JS
- 📦 **Tree-shakable** - Only import what you need

## 📦 Installation

```bash
npm install animation-trigger
```
🚀 Quick Start

Vanilla JavaScript
```bash
import { AnimationTrigger } from 'animation-trigger';

// Exit only - elements will be removed after animation
new AnimationTrigger({
  elements: ['.modal', '.popup', '.form'],
  exitAnimations: ['slideOutLeft', 'fadeOut', 'slideOutUp'],
  activator: '#closeButton'
});

// Toggle mode - show/hide with enter/exit animations
new AnimationTrigger({
  elements: ['.menu', '.sidebar'],
  exitAnimations: ['slideOutLeft', 'slideOutUp'],
  enterAnimations: ['slideInRight', 'slideInDown'],
  activator: '#toggleButton',
  toggle: true  // Click to toggle visibility
});
```

React
```bash
import React, { useEffect } from 'react';
import { AnimationTrigger } from 'animation-trigger';

function App() {
  useEffect(() => {
    // Exit only
    new AnimationTrigger({
      elements: ['.box1', '.box2', '.box3'],
      exitAnimations: ['slideOutLeft', 'fadeOut', 'rotateOut'],
      activator: '#deleteBtn'
    });
    
    // Toggle mode
    new AnimationTrigger({
      elements: ['.panel'],
      exitAnimations: ['slideOutUp'],
      enterAnimations: ['slideInDown'],
      activator: '#togglePanel',
      toggle: true
    });
  }, []);

  return (
    <div>
      <div className="box1">Box 1</div>
      <div className="box2">Box 2</div>
      <div className="box3">Box 3</div>
      <button id="deleteBtn">Delete All</button>
      <button id="togglePanel">Toggle Panel</button>
    </div>
  );
}
```

📖 API
AnimationTrigger(config)
Parameter	Type	Default	Description
elements	string[]	required	CSS selectors of elements to animate
exitAnimations	string[]	required	Exit animation types for each element (must match elements count)
enterAnimations	string[]	optional	Enter animation types for toggle mode
activator	string	required	CSS selector of the button that triggers animations
toggle	boolean	false	If true, toggles visibility (show/hide). If false, removes elements after exit

🎨 Available Animations
Exit Animations (Elements leave the screen)
Animation	Description
slideOutLeft	Slides element out to the left
slideOutRight	Slides element out to the right
slideOutUp	Slides element out to the top
slideOutDown	Slides element out to the bottom
fadeOut	Fades element out
zoomOut	Zooms out and fades element
rotateOut	Rotates and fades element
Enter Animations (Elements appear on screen) 🆕
Animation	Description
slideInLeft	Slides element in from the left
slideInRight	Slides element in from the right
slideInUp	Slides element in from the bottom
slideInDown	Slides element in from the top
fadeIn	Fades element in
zoomIn	Zooms in and fades element
rotateIn	Rotates and fades in
bounceIn	Bounces in with elastic effect

💡 Examples
Example 1: Different exit animations
```bash
new AnimationTrigger({
  elements: ['.header', '.content', '.footer'],
  exitAnimations: ['slideOutUp', 'fadeOut', 'slideOutDown'],
  activator: '#closeAll'
});
```

Example 2: Same animation for multiple elements
```bash
new AnimationTrigger({
  elements: ['.card1', '.card2', '.card3'],
  exitAnimations: ['slideOutLeft', 'slideOutLeft', 'slideOutLeft'],
  activator: '#removeCards'
});
```

Example 3: Toggle mode with enter/exit animations
```bash
new AnimationTrigger({
  elements: ['.dropdown', '.menu'],
  exitAnimations: ['slideOutUp', 'fadeOut'],
  enterAnimations: ['slideInDown', 'fadeIn'],
  activator: '#menuButton',
  toggle: true  // Click once to hide, click again to show
});
```

Example 4: Modal with fade animation
```bash
new AnimationTrigger({
  elements: ['.modal', '.overlay'],
  exitAnimations: ['zoomOut', 'fadeOut'],
  activator: '#closeModal'
});
```

🔧 Advanced Usage
Using the AnimationEngine directly
For more control, you can use the core AnimationEngine:
```bash
import { AnimationEngine } from 'animation-trigger';

// Initialize
AnimationEngine.init();

// Exit animation
const element = document.querySelector('.my-element');
AnimationEngine.exit(element, 'slideOutLeft', {
  duration: 800,
  removeAfter: true,
  onComplete: () => console.log('Animation done!')
});

// Enter animation
AnimationEngine.enter(element, 'bounceIn', {
  duration: 600,
  onComplete: () => console.log('Element appeared!')
});
```

React Hook
For React projects, you can also use the built-in hook:
```bash
import { useAnimation } from 'animation-trigger';

function MyComponent() {
  useAnimation({
    elements: ['.modal', '.backdrop'],
    exitAnimations: ['slideOutUp', 'fadeOut'],
    enterAnimations: ['slideInDown', 'fadeIn'],
    activator: '#closeModal',
    toggle: true
  });

  return <div>...</div>;
}
```

🛠️ Browser Support
Works in all modern browsers that support CSS animations:

Chrome 45+

Firefox 42+

Safari 10+

Edge 15+

📝 License
MIT © Hamidreza Norouzi

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository

Create your feature branch (git checkout -b feature/amazing)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/amazing)

Open a Pull Request

📧 Contact
GitHub: @hnorouzi

Email: hamidreza.norouzi1997@gmail.com

Made with ❤️ by Hamidreza Norouzi
