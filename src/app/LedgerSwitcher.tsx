import { useEffect, useRef, useState } from 'react';
import { CaretUpDown, Check, House, Users } from '@phosphor-icons/react';
import { LEDGERS, type LedgerRef } from '@/features/ledgers/ledgers';
import './shell.css';

interface LedgerSwitcherProps {
  current: LedgerRef;
  onSelect: (ledger: LedgerRef) => void;
}

/**
 * Cambia entre el espacio personal y los compartidos.
 *
 * Es el control que decide qué datos se están viendo, así que va arriba de
 * todo y dice siempre con quién se comparte el espacio actual.
 */
export function LedgerSwitcher({ current, onSelect }: LedgerSwitcherProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="switcher" ref={rootRef}>
      <button
        type="button"
        className="switcher-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {current.kind === 'shared' ? (
          <Users size={15} color="var(--color-accent-300)" aria-hidden="true" />
        ) : (
          <House size={15} color="var(--color-accent-300)" aria-hidden="true" />
        )}
        <span style={{ flex: 1, textAlign: 'left' }}>{current.name}</span>
        <CaretUpDown size={13} color="var(--color-text-faint)" aria-hidden="true" />
      </button>

      {open && (
        <div className="switcher-menu" role="menu" aria-label="Cambiar de espacio">
          {LEDGERS.map((l) => (
            <button
              key={l.id}
              type="button"
              role="menuitem"
              className="switcher-option"
              onClick={() => {
                onSelect(l);
                setOpen(false);
              }}
            >
              {l.kind === 'shared' ? (
                <Users size={15} aria-hidden="true" />
              ) : (
                <House size={15} aria-hidden="true" />
              )}
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block' }}>{l.name}</span>
                <span className="switcher-sub" style={{ display: 'block' }}>
                  {l.kind === 'shared' ? `Compartido con ${l.members.join(', ')}` : 'Solo tuyo'}
                </span>
              </span>
              {l.id === current.id && (
                <Check size={14} color="var(--color-good)" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
