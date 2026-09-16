import type { ComponentType } from 'react';
import type { IconProps } from '@phosphor-icons/react';
import { Card } from '@/ui/Card';
import { EmptyState } from '@/ui/EmptyState';

/**
 * Pantalla todavía sin construir. Existe para que la navegación sea real
 * desde ya —se puede recorrer la app entera— y para que cada sección diga en
 * qué fase entra, en lugar de dejar un hueco mudo.
 */
export function Placeholder({
  icon,
  title,
  body,
}: {
  icon: ComponentType<IconProps>;
  title: string;
  body: string;
}) {
  return (
    <Card>
      <EmptyState icon={icon} title={title} body={body} />
    </Card>
  );
}
