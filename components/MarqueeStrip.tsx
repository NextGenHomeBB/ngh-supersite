'use client';

import type { ReactNode } from 'react';

interface MarqueeStripProps {
  children: ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

export default function MarqueeStrip({
  children,
  speed = 30,
  direction = 'left',
  className = '',
}: MarqueeStripProps) {
  const animationDirection = direction === 'left' ? 'normal' : 'reverse';

  return (
    <>
      <style>{`
        @keyframes ngh-marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
      <div
        className={className}
        style={{
          overflow: 'hidden',
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 'max-content',
            animation: `ngh-marquee-scroll ${speed}s linear infinite`,
            animationDirection,
          }}
        >
          {/* Original */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {children}
          </div>
          {/* Duplicate for seamless loop */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
