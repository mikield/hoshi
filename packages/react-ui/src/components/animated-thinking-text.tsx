'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../lib/utils';

const THINKING_MESSAGES = [
  'Considering next steps...',
  'Analyzing the problem...',
  'Working through the details...',
  'Piecing it together...',
  'Processing information...',
  'Forming a response...',
  'Reasoning through this...',
  'Evaluating options...',
  'Connecting the dots...',
  'Building on context...',
];

const TYPING_SPEED = 24;
const SHIMMER_DURATION = 900;
const SHIMMER_COUNT = 2;
const SHIMMER_GAP = 400;
const SHIMMER_CYCLE = SHIMMER_DURATION + SHIMMER_GAP;
const CLEAR_DURATION = 300;
const PAUSE_AFTER_CLEAR = 150;

type Phase = 'typing' | 'shimmer' | 'clearing';

interface AnimatedThinkingTextProps {
  /** Override text — when provided (e.g. a real status from the server),
   *  it types that text in then shimmers it on loop.
   *  When undefined, cycles through ambient THINKING_MESSAGES. */
  statusText?: string;
  className?: string;
}

function AnimatedThinkingTextComponent({ statusText, className }: AnimatedThinkingTextProps) {
  const [msgIdx, setMsgIdx] = useState(() =>
    Math.floor(Math.random() * THINKING_MESSAGES.length),
  );
  const [phase, setPhase] = useState<Phase>('typing');
  const [visibleText, setVisibleText] = useState('');
  const [opacity, setOpacity] = useState(1);
  const [blur, setBlur] = useState(0);

  const [shimmerActive, setShimmerActive] = useState(false);
  const shimmerNodeRef = useRef<HTMLSpanElement>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const charRef = useRef(0);
  const shimmersDone = useRef(0);
  const prevStatus = useRef(statusText);
  const fullText = useRef(
    statusText || THINKING_MESSAGES[msgIdx % THINKING_MESSAGES.length],
  );

  const resolveText = useCallback(
    (idx: number) => statusText || THINKING_MESSAGES[idx % THINKING_MESSAGES.length],
    [statusText],
  );

  useEffect(() => {
    if (statusText === prevStatus.current) return;
    prevStatus.current = statusText;
    clearTimeout(timerRef.current);
    setPhase('clearing');
  }, [statusText]);

  useEffect(() => {
    if (phase !== 'typing') return;
    fullText.current = resolveText(msgIdx);
    charRef.current = 0;
    setVisibleText('');
    setOpacity(1);
    setBlur(0);
    setShimmerActive(false);

    const tick = () => {
      charRef.current += 1;
      const txt = fullText.current.slice(0, charRef.current);
      setVisibleText(txt);
      if (charRef.current < fullText.current.length) {
        timerRef.current = setTimeout(tick, TYPING_SPEED);
      } else {
        shimmersDone.current = 0;
        timerRef.current = setTimeout(() => setPhase('shimmer'), 200);
      }
    };
    timerRef.current = setTimeout(tick, TYPING_SPEED);
    return () => clearTimeout(timerRef.current);
  }, [phase, msgIdx, resolveText]);

  useEffect(() => {
    if (phase !== 'shimmer') return;

    fullText.current = resolveText(msgIdx);
    setVisibleText(fullText.current);
    setOpacity(1);
    setBlur(0);

    const hasPersistentStatus = Boolean(statusText);

    if (hasPersistentStatus) {
      setShimmerActive(true);
      return;
    }

    let cancelled = false;

    const runSweep = () => {
      if (cancelled) return;
      shimmersDone.current += 1;

      setShimmerActive(true);

      timerRef.current = setTimeout(() => {
        if (cancelled) return;
        setShimmerActive(false);

        if (shimmersDone.current < SHIMMER_COUNT) {
          timerRef.current = setTimeout(runSweep, SHIMMER_GAP);
        } else {
          timerRef.current = setTimeout(() => setPhase('clearing'), SHIMMER_GAP);
        }
      }, SHIMMER_DURATION);
    };

    timerRef.current = setTimeout(runSweep, 100);
    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
    };
  }, [phase, msgIdx, statusText, resolveText]);

  useEffect(() => {
    if (phase !== 'clearing') return;
    setShimmerActive(false);
    setOpacity(0);
    setBlur(4);

    timerRef.current = setTimeout(() => {
      setMsgIdx((i) => (i + 1) % THINKING_MESSAGES.length);
      setVisibleText('');
      setOpacity(1);
      setBlur(0);
      setPhase('typing');
    }, CLEAR_DURATION + PAUSE_AFTER_CLEAR);

    return () => clearTimeout(timerRef.current);
  }, [phase]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const shimmerStyle: React.CSSProperties = shimmerActive
    ? {
        backgroundImage:
          'linear-gradient(90deg, transparent calc(50% - var(--spread)), var(--highlight-soft) calc(50% - var(--spread-soft)), var(--highlight), var(--highlight-soft) calc(50% + var(--spread-soft)), transparent calc(50% + var(--spread))), linear-gradient(var(--base), var(--base))',
        backgroundSize: '220% 100%, auto',
        backgroundRepeat: 'no-repeat, padding-box',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        animation: statusText
          ? `thinking-shimmer-pause ${SHIMMER_CYCLE}ms linear infinite`
          : `thinking-shimmer ${SHIMMER_DURATION}ms linear forwards`,
        '--spread': `${Math.max((fullText.current.length || 10) * 1.3, 14)}px`,
        '--spread-soft': `${Math.max((fullText.current.length || 10) * 0.45, 6)}px`,
        '--base': 'var(--shimmer-base)',
        '--highlight': 'var(--shimmer-highlight)',
        '--highlight-soft': 'var(--shimmer-highlight-soft)',
      } as React.CSSProperties
    : {};

  return (
    <span
      className={cn(
        'relative inline-flex items-center min-h-[1.2em]',
        '[--shimmer-base:#a1a1aa] [--shimmer-highlight:#27272a] [--shimmer-highlight-soft:#3f3f46]',
        'dark:[--shimmer-base:#71717a] dark:[--shimmer-highlight:#f4f4f5] dark:[--shimmer-highlight-soft:#d4d4d8]',
        className,
      )}
    >
      <span
        ref={shimmerNodeRef}
        className={cn(
          'inline-block transition-[opacity,filter]',
          !shimmerActive && 'text-muted-foreground',
        )}
        style={{
          opacity,
          filter: `blur(${blur}px)`,
          transitionDuration: phase === 'clearing' ? `${CLEAR_DURATION}ms` : '0ms',
          ...shimmerStyle,
        }}
      >
        {visibleText || ' '}
      </span>
    </span>
  );
}

export const AnimatedThinkingText = React.memo(AnimatedThinkingTextComponent);
