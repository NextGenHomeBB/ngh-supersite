'use client';

import { useEffect, useState, useCallback } from 'react';
import { useInView } from './useInView';

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

interface CountUpStatsProps {
  stats: Stat[];
  className?: string;
  duration?: number;
}

function CountUp({ target, duration = 2000, started }: { target: number; duration?: number; started: boolean }) {
  const [current, setCurrent] = useState(0);

  const animate = useCallback(() => {
    if (!started) return;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [target, duration, started]);

  useEffect(() => {
    animate();
  }, [animate]);

  return <>{current}</>;
}

export default function CountUpStats({ stats, className = '', duration = 2000 }: CountUpStatsProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        gap: 32,
        width: '100%',
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .ngh-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
      {stats.map((stat, i) => (
        <div
          key={i}
          className="ngh-stats-grid"
          style={{
            textAlign: 'center',
            padding: '24px 16px',
          }}
        >
          {/* Gold accent line */}
          <div
            style={{
              width: 40,
              height: 3,
              backgroundColor: 'var(--gold, #C6A96C)',
              margin: '0 auto 16px',
            }}
          />
          <div
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 700,
              color: 'var(--charcoal, #1F1F1F)',
              lineHeight: 1.1,
              marginBottom: 8,
            }}
          >
            <CountUp target={stat.value} duration={duration} started={isInView} />
            {stat.suffix && <span>{stat.suffix}</span>}
          </div>
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              color: 'var(--olive, #8A8F83)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 500,
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
