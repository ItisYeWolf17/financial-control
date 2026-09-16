import { formatMoney, ratio } from '@/domain/money';
import { useInView } from '@/lib/motion';
import { ChartFrame } from './ChartFrame';
import { useTooltip } from './useTooltip';
import type { Datum } from './types';
import './chart.css';

interface DonutChartProps {
  title: string;
  note?: string | undefined;
  /** Parte-de-un-todo de un vistazo: hasta 6 segmentos. El resto va a "Otros". */
  data: Datum[];
  caption?: string | undefined;
  symbol?: string | undefined;
  size?: number | undefined;
}

const SERIES = [
  'var(--series-1)',
  'var(--series-2)',
  'var(--series-3)',
  'var(--series-4)',
  'var(--series-5)',
  'var(--series-6)',
];

/** Agrupa la cola en "Otros" para no pasar de 6 segmentos ni inventar colores. */
export function foldToSix(data: Datum[]): Datum[] {
  if (data.length <= 6) return data;
  const head = data.slice(0, 5);
  const tail = data.slice(5);
  return [
    ...head,
    {
      id: 'otros',
      label: 'Otros',
      value: tail.reduce((a, d) => a + d.value, 0),
      note: `${tail.length} categorías`,
    },
  ];
}

export function DonutChart({
  title,
  note,
  data,
  caption = 'Total',
  symbol = '₡',
  size = 168,
}: DonutChartProps) {
  const { containerRef, tooltip, show, hide } = useTooltip();
  const { ref: viewRef, inView } = useInView<HTMLDivElement>();

  const segments = foldToSix(data).map((d, i) => ({
    ...d,
    color: d.color ?? SERIES[i] ?? 'var(--ramp-3)',
  }));
  const total = segments.reduce((a, d) => a + Math.abs(d.value), 0);

  const stroke = 16;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  /* 2px de separación en el color de la superficie entre segmentos vecinos. */
  const gap = 2;

  let offset = 0;
  const arcs = segments.map((d) => {
    const length = ratio(Math.abs(d.value), total) * circumference;
    const arc = { ...d, length: Math.max(0, length - gap), offset };
    offset += length;
    return arc;
  });

  return (
    <div ref={containerRef}>
      <ChartFrame
        title={title}
        note={note}
        data={segments}
        legend={segments}
        tooltip={tooltip}
        symbol={symbol}
      >
        <div ref={viewRef} className="viz-donut">
          <div style={{ position: 'relative', width: size, height: size }}>
            <svg
              className="viz-donut-svg"
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              role="img"
              aria-label={`${title}: ${segments.length} categorías`}
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="var(--color-track)"
                strokeWidth={stroke}
              />
              {arcs.map((a, i) => (
                <circle
                  key={a.id}
                  className="viz-arc"
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  stroke={a.color}
                  strokeWidth={stroke}
                  strokeLinecap="butt"
                  strokeDasharray={
                    inView ? `${a.length} ${circumference - a.length}` : `0 ${circumference}`
                  }
                  strokeDashoffset={-a.offset}
                  style={{ transitionDelay: `${i * 70}ms` }}
                  tabIndex={0}
                  onPointerEnter={(e) =>
                    show(e.currentTarget, {
                      label: a.label,
                      value: formatMoney(a.value, { symbol }),
                      color: a.color,
                      note: `${Math.round(ratio(Math.abs(a.value), total) * 100)}% del total`,
                    })
                  }
                  onPointerLeave={hide}
                  onFocus={(e) =>
                    show(e.currentTarget, {
                      label: a.label,
                      value: formatMoney(a.value, { symbol }),
                      color: a.color,
                      note: `${Math.round(ratio(Math.abs(a.value), total) * 100)}% del total`,
                    })
                  }
                  onBlur={hide}
                />
              ))}
            </svg>
            <div className="viz-donut-center">
              <span className="viz-donut-total">{formatMoney(total, { symbol })}</span>
              <span className="viz-donut-caption">{caption}</span>
            </div>
          </div>
        </div>
      </ChartFrame>
    </div>
  );
}
