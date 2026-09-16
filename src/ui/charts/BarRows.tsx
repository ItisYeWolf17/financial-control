import { formatMoney, pct } from '@/domain/money';
import { useInView } from '@/lib/motion';
import { ChartFrame } from './ChartFrame';
import { useTooltip } from './useTooltip';
import type { Datum } from './types';
import './chart.css';

interface BarRowsProps {
  title: string;
  note?: string | undefined;
  data: Datum[];
  symbol?: string | undefined;
  /** Total contra el que se mide cada barra. Por defecto, el mayor valor. */
  total?: number | undefined;
}

/**
 * Barras horizontales para categorías nominales.
 *
 * Un solo tono para todas: la longitud ya codifica la magnitud, y pintar
 * "más oscuro = más grande" gastaría el canal de color en información que el
 * gráfico ya muestra. El color solo cambia cuando el dato trae identidad
 * propia (`Datum.color`).
 */
export function BarRows({ title, note, data, symbol = '₡', total }: BarRowsProps) {
  const { containerRef, tooltip, show, hide } = useTooltip();
  const { ref: viewRef, inView } = useInView<HTMLDivElement>();
  const max = total ?? Math.max(...data.map((d) => Math.abs(d.value)), 1);

  return (
    <div ref={containerRef}>
      <ChartFrame title={title} note={note} data={data} tooltip={tooltip} symbol={symbol}>
        <div ref={viewRef} className="viz-rows">
          {data.map((d, i) => {
            const color = d.color ?? 'var(--ramp-3)';
            const share = pct(Math.abs(d.value), max);
            const tip = {
              label: d.label,
              value: formatMoney(d.value, { symbol }),
              color,
              ...(d.note && { note: d.note }),
            };
            return (
              <button
                key={d.id}
                type="button"
                className="viz-row"
                onPointerEnter={(e) => show(e.currentTarget, tip)}
                onPointerLeave={hide}
                onFocus={(e) => show(e.currentTarget, tip)}
                onBlur={hide}
              >
                <span className="viz-row-head">
                  <span style={{ color: 'var(--color-text-secondary)' }}>{d.label}</span>
                  <span className="viz-row-value">{formatMoney(d.value, { symbol })}</span>
                </span>
                <span className="viz-row-track">
                  <span
                    className="viz-row-fill"
                    style={{
                      width: inView ? `${share}%` : '0%',
                      background: color,
                      transitionDelay: `${i * 55}ms`,
                    }}
                    aria-hidden="true"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </ChartFrame>
    </div>
  );
}
