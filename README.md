# Caudal

Contabilidad y finanzas personales con presupuesto **quincenal**, espacios
compartidos para parejas y metas de ahorro. React + Firebase, responsive.

El plan de desarrollo completo —modelo de datos, reglas, fases— está en
[`docs/PLAN.md`](docs/PLAN.md).

## Arrancar

```bash
npm install
cp .env.example .env.local   # completá con tu proyecto Firebase
npm run dev
```

| Script | Qué hace |
|---|---|
| `npm run dev` | servidor de desarrollo (Vite) |
| `npm run build` | typecheck + build de producción |
| `npm test` | tests del dominio (Vitest) |
| `npm run format` | Prettier |

> **Credenciales:** `.env.local` está en `.gitignore` y nunca se versiona. La
> config web de Firebase no es secreta, pero la seguridad la dan las Security
> Rules, App Check y la restricción de la API key por dominio. El JSON de
> service account va en los secretos de CI, nunca en el repo.

## Estado

**Fases 0 y 1 completas**: sistema visual, gráficos animados y todas las
pantallas del diseño navegables — acceso, primer uso en siete pasos, dashboard,
shell de escritorio y de móvil. Todavía **sin Firestore ni Firebase Auth**: los
datos son los del diseño y los formularios no persisten. Eso entra en la fase 2.

Recorrido: `/login` → `/onboarding` → `/s/personal` (o `/s/casa`, el espacio
compartido, donde aparece el reparto de gastos).

## Sistema visual

Los tokens salen del design canvas original y viven en
`src/styles/tokens.css` — es la fuente de verdad del look.

La paleta de datos está validada, no elegida a ojo: la categórica pasa los seis
checks sobre la superficie oscura (CVD ΔE 8.4, visión normal 19.3, contraste
≥3:1) y la rampa secuencial es de un solo tono con lightness monótona. Reglas
que el código respeta:

- **Los colores de estado** (verde/amarillo/rojo) significan estado; nunca se
  usan como color de serie.
- **Categorías nominales, un solo tono** — la longitud de la barra ya codifica
  la magnitud.
- **Todo gráfico tiene vista de tabla**: ninguna cifra depende del hover.
- **Las animaciones respetan `prefers-reduced-motion`**, por CSS y por JS.
