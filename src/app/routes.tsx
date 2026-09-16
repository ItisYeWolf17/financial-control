import { Navigate, createBrowserRouter } from 'react-router-dom';
import {
  ArrowsLeftRight,
  Bank,
  CalendarBlank,
  CreditCard,
  Gear,
  PiggyBank,
  Table,
  Wallet,
} from '@phosphor-icons/react';
import { AppShell } from './AppShell';
import { DashboardPreview } from '@/features/dashboard/DashboardPreview';
import { MoreScreen } from '@/features/screens/MoreScreen';
import { Placeholder } from '@/features/screens/Placeholder';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/s/personal" replace /> },
  {
    path: '/s/:ledgerId',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPreview /> },
      {
        path: 'movimientos',
        element: (
          <Placeholder
            icon={ArrowsLeftRight}
            title="Movimientos"
            body="La lista de movimientos con sus filtros entra en la fase 4, ya contra Firestore. El alta ya se puede abrir desde «Nuevo movimiento»."
          />
        ),
      },
      {
        path: 'presupuesto',
        element: (
          <Placeholder
            icon={Table}
            title="Presupuesto mensual"
            body="Plantilla fija que se copia a cada mes, con ajustes por mes y asignación de quincena. Fase 5."
          />
        ),
      },
      {
        path: 'cuentas',
        element: (
          <Placeholder
            icon={Wallet}
            title="Cuentas"
            body="Bancarias, ahorro, efectivo, SINPE y tarjetas de crédito, con su saldo y su fecha de corte. Fase 4."
          />
        ),
      },
      {
        path: 'prestamos',
        element: (
          <Placeholder
            icon={Bank}
            title="Préstamos"
            body="Saldo, cuotas pagadas y próximo pago, personales o del espacio. Fase 9."
          />
        ),
      },
      {
        path: 'tasa0',
        element: (
          <Placeholder
            icon={CreditCard}
            title="Compras a tasa 0"
            body="Compras en cuotas sin intereses, con su avance y su próxima cuota. Fase 9."
          />
        ),
      },
      {
        path: 'ahorros',
        element: (
          <Placeholder
            icon={PiggyBank}
            title="Ahorros y metas"
            body="Metas personales y de pareja, con el aporte de cada quien. Fase 10."
          />
        ),
      },
      {
        path: 'calendario',
        element: (
          <Placeholder
            icon={CalendarBlank}
            title="Calendario financiero"
            body="Ingresos previstos, gastos recurrentes, cuotas y aportes del mes. Fase 11."
          />
        ),
      },
      {
        path: 'config',
        element: (
          <Placeholder
            icon={Gear}
            title="Configuración"
            body="Moneda, ciclo quincenal, categorías, gastos recurrentes y seguridad. Fase 12."
          />
        ),
      },
      { path: 'mas', element: <MoreScreen /> },
    ],
  },
]);
