'use client';

import { motion } from 'framer-motion';
import { useInView } from './useInView';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageReveal({ src, alt, className = '' }: ImageRevealProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ overflow: 'hidden', position: 'relative' }}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={
        isInView
          ? { clipPath: 'inset(0 0% 0 0)' }
          : { clipPath: 'inset(0 100% 0 0)' }
      }
      transition={{
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </motion.div>
  );
}
