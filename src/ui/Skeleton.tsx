import './ui.css';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

/** Bloque de carga. Ocupa exactamente el sitio del contenido real: sin saltos de layout. */
export function Skeleton({ width = '100%', height = 14, radius, className, style }: SkeletonProps) {
  return (
    <div
      className={`skeleton${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      style={{ width, height, ...(radius !== undefined && { borderRadius: radius }), ...style }}
    />
  );
}

/** Varias líneas de texto en carga, la última más corta. */
export function SkeletonText({ lines = 3, gap = 8 }: { lines?: number; gap?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} height={12} width={i === lines - 1 ? '62%' : '100%'} />
      ))}
    </div>
  );
}
