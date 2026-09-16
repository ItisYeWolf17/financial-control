import { useAnimatedValue } from '@/lib/motion';
import { formatMoney, type FormatOptions, type Money } from '@/domain/money';

interface AnimatedMoneyProps extends FormatOptions {
  value: Money;
  duration?: number | undefined;
  className?: string | undefined;
}

/**
 * Una cifra que sube hasta su valor. Cuando el dato cambia en vivo, interpola
 * desde lo que había — el lector ve el ajuste, no un parpadeo.
 */
export function AnimatedMoney({ value, duration = 720, className, ...format }: AnimatedMoneyProps) {
  const animated = useAnimatedValue(value, duration);
  return (
    <span className={className}>{formatMoney(Math.round(animated), format)}</span>
  );
}
