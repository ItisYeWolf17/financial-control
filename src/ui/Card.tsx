import type { ReactNode } from 'react';
import './ui.css';

interface CardProps {
  title?: ReactNode;
  note?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ title, note, children, className, style }: CardProps) {
  return (
    <section className={`card${className ? ` ${className}` : ''}`} style={style}>
      {(title || note) && (
        <header className="card-head">
          {title && <h3 className="card-title">{title}</h3>}
          {note && <span className="card-note">{note}</span>}
        </header>
      )}
      {children}
    </section>
  );
}
