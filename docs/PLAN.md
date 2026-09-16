# Caudal — Plan de desarrollo

App de contabilidad y finanzas personales con **presupuesto quincenal**, basada en el diseño
`Caudal.html` (design canvas). Stack objetivo: **React + Firebase**, responsive (desktop + móvil).

**Decisiones tomadas**
1. Uso **individual** por defecto, con **espacios compartidos** para registrar gastos entre dos personas (pareja) y saber quién debe a quién.
2. Presupuesto **variable pero casi siempre fijo**: plantilla base que se copia a cada mes y se puede ajustar mes a mes.
3. **Ninguna credencial en el repositorio** (es público). Todo por variables de entorno y secretos de CI.
4. Metas de ahorro y deudas pueden ser **personales o del espacio**, conviviendo en el mismo espacio compartido.
5. El **split de un gasto se elige al registrarlo**, movimiento por movimiento — no hay un modo global.

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

**Pantallas nuevas** que exige el uso compartido (no están en el diseño original, hay que diseñarlas
en el mismo lenguaje visual): *selector de espacio*, *miembros e invitaciones*, *división de un gasto*
dentro del modal de movimiento, y *balance compartido / liquidar*.

### Navegación
- **Desktop**: sidebar de 9 ítems + header con selector de período (Mes / 1ª Q / 2ª Q) y botón "Nuevo movimiento". Se agrega un **switcher de espacio** arriba del sidebar (Personal ▾ / Casa).
- **Móvil**: tab bar de 5 (Inicio, Movimientos, Presupuesto, Metas, Más) + FAB. El switcher va en el header.

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
1. Cuenta de Google → proyecto en [Firebase Console](https://console.firebase.google.com). El plan **Spark** (gratis) alcanza para todo lo de este plan; **Blaze** solo si más adelante querés notificaciones push programadas o liquidaciones por Cloud Functions.
2. Habilitar: **Authentication** (Email/Password + Google), **Cloud Firestore** (modo producción), **Hosting**, **App Check** (reCAPTCHA v3). Storage solo si se adjuntan comprobantes.
3. Node.js ≥ 20 y npm; Firebase CLI (`npm i -g firebase-tools`).
4. Recomendado: **dos proyectos** Firebase, `caudal-dev` y `caudal-prod`, para no probar contra datos reales.
5. (Opcional, tiendas) cuentas de Google Play / Apple Developer si luego se empaqueta con Capacitor.

---

## 3. Manejo de credenciales (repo público)

> Regla: **nada de llaves, tokens ni archivos de service account en git.** Ni en código, ni en
> comentarios, ni en capturas, ni en el historial.

- La **config web de Firebase** (`apiKey`, `projectId`, …) no es un secreto —viaja al navegador de todas formas—, pero igual se lee de variables de entorno para poder cambiar de proyecto sin tocar código:
  - `.env.local` (real, **en `.gitignore`**), `.env.example` (placeholders, sí versionado).
  - Vite solo expone lo que empiece con `VITE_`: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`, `VITE_RECAPTCHA_SITE_KEY`.
- Lo que **sí es secreto** y nunca sale del entorno seguro: el JSON de **service account** (deploys), el **token de CI**, y la *secret key* de reCAPTCHA. Van en **GitHub Actions → Settings → Secrets** (`FIREBASE_SERVICE_ACCOUNT`), nunca en el repo.
- La seguridad real **no depende de ocultar la config**, depende de:
  - **Security Rules** de Firestore (§5), que son parte del repo y se revisan como código;
  - **App Check**, para que solo la app real pueda pegarle al backend;
  - restringir la API key por dominio (HTTP referrers) en Google Cloud Console;
  - dominios autorizados en Authentication.
- `.gitignore` incluirá: `.env`, `.env.*` (menos `.env.example`), `*-service-account*.json`, `.firebase/`, `serviceAccountKey.json`.
- Antes del primer push de código: pasar **gitleaks** (o el secret scanning de GitHub) en CI.
- Si alguna vez se filtra una llave: **rotarla en la consola**, no basta con borrar el commit.

---

## 4. Stack propuesto

| Capa | Elección | Por qué |
|---|---|---|
| Build | **Vite + React 18 + TypeScript** | rápido, PWA sencilla, tipos para el dominio financiero |
| Routing | React Router v6 | rutas = pantallas del diseño, con el espacio en la URL (`/s/:ledgerId/...`) |
| Datos | **Firestore** con listeners en tiempo real | sync entre los dos miembros del espacio, sin backend propio |
| Estado | Estado derivado en *selectors* puros (`src/domain/*`) | replica la lógica del mockup y se testea sin UI |
| Auth | Firebase Auth (email + Google) | cubre Login/Registro del diseño |
| Estilos | CSS Modules + **tokens CSS** del diseño ("Nocturne": `--color-bg #0e1018`, acento `#796cbf/#b5abfc`, verde `#7fd1a6`, rojo `#e88b8b`, amarillo `#e0c078`) | el diseño ya viene tokenizado |
| Tipografía/íconos | Inter + **Phosphor Icons** | el diseño usa clases `ph-*` |
| Gráficos | SVG/CSS propio (barras y donas simples) | evita dependencias pesadas |
| Móvil | **PWA responsive** (vite-plugin-pwa); Capacitor después si se quiere tienda | un solo código para web y móvil |
| Calidad | Vitest + Testing Library, ESLint, Prettier, gitleaks | los cálculos financieros y las reglas necesitan tests |
| Deploy | Firebase Hosting + GitHub Actions | preview por PR |

---

## 5. Modelo de datos en Firestore

Como hay que compartir, **la unidad no es el usuario sino el *ledger* (espacio)**. Cada usuario tiene
un ledger personal creado al registrarse, y puede crear o ser invitado a ledgers compartidos.

```
users/{uid}
  { displayName, email, photoURL, defaultLedgerId, createdAt }
  ledgerRefs/{ledgerId}   { name, role, color, joinedAt, lastSplitUsed }  // switcher + sugerencia de split

ledgers/{ledgerId}
  { name: "Personal" | "Casa",
    kind: "personal" | "shared",
    ownerUid,
    memberUids: [uidA, uidB],            // array para las reglas y los queries
    members: { uidA: { role: "owner",  displayName, color },
               uidB: { role: "editor", displayName, color } },
    currency: "CRC", symbol: "₡",
    cycle: { type: "quincenal", firstDay: 1, splitDay: 16 },
    onboardingDone, createdAt }

  accounts/{id}      { name, type: "bank"|"savings"|"cash"|"digital"|"credit",
                       initialBalance, currentBalance, creditLimit?, cutoffDay?,
                       ownerUid,            // de quién es la cuenta dentro del espacio
                       shared: bool,        // cuenta conjunta o personal
                       icon, note, archived }

  categories/{id}    { name, kind: "income"|"expense"|"saving", icon, color, isDefault }

  transactions/{id}  { date (Timestamp), description, amount (negativo = salida),
                       kind: "ingreso"|"gasto"|"ahorro"|"transferencia"|"pago_deuda",
                       categoryId, accountId, toAccountId?, method,
                       period: { year, month, q: 1|2 },
                       createdByUid, paidByUid,
                       split: null | { mode: "equal"|"percent"|"amount",
                                       shares: { uidA: 12000, uidB: 8000 } },
                       linkedType?: "loan"|"installment"|"goal", linkedId?, notes, createdAt }

  settlements/{id}   { fromUid, toUid, amount, date, note, transactionIds[] }

  budgetTemplate     { income: { q1, q2 }, updatedAt }
    items/{id}       { name, categoryId, planned, q: 0|1|2, icon, active }

  budgets/{YYYY-MM}  { month, income: { q1, q2 }, source: "template"|"manual", closedAt? }
    items/{id}       { name, categoryId, planned, q, icon, templateItemId?, overridden: bool }

  recurring/{id}     { name, categoryId, accountId, amount, q, dayOfMonth, active,
                       scope: "personal"|"shared", ownerUid, visibility: "private"|"space" }

  loans/{id}         { name, entity, original, balance, fee, installments, paid, rate,
                       startDate, nextPaymentDate,
                       scope: "personal"|"shared", ownerUid, visibility: "private"|"space" }

  installments/{id}  { name, total, fee, installments, paid, nextPaymentDate,     // tasa 0
                       scope: "personal"|"shared", ownerUid, visibility: "private"|"space" }

  goals/{id}         { name, icon, target, current, monthlyContribution, dueDate, active,
                       scope: "personal"|"shared", ownerUid,
                       visibility: "private"|"space",
                       contributions: { uidA: 180000, uidB: 120000 } }   // solo si scope = shared

invites/{code}       { ledgerId, ledgerName, email (lowercase), role, invitedByUid,
                       status: "pending"|"accepted"|"revoked", expiresAt }
```

### Gastos compartidos
- Un gasto en un ledger compartido lleva **`paidByUid`** (quién puso la plata) y **`split`** (cómo se reparte).
- **El split se decide al registrar cada movimiento**: no hay un modo global en configuración. El modal muestra siempre el selector con cuatro opciones — *Sin dividir* (100 % de quien pagó, `split: null`), *Mitad y mitad*, *Por porcentaje* y *Montos exactos* — y viene preseleccionado con **lo último que usaste en ese espacio** (`lastSplitUsed`, guardado en `ledgerRefs`), que es una sugerencia, no una regla: cambiarlo no cambia nada del pasado.
- `split.mode: "equal"` reparte 50/50; `percent` y `amount` permiten 70/30 o montos exactos. El movimiento se guarda **una sola vez**: no se duplica por persona.
- Se puede **editar el split de un movimiento ya registrado**; el balance se recalcula solo porque es un valor derivado.
- El **balance** se calcula en el cliente: para cada movimiento, quien pagó queda acreedor por la parte que no le tocaba. Sumado da un único número: *"Ana le debe ₡43,200 a Luis"*.
- **Liquidar** crea un `settlement` + una transferencia real entre cuentas, y deja el balance en cero.
- El movimiento afecta el saldo de **la cuenta con la que se pagó**, sin importar el split. Split y saldo son cosas distintas: el split solo alimenta el balance entre personas.
- En un ledger personal, `paidByUid` es siempre el dueño y `split` es `null`; la UI de división ni se muestra.

### Metas y deudas: personales y del espacio
Dentro de un mismo espacio compartido conviven las dos cosas, distinguidas por **`scope`**:

- **`scope: "personal"`** — la meta o la deuda es de una sola persona (`ownerUid`). Es lo que pasa con un préstamo que trajo cada quien de antes, o un ahorro propio.
- **`scope: "shared"`** — es de la pareja: *"Fondo del viaje"*, *"Préstamo del carro"*. Lleva **`contributions`**, cuánto puso cada quien, que se alimenta de los movimientos con `linkedId` apuntando a la meta. Así se ve el avance total **y** el aporte de cada uno.
- **`visibility`** es independiente de `scope`: una meta personal puede ser `"private"` (solo la ve su dueño) o `"space"` (la ve la pareja pero sigue siendo de una sola persona). Las `shared` son siempre `"space"`.
  - **Por defecto una meta o deuda personal nace `"private"`**, con un switch *"Visible para el espacio"* al crearla. Es el default prudente: se puede abrir después, pero lo que ya se vio no se puede "des-ver".
- En consulta esto son **dos listeners que se unen en el cliente**: `where('visibility','==','space')` y `where('ownerUid','==',miUid')`. Las reglas niegan la lectura de un documento `private` ajeno, así que la privacidad no depende de que el query filtre bien.
- El **dashboard** de un espacio compartido muestra las dos capas: los KPIs de deudas y ahorros suman lo del espacio, con el desglose *"tuyo / compartido"* debajo.
- En un ledger personal todo nace `scope: "personal"` y la UI no muestra ninguna de estas opciones.

### Presupuesto variable sobre plantilla fija
- `budgetTemplate` es lo normal del mes (alquiler, teléfono, gimnasio…).
- Al abrir un mes que no existe, se **materializa** `budgets/{YYYY-MM}` copiando la plantilla. Es una copia real, no una referencia: editar marzo no toca febrero.
- Un ítem editado queda con `overridden: true` y la UI lo marca ("ajustado este mes"). Botón *"Guardar cambios en la plantilla"* para cuando el cambio es permanente.
- Meses pasados quedan **cerrados** (`closedAt`) para que el histórico no se mueva solo.

### Índices, denormalización y reglas
- **Índices compuestos**: `transactions` por `(period.year, period.month, period.q)`, por `date desc`, por `(kind, date desc)`; `ledgers` por `memberUids array-contains`.
- **Denormalización mínima**: `accounts.currentBalance`, `loans.balance/paid`, `goals.current` se actualizan en la **misma `runTransaction`** que crea/edita/borra el movimiento. Todo lo demás se calcula.
- **Security Rules** (esqueleto; van versionadas en `firestore.rules`):

```js
function member(ledgerId) {
  return request.auth != null &&
         request.auth.uid in get(/databases/$(database)/documents/ledgers/$(ledgerId)).data.members;
}
function role(ledgerId) {
  return get(/databases/$(database)/documents/ledgers/$(ledgerId)).data.members[request.auth.uid].role;
}

match /users/{uid}/{doc=**} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
match /ledgers/{ledgerId} {
  allow read:   if member(ledgerId);
  allow create: if request.auth != null && request.resource.data.ownerUid == request.auth.uid;
  allow update: if role(ledgerId) in ['owner', 'editor'];   // miembros: solo owner, ver nota
  allow delete: if role(ledgerId) == 'owner';

  match /{sub=**} {
    allow read:  if member(ledgerId);
    allow write: if role(ledgerId) in ['owner', 'editor'];   // 'viewer' solo lee
  }
}
match /invites/{code} {
  allow read:   if request.auth != null &&
                   request.auth.token.email.lower() == resource.data.email;
  allow create: if request.auth != null;                     // el invitador
  allow update: if request.auth != null &&
                   request.auth.token.email.lower() == resource.data.email &&
                   request.resource.data.status == 'accepted';
}
```
> Nota: las subcolecciones con `visibility` necesitan una regla propia más estricta que el
> `match /{sub=**}` genérico — leer un documento `private` solo lo puede hacer su `ownerUid`.
> Nota: cambiar `members` debe restringirse al `owner` con una condición que compare
> `request.resource.data.members.keys()` contra las anteriores, y la aceptación de invitación
> permite **solo** que el invitado se agregue a sí mismo con el rol del invite. Estas reglas se
> prueban con el **emulador** (`@firebase/rules-unit-testing`) — son código con tests, no un anexo.

**Roles**: `owner` (todo, incluye miembros y borrar el espacio), `editor` (registra y edita movimientos), `viewer` (solo lectura, útil para mostrarle las cuentas a alguien sin que toque nada).

**Flujo de invitación sin Cloud Functions**: el owner crea `invites/{code}` con el correo del otro; se
comparte el link `…/invite/{code}`; el invitado entra con ese correo, la app valida el invite y en una
transacción se agrega a `ledgers.memberUids` + `members` y crea su `ledgerRefs`. Si más adelante hay
Blaze, esto se mueve a una Cloud Function y las reglas se cierran todavía más.

---

## 6. Estructura del proyecto

```
src/
  app/            router, layout desktop (sidebar + switcher) y móvil (tab bar), providers
  lib/firebase/   init (lee env), auth, appCheck, repositorios por colección
  domain/         money.ts, periods.ts, budget.ts, debt.ts, goals.ts, alerts.ts, split.ts, balance.ts
  features/
    auth/ onboarding/ ledgers/ dashboard/ transactions/ budget/ accounts/
    loans/ installments/ goals/ calendar/ settings/
  ui/             Button, Input, Card, KpiCard, ProgressBar, Sheet/Modal, Table, Tag, Avatar, EmptyState
  styles/         tokens.css (extraídos del diseño), globals.css
firestore.rules   firestore.indexes.json   .env.example
```

---

## 7. Fases

| Fase | Entregable | Estimado |
|---|---|---|
| **0. Setup** | Vite+TS+React, tokens y fuentes del diseño, ESLint/Prettier, `.gitignore` + `.env.example`, proyecto Firebase dev, emuladores, CI con gitleaks | 1 día |
| **1. Design system** | `ui/` completo + shells desktop/móvil navegables con los datos del diseño | 2 días |
| **2. Auth + ledger personal** | Login, registro, recuperar contraseña, guardas de ruta, creación del espacio personal | 1–2 días |
| **3. Onboarding** | los 7 pasos, escritura de moneda, ingresos, cuentas, categorías, plantilla de presupuesto, deudas y metas | 2 días |
| **4. Movimientos** | CRUD + modal, filtros, actualización transaccional de saldos | 2–3 días |
| **5. Presupuesto** | plantilla + materialización por mes, overrides, quincenas, previsto vs. real, estados | 2–3 días |
| **6. Dashboard** | KPIs, control quincenal, flujo de caja, alertas, gasto por categoría | 2 días |
| **7. Espacios compartidos** | switcher, invitaciones, roles, reglas con tests en emulador | 3 días |
| **8. Gastos compartidos** | `paidBy` + selector de split en el modal, balance "quién debe a quién", liquidación | 2–3 días |
| **9. Deudas** | préstamos y tasa 0, personales y del espacio; pagar cuota genera movimiento | 2 días |
| **10. Ahorros** | metas personales y de pareja, aportes por persona, % de avance, proyección | 1–2 días |
| **11. Calendario** | eventos del mes desde recurrentes, cuotas y metas | 1–2 días |
| **12. Configuración** | moneda, ciclo, categorías, recurrentes, seguridad, exportar CSV | 1–2 días |
| **13. PWA + pulido** | manifest, service worker, offline, skeletons, accesibilidad, tests | 2 días |
| **14. Deploy** | Hosting, reglas e índices, App Check, backups | 1 día |

Ruta más corta a algo usable: **0–2, 4 y 6** (registrar movimientos y ver el resumen). Lo compartido
(7–8) llega después, pero **el modelo de datos lo contempla desde el día uno** — por eso todo cuelga
de `ledgers/` y no de `users/`; migrarlo después sería reescribir la mitad de la app.

---

## 8. Riesgos y cuidados
- **Dinero en punto flotante**: guardar montos en **enteros (céntimos)** o usar un helper único; nunca sumar floats sueltos. En los splits, el **redondeo sobrante va a quien pagó** para que las partes sumen exactamente el total.
- **Zonas horarias**: guardar `Timestamp` UTC pero calcular la quincena con la zona del usuario (`America/Costa_Rica`).
- **Meses de 28/29/31 días**: la 2ª quincena termina el último día del mes, no el 30.
- **Borrar un movimiento** debe revertir saldo de cuenta/préstamo/meta y el balance compartido, en la misma transacción.
- **Edición simultánea** en un espacio compartido: usar `runTransaction` para todo lo que toque saldos, y mostrar quién creó cada movimiento.
- **Salida de un miembro**: decidir qué pasa con sus movimientos (se conservan, con el nombre congelado en el documento).
- **Costos de Firestore**: leer solo el mes activo; paginar movimientos.
- Reglas probadas en emulador y **backups automáticos** antes de meter datos reales.

## 9. Decisiones pendientes
1. ¿Multi-moneda real (tipo de cambio) o una moneda por espacio? (por ahora: una por espacio)
2. ¿Importar movimientos desde CSV del banco / SINPE?
3. Al liquidar un balance, ¿se permite liquidación **parcial** o siempre por el total?
4. Si alguien sale del espacio, ¿sus metas y deudas `personal` se van con él o quedan archivadas en el espacio?
