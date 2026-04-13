'use client';

import { useInView } from './useInView';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });

  return (
    <>
      <style>{`
        .ngh-glitch-wrap {
          position: relative;
          display: inline-block;
        }

        .ngh-glitch-text {
          position: relative;
        }

        .ngh-glitch-text::before,
        .ngh-glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }

        .ngh-glitch-text::before {
          color: var(--gold, #C6A96C);
          clip-path: inset(0 0 65% 0);
        }

        .ngh-glitch-text::after {
          color: var(--sand, #C8B9A6);
          clip-path: inset(60% 0 0 0);
        }

        .ngh-glitch-active .ngh-glitch-text::before {
          animation: ngh-glitch-top 0.6s ease-out 0.2s forwards;
        }

        .ngh-glitch-active .ngh-glitch-text::after {
          animation: ngh-glitch-bottom 0.6s ease-out 0.3s forwards;
        }

        @keyframes ngh-glitch-top {
          0% {
            opacity: 0.8;
            transform: translate(-3px, -2px);
          }
          20% {
            opacity: 0.6;
            transform: translate(2px, 1px);
          }
          40% {
            opacity: 0.4;
            transform: translate(-1px, -1px);
          }
          60% {
            opacity: 0.2;
            transform: translate(1px, 0px);
          }
          100% {
            opacity: 0;
            transform: translate(0, 0);
          }
        }

        @keyframes ngh-glitch-bottom {
          0% {
            opacity: 0.7;
            transform: translate(2px, 2px);
          }
          25% {
            opacity: 0.5;
            transform: translate(-2px, -1px);
          }
          50% {
            opacity: 0.3;
            transform: translate(1px, 1px);
          }
          75% {
            opacity: 0.15;
            transform: translate(-1px, 0);
          }
          100% {
            opacity: 0;
            transform: translate(0, 0);
          }
        }
      `}</style>
      <div
        ref={ref}
        className={`ngh-glitch-wrap ${isInView ? 'ngh-glitch-active' : ''} ${className}`}
      >
        <span className="ngh-glitch-text" data-text={text}>
          {text}
        </span>
      </div>
    </>
  );
}
