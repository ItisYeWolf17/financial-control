import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/Button';
import { AuthLayout } from './AuthLayout';
import { ONBOARDING, ROW_TONE } from './onboardingSteps';
import './auth.css';

/**
 * Primer uso, siete pasos.
 *
 * Por ahora recorre los pasos sin escribir nada: fija el ritmo y la forma de
 * cada paso. En la fase 3 cada «Continuar» guarda su parte en Firestore y el
 * último marca `onboardingDone`.
 */
export function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const current = ONBOARDING[step]!;
  const last = step === ONBOARDING.length - 1;

  return (
    <AuthLayout
      headline="Armemos tu presupuesto."
      blurb="Siete pasos cortos: moneda, ingresos, cuentas, categorías, presupuesto, deudas y metas. Después todo se recalcula solo."
    >
      <div className="onb">
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
            color: 'var(--color-text-faint)',
          }}
        >
          Paso {step + 1} de {ONBOARDING.length}
        </div>
        <h3 style={{ margin: '8px 0 4px' }}>{current.title}</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{current.help}</p>

        <div
          className="onb-bars"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={ONBOARDING.length}
          aria-valuenow={step + 1}
          aria-label="Avance del primer uso"
        >
          {ONBOARDING.map((_, i) => (
            <span key={i} className="onb-bar" data-done={i <= step} />
          ))}
        </div>

        {/* La `key` reinicia la animación de entrada en cada paso: las filas
            del paso nuevo se escalonan en vez de aparecer de golpe. */}
        <div className="onb-rows" key={step}>
          {current.rows.map((row, i) => (
            <div
              key={row.label}
              className="onb-row"
              style={{ '--i': i } as React.CSSProperties}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13 }}>{row.label}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-faint)' }}>{row.sub}</div>
              </div>
              <div className="onb-row-value" style={{ color: ROW_TONE[row.tone] }}>
                {row.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
          <Button
            onClick={() => (step === 0 ? navigate('/login') : setStep((s) => s - 1))}
          >
            Atrás
          </Button>
          <Button
            variant="primary"
            block
            onClick={() => (last ? navigate('/s/personal') : setStep((s) => s + 1))}
          >
            {last ? 'Entrar a Caudal' : 'Continuar'}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
