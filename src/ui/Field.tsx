import { useId, type ReactNode } from 'react';
import './ui.css';

interface FieldProps {
  label: string;
  hint?: string;
  children: (id: string) => ReactNode;
  span?: number;
}

/** Etiqueta + control, con el `id` ligado para que el label sea clicable. */
export function Field({ label, hint, children, span = 1 }: FieldProps) {
  const id = useId();
  return (
    <div className="field" style={{ gridColumn: `span ${span}` }}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {children(id)}
      {hint && (
        <p style={{ fontSize: 11, color: 'var(--color-text-faint)', marginTop: 5 }}>{hint}</p>
      )}
    </div>
  );
}
