import { useEffect, useRef, useState } from 'react';

/** `prefers-reduced-motion`, reactivo: si cambia la preferencia, los gráficos dejan de animar. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Interpola hacia `target` con requestAnimationFrame.
 *
 * Es la base de todo el movimiento de datos: un número que sube, una barra que
 * crece, un arco que se dibuja. Cuando el dato cambia, la animación arranca
 * desde el valor actual —no desde cero—, así un refresco de Firestore se ve
 * como un ajuste y no como una recarga.
 */
export function useAnimatedValue(target: number, duration = 720): number {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);
  const fromRef = useRef(reduced ? target : 0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (reduced || duration === 0) {
      fromRef.current = target;
      setValue(target);
      return;
    }

    const from = fromRef.current;
    const delta = target - from;
    if (delta === 0) return;

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const current = from + delta * easeOutCubic(t);
      fromRef.current = current;
      setValue(current);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, reduced]);

  return value;
}

/**
 * `true` cuando el elemento entró en pantalla (una sola vez).
 * Los gráficos animan al aparecer, no mientras están fuera de vista.
 */
export function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      }
    }, options ?? { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView } as const;
}
