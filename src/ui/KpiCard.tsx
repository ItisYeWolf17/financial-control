import type { ComponentType } from 'react';
import type { IconProps } from '@phosphor-icons/react';
import { AnimatedMoney } from './charts/AnimatedMoney';
import { Skeleton } from './Skeleton';
import { pct, type Money } from '@/domain/money';
import './ui.css';

export interface Kpi {
  id: string;
  label: string;
  value: Money;
  sub: string;
  icon: ComponentType<IconProps>;
  /** Color del valor y del medidor: estado, no identidad. */
  tone?: 'neutral' | 'good' | 'warning' | 'critical' | 'info';
  /** Parte y total del medidor bajo la cifra. */
  meter?: { part: number; whole: number };
  symbol?: string;
}

const TONE: Record<NonNullable<Kpi['tone']>, string> = {
  neutral: 'var(--color-text)',
  good: 'var(--color-good)',
  warning: 'var(--color-warning)',
  critical: 'var(--color-critical)',
  info: 'var(--color-info)',
};

export function KpiCard({ label, value, sub, icon: Icon, tone = 'neutral', meter, symbol }: Kpi) {
  const color = TONE[tone];
  return (
    <article className="kpi">
      <div className="kpi-label">
        <Icon size={13} weight="regular" aria-hidden="true" />
        {label}
      </div>
      <div className="kpi-value" style={{ color }}>
        <AnimatedMoney value={value} {...(symbol && { symbol })} />
      </div>
      <div className="kpi-sub">{sub}</div>
      {meter && (
        <div className="meter" style={{ marginTop: 10 }}>
          <div
            className="meter-fill"
            style={{ width: `${pct(meter.part, meter.whole)}%`, background: color }}
          />
        </div>
      )}
    </article>
  );
}

export function KpiCardSkeleton() {
  return (
    <article className="kpi" aria-hidden="true">
      <Skeleton width={84} height={10} />
      <Skeleton width={120} height={22} style={{ margin: '9px 0 6px' }} />
      <Skeleton width={96} height={10} />
      <Skeleton height={3} radius={2} style={{ marginTop: 12 }} />
    </article>
  );
}
