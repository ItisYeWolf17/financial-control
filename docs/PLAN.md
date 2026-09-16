# Caudal — Plan de desarrollo

App de contabilidad y finanzas personales con **presupuesto quincenal**, basada en el diseño
`Caudal.html` (design canvas). Stack objetivo: **React + Firebase**, responsive (desktop + móvil).

---

## 1. Qué es Caudal (alcance del diseño)

Una sola fuente de verdad: **los movimientos**. Todo lo demás (KPIs, control quincenal, flujo de
caja, avance de metas, saldos de cuentas y deudas) se **deriva por cálculo**, no se guarda duplicado.

### Pantallas del diseño
| Pantalla | Contenido |
|---|---|
| Login / Registro | tabs Ingresar / Crear cuenta, recuperar contraseña |
| Onboarding (7 pasos) | moneda → ingresos por quincena → cuentas → categorías → presupuesto → préstamos y deudas → metas de ahorro |
| Dashboard | 5 KPIs (Ingresos, Gastos, Disponible, Ahorros, Deudas), control 1ª/2ª quincena (previsto vs. real), flujo de caja del mes, alertas, gasto por categoría |
| Movimientos | lista con filtros (Todos, Ingresos, Gastos, Transferencias, Pagos de deuda, Ahorros) + modal "Nuevo movimiento" |
| Presupuesto | tabla por concepto: previsto, real, diferencia, quincena asignada, estado (Pagado / Parcial / Pendiente / Sobre presupuesto) |
| Cuentas | bancarias, ahorro, efectivo, digital (SINPE), tarjeta de crédito (saldo negativo + fecha de corte) |
| Préstamos | entidad, monto original, saldo, cuota, n.º cuotas, pagadas, tasa, próximo pago |
| Tasa 0 / cuotas | compras en cuotas sin intereses: total, cuota, n, pagadas, próximo pago |
| Ahorros y metas | meta, actual, aporte mensual, fecha objetivo, % de avance |
| Calendario | mes con eventos (ingresos previstos, gastos recurrentes, cuotas, aportes a metas) |
| Configuración | moneda, ciclo quincenal, categorías, gastos recurrentes, perfil y seguridad |
| Más (móvil) | menú para lo que no cabe en el tab bar |

### Navegación
- **Desktop**: sidebar de 9 ítems + header con selector de período (Mes / 1ª Q / 2ª Q) y botón "Nuevo movimiento".
- **Móvil**: tab bar de 5 (Inicio, Movimientos, Presupuesto, Metas, Más) + FAB.

### Reglas de negocio que ya define el diseño
- Un concepto de presupuesto se asigna a `q = 1` (1ª quincena), `q = 2` (2ª) o `q = 0` (**se divide 50/50** entre ambas).
- Quincenas: **1–15** y **16–fin de mes**. Cada una tiene su ingreso, su previsto y su real.
- Estado de un concepto: `real > prev` → Sobre presupuesto · `real == 0` → Pendiente · `real >= prev` → Pagado · resto → Parcial. Alerta amarilla desde el 85 %.
- "Sin asignar" = ingreso previsto − presupuesto total − aportes a metas.
- Disponible líquido = suma de cuentas con saldo positivo **excluyendo** cuentas de ahorro.
- Deuda total = saldo de préstamos + (cuotas pendientes × cuota) de compras a tasa 0.
- Moneda por defecto **CRC (₡)**, formato `en-US` para miles; negativos con `−`.

---

## 2. Qué necesitás (requisitos previos)

