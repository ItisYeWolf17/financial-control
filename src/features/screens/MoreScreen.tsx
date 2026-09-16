import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { CaretRight } from '@phosphor-icons/react';
import { MORE } from '@/app/nav';
import type { LedgerRef } from '@/features/ledgers/ledgers';
import { Card } from '@/ui/Card';
import { LedgerSwitcher } from '@/app/LedgerSwitcher';

/** Pantalla "Más" del móvil: lo que no entra en la barra inferior. */
export function MoreScreen() {
  const { ledger } = useOutletContext<{ ledger: LedgerRef }>();
  const navigate = useNavigate();

  return (
    <>
      {/* En escritorio el switcher vive en el sidebar; en móvil, acá — es el
          único lugar de la barra inferior donde cabe sin competir con nada. */}
      <div style={{ marginBottom: 12 }}>
        <span className="field-label">Espacio</span>
        <LedgerSwitcher current={ledger} onSelect={(l) => navigate(`/s/${l.id}/mas`)} />
      </div>
      <Card>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {MORE.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={`/s/${ledger.id}/${item.path}`}
              className="enter"
              style={
                {
                  '--i': i,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '13px 4px',
                  borderBottom:
                    i === MORE.length - 1 ? 'none' : '1px solid var(--color-divider)',
                  color: 'var(--color-text)',
                  textDecoration: 'none',
                } as React.CSSProperties
              }
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-surface-2)',
                  color: 'var(--color-accent-300)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: '0 0 auto',
                }}
              >
                <Icon size={16} aria-hidden="true" />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 14 }}>{item.label}</span>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--color-text-faint)' }}>
                  {item.sub}
                </span>
              </span>
              <CaretRight size={14} color="var(--color-text-faint)" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
      </Card>
    </>
  );
}
