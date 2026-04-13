'use client';

import { useEffect, useState } from 'react';

interface WaveOverlayProps {
  color?: string;
  flip?: boolean;
  className?: string;
}

export default function WaveOverlay({
  color = 'var(--cream, #F5F3EE)',
  flip = false,
  className = '',
}: WaveOverlayProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setOffset(window.scrollY * 0.05);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0,
        transform: flip ? 'scaleY(-1)' : undefined,
      }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: 'clamp(60px, 8vw, 120px)',
          display: 'block',
          transform: `translateX(${offset}px)`,
          transition: 'transform 0.1s linear',
        }}
      >
        <path
          d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,30 1440,50 L1440,120 L0,120 Z"
          fill={color}
        />
        <path
          d="M0,60 C240,20 480,90 720,50 C960,10 1200,80 1440,40 L1440,120 L0,120 Z"
          fill={color}
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
