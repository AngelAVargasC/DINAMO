# DINAMO — Gym | Active Hub

Experiencia web 3D scrolltelling de la marca DINAMO (gimnasio, Polanco CDMX).

**Lee primero la bitácora: [BITACORA.md](./BITACORA.md)** — ahí está lo hecho,
lo decidido y lo pendiente de cada sesión.

## Estructura

- `brand/` — material fuente (brandbooks PDF, logos, fuente, piezas OASIS). No tocar.
- `web/` — el sitio: Astro 5 + CSS a mano + WebGL2 a mano (sin Three.js, sin
  Tailwind/Bootstrap; es decisión firme).
  - `src/pages/index.astro` — toda la página (single scrolltelling).
  - `src/styles/global.css` — todo el CSS.
  - `src/scripts/gl.ts` — WebGL: barra olímpica por revolución + partículas + coreografía de scroll.
  - `src/scripts/ui.ts` — reveals, cursor, marquees, microinteracciones.

## Marca (resumen operativo)

- Colores: negro `#282420`, amarillo `#FFE700` (Pantone 803 C), grises `#949290` / `#C9C9C8`.
- Tipografía: Acumin Variable Concept (wght 100–900, wdth 50–115) en `web/public/fonts/`.
- Slogan: **YOU VS YOU**. Sub: GYM | ACTIVE HUB.
- Sub-marcas (secundarias a DINAMO): **the lab** (shake bar, morados + magenta) y
  **OASIS** (wellness, gradientes aurora).

## Comandos

```
cd web && npm run dev    # http://localhost:4321
cd web && npm run build
```

Angel hace sus propios commits — nunca commitear por él.

## Deploy (GitHub → Railway)

- El repo es la carpeta raíz (`DINAMO/`), no `web/`. `package.json` y
  `railway.json` de la raíz delegan a `web/`: Railway no necesita Root Directory.
- Build: `npm run build` (→ `npm ci` + `astro build` en `web/`).
  Start: `npm start` (→ `serve dist -s`, lee `PORT` del entorno). Node 20+.
- Sitio 100 % estático (`web/dist/`). Sin variables de entorno.
- `brand/`, `scrape/` y `vault/` están en `.gitignore` (656 MB; no se suben).
  Todo lo que usa la web ya está en `web/public/`.
