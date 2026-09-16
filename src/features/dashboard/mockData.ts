/**
 * Datos de muestra tomados del design canvas (septiembre 2026).
 *
 * Provisionales: son el mismo juego de datos del diseño para poder construir y
 * revisar la UI antes de que Firestore esté conectado. Cuando entre la fase 4,
 * estos objetos se reemplazan por los selectores de `domain/`, sin tocar los
 * componentes: la forma de `Datum` ya es la que consumen los gráficos.
 */
import { money } from '@/domain/money';
import type { Datum } from '@/ui/charts/types';

export const flujoDeCaja: Datum[] = [
  { id: 'ingresos', label: 'Ingresos', value: money(597440), color: 'var(--color-good)' },
  { id: 'gastos', label: 'Gastos', value: money(-408708), color: 'var(--color-critical)' },
  { id: 'deudas', label: 'Deudas', value: money(-181000), color: 'var(--color-critical)' },
  { id: 'ahorros', label: 'Ahorros', value: money(-5000), color: 'var(--color-info)' },
  { id: 'disponible', label: 'Disponible', value: money(2732), color: 'var(--color-good)' },
];

export const gastoPorCategoria: Datum[] = [
  { id: 'vivienda', label: 'Vivienda', value: money(250000), note: 'Alquiler' },
  { id: 'cuidado', label: 'Cuidado personal', value: money(32800), note: '3 movimientos' },
  { id: 'alimentacion', label: 'Alimentación', value: money(22450), note: '2 movimientos' },
  { id: 'servicios', label: 'Servicios', value: money(11373), note: 'Teléfono' },
  { id: 'otros', label: 'Otros', value: money(8600), note: 'Farmacia' },
];

export const composicionDeuda: Datum[] = [
  { id: 'prestamo-bn', label: 'Préstamo personal · BN', value: money(512400) },
  { id: 'conape', label: 'Crédito educativo · Conape', value: money(288000) },
  { id: 'refrigeradora', label: 'Refrigeradora', value: money(245000) },
  { id: 'secadora', label: 'Secadora y pantalla', value: money(66000) },
];

export const quincenas: Datum[] = [
  { id: 'q1', label: '1ª quincena', value: money(318873), note: 'Cerrada el 15 de setiembre' },
  { id: 'q2', label: '2ª quincena', value: money(270835), note: 'Previsto hasta el 30' },
];
