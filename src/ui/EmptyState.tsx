import type { ComponentType, ReactNode } from 'react';
import type { IconProps } from '@phosphor-icons/react';
import './ui.css';

interface EmptyStateProps {
  icon: ComponentType<IconProps>;
  title: string;
  body?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon size={22} aria-hidden="true" />
      </span>
      <span className="empty-title">{title}</span>
      {body && <p className="empty-body">{body}</p>}
      {action}
    </div>
  );
}
