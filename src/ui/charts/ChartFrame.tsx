import { useId, useState, type ReactNode } from 'react';
import { formatMoney } from '@/domain/money';
import type { Datum, TooltipState } from './types';
import './chart.css';

interface ChartFrameProps {
  title: string;
  note?: string | undefined;
  /** Con dos o más series la leyenda es obligatoria; con una, el título ya la nombra. */
  legend?: Datum[] | undefined;
  data: Datum[];
  /** Encabezado de la columna de valores en la vista de tabla. */
  valueHeader?: string | undefined;
  tooltip?: TooltipState | null | undefined;
  symbol?: string | undefined;
  children: ReactNode;
}

/**
 * Marco de un gráfico: título, leyenda, tooltip y **vista de tabla**.
 *
 * La tabla no es un extra: es lo que garantiza que ninguna cifra dependa del
 * hover (ni del color) para ser legible.
 */
export function ChartFrame({
  title,
  note,
  legend,
  data,
  valueHeader = 'Monto',
  tooltip,
  symbol = '₡',
  children,
}: ChartFrameProps) {
  const [showTable, setShowTable] = useState(false);
  const tableId = useId();

  return (
    <div className="viz">
      <div className="viz-head">
        <h3 className="viz-title">{title}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          {note && <span className="viz-note">{note}</span>}
          <button
            type="button"
            className="viz-toggle"
            aria-expanded={showTable}
            aria-controls={tableId}
            onClick={() => setShowTable((v) => !v)}
          >
            {showTable ? 'Ver gráfico' : 'Ver tabla'}
          </button>
        </div>
      </div>

      {legend && legend.length > 1 && (
        <ul className="viz-legend">
          {legend.map((d) => (
            <li key={d.id} className="viz-legend-item">
              <span className="viz-swatch" style={{ background: d.color }} aria-hidden="true" />
              {d.label}
            </li>
          ))}
        </ul>
      )}

      <div id={tableId}>
        {showTable ? (
          <table className="viz-table">
            <thead>
              <tr>
                <th scope="col">Concepto</th>
                <th scope="col">{valueHeader}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id}>
                  <th scope="row" style={{ fontWeight: 400, color: 'var(--color-text)' }}>
                    {d.label}
                    {d.note && <span className="viz-note"> · {d.note}</span>}
                  </th>
                  <td>{formatMoney(d.value, { symbol })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          children
        )}
      </div>

      {!showTable && tooltip && (
        <div className="viz-tip" style={{ left: tooltip.x, top: tooltip.y - 10 }} role="status">
          <div className="viz-tip-value">{tooltip.value}</div>
          <div className="viz-tip-label">
            <span className="viz-tip-key" style={{ background: tooltip.color }} aria-hidden="true" />
            {tooltip.label}
          </div>
          {tooltip.note && <div className="viz-note">{tooltip.note}</div>}
        </div>
      )}
    </div>
  );
}
