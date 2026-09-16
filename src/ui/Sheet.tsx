import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from '@phosphor-icons/react';
import './ui.css';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Diálogo modal. En escritorio aparece centrado; en móvil sube desde abajo
 * como una hoja, que es donde cae el pulgar.
 *
 * Cierra con Escape y con clic en el fondo, devuelve el foco a donde estaba y
 * lo atrapa dentro mientras está abierto.
 */
export function Sheet({ open, onClose, title, subtitle, children, footer }: SheetProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const returnFocusRef = useRef<Element | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('button, input, a')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      (returnFocusRef.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="sheet-scrim"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="sheet"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="sheet-head">
          <div>
            <h3 id={titleId} style={{ fontSize: 17 }}>
              {title}
            </h3>
            {subtitle && (
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 3 }}>
                {subtitle}
              </p>
            )}
          </div>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Cerrar">
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        <div className="sheet-body">{children}</div>
        {footer && (
          <div
            className="sheet-body"
            style={{ paddingTop: 0, display: 'flex', gap: 8, justifyContent: 'flex-end' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
