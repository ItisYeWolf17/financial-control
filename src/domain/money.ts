/**
 * Dinero — siempre enteros (céntimos). Nunca floats sueltos.
 *
 * Un `Money` es la cantidad multiplicada por 100: ₡298,720.50 → 29_872_050.
 * Todas las sumas, splits y porcentajes trabajan sobre enteros; el formateo
 * es lo único que vuelve a decimales.
 */
export type Money = number;

export const money = (units: number): Money => Math.round(units * 100);
export const toUnits = (m: Money): number => m / 100;

export const addMoney = (...xs: Money[]): Money => xs.reduce((a, b) => a + b, 0);
export const negate = (m: Money): Money => -m;
export const absMoney = (m: Money): Money => Math.abs(m);

/** Porcentaje de un monto, redondeado al céntimo. */
export const percentOf = (m: Money, pct: number): Money => Math.round((m * pct) / 100);

/** Ratio 0–1 acotado, seguro ante divisor 0. */
export const ratio = (part: number, whole: number): number =>
  whole === 0 ? 0 : Math.max(0, Math.min(1, part / whole));

/** Porcentaje 0–100 redondeado, para barras y etiquetas. */
export const pct = (part: number, whole: number): number => Math.round(ratio(part, whole) * 100);

export interface FormatOptions {
  /** Símbolo de la moneda del espacio. */
  symbol?: string | undefined;
  /** Mostrar decimales (por defecto no, como en el diseño). */
  decimals?: boolean | undefined;
  /** Anteponer `+` a los positivos. */
  signed?: boolean | undefined;
  /** Compactar a 1.2M / 12.9K para ejes y espacios angostos. */
  compact?: boolean | undefined;
}

/**
 * Formatea un `Money`. Negativos con el menos tipográfico `−` (U+2212),
 * como en el diseño, no con el guion ASCII.
 */
export function formatMoney(m: Money, options: FormatOptions = {}): string {
  const { symbol = '₡', decimals = false, signed = false, compact = false } = options;
  const units = Math.abs(toUnits(m));
  const body = compact
    ? new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(units)
    : new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals ? 2 : 0,
        maximumFractionDigits: decimals ? 2 : 0,
      }).format(units);
  const sign = m < 0 ? '−' : signed && m > 0 ? '+' : '';
  return `${sign}${symbol}${body}`;
}

/**
 * Reparte un monto en partes enteras cuyas sumas dan exactamente el total.
 * El sobrante del redondeo va a `remainderTo` (por defecto, el primero) —
 * así un gasto de ₡1,000.01 dividido 50/50 no pierde ni gana un céntimo.
 */
export function splitMoney(total: Money, weights: number[], remainderTo = 0): Money[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) return weights.map(() => 0);
  const parts = weights.map((w) => Math.floor((total * w) / sum));
  const remainder = total - parts.reduce((a, b) => a + b, 0);
  const idx = Math.min(Math.max(remainderTo, 0), parts.length - 1);
  if (parts.length > 0) parts[idx] = (parts[idx] ?? 0) + remainder;
  return parts;
}
