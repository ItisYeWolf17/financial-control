import type { ComponentType } from 'react';
import type { IconProps } from '@phosphor-icons/react';
import {
  Bank,
  CalendarBlank,
  CreditCard,
  DotsThreeOutline,
  Gear,
  House,
  PiggyBank,
  Repeat,
  SquaresFour,
  Table,
  Tag,
  Target,
  Wallet,
  ArrowsLeftRight,
} from '@phosphor-icons/react';

export interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: ComponentType<IconProps>;
  /** Etiqueta corta para la barra inferior del móvil. */
  short?: string;
  badge?: string;
}

/** Sidebar de escritorio — los nueve destinos del diseño, en orden. */
export const NAV: NavItem[] = [
  { id: 'dashboard', path: '', label: 'Resumen', icon: SquaresFour, short: 'Inicio' },
  { id: 'movimientos', path: 'movimientos', label: 'Movimientos', icon: ArrowsLeftRight },
  { id: 'presupuesto', path: 'presupuesto', label: 'Presupuesto', icon: Table },
  { id: 'cuentas', path: 'cuentas', label: 'Cuentas', icon: Wallet },
  { id: 'prestamos', path: 'prestamos', label: 'Préstamos', icon: Bank },
  { id: 'tasa0', path: 'tasa0', label: 'Tasa 0 / cuotas', icon: CreditCard },
  { id: 'ahorros', path: 'ahorros', label: 'Ahorros y metas', icon: PiggyBank, short: 'Metas' },
  { id: 'calendario', path: 'calendario', label: 'Calendario', icon: CalendarBlank },
  { id: 'config', path: 'config', label: 'Configuración', icon: Gear },
];

/** Barra inferior del móvil: cinco destinos. El resto vive en "Más". */
export const TABBAR: NavItem[] = [
  { id: 'dashboard', path: '', label: 'Inicio', icon: House },
  { id: 'movimientos', path: 'movimientos', label: 'Movimientos', icon: ArrowsLeftRight },
  { id: 'presupuesto', path: 'presupuesto', label: 'Presupuesto', icon: Table },
  { id: 'ahorros', path: 'ahorros', label: 'Metas', icon: Target },
  { id: 'mas', path: 'mas', label: 'Más', icon: DotsThreeOutline },
];

export interface MoreItem extends NavItem {
  sub: string;
}

/** Pantalla "Más" del móvil: lo que no cabe en la barra. */
export const MORE: MoreItem[] = [
  { id: 'cuentas', path: 'cuentas', label: 'Cuentas', icon: Wallet, sub: 'Saldos y medios de pago' },
  { id: 'prestamos', path: 'prestamos', label: 'Préstamos', icon: Bank, sub: 'Deudas activas' },
  {
    id: 'tasa0',
    path: 'tasa0',
    label: 'Compras a tasa 0',
    icon: CreditCard,
    sub: 'Compras en cuotas',
  },
  {
    id: 'calendario',
    path: 'calendario',
    label: 'Calendario',
    icon: CalendarBlank,
    sub: 'Próximos pagos e ingresos',
  },
  { id: 'categorias', path: 'config', label: 'Categorías', icon: Tag, sub: 'Ingresos y gastos' },
  {
    id: 'recurrentes',
    path: 'config',
    label: 'Gastos recurrentes',
    icon: Repeat,
    sub: 'Reglas que se repiten cada mes',
  },
  {
    id: 'config',
    path: 'config',
    label: 'Perfil y configuración',
    icon: Gear,
    sub: 'Moneda, ciclo y seguridad',
  },
];

/** Encabezado de cada pantalla: volada y título, como en el diseño. */
export const SCREEN_META: Record<string, { kicker: string; title: string }> = {
  dashboard: { kicker: 'Septiembre 2026', title: 'Resumen' },
  movimientos: { kicker: 'Fuente de verdad', title: 'Movimientos' },
  presupuesto: { kicker: 'Septiembre 2026', title: 'Presupuesto mensual' },
  cuentas: { kicker: 'Medios de pago', title: 'Cuentas' },
  prestamos: { kicker: 'Deudas', title: 'Préstamos' },
  tasa0: { kicker: 'Deudas', title: 'Compras a tasa 0' },
  ahorros: { kicker: 'Metas', title: 'Ahorros' },
  calendario: { kicker: 'Septiembre 2026', title: 'Calendario financiero' },
  config: { kicker: 'Tu cuenta', title: 'Configuración' },
  mas: { kicker: 'Navegación', title: 'Más' },
};
