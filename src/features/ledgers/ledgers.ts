/**
 * Espacios de muestra. En la fase 7 esto sale de `ledgers/` en Firestore y de
 * `users/{uid}/ledgerRefs`; la forma del tipo ya es la definitiva.
 */
export interface LedgerRef {
  id: string;
  name: string;
  kind: 'personal' | 'shared';
  /** Iniciales de los miembros, para el switcher. */
  members: string[];
  currencySymbol: string;
}

export const LEDGERS: LedgerRef[] = [
  { id: 'personal', name: 'Personal', kind: 'personal', members: ['MR'], currencySymbol: '₡' },
  { id: 'casa', name: 'Casa', kind: 'shared', members: ['MR', 'LS'], currencySymbol: '₡' },
];

export const findLedger = (id: string | undefined): LedgerRef =>
  LEDGERS.find((l) => l.id === id) ?? (LEDGERS[0] as LedgerRef);
