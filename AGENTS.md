# AGENTS.md — futbol360-app

Instrucciones para agentes de IA que trabajen en el frontend de Fútbol 360.

**Contexto único del proyecto:** el producto y el contrato con la API están en el repo hermano
`../futbol360-api`. Antes de escribir código lee:
- `../futbol360-api/SPEC.md` — entidades, reglas de negocio, endpoints (§5) y pantallas (§6)
- `../futbol360-api/specs/NNN-*.md` — spec de la tarea
- `../futbol360-api/AGENTS.md` — si la tarea también toca la API

No copies SPEC.md a este repo: se edita solo en la API. Si añades o cambias una pantalla,
actualiza `SPEC.md` §6 allí.

## Stack (versiones reales de package.json)
- Next.js 16.2 con App Router (`app/`), React 19.2, TypeScript 5 (`strict`)
- UI: Ant Design 6 (`antd`, `@ant-design/icons`) + Tailwind CSS 4 + `react-icons`
- Datos: `axios` (cliente en `app/services/api.ts`), `swr` en pantallas de campeonato
- Estado global: `zustand` con `persist` (localStorage, clave `auth-storage`)
- Fechas: `dayjs`
- Alias de imports: `@/*` → `./app/*`
- **Node ≥ 20** (Next 16 no funciona con el Node 16 por defecto del sistema: `nvm use 22`)

## Comandos
- `npm run dev` — http://localhost:3000 (la API local debe correr en :5001)
- `npm run build` — debe pasar sin errores antes de terminar una tarea
- `npm run lint` — ESLint 9 (`eslint-config-next`); hoy 0 errores, algunos warnings
- `npx tsc --noEmit` — chequeo de tipos rápido
- No hay tests.

## Variables de entorno (`.env`, ver `.env.example`)
- `NEXT_PUBLIC_API_URL` — URL de la API. Si existe, axios llama **directo** a ella desde el
  navegador (no pasa por el rewrite). Si no existe, usa `/api`, que `next.config.ts` reescribe a
  `http://localhost:5001`.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — para construir URLs de imágenes.

## Estructura real
```
app/
  layout.tsx, page.tsx (redirige a /login), not-found.tsx, globals.css
  (login)/      login/ (usuarios de liga, pide código de liga) · admin/login/ (master)
  (admin)/      layout con menú admin/master · home/ leagues/ users/
  (usuarios)/   layout de la liga · dashboard/ campeonatos/ categories/ teams/ players/
                matchs/ history/ usuarios/
  components/   reutilizables (CrudModal, DeleteButton, FastAutocomplete, ImagenUploader,
                PageHeader, Movements, ResponsiveCard…)
    campeonato/ EtapasCampeonato, ProgamarPartido, TablaPosiciones, ContadorMinutos
    forms/      categoryForm, championsForm, playerForm, teamForm, userForm
    layout/     AppHeader, AppSidebar, AuthProvider (+ Providers con tema antd)
    utils/      ShowError (useShowError/useShowMessage), useConfirm
  assets/       vistaIndex.tsx (useVistaIndex), vistaInsert.tsx (useVisataInsert), menus.tsx, utils.tsx ($filtros, $rules)
  services/     api.ts (axios + token + 401→logout), auth.ts, store.ts (useAuthStore)
  libs/         cloudinary.ts (cloudinaryUrl)
  types/        tipos compartidos
```

## Patrones del repo (úsalos en lugar de crear nuevos)
- **Listados:** `useVistaIndex<T>({ endpoint, params })` → `tableProps` para `<Table>` de antd.
  Guarda `page`, `limit`, `sort`, `q` y filtros en la URL; lee `{ data, total }` de la API.
- **Alta/edición:** `useVisataInsert<T>({ endpoint })` con `Form` de antd. Las rutas
  `[id]/edit/page.tsx` reutilizan la página `insert`. Para formularios cortos, `CrudModal`.
- **Errores:** `useShowError()` muestra `error.response.data.message` en un modal.
  Mensajes de éxito con `useShowMessage()`.
- **Selects remotos:** `FastAutocomplete` con `endpoint`.
- **Imágenes:** `ImagenUploader` (`POST/DELETE <endpoint>/:id/image`) y
  `cloudinaryUrl(publicId, size, "fill" | "fit" | "face" | "pad")` dentro de `Avatar`/`img`.
  La API guarda el `publicId`, no la URL.
- **Auditoría:** el componente `Movements` (Bitácora) muestra `_movements` vía `useAuthStore().setBitacora`.
- **Filtros a la API** usan la sintaxis de mongoose-smart-query: `{$in}a,b`, `{$gte}x{$lte}y`,
  `$getAllFields=true` (ver SPEC.md §5).

## Autenticación y roles
- Login de liga: `POST /auth/login { code, username, password }` → `setAuth(token, user, "user")` → `/dashboard`.
- Login master: `POST /auth/admin/login` → `setAuth(..., "admin")` → `/users`.
- La protección de rutas es solo en cliente (layouts de `(usuarios)` y `(admin)`); no hay `middleware`.
  La seguridad real la hace la API.
- El menú se arma por roles con `getMenuByRoles` (`assets/menus.tsx`):
  master, admin, directivo, official, player.

## Convenciones
- Casi todas las páginas son `"use client"` (antd + zustand). Server Components solo si no hay estado ni antd interactivo.
- Textos de la interfaz en español; código en inglés (hay legado en español: `Insertar`, `vocalia`, `$filtros`).
- Colores del tema: primario `#51ad73`, sidebar `#1da350`, header liga `#DCFCE7`, header admin `#D4D4FF`.
- Cada pantalla contempla estados de carga, vacío (`components/Empty`) y error.
- Responsive con `Grid.useBreakpoint()` de antd y `ResponsiveCard`; menú en `Drawer` en móvil.
- Los tipos de respuesta deben coincidir con SPEC.md §3/§5. Si la API no ofrece lo que necesitas,
  no lo inventes: anótalo como pendiente en la spec.
- No añadir dependencias nuevas sin justificarlo en el PR.

## Seguridad
- Nada secreto en variables `NEXT_PUBLIC_*`: se exponen al navegador.
- El token JWT y el usuario se guardan en localStorage (`auth-storage`); no guardes más datos sensibles.

## Flujo de trabajo para el agente
1. Lee la spec de la tarea en `../futbol360-api/specs/`. Si es ambigua, pregunta antes de codificar.
2. Propón un plan corto (pantallas/componentes a tocar).
3. Implementa, ejecuta `npm run lint` y `npm run build` (Node ≥ 20) y revisa en el navegador.
4. Actualiza SPEC.md §6 si cambiaste pantallas y marca los criterios de aceptación cumplidos.
