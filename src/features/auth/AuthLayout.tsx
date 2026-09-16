import type { ReactNode } from 'react';
import { ChartDonut } from '@phosphor-icons/react';
import './auth.css';

interface AuthLayoutProps {
  headline: string;
  blurb: string;
  children: ReactNode;
}

/** Panel de marca + panel de tarea. Lo comparten el acceso y el primer uso. */
export function AuthLayout({ headline, blurb, children }: AuthLayoutProps) {
  return (
    <div className="auth">
      <aside className="auth-brand">
        <div className="auth-brand-mark">
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: '1px solid var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent-300)',
            }}
          >
            <ChartDonut size={17} aria-hidden="true" />
          </span>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 16 }}>
            Caudal
          </span>
        </div>

        <div>
          <h1 style={{ maxWidth: '11ch', marginBottom: 14 }}>{headline}</h1>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '42ch' }}>{blurb}</p>
        </div>

        <div className="auth-brand-facts">
          <div>
            <div className="auth-fact-label">Ciclo</div>
            <div className="auth-fact-value">1ª / 2ª quincena</div>
          </div>
          <div>
            <div className="auth-fact-label">Moneda</div>
            <div className="auth-fact-value">Colón · ₡</div>
          </div>
        </div>
      </aside>

      <main className="auth-panel">{children}</main>
    </div>
  );
}
