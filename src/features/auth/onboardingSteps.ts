/**
 * Los siete pasos del primer uso, tal como los define el diseño.
 *
 * Los montos son de ejemplo: en la fase 3 cada paso escribe de verdad en
 * Firestore (moneda, ingresos, cuentas, categorías, presupuesto, deudas y
 * metas) y las filas pasan a reflejar lo que la persona va cargando.
 */
export type RowTone = 'good' | 'warning' | 'critical' | 'muted' | 'text';

export interface OnboardingRow {
  label: string;
  sub: string;
  value: string;
  tone: RowTone;
}

export interface OnboardingStep {
  title: string;
  help: string;
  rows: OnboardingRow[];
}

export const ONBOARDING: OnboardingStep[] = [
  {
    title: 'Elegí tu moneda',
    help: 'Todos los montos se muestran en esta moneda. Podés cambiarla después.',
    rows: [
      { label: 'Colón costarricense', sub: 'CRC · símbolo ₡', value: 'Elegida', tone: 'good' },
      { label: 'Dólar estadounidense', sub: 'USD · símbolo $', value: '', tone: 'muted' },
      { label: 'Euro', sub: 'EUR · símbolo €', value: '', tone: 'muted' },
    ],
  },
  {
    title: 'Registrá tus ingresos',
    help: 'Dividilos por quincena — así el presupuesto calcula cada período.',
    rows: [
      {
        label: 'Salario 1ª quincena',
        sub: 'Día 1 · BN Cuenta Colones',
        value: '₡298,720',
        tone: 'good',
      },
      {
        label: 'Salario 2ª quincena',
        sub: 'Día 16 · BN Cuenta Colones',
        value: '₡298,720',
        tone: 'good',
      },
      { label: 'Total mensual', sub: 'Calculado', value: '₡597,440', tone: 'text' },
    ],
  },
  {
    title: 'Creá tus cuentas',
    help: 'Cada movimiento se descuenta de la cuenta que elijas.',
    rows: [
      { label: 'BN Cuenta Colones', sub: 'Cuenta bancaria', value: '₡186,420', tone: 'text' },
      { label: 'Efectivo', sub: 'Billetera', value: '₡28,500', tone: 'text' },
      { label: 'Tarjeta BAC Visa', sub: 'Tarjeta de crédito', value: '−₡142,800', tone: 'critical' },
    ],
  },
  {
    title: 'Definí tus categorías',
    help: 'Vienen unas por defecto; agregá las tuyas cuando querás.',
    rows: [
      { label: 'Vivienda, Servicios, Alimentación', sub: 'Gastos fijos', value: '3', tone: 'muted' },
      { label: 'Educación, Salud, Familia', sub: 'Gastos variables', value: '3', tone: 'muted' },
      { label: 'Salario, Freelance, Bonos', sub: 'Ingresos', value: '3', tone: 'muted' },
    ],
  },
  {
    title: 'Armá tu presupuesto',
    help: 'Asigná un monto previsto y una quincena a cada concepto.',
    rows: [
      {
        label: 'Gastos previstos',
        sub: '12 conceptos en 8 categorías',
        value: '₡589,708',
        tone: 'text',
      },
      {
        label: '1ª quincena',
        sub: 'Alquiler, teléfono, gimnasio…',
        value: '₡318,873',
        tone: 'warning',
      },
      {
        label: '2ª quincena',
        sub: 'Universidad, cuotas, servicios…',
        value: '₡270,835',
        tone: 'good',
      },
      { label: 'Sin asignar', sub: 'Queda libre cada mes', value: '₡7,732', tone: 'good' },
    ],
  },
  {
    title: 'Registrá préstamos y deudas',
    help: 'El sistema calcula saldo, cuotas pagadas y próximos pagos.',
    rows: [
      {
        label: 'Préstamo personal · BN',
        sub: '9 de 24 cuotas',
        value: '₡512,400',
        tone: 'critical',
      },
      {
        label: 'Crédito educativo · Conape',
        sub: '9 de 24 cuotas',
        value: '₡288,000',
        tone: 'critical',
      },
      { label: 'Compras a tasa 0', sub: '2 compras activas', value: '₡311,000', tone: 'critical' },
    ],
  },
  {
    title: 'Creá tus metas de ahorro',
    help: 'Con tu presupuesto actual podés aportar ₡5,000 al mes.',
    rows: [
      {
        label: 'Fondo de emergencia',
        sub: 'Meta ₡1,200,000 · dic 2027',
        value: '68%',
        tone: 'good',
      },
      { label: 'Viaje a Colombia', sub: 'Meta ₡800,000 · jul 2027', value: '26%', tone: 'warning' },
      {
        label: 'Cambio de vehículo',
        sub: 'Meta ₡3,500,000 · dic 2029',
        value: '13%',
        tone: 'warning',
      },
    ],
  },
];

export const ROW_TONE: Record<RowTone, string> = {
  good: 'var(--color-good)',
  warning: 'var(--color-warning)',
  critical: 'var(--color-critical)',
  muted: 'var(--color-text-muted)',
  text: 'var(--color-text)',
};
