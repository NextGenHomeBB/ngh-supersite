'use client';

import { useEffect, useState, useRef } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
}

export default function ParallaxImage({
  src,
  alt,
  speed = 0.1,
  className = '',
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only calculate when element is in viewport
      if (rect.bottom > 0 && rect.top < windowHeight) {
        const centerOffset = rect.top - windowHeight / 2;
        setTranslateY(centerOffset * speed);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '120%',
          objectFit: 'cover',
          display: 'block',
          transform: `translateY(${translateY}px)`,
          willChange: 'transform',
        }}
      />
    </div>
  );
}
