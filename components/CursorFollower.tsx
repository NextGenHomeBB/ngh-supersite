'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CursorFollower() {
  const [mounted, setMounted] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);

  const dotX = useSpring(0, { stiffness: 500, damping: 30 });
  const dotY = useSpring(0, { stiffness: 500, damping: 30 });
  const ringX = useSpring(0, { stiffness: 150, damping: 20 });
  const ringY = useSpring(0, { stiffness: 150, damping: 20 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      setMounted(false);
      return;
    }

    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [dotX, dotY, ringX, ringY, visible]);

  if (mounted === null || mounted === false) return null;

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'var(--gold, #C6A96C)',
          pointerEvents: 'none',
          zIndex: 9999,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference',
          opacity: visible ? 1 : 0,
        }}
      />
      {/* Ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1.5px solid var(--gold, #C6A96C)',
          pointerEvents: 'none',
          zIndex: 9998,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference',
          opacity: visible ? 0.6 : 0,
        }}
      />
    </>
  );
}
