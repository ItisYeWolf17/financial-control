import { useEffect, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowsClockwise,
  Bank,
  ChartDonut,
  PiggyBank,
  Wallet,
} from '@phosphor-icons/react';
import { money } from '@/domain/money';
import { KpiCard, KpiCardSkeleton, type Kpi } from '@/ui/KpiCard';
import { Card } from '@/ui/Card';
import { Skeleton } from '@/ui/Skeleton';
import { BarRows } from '@/ui/charts/BarRows';
import { ColumnChart } from '@/ui/charts/ColumnChart';
import { DonutChart } from '@/ui/charts/DonutChart';
import { composicionDeuda, flujoDeCaja, gastoPorCategoria, quincenas } from './mockData';

const KPIS: Kpi[] = [
  {
    id: 'ingresos',
    label: 'Ingresos',
    value: money(298720),
    sub: 'de ₡597,440 previstos',
    icon: ArrowDownLeft,
    tone: 'good',
    meter: { part: 298720, whole: 597440 },
  },
  {
    id: 'gastos',
    label: 'Gastos',
    value: money(315223),
    sub: 'de ₡589,708 previstos',
    icon: ArrowUpRight,
    tone: 'critical',
    meter: { part: 315223, whole: 589708 },
  },
  {
    id: 'disponible',
    label: 'Disponible',
    value: money(227220),
    sub: 'en cuentas líquidas',
    icon: Wallet,
  },
  {
    id: 'ahorros',
    label: 'Ahorros',
    value: money(1755000),
    sub: '29% de las metas',
    icon: PiggyBank,
    tone: 'info',
    meter: { part: 1755000, whole: 6150000 },
  },
  {
    id: 'deudas',
    label: 'Deudas',
    value: money(1111400),
    sub: '₡181,000 al mes · 16% del saldo',
    icon: Bank,
    tone: 'warning',
    meter: { part: 181000, whole: 1111400 },
  },
];

/**
 * Vista de revisión del sistema visual: los gráficos del dashboard con los
 * datos del diseño. Sirve para ver el comportamiento de carga y las
 * animaciones antes de que haya Firestore detrás.
 */
export function DashboardPreview() {
  const [loading, setLoading] = useState(true);
  const [pass, setPass] = useState(0);

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(id);
  }, [pass]);

  return (
    <div style={{ padding: '24px 22px 56px', maxWidth: 1280, margin: '0 auto' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
          marginBottom: 22,
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: 6,
            }}
          >
            <ChartDonut size={15} color="var(--color-accent-300)" aria-hidden="true" />
            Caudal · septiembre 2026
          </div>
          <h2>Resumen</h2>
        </div>
        <button
          type="button"
          onClick={() => setPass((p) => p + 1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            border: '1px solid var(--color-divider)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-secondary)',
            borderRadius: 'var(--radius)',
            padding: '7px 12px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          <ArrowsClockwise size={14} aria-hidden="true" />
          Recargar datos
        </button>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(158px, 1fr))',
          gap: 12,
        }}
      >
        {loading
          ? KPIS.map((k) => <KpiCardSkeleton key={k.id} />)
          : KPIS.map((k, i) => (
              <div key={k.id} className="enter" style={{ '--i': i } as React.CSSProperties}>
                <KpiCard {...k} />
              </div>
            ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: 12,
          marginTop: 12,
          alignItems: 'start',
        }}
      >
        <Card>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <ColumnChart
              title="Flujo de caja del mes"
              note="Previsto"
              data={flujoDeCaja}
              height={168}
            />
          )}
        </Card>

        <Card>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <BarRows
              title="Gasto por categoría"
              note="1ª quincena · real"
              data={gastoPorCategoria}
            />
          )}
        </Card>

        <Card>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <DonutChart
              title="Composición de la deuda"
              note="Saldo pendiente"
              data={composicionDeuda}
              caption="Deuda total"
            />
          )}
        </Card>

        <Card>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <ColumnChart
              title="Presupuesto por quincena"
              note="Previsto"
              data={quincenas}
              height={168}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div aria-hidden="true">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
        <Skeleton width={150} height={14} />
        <Skeleton width={64} height={10} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
        {[58, 92, 44, 120, 76].map((h, i) => (
          <Skeleton key={i} height={h} radius="4px 4px 0 0" />
        ))}
      </div>
    </div>
  );
}
