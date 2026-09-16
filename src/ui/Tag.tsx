import type { ReactNode } from 'react';
import './ui.css';

type Tone = 'neutral' | 'good' | 'warning' | 'critical' | 'info';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: 'var(--color-surface-3)', fg: 'var(--color-text-secondary)' },
  good: { bg: 'var(--color-good-bg)', fg: 'var(--color-good)' },
  warning: { bg: 'var(--color-warning-bg)', fg: 'var(--color-warning)' },
  critical: { bg: 'var(--color-critical-bg)', fg: 'var(--color-critical)' },
  info: { bg: 'var(--color-info-bg)', fg: 'var(--color-accent-100)' },
};

export function Tag({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  const { bg, fg } = TONES[tone];
  return (
    <span className="tag" style={{ background: bg, color: fg }}>
      {children}
    </span>
  );
}
