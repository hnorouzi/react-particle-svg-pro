import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import { ParticleEngine } from '../core/ParticleEngine';
import './ParticleSVG.css';

const ParticleSVG = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  
  const {
    svgString,
    particleCount = 2000,
    particleColor = '#ff6b6b',
    backgroundColor = '#0a0a0a',
    animationDuration = 2500,
    explodeDuration = 800,
    fadeDuration = 2000,
    colorMode = 'single',
    animationMode = 'morph',
    mouseEffect = true,
    mouseEffectType = 'repel',
    wobbleEffect = true,
    wobbleIntensity = 1.5,
    autoStart = true,
    onReady,
    onStart,
    onProgress,
    onComplete,
    onExplodeStart,
    onExplodeComplete,
    onFadeComplete,
    className = '',
    style = {},
    ...rest
  } = props;
  
  // متدهای کنترل از طریق ref
  useImperativeHandle(ref, () => ({
    explode: () => {
      if (engineRef.current && !engineRef.current.animating) {
        engineRef.current.explode();
      }
    },
    reset: () => {
      if (engineRef.current) {
        engineRef.current.reset();
      }
    },
    updateConfig: (newConfig) => {
      if (engineRef.current) {
        Object.assign(engineRef.current.options, newConfig);
        engineRef.current.reset();
      }
    },
    downloadScreenshot: async (filename = 'particle-svg.png') => {
      if (canvasRef.current) {
        const dataURL = canvasRef.current.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        link.click();
      }
    },
    getProgress: () => engineRef.current?.animationProgress || 0,
    isAnimating: () => engineRef.current?.animating || false
  }));
  
  // ایجاد موتور و بارگذاری SVG
  useEffect(() => {
    if (!canvasRef.current || !svgString) return;
    
    const engine = new ParticleEngine(canvasRef.current, {
      particleCount,
      particleColor,
      backgroundColor,
      animationDuration,
      explodeDuration,
      fadeDuration,
      colorMode,
      animationMode,
      mouseEffect,
      mouseEffectType,
      wobbleEffect,
      wobbleIntensity,
      svgString,
      onProgress: (progress) => {
        if (onProgress) onProgress(progress);
      },
      onComplete: () => {
        if (onComplete) onComplete();
      },
      onExplodeStart: () => {
        if (onExplodeStart) onExplodeStart();
      },
      onExplodeComplete: () => {
        if (onExplodeComplete) onExplodeComplete();
      },
      onFadeComplete: () => {
        if (onFadeComplete) onFadeComplete();
      }
    });
    
    engineRef.current = engine;
    
    const init = async () => {
      try {
        await engine.loadSVG();
        if (autoStart) {
          if (onStart) onStart();
          engine.startAnimation();
        }
        setIsReady(true);
        if (onReady) onReady();
      } catch (error) {
        console.error('Error loading SVG:', error);
      }
    };
    
    init();
    
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, [svgString]); // فقط با تغییر svgString بازسازی بشه
  
  // به‌روزرسانی تنظیمات بدون بازسازی کامل
  useEffect(() => {
    if (engineRef.current && isReady) {
      engineRef.current.options.particleCount = particleCount;
      engineRef.current.options.colorMode = colorMode;
      engineRef.current.options.animationMode = animationMode;
      engineRef.current.options.particleColor = particleColor;
      engineRef.current.options.backgroundColor = backgroundColor;
      engineRef.current.options.mouseEffectType = mouseEffectType;
      engineRef.current.options.wobbleIntensity = wobbleIntensity;
      
      // ریست کن تا تنظیمات جدید اعمال بشه
      engineRef.current.reset();
    }
  }, [particleCount, colorMode, animationMode, particleColor, backgroundColor, mouseEffectType, wobbleIntensity]);
  
  return (
    <div 
      className={`particle-svg-container ${className}`} 
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      <canvas
        ref={canvasRef}
        className="particle-svg-canvas"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'block' }}
        {...rest}
      />
    </div>
  );
});

ParticleSVG.displayName = 'ParticleSVG';

ParticleSVG.propTypes = {
  svgString: PropTypes.string.isRequired,
  particleCount: PropTypes.number,
  particleColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  animationDuration: PropTypes.number,
  explodeDuration: PropTypes.number,
  fadeDuration: PropTypes.number,
  colorMode: PropTypes.string,
  animationMode: PropTypes.string,
  mouseEffect: PropTypes.bool,
  mouseEffectType: PropTypes.string,
  wobbleEffect: PropTypes.bool,
  wobbleIntensity: PropTypes.number,
  autoStart: PropTypes.bool,
  onReady: PropTypes.func,
  onStart: PropTypes.func,
  onProgress: PropTypes.func,
  onComplete: PropTypes.func,
  onExplodeStart: PropTypes.func,
  onExplodeComplete: PropTypes.func,
  onFadeComplete: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object
};

export default ParticleSVG;