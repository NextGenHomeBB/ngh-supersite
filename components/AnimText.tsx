'use client';

import { motion } from 'framer-motion';
import { useInView } from './useInView';
import type { ElementType, CSSProperties } from 'react';

interface AnimTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export default function AnimText({
  text,
  className = '',
  delay = 0,
  as: Tag = 'p',
}: AnimTextProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });

  const words = text.split(' ');

  const wordStyle: CSSProperties = {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    wordBreak: 'keep-all',
    overflowWrap: 'normal',
  };

  let letterIndex = 0;

  return (
    <Tag ref={ref as any} className={className} style={{ wordBreak: 'keep-all', overflowWrap: 'normal' }}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} style={wordStyle}>
          {word.split('').map((letter) => {
            const currentIndex = letterIndex++;
            return (
              <motion.span
                key={`${wordIdx}-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.4,
                  delay: delay + currentIndex * 0.03,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{ display: 'inline-block' }}
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIdx < words.length - 1 && (
            <span style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  );
}
