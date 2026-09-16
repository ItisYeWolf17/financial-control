import type { Money } from '@/domain/money';

/** Un dato graficable. `color` es del CSS token de la serie, nunca del ranking. */
export interface Datum {
  /** Identidad estable: el color sigue a la entidad, no a su posición. */
  id: string;
  label: string;
  value: Money;
  color?: string | undefined;
  /** Texto opcional bajo el valor en el tooltip y la tabla. */
  note?: string | undefined;
}

export interface TooltipState {
  x: number;
  y: number;
  label: string;
  value: string;
  color: string;
  note?: string | undefined;
}
