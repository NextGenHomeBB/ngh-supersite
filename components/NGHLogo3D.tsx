'use client';

import { motion } from 'framer-motion';

interface NGHLogo3DProps {
  scale?: number;
}

export default function NGHLogo3D({ scale = 1 }: NGHLogo3DProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}
    >
      {/* Arch / crown motif */}
      <svg
        width="220"
        height="48"
        viewBox="0 0 220 48"
        fill="none"
        style={{ marginBottom: -4 }}
      >
        {/* Left line */}
        <line x1="20" y1="46" x2="72" y2="10" stroke="url(#archGold)" strokeWidth="1.2" />
        {/* Arch crown */}
        <path
          d="M72 10 Q110 -4 148 10"
          stroke="url(#archGold)"
          strokeWidth="1.2"
          fill="none"
        />
        {/* Right line */}
        <line x1="148" y1="10" x2="200" y2="46" stroke="url(#archGold)" strokeWidth="1.2" />
        {/* Diamond at apex */}
        <polygon
          points="110,0 116,8 110,16 104,8"
          fill="url(#diamondGold)"
        />
        {/* Small dots at base corners */}
        <circle cx="20" cy="46" r="2.5" fill="#C6A96C" opacity="0.7" />
        <circle cx="200" cy="46" r="2.5" fill="#C6A96C" opacity="0.7" />

        <defs>
          <linearGradient id="archGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B6914" stopOpacity="0.6" />
            <stop offset="35%" stopColor="#C6A96C" stopOpacity="1" />
            <stop offset="65%" stopColor="#E8C96A" stopOpacity="1" />
            <stop offset="100%" stopColor="#8B6914" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="diamondGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5D78A" />
            <stop offset="50%" stopColor="#C6A96C" />
            <stop offset="100%" stopColor="#8B6914" />
          </linearGradient>
        </defs>
      </svg>

      {/* 3D Letters — NGH */}
      <div
        style={{
          perspective: '600px',
          perspectiveOrigin: '50% 40%',
        }}
      >
        <motion.div
          animate={{
            rotateX: [0, 1.5, 0, -1.5, 0],
            rotateY: [0, 2, 0, -2, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            display: 'flex',
            gap: '0.04em',
            transformStyle: 'preserve-3d',
          }}
        >
          {['N', 'G', 'H'].map((letter, i) => (
            <span
              key={letter}
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 'clamp(72px, 14vw, 128px)',
                fontWeight: 400,
                letterSpacing: '0.08em',
                lineHeight: 1,
                display: 'inline-block',
                // Metallic gold gradient fill
                background:
                  'linear-gradient(160deg, #F5D78A 0%, #E8C050 18%, #C6A96C 40%, #F0D080 55%, #C6A96C 72%, #8B6914 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                // 3D extrusion shadow
                filter:
                  'drop-shadow(0px 1px 0px rgba(139,105,20,0.9)) drop-shadow(0px 2px 0px rgba(100,70,10,0.7)) drop-shadow(0px 3px 0px rgba(70,45,5,0.5)) drop-shadow(0px 6px 20px rgba(0,0,0,0.5))',
                // Subtle individual delay for stagger
                animationDelay: `${i * 0.06}s`,
              }}
            >
              {letter}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Thin divider with corner marks */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 6,
          marginBottom: 8,
        }}
      >
        <div style={{ width: 36, height: 1, background: 'linear-gradient(to right, transparent, #C6A96C)' }} />
        <svg width="8" height="8" viewBox="0 0 8 8">
          <polygon points="4,0 8,4 4,8 0,4" fill="#C6A96C" />
        </svg>
        <div style={{ width: 36, height: 1, background: 'linear-gradient(to left, transparent, #C6A96C)' }} />
      </div>

      {/* Subtext */}
      <div
        style={{
          fontFamily: '"Inter", "Helvetica Neue", sans-serif',
          fontSize: 'clamp(9px, 1.5vw, 13px)',
          letterSpacing: '0.35em',
          fontWeight: 300,
          color: '#C6A96C',
          textTransform: 'uppercase',
          opacity: 0.9,
        }}
      >
        Property Group
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 'clamp(11px, 1.8vw, 15px)',
          letterSpacing: '0.12em',
          fontStyle: 'italic',
          color: 'rgba(245, 240, 232, 0.75)',
          marginTop: 6,
          fontWeight: 400,
        }}
      >
        Real Estate Development · Bali
      </div>
    </motion.div>
  );
}
