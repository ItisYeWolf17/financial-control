import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/ui/Button';
import { Field } from '@/ui/Field';
import { Segmented } from '@/ui/Segmented';
import { AuthLayout } from './AuthLayout';
import './auth.css';

type Mode = 'login' | 'signup';

/**
 * Acceso y registro.
 *
 * Todavía sin Firebase Auth: el botón navega al onboarding o al dashboard para
 * poder recorrer el flujo. La validación y el manejo de errores entran en la
 * fase 2, junto con el proveedor real.
 */
export function LoginScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const navigate = useNavigate();
  const signup = mode === 'signup';

  return (
    <AuthLayout
      headline="Tu presupuesto, quincena a quincena."
      blurb="Ingresos, gastos, préstamos, cuotas a tasa 0 y metas de ahorro en una sola fuente de verdad. Registrás un movimiento y todo lo demás se recalcula."
    >
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(signup ? '/onboarding' : '/s/personal');
        }}
      >
        <h3 style={{ marginBottom: 4 }}>{signup ? 'Creá tu cuenta' : 'Ingresá a Caudal'}</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 22 }}>
          {signup
            ? 'Siete pasos cortos y tu presupuesto queda armado.'
            : 'Tus movimientos, tu presupuesto y tus metas donde los dejaste.'}
        </p>

        <div style={{ marginBottom: 20 }}>
          <Segmented
            label="Acceso"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'login', label: 'Ingresar' },
              { value: 'signup', label: 'Crear cuenta' },
            ]}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {signup && (
            <Field label="Nombre">
              {(id) => (
                <input id={id} className="input" autoComplete="name" placeholder="María Rodríguez" />
              )}
            </Field>
          )}
          <Field label="Correo">
            {(id) => (
              <input
                id={id}
                className="input"
                type="email"
                autoComplete="email"
                placeholder="vos@correo.com"
              />
            )}
          </Field>
          <Field label="Contraseña">
            {(id) => (
              <input
                id={id}
                className="input"
                type="password"
                autoComplete={signup ? 'new-password' : 'current-password'}
                placeholder="••••••••"
              />
            )}
          </Field>
        </div>

        <div style={{ marginTop: 20 }}>
          <Button variant="primary" block type="submit">
            {signup ? 'Crear cuenta' : 'Ingresar'}
          </Button>
        </div>

        <div className="auth-meta">
          <Link to="/login">Olvidé mi contraseña</Link>
          <span>{signup ? 'Gratis, sin tarjeta' : 'Rol: Usuario'}</span>
        </div>
      </form>
    </AuthLayout>
  );
}
