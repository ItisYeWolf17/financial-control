import { formatMoney } from '@/domain/money';
import { useInView } from '@/lib/motion';
import { ChartFrame } from './ChartFrame';
import { useTooltip } from './useTooltip';
import type { Datum } from './types';
import './chart.css';

interface ColumnChartProps {
  title: string;
  note?: string | undefined;
  data: Datum[];
  height?: number | undefined;
  symbol?: string | undefined;
  /** Muestra el valor sobre cada cabeza de columna. Con más de ~6 columnas, apagalo. */
  labelCaps?: boolean | undefined;
}

/**
 * Columnas desde una sola línea base. Crecen al entrar en pantalla, con un
 * escalonado corto que se lee como una sola transición.
 *
 * Los negativos se grafican por magnitud —el color y el signo de la etiqueta
 * llevan la dirección—, porque el flujo de caja compara tamaños de salida
 * contra tamaños de entrada.
 */
export function ColumnChart({
  title,
  note,
  data,
  height = 140,
  symbol = '₡',
  labelCaps = true,
}: ColumnChartProps) {
  const { containerRef, tooltip, show, hide } = useTooltip();
  const { ref: viewRef, inView } = useInView<HTMLDivElement>();
  const max = Math.max(...data.map((d) => Math.abs(d.value)), 1);

  /* El tooltip se ancla a la barra, no al botón: el botón ocupa todo el alto
     de la columna y el globo terminaría flotando sobre el título. */
  const markOf = (column: Element) => column.querySelector('.viz-col-bar') ?? column;

  return (
    <div ref={containerRef}>
      <ChartFrame title={title} note={note} data={data} tooltip={tooltip} symbol={symbol}>
        <div
          ref={viewRef}
          className="viz-cols"
          style={{ height, maxWidth: Math.max(240, data.length * 116) }}
        >
          {data.map((d, i) => {
            const color = d.color ?? 'var(--ramp-3)';
            const barHeight = inView ? Math.max(4, (Math.abs(d.value) / max) * (height - 46)) : 0;
            return (
              <button
                key={d.id}
                type="button"
                className="viz-col"
                onPointerEnter={(e) =>
                  show(markOf(e.currentTarget), {
                    label: d.label,
                    value: formatMoney(d.value, { symbol, signed: true }),
                    color,
                    ...(d.note && { note: d.note }),
                  })
                }
                onPointerLeave={hide}
                onFocus={(e) =>
                  show(markOf(e.currentTarget), {
                    label: d.label,
                    value: formatMoney(d.value, { symbol, signed: true }),
                    color,
                    ...(d.note && { note: d.note }),
                  })
                }
                onBlur={hide}
              >
                {labelCaps && (
                  <span className="viz-col-value" style={{ color }}>
                    {formatMoney(d.value, { symbol, compact: true })}
                  </span>
                )}
                <span
                  className="viz-col-bar"
                  style={{
                    height: barHeight,
                    background: `color-mix(in srgb, ${color} 22%, transparent)`,
                    borderTop: `2px solid ${color}`,
                    transitionDelay: `${i * 60}ms`,
                  }}
                  aria-hidden="true"
                />
                <span className="viz-col-key">{d.label}</span>
              </button>
            );
          })}
        </div>
      </ChartFrame>
    </div>
  );
}