**Cuentas y servicios**
1. Cuenta de Google → proyecto en [Firebase Console](https://console.firebase.google.com) (plan **Spark** gratis alcanza para empezar; **Blaze** solo si se usan Cloud Functions).
2. En el proyecto, habilitar: **Authentication** (Email/Password + Google), **Cloud Firestore** (modo producción, región `nam5` o `us-central`), **Hosting**. Storage solo si se van a adjuntar comprobantes.
3. Node.js ≥ 20 y npm, Firebase CLI (`npm i -g firebase-tools`).
4. (Opcional, para publicar en tiendas) cuenta de Google Play y/o Apple Developer si más adelante se empaqueta con Capacitor.

**Decisiones a confirmar antes de codear** (ver §8).

---

## 3. Stack propuesto

| Capa | Elección | Por qué |
|---|---|---|
| Build | **Vite + React 18 + TypeScript** | rápido, PWA sencilla, tipos para el dominio financiero |
| Routing | React Router v6 | rutas = pantallas del diseño |
| Datos | **Firestore** con listeners en tiempo real vía **TanStack Query** o hooks propios | offline y sync gratis |
| Estado | Estado derivado en *selectors* puros (`src/domain/*`) | replica exactamente la lógica del mockup y se testea sin UI |
| Auth | Firebase Auth (email + Google) | cubre Login/Registro del diseño |
| Estilos | CSS Modules + **tokens CSS** tomados del diseño ("Nocturne": `--color-bg #0e1018`, `--color-surface`, acento `#796cbf/#b5abfc`, verde `#7fd1a6`, rojo `#e88b8b`, amarillo `#e0c078`) | el diseño ya viene tokenizado |
| Tipografía/íconos | Inter + **Phosphor Icons** (`@phosphor-icons/react`) | el diseño usa clases `ph-*` |
| Gráficos | SVG/CSS propio (barras y donas simples, como el mockup) | evita dependencias pesadas |
| Móvil | **PWA responsive** (vite-plugin-pwa), instalable; Capacitor después si se quiere tienda | un solo código para web y móvil |
| Calidad | Vitest + Testing Library, ESLint, Prettier | los cálculos financieros necesitan tests |
| Deploy | Firebase Hosting + GitHub Actions | preview por PR |

> **React Native no se recomienda aquí**: el diseño es una app de tablas y formularios que funciona igual de bien como PWA, y una sola base de código reduce a la mitad el trabajo.

---

## 4. Modelo de datos en Firestore

Todo cuelga del usuario: `users/{uid}/...`. Así las reglas de seguridad son de una línea.

```
users/{uid}
  profile:      { displayName, email, currency: "CRC", symbol: "₡",
                  cycle: { type: "quincenal", firstDay: 1, splitDay: 16 },
                  onboardingDone: bool, createdAt }

  accounts/{id}        { name, type: "bank"|"savings"|"cash"|"digital"|"credit",
                         initialBalance, currentBalance, creditLimit?, cutoffDay?,
                         icon, note, archived }

  categories/{id}      { name, kind: "income"|"expense"|"saving", icon, color, isDefault }

  transactions/{id}    { date (Timestamp), description, amount (negativo = salida),
                         kind: "ingreso"|"gasto"|"ahorro"|"transferencia"|"pago_deuda",
                         categoryId, accountId, toAccountId?, method: "Débito"|"Crédito"|"Efectivo"|"SINPE"|"Transferencia",
                         period: { year, month, q: 1|2 },
                         linkedType?: "loan"|"installment"|"goal", linkedId?, notes, createdAt }

  budgets/{YYYY-MM}    { month, income: { q1, q2 }, createdAt }
    items/{id}         { name, categoryId, planned, q: 0|1|2, icon, recurringId? }

  recurring/{id}       { name, categoryId, accountId, amount, q, dayOfMonth, active }

  loans/{id}           { name, entity, original, balance, fee, installments, paid,
                         rate, startDate, nextPaymentDate }

  installments/{id}    { name, total, fee, installments, paid, nextPaymentDate }   // tasa 0

  goals/{id}           { name, icon, target, current, monthlyContribution, dueDate, active }
```

**Índices compuestos** que harán falta: `transactions` por `(period.year, period.month, period.q)`, por `date desc`, y por `(kind, date desc)`.

**Denormalización mínima y controlada**: `accounts.currentBalance`, `loans.balance/paid`, `goals.current` se actualizan en la **misma transacción de Firestore** que crea/edita/borra el movimiento (`runTransaction`). Lo demás (KPIs, quincenas, flujo, alertas) se calcula en el cliente a partir de los movimientos del mes — es poca data y evita inconsistencias.

**Reglas de seguridad** (base):
```
match /users/{uid}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
```
Más validaciones de tipo/rango por colección antes de producción.

---

## 5. Estructura del proyecto

```
src/
  app/            router, layout desktop (sidebar) y móvil (tab bar), providers
  lib/firebase/   init, auth, repositorios por colección
  domain/         money.ts, periods.ts, budget.ts, debt.ts, goals.ts, alerts.ts  ← lógica pura, testeada
  features/
    auth/ onboarding/ dashboard/ transactions/ budget/ accounts/
    loans/ installments/ goals/ calendar/ settings/
  ui/             Button, Input, Card, KpiCard, ProgressBar, Sheet/Modal, Table, Tag, EmptyState
  styles/         tokens.css (extraídos del diseño), globals.css
```

---

## 6. Fases

| Fase | Entregable | Estimado |
|---|---|---|
| **0. Setup** | Vite+TS+React, tokens y fuentes del diseño, ESLint/Prettier, proyecto Firebase, emuladores, CI | 1 día |
| **1. Design system** | `ui/` completo + shells desktop/móvil navegables con datos mock (los del diseño) | 2 días |
| **2. Auth** | Login, registro, recuperar contraseña, guardas de ruta, perfil en Firestore | 1 día |
| **3. Onboarding** | los 7 pasos, escritura de moneda, ingresos, cuentas, categorías, presupuesto, deudas y metas | 2 días |
| **4. Movimientos** | CRUD + modal, filtros, actualización transaccional de saldos | 2–3 días |
| **5. Presupuesto** | ítems por mes, asignación de quincena, previsto vs. real, estados | 2 días |
| **6. Dashboard** | KPIs, control quincenal, flujo de caja, alertas, gasto por categoría (todo derivado) | 2 días |
| **7. Deudas** | préstamos y compras a tasa 0, pago de cuota que genera movimiento | 2 días |
| **8. Ahorros** | metas, aportes, % de avance, proyección a fecha objetivo | 1 día |
| **9. Calendario** | eventos del mes desde recurrentes, cuotas y metas | 1–2 días |
| **10. Configuración** | moneda, ciclo, categorías, gastos recurrentes, cambio de contraseña, exportar CSV | 1–2 días |
| **11. PWA + pulido** | manifest, service worker, offline, skeletons, accesibilidad, tests de dominio | 2 días |
| **12. Deploy** | Hosting, reglas e índices, backups | 1 día |

Ruta más corta a algo usable: **fases 0–2, 4 y 6** (MVP: registrar movimientos y ver el resumen).

---

## 7. Riesgos y cuidados
- **Dinero en punto flotante**: guardar montos en **enteros (céntimos)** o usar un helper único; nunca sumar floats sueltos.
- **Zonas horarias**: guardar `Timestamp` UTC pero calcular quincena con la zona del usuario (`America/Costa_Rica`).
- **Meses de 28/29/31 días**: la 2ª quincena termina en el último día del mes, no el 30.
- **Borrar un movimiento** debe revertir saldo de cuenta/préstamo/meta en la misma transacción.
- **Costos de Firestore**: leer el mes activo, no todo el histórico; paginar movimientos.
- Reglas de seguridad y **backups automáticos** antes de meter datos reales.

## 8. Decisiones pendientes
1. ¿Solo la web instalable (PWA) o también app en tiendas (Capacitor) más adelante?
2. ¿Uso individual o cuentas compartidas (pareja/familia) con roles?
3. ¿Multi-moneda real (tipo de cambio) o solo una moneda por usuario?
4. ¿Hace falta importar movimientos desde CSV del banco / SINPE?
5. ¿Presupuesto fijo mensual o plantilla que se copia mes a mes con ajustes?
