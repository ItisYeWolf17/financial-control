import { useCallback, useRef, useState } from 'react';
import type { TooltipState } from './types';

/**
 * Tooltip por marca: la marca misma es el blanco (no hay crosshair en barras).
 * Se posiciona sobre el centro superior de la marca, en coordenadas del marco,
 * y responde igual al foco de teclado que al puntero.
 */
export function useTooltip() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const show = useCallback((mark: Element, content: Omit<TooltipState, 'x' | 'y'>) => {
    const container = containerRef.current;
    if (!container) return;
    const box = mark.getBoundingClientRect();
    const frame = container.getBoundingClientRect();
    setTooltip({
      ...content,
      x: box.left - frame.left + box.width / 2,
      y: box.top - frame.top,
    });
  }, []);

  const hide = useCallback(() => setTooltip(null), []);

  return { containerRef, tooltip, show, hide } as const;
}
