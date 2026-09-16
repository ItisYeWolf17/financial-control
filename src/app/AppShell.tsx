import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Bell, CalendarBlank, ChartDonut, Plus } from '@phosphor-icons/react';
import { findLedger } from '@/features/ledgers/ledgers';
import { Button } from '@/ui/Button';
import { Segmented } from '@/ui/Segmented';
import { NAV, SCREEN_META, TABBAR } from './nav';
import { LedgerSwitcher } from './LedgerSwitcher';
import { NewTransactionSheet } from '@/features/transactions/NewTransactionSheet';
import './shell.css';

export type Period = 'mes' | 'q1' | 'q2';

/**
 * Armazón de la app: sidebar en escritorio, barra inferior y FAB en móvil.
 *
 * El espacio activo vive en la URL (`/s/:ledgerId/...`), no en un estado
 * suelto: así un enlace compartido abre el mismo espacio que ve quien lo manda,
 * y cambiar de espacio es navegar, con su historial.
 */
export function AppShell() {
  const { ledgerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const ledger = findLedger(ledgerId);

  const [period, setPeriod] = useState<Period>('mes');
  const [txOpen, setTxOpen] = useState(false);

  const base = `/s/${ledger.id}`;
  const rest = location.pathname.replace(`${base}`, '').replace(/^\//, '');
  const activeId = NAV.find((n) => n.path === rest)?.id ?? (rest === 'mas' ? 'mas' : 'dashboard');
  const meta = SCREEN_META[activeId] ?? SCREEN_META['dashboard']!;

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-mark">
            <ChartDonut size={15} aria-hidden="true" />
          </span>
          <span className="sidebar-name">Caudal</span>
        </div>

        <LedgerSwitcher
          current={ledger}
          onSelect={(l) => navigate(`/s/${l.id}/${rest}`.replace(/\/$/, ''))}
        />

        <nav className="sidebar-nav" aria-label="Secciones">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={`${base}/${item.path}`.replace(/\/$/, '')}
                className="nav-item"
                {...(item.id === activeId && { 'aria-current': 'page' as const })}
              >
                <Icon size={16} aria-hidden="true" />
                <span className="nav-item-label">{item.label}</span>
                {item.badge && <span className="nav-item-badge">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-foot">
          <span className="avatar">MR</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12 }}>María Rodríguez</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-faint)' }}>
              {ledger.kind === 'shared' ? 'Espacio compartido' : 'Cuenta personal'}
            </div>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div style={{ minWidth: 0 }}>
            <div className="topbar-kicker">{meta.kicker}</div>
            <div className="topbar-title">{meta.title}</div>
          </div>

          <div className="topbar-tools">
            <span className="chip">
              <CalendarBlank size={14} color="var(--color-text-muted)" aria-hidden="true" />
              Septiembre 2026
            </span>
            <Segmented
              label="Período"
              value={period}
              onChange={setPeriod}
              options={[
                { value: 'mes', label: 'Mes' },
                { value: 'q1', label: '1ª Q' },
                { value: 'q2', label: '2ª Q' },
              ]}
            />
            <Button variant="ghost" aria-label="Alertas">
              <Bell size={16} aria-hidden="true" />
            </Button>
            <Button variant="primary" onClick={() => setTxOpen(true)} className="topbar-new">
              <Plus size={14} aria-hidden="true" />
              Nuevo movimiento
            </Button>
          </div>
        </header>

        <main className="screen" key={location.pathname}>
          <Outlet context={{ ledger, period }} />
        </main>
      </div>

      <button
        type="button"
        className="fab"
        onClick={() => setTxOpen(true)}
        aria-label="Nuevo movimiento"
      >
        <Plus size={22} weight="bold" aria-hidden="true" />
      </button>

      <nav className="tabbar" aria-label="Secciones">
        {TABBAR.map((item) => {
          const Icon = item.icon;
          const current = item.id === activeId;
          return (
            <Link
              key={item.id}
              to={`${base}/${item.path}`.replace(/\/$/, '')}
              className="tab"
              {...(current && { 'aria-current': 'page' as const })}
            >
              <Icon size={19} weight={current ? 'fill' : 'regular'} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <NewTransactionSheet open={txOpen} onClose={() => setTxOpen(false)} ledger={ledger} />
    </div>
  );
}
