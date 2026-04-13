'use client';

import { motion } from 'framer-motion';

interface NGHLogoSVGProps {
  width?: number;
  color?: 'gold' | 'white' | 'dark';
  className?: string;
  animated?: boolean;
}

/**
 * Pixel-accurate React SVG recreation of the NGH Bali Property Group logo.
 * Based on the official mark: geometric N·G·H letters with house-peak above G,
 * wing triangles on sides, and "BALI PROPERTY GROUP" wordmark.
 */
export default function NGHLogoSVG({
  width = 340,
  color = 'gold',
  className = '',
  animated = true,
}: NGHLogoSVGProps) {
  const C =
    color === 'gold'
      ? '#C6A96C'
      : color === 'white'
      ? '#F5F0E8'
      : '#1A1208';

  // ViewBox: 1000 × 430  (logo aspect ≈ 2.33)
  const h = Math.round(width / 2.33);

  return (
    <motion.div
      className={className}
      style={{ display: 'inline-block', lineHeight: 0 }}
      initial={animated ? { opacity: 0, scale: 0.88 } : undefined}
      animate={animated ? { opacity: 1, scale: 1 } : undefined}
      transition={animated ? { duration: 1.5, ease: 'easeOut' } : undefined}
    >
      <svg
        viewBox="0 0 1000 430"
        width={width}
        height={h}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* ══════════════════════════════
            LEFT WING TRIANGLE
            Right-pointing chevron at left baseline
        ══════════════════════════════ */}
        <polygon
          points="0,300 140,300 140,230"
          fill={C}
        />

        {/* ══════════════════════════════
            LETTER N  (x 140 → 290)
        ══════════════════════════════ */}
        {/* N left vertical stroke */}
        <rect x="140" y="100" width="42" height="200" fill={C} />
        {/* N diagonal (top-left to bottom-right) */}
        <polygon points="140,100 182,100 290,280 290,300 248,300 140,120" fill={C} />
        {/* N right vertical stroke */}
        <rect x="248" y="100" width="42" height="200" fill={C} />

        {/* ══════════════════════════════
            G LETTER + HOUSE MARK (x 290 → 560)
            House peak centered at x=420, y=8
        ══════════════════════════════ */}

        {/* ── House roof slopes ── */}
        {/* Left slope of roof: from top of G-left-stroke to peak */}
        <polygon points="290,100 332,100 430,8 430,48 380,100" fill={C} />
        {/* Right slope of roof */}
        <polygon points="560,100 518,100 430,8 430,48 480,100" fill={C} />
        {/* Peak cap rectangle */}
        <rect x="410" y="0" width="40" height="18" fill={C} />

        {/* ── G letter body ── */}
        {/* G left vertical stroke (full height) */}
        <rect x="290" y="100" width="42" height="200" fill={C} />
        {/* G top horizontal (partial — open top because roof is the "top") */}
        <rect x="290" y="100" width="200" height="40" fill={C} />
        {/* G bottom horizontal */}
        <rect x="290" y="260" width="200" height="40" fill={C} />
        {/* G inner right vertical (bottom half only — classic G shape) */}
        <rect x="450" y="200" width="42" height="100" fill={C} />
        {/* G inner crossbar at mid-right */}
        <rect x="450" y="200" width="110" height="38" fill={C} />

        {/* ══════════════════════════════
            LETTER H  (x 560 → 730)
        ══════════════════════════════ */}
        {/* H left vertical */}
        <rect x="560" y="100" width="42" height="200" fill={C} />
        {/* H right vertical */}
        <rect x="688" y="100" width="42" height="200" fill={C} />
        {/* H crossbar */}
        <rect x="560" y="185" width="170" height="42" fill={C} />

        {/* ══════════════════════════════
            RIGHT WING TRIANGLE
            Left-pointing chevron at right baseline
        ══════════════════════════════ */}
        <polygon
          points="730,300 730,230 870,300"
          fill={C}
        />

        {/* ══════════════════════════════
            BASELINE
        ══════════════════════════════ */}
        <rect x="0" y="300" width="870" height="6" fill={C} opacity="0.45" />

        {/* ══════════════════════════════
            WORDMARK: BALI PROPERTY GROUP
        ══════════════════════════════ */}
        <text
          x="435"
          y="392"
          textAnchor="middle"
          fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
          fontWeight="700"
          fontSize="46"
          letterSpacing="16"
          fill={C}
        >
          BALI PROPERTY GROUP
        </text>
      </svg>
    </motion.div>
  );
}
