# Bitácora — DINAMO

## 2026-09-18 — Observaciones de Enrique (cliente) por WhatsApp

Enrique revisó el sitio publicado y mandó estas correcciones. Se anotan
**todas antes de tocar nada**, para poder comprobar al final que ninguna
quedó fuera. Estado: `[x]` hecho · `[ ]` pendiente.

### Lista de cambios solicitados

1. `[x]` **«Ese no es el logo».** *Aclaración posterior de Angel:* Enrique se
   refería al **orden del lockup horizontal**: DINAMO usa oficialmente la
   palabra con el isotipo (tres barras) **a la derecha** («DINAMO ⫽», portada
   del brandbook), no a la izquierda como iba en la web. Corregido en la
   cabecera (`.hd-logo`), el sello de las fotos (`stamp`) y el pie
   (`.ft-mark`). El logo vertical (isotipo arriba, palabra debajo) y el
   `og.jpg` ya eran los oficiales. Lo de abajo (la tarjeta de WhatsApp) sigue
   siendo cierto y también quedó hecho. La tarjeta de previsualización al compartir
   el enlace por WhatsApp mostraba un logo inventado (dos barras + DINAMO
   sobre triángulo amarillo). Causa: la página no tenía `og:image` ni
   metadatos sociales (pendiente desde sesiones anteriores), así que WhatsApp
   generó la tarjeta por su cuenta. Hecho: `web/public/og.jpg` (1200×630,
   logo oficial con eslogan en blanco e isotipo amarillo sobre negro de marca,
   29 KB) + etiquetas `og:*` y `twitter:*` en el `<head>` de `index.astro`.
   La URL es absoluta y sale de `site` en `astro.config.mjs` → ver «abierto».
2. `[x]` **Foto «Sala privada» está mal etiquetada:** debe ser **TECHNOGYM
   VISIO**. Hecho: pie y `alt` de `sala-privada.jpg` en la galería de «El
   espacio». (El archivo conserva su nombre; el ítem «Sala privada por
   sesión» de la membresía Private es un servicio, no la foto, y se queda.)
3. `[x]` **«Marcas propias dentro del club»:** quitar Technogym, Contorno y
   Latte Latte y poner **OASIS, THE LAB y DINAMO SHOP**. Hecho: la fila de
   logos aliados («Con Technogym · Contorno · Latte Latte») se eliminó; las
   tres tarjetas son ahora OASIS, the lab y DINAMO Shop, en ese orden. La de
   DINAMO Shop usa `recepcion.jpg` y un texto provisional («ropa, accesorios
   y suplementos») **a falta de foto y descripción reales de la tienda**.
   Subtítulo: «Recuperación, nutrición y equipamiento DINAMO».
4. `[x]` **Más fondos oscuros, menos blanco.** Los textos amarillos sobre
   fondo blanco son problemáticos (contraste). Hecho con criterio, no en
   bloque (Angel pidió justificarlo por el usuario). Análisis y decisiones:

   **Regla de contraste.** `#FFE700` sobre hueso `#F4F1EC` da 1.2:1 de
   contraste (WCAG pide 3:1 en titulares grandes): ilegible para cualquiera.
   Sobre tinta `#14130F` da 15:1. Por eso el amarillo **sólo pinta texto
   sobre fondo oscuro**; en secciones claras el énfasis del titular
   (`<em>`) va en tinta y lo distingue el peso 500. Regla CSS global
   `[data-theme="light"] .display em`, afecta a hero («transforms»),
   manifiesto («fitness»), timeline («Conecta») y El espacio («inspira»).
   Antes había 7 titulares con amarillo sobre hueso; ahora 0.

   **Qué sección va en oscuro y por qué (lectura de lo que hace el
   visitante en cada tramo):**
   - Technogym (split) → **tinta**. Contenido de rendimiento y tecnología,
     foto de sala oscura; en claro la foto flotaba y el «alto rendimiento»
     era amarillo sobre hueso. En oscuro la sección se lee como la marca
     Technogym (negro) y el amarillo recupera su función.
   - Conceptos (carrusel de 8) → **tinta**. Es un tramo de *exploración*
     (arrastrar, mirar fotos): las tarjetas ya eran oscuras con velo, y
     sobre hueso parecían recortes pegados. Sobre tinta flotan las fotos y
     el ojo va a ellas. Flechas del carrusel adaptadas (`.dark .cc-arrow`).
   - Marcas propias → fondo **tinta** (era hueso bajo las fotos): evita el
     filete claro bajo las tarjetas.
   - Membresías y Preguntas → **tinta** (ya en esta sesión). Son el tramo
     de *decisión*: comparar planes y resolver dudas antes del CTA; el
     oscuro concentra y aísla del resto del recorrido, y enlaza sin corte
     con YOU VS YOU (amarillo) y el cierre oscuro.
   - Hero, Manifiesto, Todo lo que necesitas, timeline «Entrena. Recupérate.
     Conecta.», El espacio, «Equilibrio bajo la luz» → **siguen en claro**.
     Son tramos de *lectura* (párrafos, listas horarias) o de *arquitectura*
     (interiores claros, madera, luz natural, «bajo la luz» literal): el
     hueso da descanso ocular y el gimnasio no parece un búnker. Sin ellos
     el amarillo deja de destacar, porque destaca por contraste con el negro
     **y** por escasez.

   **Ritmo resultante** (L claro · D oscuro · G amarillo): L L D D D L **D**
   L **D** L D L D D · G · D D D G · lab · oasis · D. Antes había seis
   claras seguidas en el centro; ahora alternan. Cuota oscura ≈ 60 %
   (antes ≈ 45 %).

   **Fondos a sangre, sin filetes claros (Angel, con capturas).** Membresías
   y Preguntas tenían `wrap` en el propio `<section>`: el negro sólo cubría
   el ancho del contenedor y el hueso del body asomaba a los lados y arriba.
   El `wrap` pasa a un `div` interior. Y el separador con isotipo (`.rule`)
   entre marcas propias y membresías **se eliminó**: sus márgenes
   descubrían el hueso del body como dos franjas claras sin función entre
   dos secciones negras.

   Verificado en navegador a 1500 px: hero, Technogym, timeline, Conceptos,
   marcas propias → membresías, Preguntas → YOU VS YOU.

5. `[x]` **Usar las líneas superpuestas del brandbook** (barras amarillas
   diagonales, con degradado, sobre foto en blanco y negro; portada del
   brandbook como referencia). Hecho: componente `.bars` (CSS puro, dos `<i>`
   a 45° con degradado a transparente, entran deslizándose por su eje al
   hacer scroll) en la sección YOU VS YOU («La única competencia eres tú»),
   esquina superior izquierda, sin tapar el titular. Verificado en navegador.
   Reutilizable en cualquier sección `position: relative` con
   `<div class="bars rv" data-rv="bars"><i></i><i></i></div>`.
6. `[ ]` **Membresías («Elige cómo quieres vivirlo»):** nombres correctos
   (Montserrat los pasa; los actuales Essential / Signature / Private son
   provisionales), características reales y **fotos que ilustren cada
   membresía**. Enrique dijo «mando aquí la info de membresías al día de hoy»
   pero esa info **no llegó en las capturas** → pedirla a Angel.
7. `[x]` **«Valoración inicial»:** añadir **«Technogym checkup»**, y dejar
   claro que **el primer checkup está incluido en todas las membresías**.
   Hecho: la FAQ «¿La valoración inicial está incluida?» responde «Sí, en
   todas las membresías. El primer Technogym Checkup está incluido…», y las
   tres tarjetas de membresía llevan una línea con Technogym Checkup
   (Essential: «Technogym Checkup inicial incluido»).

### Transiciones de fondo: probadas y descartadas

Angel pidió que los cambios de fondo fueran «transicionados, no colores
fijos». Se implementó un sistema de **costuras ligadas al scroll** (bloque
del color de una sección avanzando sobre el relleno de la vecina con borde
diagonal, progreso escrito por `ui.ts` según la posición en pantalla, sin
fundido por tiempo). Angel lo vio y lo **descartó**: las cuñas diagonales
a medio recorrido se veían como formas deformes. Se eliminó entero (HTML,
CSS y script; no queda rastro de `seam`).

**Decisión vigente, por tercera vez:** los fondos cambian con **corte
limpio en el borde de la sección**. Ni fundido por tiempo (sesiones
anteriores), ni degradado en el borde (sistema `.fade`, eliminado), ni
costura geométrica (hoy). No volver a proponerlo.

### Rendimiento: scroll sin bajones

Angel pidió «máximo rendimiento, que no se sienta lageado ni con bajones de
fps». Se midió antes y después con un recorrido automático de arriba abajo
(28 px por frame, ~965 frames, 1500 px de ancho), registrando la duración de
cada frame. Primera pasada en frío (caché vacía) y pasadas en caliente.

| Recorrido en frío | Antes | Después |
|---|---|---|
| Frames > 25 ms | 24 | 2 |
| Frames > 50 ms | 2 | 0 |
| p99 | 37,6 ms | 20,8 ms |
| Peor frame | 70,8 ms | 29,1 ms |

En caliente no había bajones ni antes ni después (p95 ≈ 12 ms, con o sin los
cambios: es el techo de este equipo, no del sitio). **Los bajones eran de
frío**: descodificar fotos de 2000–2400 px al entrar en pantalla y, sobre
todo, remedir todo el layout con cada foto diferida que cargaba.

**Qué se cambió (y por qué):**
- `ui.ts`, medición: antes **cada `<img>` al cargar lanzaba `measureAll()`**
  (cientos de `offsetTop` en pleno scroll: 86 fotos diferidas → 86 mediciones
  completas). Ahora sólo miden resize, fuentes, `load` y el
  `ResizeObserver` cuando cambia el alto del documento, agrupados en un frame
  (`requestMeasure`). Es la causa principal de la mejora en frío.
- `ui.ts`, bucle: parallax (`data-par`), ventana (`data-fix`), cinéticas,
  cruz, universo, contadores, carrusel y franja ya **no llaman
  `getBoundingClientRect` por elemento y frame**: su geometría se cachea en
  `measureAll` y por frame sólo se resta el scroll. Antes se alternaban
  lecturas de layout y escrituras de estilo (layout thrashing). Los
  contadores hacían `absTop()` (recorrido de `offsetParent`) por frame.
- `ui.ts`, bucle en reposo: si el scroll no cambió y no hay medición nueva,
  se saltan todos los `sync` atados al scroll (`moved`). Sólo siguen los que
  van por tiempo (universo amortiguado, deriva del carrusel, franja, tour).
- CSS, capas de GPU: `.media img` y `.plan-bg img` tenían
  `translate3d` + `will-change: transform` **siempre**: ~80 fotos del club
  y 45 fondos de membresía promovidos a capa con su textura, fuera de
  pantalla incluidos. Ahora el transform es 2D y sin `will-change`; la clase
  `.par-on` (la pone `syncPars` exactamente en el rango en que escribe
  `--py`, ±200 px del viewport) promueve la foto mientras se mueve y la
  libera al salir. Sin repintados sin capa, sin capas de más. A/B medido:
  mismo coste en caliente que las capas permanentes, y mucha menos memoria
  de GPU (importa en móvil/portátil, no en este PC).
- CSS, trabajo fuera de vista: `IntersectionObserver` pone `.vis` en hero,
  universo, marcas propias, OASIS y la cruz. Fuera de vista se pausan las
  animaciones infinitas (aurora de OASIS, zoom de las tarjetas de marcas) y
  la nube 3D del universo (45 figuras) va con `content-visibility: hidden`.
- HTML: `decoding="async"` en las 87 imágenes (la descodificación no bloquea
  el hilo principal al entrar en pantalla).
- Fotos: 72 JPEG recomprimidos (tope 1800 px de lado mayor, calidad 80,
  progresivo): 16,4 → 12,6 MB. Copia de los originales en el scratchpad de
  esta sesión; la fuente sigue en `brand/`. `img/uni/` (ya ligeras) y los PNG
  no se tocaron.

**Validado y no hay que volver a revisar:** sin errores de consola; galería
de El espacio, universo (secuencia de tres actos intacta) y membresías se
ven igual que antes; `npm run build` OK.

**Marcas propias, hover a tirones (captura de Angel).** La tarjeta se
expande animando `flex-grow` (0.9 s). El coste no era el layout de tres
cajas, sino que la foto (`object-fit: cover` al 100 % del ancho) y el velo
degradado (`::after`) se re-encajaban y **repintaban en cada frame**, tres
fotos grandes a la vez, con el zoom infinito y el parallax encima. Arreglo
sin cambiar el gesto: `.eco-card .media` y `::after` miden siempre el ancho
de la tarjeta expandida (62 vw = 3.2/5.2 de la fila) y van centrados
(`inset: 0 auto 0 50%; margin-left: -31vw`); al animar, la tarjeta sólo
cambia el recorte sobre una imagen ya rasterizada. El encuadre en reposo no
cambia: con estas proporciones (foto 3:2 en caja de ~700 px de alto) la
escala la fija la altura tanto a 33 vw como a 62 vw. En columna (≤ 900 px)
vuelven a `inset: 0; width: auto`. Geometría verificada por script (media de
1059 px centrada en tarjetas de 564 px a 1707 px de ancho). **La medición de
fps del hover no se pudo hacer**: la pestaña de Chrome quedó en segundo
plano y el navegador no ejecuta frames ahí. Angel lo comprueba a mano.

**Carrusel de Conceptos: el hover ya no detiene nada (Angel).** La deriva
automática se pausaba con el cursor encima y con el foco; se quitó. Sigue
parando sólo mientras se arrastra y 3,5 s tras un gesto explícito (flechas,
rueda, táctil), para no pelear con la mano del usuario.

**Collage en cruz en móvil (captura de Angel, iPhone).** Las piezas salían
diminutas y sueltas porque la regla móvil `.cross-t { grid-area: auto }`
pesaba menos que las áreas de escritorio (`.cross .t1 { grid-area: … }`) y
nunca se aplicaba: las fotos seguían ancladas a celdas de una retícula de 12
columnas que ya no existía. Se anula con la misma especificidad
(`.cross .cross-t`) y se recompone a 2 columnas con `grid-auto-flow: dense`:
recepción a sangre → máquinas | cardio a media anchura → terraza a sangre →
vestidores a sangre; las tres flotantes con marco siguen ocultas. Verificado
por geometría en un iframe de 400 px (sin huecos: 360×186, 175×186 ×2,
360×186, 360×186). **Móvil sigue sin probarse en dispositivo real** más allá
de esta sección; conviene que Angel recorra la página entera en el iPhone.

**Portada del brandbook en YOU VS YOU y hero en negro (Angel).**
- **YOU VS YOU («La única competencia eres tú»)**: fuera la foto del chico y
  la chica (`que-es-dinamo.jpg`, queda en `public/img/site` sin usar). Entra
  el velocista de la portada del brandbook, extraído a resolución completa
  del PDF (`public/img/site/sprinter-brandbook.jpg`, 1540×966, fondo negro
  puro). La sección recrea la portada: fondo `#000`, velocista a la derecha
  (`object-position: 68% 60%`), dos barras grandes blanco→amarillo arriba a
  la izquierda (las `.bars` ya existentes, ahora más grandes y con la cola en
  blanco como en la portada), seis carriles verticales (`.creed::before`) y
  el texto abajo a la derecha, donde la portada lleva el logo. En móvil el
  texto va abajo a la izquierda. Velo reducido a un cierre leve inferior.
- **Hero**: se pasó a negro y **Angel lo devolvió a blanco** en la misma
  sesión: sobre negro se ven los cantos del recorte de la atleta
  (`atleta-light.png`). Revertido todo (fondo, tipografía, capas, lecho,
  aurora del shader, opacidad del isotipo 3D y color inicial de la
  cabecera); `hero-gl.ts` queda idéntico al original. **Decisión: el hero es
  blanco.** Si algún día se quiere negro, hace falta otro recorte de la
  figura (o una foto con fondo negro real, como la del velocista).
- YOU VS YOU verificado sólo por DOM (foto cargada, reveal abierto,
  barras y texto en posición): la pestaña de Chrome quedó oculta antes de
  poder capturar el estado final. **Angel: mirar YOU VS YOU** (encuadre del
  velocista y carriles).
- Ajuste posterior: el isotipo de la sección iba encima del titular y caía
  sobre el cuerpo del velocista (se perdían barras). Ahora cierra el bloque
  **abajo a la derecha**, bajo «You vs You», más pequeño (`.creed-mark`).
  Angel seguía viendo «dos barras»: no era recorte (las tres están dentro
  del viewBox, comprobado por geometría) sino tamaño: las dos barras de la
  izquierda comparten diagonal con un hueco de ~9 % del alto y a 38 px el
  antialias las funde. **Regla: el isotipo nunca por debajo de ~3.2 rem**
  (≈ 50 px); en la cabecera y el sello ya está en ese límite.
- **Las barras grandes de la esquina eran dos; el isotipo son tres** (Angel:
  «corrige el logo de la esquina superior izquierda»). En la portada lo que
  hay ahí es el isotipo completo a gran escala. El componente `.bars` ya no
  usa dos `<i>` sueltos: es el SVG del isotipo (mismos `rect` del logo, o
  sea proporciones oficiales) a 46 vw, cortado por el borde izquierdo, con
  un `linearGradient` en unidades de la caja de cada rect: la cola inferior
  izquierda de cada barra se funde a blanco, como en la portada. Entrada por
  opacidad escalonada. Verificado sólo por geometría (pestaña oculta).

**Ideas que quedan si hiciera falta más:** bajar el tope a 1600 px en las
fotos que nunca van a sangre (las de tarjetas y mitades); `srcset` por
tamaño; convertir a WebP/AVIF (~30–40 % menos peso, requiere `<picture>`).
El `CLAUDE.md` menciona `src/scripts/gl.ts`, que no existe (el hero ya no
usa WebGL a mano); conviene actualizarlo.

### Qué quedó abierto

- **Dominio real para `og:image`.** `site` en `astro.config.mjs` es
  `https://dinamo.mx`, pero ese dominio es de otra empresa (redirige a
  dinamo.agency). Hasta que `site` apunte al dominio real (el de Railway o el
  definitivo), WhatsApp no podrá cargar `og.jpg` y mostrará la tarjeta sin
  imagen (nunca más el logo falso). Angel: cambiar `site` y volver a
  desplegar.
- WhatsApp cachea la previsualización: tras el deploy hay que compartir el
  enlace con un parámetro nuevo (`?v=2`) o esperar a que expire la caché.
- **Punto 6 (membresías) sin hacer**: la info de membresías no está en el
  chat capturado. Angel: pasar nombres, características y qué foto ilustra
  cada una. Las tarjetas ya están preparadas para ello (`.plan-bg` rota
  fotos; basta cambiar la lista de `<img>`).
- **Punto 4**: si Enrique quiere aún más oscuro, las candidatas siguientes
  son «Todo lo que necesitas» (lista con fotos al hover) y El espacio
  (galería); las de lectura larga (manifiesto, timeline) deberían seguir
  claras.
- **DINAMO Shop**: falta foto y texto reales (hoy `recepcion.jpg` y texto
  genérico).
- Sitio construido y verificado en navegador (`npm run build` OK; secciones
  YOU VS YOU, marcas propias, membresías y FAQ revisadas a 1500 px). Móvil
  sin probar en dispositivo.

### Sugerencia de commit

`Correcciones de Enrique: og:image con logo oficial, Technogym Visio, marcas propias, checkup en membresías, fondos oscuros y barras del brandbook`

## 2026-09-04 — Preparación para deploy en Railway vía GitHub

### Qué se hizo

**Repo git inicializado en la raíz (`DINAMO/`), sin commits.** Angel hace el
primer commit y el push. Dry run del `git add`: entran 149 archivos, 27 MB en
total (código, `web/public/` con 128 imágenes, fuente, vídeo del recorrido
de 6 MB). GitHub admite archivos hasta 100 MB, así que el vídeo pasa.

**`.gitignore` en la raíz.** Excluye `node_modules/`, `web/dist/`,
`web/.astro/`, y el material fuente: `brand/` (656 MB; sólo el brandbook PDF
pesa 61 MB y hay 389 MB de fotos de interiorismo), `scrape/` (HTML/CSS
bajado de dinamo.fit) y `vault/`. Nada de eso lo necesita el deploy: lo que
usa la web ya está optimizado en `web/public/`. Si algún día hace falta
versionar `brand/`, sería con Git LFS, no en el repo normal.

**Railway sin configurar Root Directory.** En vez de pedirle a Railway que
apunte a `web/`, la raíz tiene un `package.json` mínimo cuyos scripts delegan:
`build` → `npm --prefix web ci && npm --prefix web run build`;
`start` → `npm --prefix web start`. Railpack detecta Node por ese
`package.json` y ejecuta build/start. `railway.json` lo deja explícito y añade
healthcheck en `/` y reinicio ON_FAILURE. `.nvmrc` = 20 y `engines.node >=20`.

**Servidor de producción: `serve`** (añadido a `web/package.json`, lockfile
actualizado). `astro preview` no está pensado para producción. Script:
`serve dist -s --no-clipboard`; `serve` toma el puerto de la variable `PORT`
que inyecta Railway (probado localmente con `PORT=4567`: index 200, fuente
200, ruta inexistente cae al index por `-s`).

### Qué se decidió

- El repo es `DINAMO/` completo (con bitácora y CLAUDE.md), no sólo `web/`.
- Sitio estático servido con `serve`; no hay SSR ni variables de entorno.

### Validado — no hay que volver a revisar

- `npm run build` desde la raíz genera `web/dist/` (1 página, ~1 s).
- `PORT=4567 npm start` desde la raíz sirve el sitio correctamente.
- No hay referencias a `localhost` en `web/src` ni `web/public`.

### Qué quedó abierto

- **Primer commit y push a GitHub**: los hace Angel. Sugerencia de mensaje:
  `Preparar deploy en Railway: gitignore, serve, railway.json`.
- **En Railway**: New Project → Deploy from GitHub repo → elegir el repo. No
  hace falta tocar Root Directory ni comandos. Tras el primer deploy, en
  Settings → Networking → Generate Domain (o dominio propio `dinamo.mx`, que
  es el `site` de `astro.config.mjs`).
- **OneDrive + `.git`**: la carpeta está dentro de OneDrive; si el sync da
  guerra con `.git/`, mover el proyecto fuera de OneDrive o excluir la
  carpeta del sync.
- **Peso**: 27 MB de assets estáticos; el vídeo `recorrido.mp4` (6 MB) es
  lo más pesado. Si el hosting va lento, candidato a comprimir.

## 2026-08-20 — Fondos por sección, rayitas, material de dinamo.fit, cierre con marea, cabecera minimalista y submarcas

### Qué se hizo

**Ecosistema a PANTALLA COMPLETA (`.ecofs`).** La sección pierde `pad-y` y
`.wrap`: las tres tarjetas llenan juntas el viewport (fila flex a `100svh`,
franja continua sin gaps ni radios) y el titular «Marcas propias dentro del
club» vive **dentro del contenedor de imágenes**, superpuesto arriba en hueso
(cabecera absoluta + velo superior en degradado para legibilidad;
`data-theme` pasa a dark). La expansión al hover se conserva tal cual. En
≤900 px, columna con tarjetas de ~55vh. Verificado en Chrome: titular en
hueso sobre el velo, franja continua a viewport completo.

**El DINAMO vertical del split entra de abajo arriba.** Mismo gesto amplio de
Recovery, bidireccional (`.above` espejado hacia arriba). OJO técnico: sus
transforms de reveal **componen** con el `translateY(-50%) rotate(180deg)`
que lo centra y orienta — sin eso, el reveal genérico lo descentraba.

**Coreografía de entrada en Recovery (bidireccional).** Cuatro piezas, cada
una con su gesto: titular «El descanso también…» desliza **desde la
izquierda** (recorrido amplio, `clamp(-9rem, -12vw, -5rem)`); foto vertical
con **barrido izq→der** (`wipel`); foto horizontal **sube** con recorrido
amplio (`clamp(5rem, 14vh, 10rem)`, sin cortina); logo DINAMO entra **desde
la derecha** amplio. Todo sobre el sistema de reveals: entrada lenta
escalonada, salida corta, y al bajar y regresar con el scroll se repite en
ambos sentidos (`.above` con los recorridos espejados).

**Logo grande en el hueco de Recovery.** El espacio muerto sobre la foto
derecha del `rec-grid` lo llena ahora el logo DINAMO (`logo-blanco.png`,
wordmark blanco + rayitas amarillas) **a todo el ancho de la columna**
(misma celda que `rec-b`: logo `align-self: start`, foto `end`; la fila la
mide la foto vertical de la izquierda). Segunda vuelta: primero fue mediano
y Angel lo pidió grandote cubriendo el sobrante.

**El lecho blanco del hero, focalizado en «transforms».** La elipse de
legibilidad (`.hero::before`) pasa de 52%×42% a **22%×13% centrada en la
palabra** (28% 71%): sólo «transforms» necesita lecho — es la palabra
amarilla que se perdería contra la barra amarilla; el resto del titular va
en tinta. Las barras del fondo ya no se ven lavadas por el velo. Verificado
en Chrome.

**Las barras 3D del loader y del hero, al amarillo oficial.** El shader
compartido (`iso3d.ts`) sombreaba las caras al 74 % del amarillo y pintaba
con alpha 0.4–0.8: las barras se veían apagadas y lavadas contra el fondo
(corrección pedida por Angel). Ahora van en `#FFE700` pleno y opaco
(`a = u_op`), con un matiz mínimo en caras (0.94) y cantos (fresnel 0.15)
para que el volumen siga leyéndose. Verificado en el hero: mismo tono que el
resaltado del titular.

**Cierre de la marea con entrada de recorrido amplio.** Al llegar al fondo
de la web, el kicker YOU VS YOU y el logo centrado suben desde abajo con
recorrido largo (`clamp(6rem, 16vh, 11rem)`, no el 1.8rem estándar), lentos
(1.7 s) y escalonados (kicker 0.1 s, logo 0.35 s), con salida corta. De paso:
el kicker vuelve a su 0.6 de opacidad en reposo (el `.rv.in` genérico lo
subía a 1). Verificado en Chrome.

**Split de coworking: el isotipo ya no pisa el texto.** `.split-iso` estaba
centrado en vertical, justo donde cae el párrafo (el copy vive centrado);
pasa al remate superior del carril (`top: clamp(2.6rem, 9vh, 6rem)`).
Verificado en Chrome.

**Ecosistema: la tarjeta se expande al hover.** La fila pasa de grid a flex y
al pasar el cursor la tarjeta crece (`flex-grow` 1→3.2, animado 0.9 s) hasta
dominar la fila y dejar ver la foto entera; las otras dos ceden espacio.
**Sin separación entre tarjetas** (`gap: 0`, franja continua), ambas cosas
afinadas por Angel sobre la primera versión (2.1 + gap). En ≤900 px
(columna) la expansión se desactiva — crecería en alto.
- De paso se reparó una llave huérfana en `global.css` (línea ~2670, del
  bloque de carriles del split) que rompía el build de PostCSS.

**Nueva sección: EL UNIVERSO DINAMO (#universo), tras El espacio.** Sección
oscura de 340vh con escenario sticky: el scroll no baja la página, **mueve la
cámara** (`--cam`, 0→2600px) a través de una nube 3D con **las 45 fotos del
pool** flotando a distintas profundidades (`perspective: 1000px` en el stage,
`preserve-3d` en la nube, cada foto con su `translateZ` de −120 a −2420px).
Al centro, copy elegante sobre velo radial: «EL UNIVERSO DINAMO / Todo lo que
somos, a tu alrededor».
- Posiciones por **hash determinista en el frontmatter** (mismo cielo en cada
  build; nada de Math.random en runtime).
- Cada foto aparece desde el fondo y **se apaga antes de cruzar el plano de la
  cámara** (`syncUni()` calcula opacidad por distancia): sin ese fundido, al
  cruzar el plano la perspectiva la escala a lo bestia y revienta el cuadro.
- Vaivén propio por foto (animación en el `img`, no en el marco, para no
  pisar el transform 3D).
- Móvil: 260vh y la mitad de la nube (`nth-child(2n)` fuera). Reduced motion:
  sin nube, solo el copy sobre fondo oscuro fijo.
- **Entrada en tres actos bien separados (tercera pasada, partitura final de
  Angel):** 1) p 0→0.10 el copy sube de abajo arriba sobre hueso, **en
  tinta** (`--utext` mueve opacidad+translate; el color vira con
  `color-mix(in oklab, bone udark%, ink)` — tinta en claro, hueso en
  oscuro); 2) p 0.14→0.40 el fondo funde a negro, lento (`--udark`);
  3) p 0.42→0.88 sólo entonces aparecen las fotos y viaja la cámara (rampa
  propia `uimg` multiplicando la opacidad por distancia — las fotos son
  exclusivas del acto 3). A la salida la partitura se toca al revés. La
  sección es `bg-bone` como sus vecinas: sin corte en ningún borde. El copy
  ya no usa `.rv`/`data-lines` (un solo sistema). Esto es una excepción
  deliberada al criterio de «línea limpia entre fondos»: aquí el cambio
  sigue siendo ESPACIAL (atado a p, no al reloj), que es lo que importa.

**Barridos con fondo claro y credo en espejo.** La banda de recepción lleva
`.band-light` (fondo hueso bajo la foto): el barrido izquierda→derecha
descubre la imagen sobre claro, no sobre negro. Y la foto del credo («La
única competencia eres tú») entra ahora con `wiper`, de derecha a izquierda.

**Carrusel de conceptos sin separación.** `gap: 0` en el track (franja
continua de fotos) y el paso de las flechas deja de sumar el hueco.

**BUG de cascada arreglado: los reveals con variante se quedaban clavados.**
`.rv[data-rv="…"]` (atributo = nivel clase) empata con `.rv.in` y va después
en el archivo, así que los bloques con variante nunca llegaban a su estado
final — las tarjetas del carrusel se quedaban a `scale(0.96)` para siempre y
eso creaba huecos entre fotos. Arreglo: `.rv.in[data-rv] { transform: none }`
tras las variantes. Afectaba a TODOS los `data-rv` (left/right/scale).

**Journey: isotipo de fondo a la izquierda y titular más grande.** Mismo
patrón que el manifiesto: las tres rayitas (en tinta, sobre amarillo) en
absoluto al borde izquierdo del viewport
(`left: calc(-1·((100vw − min(100vw, maxw))/2 + pad))` desde la celda del
título), detrás del titular, sin mover ningún texto. Y «Dinamo: The Journey»
sube de `clamp(2.2, 4.6vw, 4.4)` a `clamp(2.6rem, 5.8vw, 5.6rem)`.

**Tarjeta central de YOU VS YOU recta y en fundido.** La tarjeta «DENTRO DE
DINAMO VIVEN DOS MARCAS» pierde la rotación de −2° y el `border-radius` de
16 px (recta, ángulos vivos) y su aparición pasa a **fundido puro**: de
desvanecida a sólida (1.7 s), sin desplazamiento. Petición de Angel.

**Cortinas horizontales en las dos bandas.** Nuevas variantes de `.rv-img`:
`data-rv="wipel"` (abre de izquierda a derecha) y `wiper` (de derecha a
izquierda), mismas duraciones que la cortina vertical. La banda de recepción
entra con `wipel` y la de vestidores con `wiper`, a petición de Angel.

**Experiencia: filas activas en amarillo, como Un día.** La lista de las ocho
disciplinas sustituye el filete subrayado de la fila activa por el mismo
trato del timeline: **hover y activa en bloque amarillo con texto en tinta**
(número y título a tinta, descripción a 0.66). Fuera el desplazamiento de
padding del hover; el padding horizontal pasa a fijo (1.2rem) para que el
bloque enmarque.

**Banda de recepción sin parallax de ventana (`.still`).** El efecto ventana
enseña la foto a tamaño pantalla dentro del marco y el lobby nunca se veía
entero; Angel lo pidió completo. La banda lleva ahora `.media.still`
(`height: 100%`, sin `--fy`): la foto llena su marco, quieta, con su
`--pos` de encuadre. El modificador sirve para cualquier otra banda que
quiera foto íntegra.

**Isotipo del manifiesto: FONDO a la izquierda (versión final, 4 vueltas).**
1ª: fila flex a la izquierda → desalineaba el titular. 2ª (otra sesión):
colgado en el margen izquierdo. 3ª: absoluto a la derecha. 4ª, la definitiva
de Angel: **de fondo a la izquierda** — absoluto, pegado al borde izquierdo
del viewport (`left: calc(50% - 50vw)`), grande (`clamp(9rem, 14vw, 14rem)`),
detrás del titular (z 0, titular z 1, `pointer-events: none`), centrado a la
altura del titular. Los textos no se mueven: conservan su alineación con el
párrafo de abajo. En ≤900 px el fondo desaparece. **No mover más sin
preguntar.**

**Un día en DINAMO: selector con preselección y filas amarillas.** Tercera
vuelta de esta pieza, a petición de Angel:
- La imagen ocupa **todo el espacio derecho** (columna al 42 %, alta como el
  timeline) y **siempre hay una foto visible**: la primera fila arranca
  preseleccionada.
- Hover y selección activa van iguales: **bloque amarillo con texto en
  tinta** (hora y título a tinta plena, descripción a 0.66). La selección
  persiste al salir de la lista (ya no se pliega) y también funciona por
  clic/toque, así que el marco vive también en táctil y en móvil (bajo la
  lista, 4:3).
- El marco entra con la cortina estándar (`rv-img`) y las fotos funden entre
  sí al cambiar de fila.

**KPIs del manifiesto en banda amarilla a sangre derecha.** El bloque 3 /
+40 / 24-7 vive ahora en un rectángulo amarillo que corre desde el borde
derecho del viewport y se detiene antes del texto. Cifras al triple
(clamp 2.8–4.6 rem), en tinta, **sin el filete superior**; etiquetas en tinta
suave. Entrada animada: la banda nace en el borde derecho con ancho cero y
**se abre hacia la izquierda** (barrido por `clip-path`, no por escala — la
escala deformaría las cifras), 1.5 s con salida corta.
- OJO técnico: la fila pasó de grid a **flex** porque el sangrado
  `margin-right: calc(50% - 50vw)` resuelve el % contra el contenedor flex;
  en un item de grid resuelve contra su celda y el borde no llega. En móvil
  la banda sangra por ambos lados.

**El botón del header, encima y cuadrado.** Se probó ponerlo detrás de la
chica del hero y Angel lo revirtió en el momento: el botón va **por encima**
(orden normal de capas) y pasa de píldora a **cuadrado, sin border-radius**.
No retomar la variante detrás de la figura.

**El carrusel de conceptos se recorre solo.** Deriva automática suave
(26 px/s, en el bucle rAF) con ping-pong en los extremos — sin saltos de
vuelta al inicio. Cede el mando en cuanto el usuario interviene: pausa por
hover y foco, tregua de 3,5 s tras flechas/rueda/táctil, parada durante el
arrastre y con la pestaña oculta. Detalles:
- Mientras deriva lleva la clase `.auto` (sin `scroll-snap` ni
  `scroll-behavior: smooth`, que pelearían contra el avance por frame); al
  pausar se retira y el encaje vuelve para el uso manual.
- El avance acumula en un float propio (`autoX`): a ~0.4 px/frame, confiar en
  el redondeo de `scrollLeft` podría dejarlo clavado.
- Con `prefers-reduced-motion` no deriva.

**Conceptos sin zoom (decisión firme).** Angel no quiere zoom en las fotos
del carrusel de conceptos: fuera el parallax de ventana (la foto a `100vh`
enseñaba un recorte, que lee como zoom) y fuera el zoom del hover. La foto
entera, quieta en su marco (`cover` normal). También se limpió una regla
huérfana de hover con `scale(1.12)` en el media query de reduced-motion. **No
reintroducir zoom ni ventana aquí.**

**Pilates con la foto del escenario.** El split «Equilibrio bajo la luz» usaba
`site/pilates-tg.jpg` (persona con dálmata); Angel pidió escenario, no
persona: va `terraza.jpg`, el estudio acristalado — que además es lo que dice
el copy.

**Isotipo grandote de fondo en Experiencia.** Las tres rayitas en la esquina
superior derecha de «Todo lo que necesitas…», apareciendo suave (fundido de
2 s con deriva desde la esquina y leve escala). Tras una primera versión en
marca de agua (32 %, 14–26 rem), Angel lo pidió **un 300 % más grande, a
color pleno, pegado a la esquina y con parallax**: queda en
`clamp(42rem, 78vw, 78rem)`, amarillo sin velo, con un tercio superior y un
quinto derecho sangrando fuera (la capa `inset: 0` + `overflow: clip` recorta
sin invadir otras secciones) y deriva con el scroll (`data-par="0.12"` en la
capa, `--py` sobre el svg). `pointer-events: none`, z 0, y el `.wrap` de la
sección sube a z 1. Mismo criterio anti-bug: sin clase `.mark`.

**El pie se funde con la marea.** El footer pasa de tinta a **amarillo pleno**
(`var(--accent)` = `#FFE700`, exactamente el `vec3(1.0, 0.906, 0.0)` del shader
de la marea: sin costura posible) y pierde el borde superior — la ola y el pie
son una sola superficie. Todo el texto pasa a tinta (enlaces 0.78/0.58, aviso
legal 0.5, hover a tinta plena) y las barras del logo también, porque en
amarillo desaparecerían. La estructura del pie no se tocó (a Angel le gusta
como está).

**Icono de las tres rayitas en tamaño medio (`.sec-mark`) presidiendo
cabeceras.** Sólo el isotipo, sin wordmark, con entrada por opacidad barra a
barra. Colocado en: **Journey** (en tinta, sobre amarillo), **credo YOU VS
YOU** y **CTA** (centrado, en amarillo), **Membresías** y **Recovery**.
Sustituye a los `<svg class="mark">` de cabecera, que estaban invisibles: la
animación de `.mark rect` desplaza las barras fuera del viewBox y el SVG las
recorta (el mismo bug documentado en el hero — a tamaño separador no se nota,
a partir de ~3 rem sí). Los separadores `.rule` conservan `.mark`.

**Credo YOU VS YOU casi natural.** El velo doble sobre los atletas iba muy
cargado (radial 0.82 al centro + lineal 0.92/0.95 en bordes) y hundía la foto.
Angel la quiere casi natural: queda un lecho suave tras la tipografía (radial
0.38→0.16) y un cierre ligero arriba/abajo (0.38/0.42), el resto transparente.

**El collage en cruz: dolly-in, no desplazamiento (2ª vuelta).** Se probó una
coreografía radial (las piezas se recogían hacia el centro y se dispersaban al
salir) y Angel la descartó: **las fotos deben verse completas y quietas en su
marco**. Versión final: los marcos no se mueven; cada foto hace **zoom hacia
dentro** conforme la sección recorre el viewport (`--cz` desde `syncCross()`,
monótono: 1 al llegar → 1+profundidad al salir), con más recorrido cuanto más
al frente la pieza (`data-depth` 0.1 el centro → 0.5 las flotantes). La
sensación es de irse metiendo en las imágenes, y la profundidad la da el
diferencial de zoom entre capas. No volver al desplazamiento de piezas.

**Marcas aliadas centradas y animadas.** La fila de logos (Technogym,
Contorno, Latte Latte) va centrada (`justify-content: center`) y cada logo
aparece por su cuenta: sube 1.1 rem y funde a su 55 % de opacidad, escalonados
(0.12/0.28/0.44 s). Hover a opacidad plena, como estaba.

**Isotipo grande en el hero.** Las tres barras (amarillo, ~7 rem) presiden el
titular «Active energy…», entrando por opacidad escalonada barra a barra.
- OJO: **no llevan la clase `.mark`** — su animación (propiedad `translate` +
  `transform-origin: center` conjugada con el `transform` del atributo, que
  rota sobre un punto explícito) desplaza las barras fuera del `viewBox` y el
  SVG las recorta. A tamaño separador no se nota; a 7 rem sí. Si algún día se
  quiere el gesto de construcción aquí, animar sólo opacidad (como quedó) o
  envolver cada barra en un `<g>` y animar el grupo.

**Collage en cruz con profundidad en El club.** Bajo el manifiesto entra un
collage de 8 interiores en forma de cruz: cinco piezas dibujan la cruz
(recepción arriba, maquinas/terraza/cardio-sala como brazos, vestidores abajo)
y tres pequeñas (lámparas, funcional, spa) **flotan por delante de las juntas**
con marco hueso de 5 px. La profundidad la da el parallax escalonado:
`data-par` 0.04 en el centro → 0.16 en las flotantes (verificado: derivas de
4 a 19 px simultáneas). Reutiliza cortina + asentamiento de `.rv-img`. En
móvil (≤900 px) la cruz se pliega a retícula simple y las flotantes se
ocultan.

**Fuera el degradado entre secciones (cambio de criterio).** Angel prefiere
que los fondos cambien con **línea limpia**, no con empalme. Se eliminó entero
el sistema `.fade` (las reglas CSS con `color-mix in oklab`, el padding extra
de `.sec.fade`, las clases y los estilos `--c1/--c2/--fh` de las 8 secciones)
y también el fundido inferior del hero hacia el hueso. Esto **sustituye** la
decisión anterior de «el cambio de color se resuelve como degradado en la
cabecera»: ahora el corte es el borde mismo de cada sección. Verificado en
Chrome: hueso→amarillo y hueso→negro con línea franca; ninguna sección quedó
sin padding propio (the lab, OASIS, CTA y YOU VS YOU lo llevan de serie).

**El velo del hero, de franja a elipse.** La banda blanca al 94% que daba
lecho al titular se comía la máquina de la esquina izquierda de la foto
(Angel pidió que se viera). Ahora el lecho es una **elipse bajo el titular**
(`radial-gradient` en 27% 60%): el texto conserva su fondo y las esquinas de
la foto respiran.

**Cabecera sin `backdrop-filter`** (petición de Angel: nada de filtro en el
fondo del header). La barra `solid` pasa a hueso pleno (`var(--bone)`) en vez
de hueso translúcido + blur — sin desenfoque, y opaca para que el contenido
no se transparente detrás.

**Pasada de mejora sobre parallax, reveals y transiciones (todo el sitio).**
- **Jerarquía de parallax deliberada**: los marcos a sangre o protagonistas
  (las dos bandas `.band`, el CTA, Journey, carrusel de conceptos) llevan el
  **parallax de ventana** (`data-fix`, foto quieta respecto a la pantalla);
  las fotos pequeñas en retícula (galería, ecosistema, planes) conservan el
  **drift suave** (`data-par`). Dos sistemas, un criterio: cuanto más grande
  el marco, más «ventana».
- **Reveals asimétricos**: la entrada sigue lenta y escalonada (cinemática),
  pero la **salida pasa a 0.5–0.6 s sin retardo** — el retardo por índice al
  salir dejaba bloques a medio desvanecer arrastrándose al scrollear rápido.
  Aplica a `.rv`, a la cortina `.rv-img` y a los titulares por línea `.ln`.
- **Asentamiento en las cortinas**: mientras la cortina abre, la foto asienta
  desde `scale: 1.07` a 1 (1.7 s). Compone con el transform del parallax; el
  Ken Burns del ecosistema no se ve afectado (su animación manda sobre scale).
- **Marquesina de disciplinas**: sólo avanza cuando está en pantalla.
- Fuera el `.eyebrow` del hero que había reaparecido: quedó huérfano de CSS
  tras la limpieza y además es decisión firme de Angel.
- Verificado en Chrome: banda de recepción y CTA con la foto clavada al
  viewport y el texto revelando encima; `npm run build` limpio.

**Parallax de ventana también en The Journey.** El mockup de la app
(`.gold-shot`) y la banda del Checkup (`.gold-band`) pasan de `data-par` a
`data-fix`: foto a `100vh` contra-desplazada por `syncFixed()`, quieta
respecto a la pantalla mientras el marco la descubre. Mismo fallback de
`prefers-reduced-motion` que en conceptos.

**Ecosistema: tarjetas más grandes y zoom in permanente.** Las tres tarjetas
(the lab / Oasis / Latte Latte) pasan de `aspect-ratio: 3/4` a
`height: clamp(30rem, 72vh, 44rem)` — el ancho lo da la columna. OJO: un
`aspect-ratio` junto a `min-height` acaba mandando sobre el ancho y desborda
la retícula (pasó y se corrigió). Zoom: **Ken Burns continuo** (animación
`eco-zoom`, 1→1.16 en 16 s, alterna ida y vuelta, siempre en movimiento) sobre
la propiedad `scale`, que compone con el transform del parallax sin pisarlo.
Angel lo pidió así explícitamente: **animado en continuo, no al hover** (se
probó al hover primero y lo corrigió). Con `prefers-reduced-motion`, sin
animación.

**Fuera todos los rótulos `.eyebrow`** («EL CLUB», «MEMBRESÍAS», «GYM & ACTIVE
HUB · POLANCO»…, la rayita amarilla + etiqueta en mayúsculas). Angel no los
quiere: **decisión firme, no reintroducirlos**. Se eliminaron los 18 del HTML y
todo su CSS (base, `.gold`, `.dark`, `.creed`, `.thelab`, `.oasis`, hero/band/
cta). Las secciones abren ahora directamente con el titular. El filete amarillo
de marca sobrevive donde no era rótulo: subrayado del `em`, viñetas, bordes.

**Parallax de ventana en el carrusel de conceptos.** Las fotos de las tarjetas
(`.cc-media`) llevan el efecto que pidió Angel: la imagen se ve **quieta
respecto a la pantalla** y es el sitio el que baja por delante. Mecánica: la
foto mide `100vh` dentro del marco (`overflow: hidden`) y `ui.ts` la
contra-desplaza exactamente lo que el marco lleva recorrido
(`--fy = -rect.top`, con clamp a `[-(vh - alto), 0]` para no descubrir bordes
cuando la tarjeta asoma por los extremos). Es `syncFixed()` sobre `[data-fix]`,
generalizable a cualquier otro marco que quiera este efecto.
- El zoom del hover pasa a la propiedad `scale` (compone con el `transform`
  del contra-desplazamiento sin pisarlo).
- Con `prefers-reduced-motion` la foto vuelve a `height: 100%` estática.
- Verificado en Chrome: `--fy` clava `-top` al píxel y el encuadre cambia
  dentro del marco al scrollear.

**Un día en DINAMO: foto desplegable por fila.** El timeline lleva ahora un
marco fijo a la derecha (misma retícula lista/imagen del resto del sitio) donde
la foto de cada fila **se despliega con cortina** al pasar el cursor y se
pliega al salir de la lista; entre filas, fundido. Fotos: peso-libre (Primer
turno), lounge (The Lab), coworking, sauna (Oasis) y terraza (Comunidad).
- El marco mide lo que mide el timeline (imágenes en absoluto + `align-self:
  stretch`, mismo truco que el mockup de Journey).
- Sin hover real (`hover: none`) o por debajo de 900 px el marco no existe:
  es un adorno de hover, en táctil la lista vuelve a una columna.
- Se probó primero una versión flotante que perseguía al cursor y Angel la
  descartó en el momento: la quiere fija, desplegándose. No retomar la
  flotante.

**The Journey, rediseñada con retícula.** La sección amarilla no tenía ley:
el título quedaba flotando con un vacío enorme debajo y las dos imágenes iban
sueltas, desalineadas y con huecos de amarillo arbitrarios (el «hueco suelto»
ya anotado como pendiente). Ahora es una sola retícula de dos columnas
repetida fila a fila: **cabecera** (título / declaración grande, asentada al
pie del título con `align-self: end`), **cuerpo** (mockup de la app / copy con
ticks, a la misma altura) y **banda de cierre** a todo el ancho (21:9). Nada
queda suelto: cada pieza ocupa una celda y las filas marcan el ritmo vertical.
- OJO técnico: para que el mockup mida lo que mide el copy, su `img` va en
  `position: absolute` — un `height: 100%` en una fila de grid es circular y
  el navegador cae a la altura intrínseca del retrato (kilométrica, era lo que
  descolgaba la columna). En móvil recupera proporción propia (4/5).
- El copy no cambió: mismo texto literal del cliente, sólo recolocado.

**Membresías con foto de fondo rotando + parallax.** Las tres tarjetas de
planes dejan de ser bloques planos: cada una lleva un pase de fotos en fundido
(`.plan-bg`, 15 fotos por tarjeta = las 45 fotos del pool de `/img`, repartidas
por tema — Essential: el club y las salas; Signature: recovery y amenidades;
Private: entrenamiento uno a uno). Quedan fuera sólo los logos y las 3 piezas
gráficas de OASIS (son artes, no fotografía). Las escenas duplicadas conocidas
(`rope-back`≈`runners`, `chalk-plate`≈`deadlift`) van en posiciones alejadas
del mismo ciclo para que no se lean como repetición. Detalles:
- Velo en degradado (0.6→0.9 de tinta) sobre la foto: el texto pasa a claro en
  las tres tarjetas y manda siempre; Signature conserva su filete amarillo.
- La rotación (cada 4,8 s, desfasada 1,6 s por tarjeta) sólo avanza a fotos ya
  cargadas y **se pausa con `document.hidden`**: sin pintado las transiciones
  CSS se congelan pero `setInterval` sigue, y al volver quedaban fundidos a
  medias (misma familia de trampa que el rAF congelado ya anotado).
- Parallax interno vía el sistema existente (`data-par="0.09"` en `.plan-bg`,
  `--py` + `scale(1.14)` en las imágenes) y tarjetas algo más altas
  (min-height 22→27 rem), ambas cosas a petición de Angel.

**El sistema de fondos, rehecho de raíz.** El lienzo fijo que cambiaba de color
con una transición temporal (`transition: background-color`) era el origen de
todo: el color llegaba antes o después que el texto, y había tramos con texto
blanco sobre hueso o negro sobre negro. Además las secciones sin `id` no estaban
en la lista de sondeo, así que al pasar por ellas el lienzo conservaba el color
anterior.

Ahora el color es **espacial, no temporal**: cada sección pinta su propio fondo
(`.bg-bone` / `.bg-ink` / `.bg-gold`) y el cambio entre dos colores se resuelve
como un **degradado en la cabecera** de la sección entrante (`.fade`, con
`--c1` = color saliente y `--c2` = propio). La transición va ligada al scroll por
geometría: es imposible que el texto caiga sobre el color equivocado.

Detalles que costaron:
- El degradado se recortaba al ancho de `.wrap`. Las secciones con empalme pasan
  a ancho completo y el contenido va en un `.wrap` interior.
- `.pad-y` ganaba en especificidad al `padding-top` del empalme y el texto caía
  dentro del tramo mezclado. Resuelto con `.sec.fade`.
- Un degradado lineal de negro a hueso atraviesa un gris sucio que se lee como
  niebla. Va interpolado `in oklab` y con curva (sostiene el color de salida y
  resuelve al final).
- `.hero`, `.band` y `.cta` llevan color de respaldo bajo la foto, por si la
  imagen tarda.

**Las tres barras del isotipo, repartidas por el recorrido** (`.mark`): separador
tras el manifiesto, credo YOU VS YOU, sección amarilla, separador antes de
membresías y cierre. Entran escalonadas, una barra tras otra. El color se decide
por el fondo: tinta sobre hueso y sobre amarillo, amarillo sobre negro.

**Material del sitio actual (dinamo.fit).** Descargadas las 39 piezas a
`brand/DINAMO-FIT-SITE/` y optimizadas 23 fotos a `web/public/img/site/`.
Integradas donde aportan algo que no teníamos:
- El credo deja de ser un bloque negro plano: lleva detrás los atletas de la
  marca, muy velados. Es la única presencia de personas en toda la web.
- La sección amarilla llevaba sólo texto; entra el mockup real de la app.
- Contorno Pilates, Recovery, Nutrición, Coworking y Biostrength usan ahora las
  fotos reales del cliente en el visor de la experiencia.
- Galería: suman terraza acristalada, recepción y peso integrado.
- Fila de marcas aliadas (Technogym, Contorno, Latte Latte) antes de membresías.
  Los logos venían en blanco sobre transparente: se generaron variantes en tinta
  (`*-dark`), porque invertirlos daba negro puro fuera de paleta.

**Reveals y fotos diferidas.** Las imágenes `loading="lazy"` entraban después de
la primera medición y desplazaban todo lo de abajo: los bloques posteriores
quedaban clasificados con posiciones viejas y no llegaban a revelarse nunca. Se
vuelve a medir en `load` y cuando cada imagen pendiente termina de cargar.

**Vuelve la marea líquida como cierre.** Tras «Conoce el club en persona» entra
la sección final que ya teníamos en la propuesta 1: fondo blanco y el frente
amarillo que sube ondulando hasta ir tapando la marca desde abajo, con el tramado
de puntos a 45° (el ángulo del isotipo) vivo sólo en el borde. El shader se
porta **sin tocar** desde `vault/web-v1-propuesta1/src/scripts/footer-gl.ts` a
`web/src/scripts/tide.ts` (sólo cambia el id del canvas): es el gesto que costó
varias vueltas afinar y ya estaba validado. Encima, el logo con eslogan en negro,
que la marea va sumergiendo.

**El pie, a un tercio.** Pasaba de 386 px con cuatro columnas de enlaces
apilados; ahora son 127 px exactos (×0.33) en una sola banda: marca, navegación
y datos de contacto en línea, más un filete fino con el aviso legal. El pie es un
cierre, no una segunda portada — y detrás va la marea, que es lo que debe
llevarse la atención.

**Cabecera minimalista y ocultable.** Siete enlaces, marca y CTA competían
entre sí. Ahora la cabecera es hamburguesa · marca centrada · una sola acción,
y las secciones viven en un menú a pantalla completa (tipografía grande sobre
negro, con dirección, teléfono e Instagram al pie). La barra se retira al bajar
y vuelve al subir.

El ocultado usa un **acumulador de recorrido**, no el delta de un frame: a
velocidad baja el delta es de un píxel y ningún umbral llegaría a dispararse.
Hacen falta 110 px seguidos bajando para esconderla y 70 px subiendo para
recuperarla; por encima del 55 % de la primera pantalla siempre está visible, y
con el menú abierto no se esconde nunca (el botón de cerrar vive en ella).
De paso queda resuelto el menú móvil, que estaba pendiente.

**Vuelven the lab y OASIS desde el vault**, precedidas por la sección amarilla
de texto cinético. Las tres se portan con su lenguaje propio: los morados y el
magenta de the lab, la aurora sobre índigo de OASIS. Las bandas gigantes se
desplazan **según su posición en el viewport**, no con el reloj, para que el
movimiento lo siga mandando el scroll como en el resto del recorrido.

Van al final del recorrido, antes del CTA, con sus empalmes de color encadenados:
hueso → amarillo → morado profundo → índigo → negro.

Un cambio sobre el original: la tarjeta central de la sección amarilla decía
«LA ÚNICA COMPETENCIA ERES TÚ», que es literalmente el credo que ya existe más
arriba. Se cambió por «DENTRO DE DINAMO VIVEN DOS MARCAS», que además presenta
lo que viene justo debajo. Las bandas gigantes se mantienen tal cual.

**Texto dentro de la imagen.** El credo tenía la foto como bloque encima y el
texto en una banda negra debajo: la escena quedaba partida en dos. La causa era
un fallo mío — la regla que hacía la foto absoluta nunca llegó al archivo,
porque la sustitución apuntaba a una versión multilínea de `.creed` y en el CSS
estaba en una sola línea, así que se aplicó en silencio a nada. **Lección: toda
sustitución sobre el CSS lleva `assert`; sin él, un fallo parece un cambio que
simplemente no hace nada.**

Ahora la foto ocupa la sección entera y la frase va encima, con velo doble: un
radial que hunde el centro para que la tipografía blanca no pelee con los altos
de la imagen, y un lineal que cierra los bordes contra las secciones vecinas.

El mismo tratamiento se llevó a otros dos sitios donde gana:
- **Tarjetas del ecosistema**: el rótulo pasa a vivir dentro de la foto. La
  tarjeta se lee como una pieza y no como una imagen con un pie debajo.
- **Galería del espacio**: cada foto lleva su pie dentro (Cardio, Sala privada,
  Doble altura, Terraza, Recepción, Peso integrado). Antes era muda.

**Carrusel de conceptos.** Sección nueva entre «Un día en DINAMO» y «El
espacio»: ocho tarjetas a sangre con el título y la descripción dentro de la
foto, arrastre con el puntero y flechas. Las tarjetas se salen por el borde a
propósito — el corte de la última es lo que anuncia que hay más.

Dos detalles del encaje (`scroll-snap`) que costaron:
- Sin `scroll-padding-inline-start`, el encaje ignora el margen inicial del
  carril: busca el punto más cercano, salta a `scrollLeft: 93` y mete la primera
  tarjeta bajo el borde izquierdo.
- El estado de las flechas **no puede decidirse comparando `scrollLeft` con el
  máximo**: al reposar, el encaje deja un residuo variable (7 px al principio,
  21 al final) y cualquier umbral fijo deja la flecha del extremo activa sin
  nada que recorrer. Se decide por geometría — dónde cae el borde de la primera
  y de la última tarjeta respecto al carril. Y la última encaja por su borde
  derecho (`scroll-snap-align: end`), porque encajando por el izquierdo como el
  resto el recorrido se detenía antes de dejarla ver entera.

**Hero nuevo.** La fachada de noche no vendía el gimnasio; ahora va la atleta en
carrera, en blanco y negro sobre fondo negro. Cae a la derecha del encuadre y
deja el aire de la izquierda justo donde vive el claim, así que el recorte no va
centrado (`object-position: 64% 42%`). La foto salió del visor de la experiencia
y del carrusel para no aparecer tres veces; en ambos sitios Nutrición usa ahora
la del lounge.

**Ajustes de cabecera y arreglo del menú.**
- La marca crece (barras `clamp(1.5rem, 2.4vw, 2.1rem)`, palabra hasta 1.32rem)
  y las tres barras van **siempre en amarillo**, también sobre la cabecera
  clara: son el único punto de color de todo el encabezado.
- «Agenda tu visita» pierde la cápsula y el borde: ahora es texto con un
  subrayado amarillo que aparece al pasar. Pesa mucho menos y deja respirar a
  la marca del centro.
- **El menú se comía los primeros enlaces.** Estaba justificado abajo
  (`justify-content: flex-end`) y con diez secciones el contenido desbordaba
  por arriba, fuera de la pantalla y sin forma de alcanzarlo. Ahora crece desde
  arriba, el pie se empuja solo con `margin-top: auto`, el conjunto puede
  desplazarse si no cabe y los enlaces bajan a `clamp(1.5rem, 4vw, 3rem)` para
  que las diez secciones entren de una vez.

**Hero sobre fondo claro.** Se intentó primero recortar a la atleta del fondo
negro con `rembg` (`u2net_human_seg`). Salió razonable de cuerpo, pero **el pelo
no**: la máscara lo cortaba con un borde escalonado y recto en lugar de seguir
los mechones. Se probó con *alpha matting* y con una clave de luminancia sobre
el fondo negro (núcleo sólido de la máscara + banda exterior sacada de la
luminancia), y aun así el canto no daba la calidad necesaria para un hero.

**Lo resolvió Angel**: descargó `brand/heroligth.png`, la misma toma ya
compuesta sobre fondo claro, con el pelo intacto. Se optimizó a
`web/public/img/site/hero-light.jpg` — de 1.68 MB a 142 KB — y va a sangre.
Se descartó el recorte y se borró la versión oscura, que ya no se usaba.

Con el hero claro, todo el encabezado cambia de signo: la cabecera arranca en
tinta en vez de hueso, el titular y el pie del hero van en tinta, y desaparece
el velo oscuro. En su lugar hay un velo **claro por la izquierda**, porque el
final de «Energía activa» caía sobre el brazo oscuro de la atleta; así la
tipografía conserva su tamaño y siempre tiene lecho.

El empalme hacia el hueso del manifiesto lo cierra el propio hero. Puesto como
`fade` en la sección de abajo salía recortado a su `.wrap` y se veía como una
banda blanca flotando — **el mismo error del `.creed`, y por la misma razón: un
degradado de empalme nunca puede ir en una sección con `wrap`.**

**Resaltado en vez de subrayado, en toda la página.** Las palabras clave de los
titulares llevaban un filete amarillo fino bajo la línea base. Ahora van con la
palabra entera resaltada sobre banda amarilla, y el texto resaltado pasa a
tinta: sobre el amarillo, ni el gris ni el hueso aguantan. Son nueve titulares
más el del hero; el credo se queda como estaba, con «tú» en amarillo sobre la
foto, porque ahí nunca hubo filete.

**El titular del hero, en el gris de marca.** Estaba en `--stone` (`#8a857c`),
un gris cálido que me había inventado. Pasa a `#949290`, que es el Process
Black C al 50 % del brandbook. Se añaden los dos grises oficiales como tokens
con nombre (`--gris` y `--gris-claro`, este último `#c9c9c8`) para no volver a
improvisar.

**Paquete de animación, a partir de maxmilkin.com como referencia.** De esa web
se estudió el *vocabulario*, no el código: al leer su texto se ve que cada letra
y cada enlace aparecen duplicados («M M A A X X», «ABOUT ABOUT»), que es *split*
por carácter con capa duplicada para el rodillo al pasar el ratón, más un
precargador con contador y scroll inercial (usan Lenis). Todo eso son técnicas
estándar; aquí van reimplementadas a mano, que es lo que pide el proyecto.

Lo que entró:
- **Revelado palabra a palabra.** El escalonado pasa de la línea a la palabra:
  el retardo suma línea y posición, así el titular se arma de izquierda a
  derecha. El troceo se hace **sobre los nodos de texto, no sobre `innerHTML`**,
  para que el `<em>` de la palabra amarilla sobreviva entero en vez de partirse.
  Y la puntuación viaja pegada a su palabra: con turno propio entraba 62 ms
  tarde y el punto se despegaba.
- **Enlaces de rodillo** en el menú: la etiqueta sale por arriba y su copia
  entra desde abajo. El duplicado va oculto al lector de pantalla.
- **Botones magnéticos**: el CTA y el botón del cierre se inclinan hacia el
  puntero, con desvío corto a propósito.
- **Precargador**: telón en tinta con el isotipo armándose y un contador que no
  finge — sube mientras las imágenes se resuelven y cierra al terminar la carga,
  con tope de 4 s. Lleva **animación de reserva en CSS**: si el script falla, el
  telón se retira igual y la página nunca queda tapada.

Un efecto secundario que hubo que cerrar: con el telón puesto se bloquea el
scroll, desaparece la barra lateral y la ventana es ~15 px más ancha. Cualquier
posición medida en ese momento queda desviada, así que al cerrar se fuerza una
remedición.

**Hero recortado y fondo WebGL.** La atleta va ahora recortada sobre un fondo
construido. La extracción salió bien **porque se partió de la toma sobre fondo
claro**: máscara de segmentación para el cuerpo más clave de luminancia
invertida para el pelo (sobre fondo casi blanco, la opacidad de un mechón es el
inverso de su luminancia). Sobre el negro original esto mismo fallaba — el
problema nunca fue la técnica, era el fondo.

Encaje: se agrandó y se corrió hasta que los dos cantos del recorte quedaran
fuera de cuadro — el derecho, donde acaban los mechones, y el superior, donde el
recorte los corta en línea recta. Todo medido, no a ojo.

**`src/scripts/hero-gl.ts`** — WebGL2 a mano, sin librerías:
- **Aurora**: campo de color en tonos de marca. Dos campos de ruido arrastrados
  en sentidos opuestos; sin ese cruce se lee como una textura que se desliza y
  no como algo vivo. El amarillo sube por la derecha y se apaga a la izquierda,
  donde vive el titular, para que el texto nunca compita contra el color.
- **Isotipo en 3D**: las tres barras extruidas girando despacio, con difusa y
  un fresnel que marca sus cantos. Cada cara lleva normal propia — compartiendo
  vértices entre caras las normales se promedian y la barra pierde sus aristas.

Disciplina aplicada del oficio: localizaciones de uniforms resueltas una vez y
nunca por frame; DPR limitado a 1.5; sin `ResizeObserver` sobre el propio lienzo
(cambiar sus atributos realimenta al observador); tamaño revisado cada 30 frames
en vez de cada uno; `webglcontextlost` y `webglcontextrestored` atendidos; y las
capas CSS siguen ahí como respaldo — si el contexto no arranca, el hero no se
queda desnudo (la clase `.gl-on` apaga los sustitutos sólo cuando GL sí funciona).

### Qué se decidió

- **El negro se queda en `#14130f`.** Se llegó a cambiar al Process Black C del
  brandbook (`#282420`) y se revirtió a petición de Angel. Queda anotado que la
  página 49 del brandbook especifica `#282420`, `#949290` (50 %) y `#c9c9c8`
  (25 %); si algún día el cliente lo audita, ahí está la diferencia.
- Los colores de marca entran como **acentos y secciones**, no cambiando la base.
- El fondo de una sección **nunca** se anima por tiempo. Si hay que cambiar de
  color, se hace con geometría.
- Un `<svg>` no tiene `offsetTop`: cualquier elemento animado por scroll va
  envuelto en un contenedor de bloque.

### Qué quedó abierto

- Precios de las tres membresías: los tres planes dicen «Consultar». Faltan
  cifras y los nombres definitivos de los niveles.
- `og:image` y metadatos sociales; decisión de hosting.
- `video-checkup.mp4` y `poster-checkup.png` están descargados pero sin usar:
  podrían ir en la sección amarilla si se quiere vídeo.
- Los tres `.split` (Technogym, Contorno Pilates, Coworking) siguen con el texto
  al lado de la imagen, a propósito: si todo el recorrido fuera texto-sobre-foto
  se perdería el ritmo. Queda a decisión de Angel convertirlos también.
- Recortar sujetos de fondos oscuros con `rembg` **no da calidad de hero**
  cuando hay pelo suelto: el cuerpo sale bien, el pelo no. Si vuelve a hacer
  falta, pedir la toma ya compuesta antes de intentarlo.
- **Scroll inercial (tipo Lenis) sin implementar.** Es lo que más cambiaría la
  sensación general, pero secuestra el scroll nativo y hay que medirlo bien
  contra el bucle de posiciones que ya existe. Queda propuesto, no hecho.
- Las fotos de las tarjetas del ecosistema son interiores genéricos (lounge,
  spa, coworking), no de the lab / Oasis / Latte Latte. Y el recorte 3/4 corta
  el rótulo DINAMO en la primera. Faltan fotos propias de cada submarca.

**Aviso de método III.** El servidor de desarrollo cachea módulos por HMR: salió
un `ReferenceError: measureCross is not defined` que **no existía en el código
fuente**, venía de una versión intermedia cacheada. Antes de perseguir un error
de consola, recargar con la query cambiada y confirmar que sigue apareciendo.

**Aviso de método II.** La hamburguesa **alterna**: un `click()` de
comprobación en una llamada y otro en la siguiente la dejan cerrada. Si una
captura sale con el menú cerrado, mirar primero la secuencia de comprobación
antes de buscar el fallo en el sitio.

**Aviso de método (segunda vez que cae).** Con la pestaña sin pintar,
`requestAnimationFrame` se congela: el bucle no corre, las clases se quedan
como estaban y las transiciones CSS se paran a mitad. Cualquier medición hecha
así miente — y un bucle `await rAF` dentro del evaluador **cuelga la pestaña**.
Hay que forzar un repintado (una captura) antes de medir, y nunca esperar
frames desde el evaluador.

### Validado — no hace falta volver a revisarlo

- Los cinco emplazamientos del isotipo: visibles y con contraste correcto en su
  fondo (comprobado en navegador, uno a uno).
- Ninguna imagen rota en toda la página (`naturalWidth === 0` → 0 casos).
- Cada posición del scroll tiene fondo definido: no quedan huecos entre secciones.
- Los cuatro empalmes de color (negro→hueso, hueso→negro, hueso→amarillo,
  amarillo→hueso) con el texto siempre fuera del tramo mezclado.
- El cierre de la marea: contexto WebGL2 activo, canvas dimensionado y contenido
  centrado (849 px de sección, 127 px de aire arriba y abajo).
- El alto del pie: 127 px medidos en navegador, un tercio justo de los 386 px
  que tenía.
- Las tres secciones nuevas en su orden y con sus imágenes: amarilla cinética,
  the lab y OASIS, sin ninguna imagen rota en toda la página.
- El ocultado de la cabecera: `hd solid hide` al bajar y `hd solid` al subir.
- El fondo WebGL: contexto activo, lienzo dimensionado (DPR 1.5), respaldos CSS
  apagados y **cero errores de shader** en carga limpia — importante porque
  WebGL no lanza excepción si un shader no compila, simplemente no dibuja.
- El troceo de titulares: 70 palabras en toda la página, `<em>` intacto dentro
  de su palabra y puntuación pegada («transforms.», «tradicional.»).
- El precargador se retira solo y desbloquea el scroll (comprobado que no queda
  ningún telón residual ni la página bloqueada).
- El texto dentro de la imagen en credo, tarjetas del ecosistema y galería:
  comprobado que la foto cubre la sección entera y que el texto queda dentro.
- El carrusel de conceptos en los dos extremos: al principio sólo avanza, al
  final sólo retrocede, y la última tarjeta se ve entera (7 px de residuo).
  Ocho tarjetas, ninguna imagen rota.
- El menú abierto con las diez secciones: ningún enlace fuera de la pantalla y
  el pie dentro. Comprobado midiendo cada enlace contra la caja del menú.
- El hero claro: titular legible sobre el velo, marca y cabecera en tinta,
  empalme al hueso sin banda visible.
- El resaltado en los nueve titulares: banda completa, texto en tinta y
  `text-decoration: none` en todos, comprobado uno a uno — incluidos los de
  fondo oscuro (Recovery y el cierre), donde la tinta sobre amarillo se lee.

## 2026-08-19 (noche) — PROPUESTA 2: rediseño completo, lujo silencioso

### Contexto
**La propuesta 1 fue rechazada por el cliente.** Se conserva íntegra en
`vault/web-v1-propuesta1/` (sin `node_modules` ni `dist`). El encargo nuevo:
elegante, minimalista, moderna, suave y profesional — el gimnasio es Technogym
de gama alta y la web debe transmitirlo. Referencias que dio el cliente:
su propia web (dinamo.fit) y **remedyplace.com**.

### Qué se analizó
- **remedyplace.com**: minimalismo lujoso. Secciones a pantalla completa,
  splits texto/imagen, blanco y neutros, tipografía grande y limpia, espaciado
  generoso, la imagen manda sobre la ornamentación.
- **dinamo.fit**: estructura (Experience / Journey / Space), servicios reales y
  datos de contacto verificados: Anatole France 146, Polanco, 11550 CDMX ·
  55 2896 3255 · hola@dinamo.fit · partners Technogym, Contorno Pilates y
  Latte Latte · app propia con IA.

### Decisión de diseño clave
**El amarillo deja de ser superficie y pasa a ser acento.** En la propuesta 1
el Pantone 803 C ocupaba pantallas enteras: eso lee "energético/deportivo", no
"lujo". Ahora el peso visual lo llevan la fotografía, el aire y una tipografía
ligera a gran tamaño; el amarillo aparece en viñetas, el isotipo del pie y
poco más. Paleta: hueso cálido `#f4f1ec`, negro cálido `#14130f`, gris piedra
`#8a857c`.

Movimiento: lento y sin rebote (`cubic-bezier(.22,1,.36,1)`, 1,1–1,4 s).
Las imágenes se descubren con una **cortina** (`clip-path`) en lugar de
aparecer, y todas llevan **parallax interno** por variable CSS.

### Estructura
Hero (fachada de noche a sangre) → El club (manifiesto + cifras que cuentan) →
banda de recepción → La experiencia (8 disciplinas con visor sticky) →
Technogym (split) → El espacio (galería asimétrica) → Contorno Pilates (split
invertido) → Recovery (bloque oscuro) → banda de vestidores → Coworking
(split) → Membresías (Essential / Signature / Private) → CTA → pie con datos
reales.

### Material nuevo
`brand/FOTOS INTERIORISMO` (30 tomas HDR) y `brand/RENDERS DINAMO PNG` (10
renders). Se optimizaron **25 imágenes** a `web/public/img/` con nombres
descriptivos (fachada-noche, escaleras, technogym, sauna, vestidores…),
9,9 MB en total. El script de preparación quedó en el scratchpad de la sesión.

### Segunda pasada (misma noche)
Feedback: encuadre de la banda, faltaban acentos amarillos, el scrollytelling
debía ser bidireccional y **faltaba contenido**. Se resolvió:

- **Encuadre por foto**: cada banda declara su `--pos` (`object-position`).
  Encuadrar a ojo es lo que separa una toma de arquitectura de una captura.
- **Reveals bidireccionales** con histéresis (entrar cuesta menos que salir,
  para que un bloque en el umbral no parpadee), variantes `left/right/scale`
  y **titulares partidos por líneas**: cada línea sube desde su máscara.
- **Acentos amarillos** repartidos con criterio: filete del rótulo que se
  dibuja al entrar, subrayado que crece bajo la palabra enfatizada de cada
  titular, filete bajo la fila activa de la experiencia, borde superior de las
  cifras, viñetas, franja del plan destacado, hover del botón y de la nav.
- **Contenido nuevo**: YOU VS YOU (el slogan de marca no estaba en ninguna
  parte), *Un día en DINAMO*, *The Journey* (app con IA + Biostrength),
  **Ecosistema** con las marcas propias — the lab, Oasis y Latte Latte — y
  preguntas frecuentes. La navegación y el pie suman la entrada Ecosistema.

### Tercera pasada — el amarillo vuelve como superficie (medida)
El cliente pidió secciones con **fondo amarillo de marca** y que la transición
entre fondos **se anime con el scroll**.

- **Lienzo de fondo animado**: una capa fija (`.backdrop`) lleva el color y se
  funde en 0,6 s al cambiar de sección; las secciones declaran `data-bg` y no
  pintan fondo propio. El color se decide con una **sonda al 62 % del viewport**
  — más arriba, el color entrante invade la sección anterior; más abajo, llega
  tarde. (Misma lección que en la propuesta 1: un crossfade es temporal, no
  espacial, así que el punto de disparo es lo que hay que calibrar.)
- **DINAMO: THE JOURNEY** pasa a **amarillo pleno**, con el layout de la
  referencia del cliente (título a la izquierda, texto a la derecha) y **su copy
  literal**: Dinamo App, Technogym Checkup, «wellness age», Technogym Coach y
  el login en cada aparato. Entra en la navegación como "La app".
- **Franja de disciplinas** en negro, en marquesina continua: peso libre, peso
  integrado, cardio, alto rendimiento… con el mismo clonado que evita que el
  ciclo quede vacío.

Criterio: el amarillo pleno funciona **como momento único**, no como norma. Un
solo golpe de color en todo el recorrido lo convierte en clímax; repartido por
varias secciones volvería al problema que hundió la propuesta 1.

### Qué quedó abierto
- **Precios de las membresías**: los tres planes dicen "Consultar"; faltan
  cifras reales y el nombre definitivo de cada nivel.
- **Menú móvil**: por debajo de 980 px la navegación se oculta y aún no hay
  botón hamburguesa.
- Falta og:image y metadatos sociales; falta decidir hosting.
- Las fotos verticales de recovery pesan más que el resto: convendría servir
  WebP/AVIF si se busca afinar la carga.

### Validado
Recorrido completo revisado en Chrome: hero, manifiesto, bandas, visor de la
experiencia, galería, recovery, membresías, CTA y pie. `npm run build` limpio.
Correcciones aplicadas en la revisión: velo inferior en las bandas y en el CTA
(el texto claro se perdía sobre las tomas claras), el visor de la experiencia
no debía llevar cortina (es sticky y quedaba en gris), y las columnas del pie
se posicionan por `nth-child` — con `nth-of-type` el bloque de marca contaba
como columna y descolocaba la tercera.

---

## 2026-08-18 (tarde) — Secciones nuevas, color en transición, profundidad y hero v3

### Qué se hizo

**1. Fondo global que se funde entre secciones.** Nuevo `.backdrop` fijo
(`z-index:-1`) con `transition: background-color .9s`. Cada `<section>` declara
`data-bg`; el color activo se resuelve **en el bucle rAF** (`syncSection`), no
con IntersectionObserver: al saltar de golpe a mitad de página el observer no
disparaba y el fondo quedaba desfasado. El mismo resolvedor fija el tema del
header y la etiqueta de sección.

**2. Tres secciones nuevas** (más blanco y amarillo, que es lo que resalta):
- `03 MÉTODO` (blanco): 3 cards Diagnóstico / Plan / Progresión.
- `04 UN DÍA EN DINAMO` (negro): timeline 06:00 TRAIN → 07:30 THE LAB →
  19:00 OASIS → 21:00 CONNECT. Enlaza las sub-marcas con el día del socio.
- `06 COMUNIDAD` (blanco): 3 fotos flotantes con parallax a distintas
  velocidades y repartidas en distintas capas, título gigante y link a IG.
Ritmo de color resultante: negro → blanco → **amarillo** → blanco → negro →
**amarillo** → blanco → **amarillo** → morado (lab) → aurora (oasis) → negro.

**3. Sistema de capas / profundidad.** Orden explícito:
`backdrop(-1) → palabras gigantes .bgword → contenido → canvas 3D (z3) → .front (z4+)`.
- `.bgword`: palabra gigante de fondo (ENERGÍA, FUERZA, MÉTODO) con parallax:
  la pesa pasa **por encima** de ellas.
- Todos los bloques de texto clave suben a `z-index:4`: la pesa pasa **por
  detrás** del copy (legibilidad garantizada) — el efecto pedido de "por atrás,
  luego por encima".
- En Comunidad: la foto grande va detrás (z auto), las chicas por delante (z4/z5)
  → el título cruza por delante de una y por detrás de otra.
- Parallax de scroll vía `data-para` y parallax de cursor en el hero vía
  `data-mpar` / `data-hpar`.

**4. Nueva narrativa de la pesa 3D** (no estorba): se presenta en el hero,
se encoge y se va al margen en los bloques de lectura, crece en Entrenamiento,
casi desaparece en Método, acompaña el timeline, **sale de cuadro** en
Comunidad / the lab / OASIS y vuelve al clímax en YOU VS YOU y el cierre.
El `alpha` ya no se interpola lineal: viaja en el último 38% del tramo con
smoothstep, así la pesa **entra o sale**, nunca se queda traslúcida a media
pantalla.

**5. Hero v3.** Sello circular giratorio con texto en `textPath`
(YOU VS YOU · THE TIME IS NOW) e isotipo al centro; wordmark más grande con
**máscara por letra** (cada letra sube desde su propio recorte); viñeta sobre la
foto; entrada del panel amarillo con `skewX`; métricas +40 / 3 / 24-7;
indicador de scroll; parallax de foto y formas con el cursor. Composición de la
esquina derecha aligerada (aro más discreto y al filo, rayas más chicas).

**5b. Foto del hero definitiva.** `brand/HERO1.png` (contrapicado de battle
ropes, ya en b/n) optimizada a `web/public/img/hero1.jpg` (110 KB) con
`fetchpriority="high"`. Encuadre `object-position: 30% 55%` para dejar al
atleta en la mitad izquierda; viñeta suavizada y subtítulo del hero en amarillo
de marca con sombra, porque sobre esta foto el blanco perdía contraste.

**6. Border-radius ligero** en cards y piezas: `.paso` y `.disc-view` 14px,
fotos de marquee 12px, `.com-photo` 14px, `.ocard` 12px, bloque YOU VS YOU 16px,
chips y botones (CTA / header) en píldora.

**7. Ajustes de cierre de sesión (feedback de Angel):**
- **Fuera los contadores de sección** (`01 —`, `06 —`, `DENTRO DE DINAMO — 01`):
  leían a numeración interna de brandbook, no a web. Quitados del rótulo y del
  `data-label` del header. Se conserva la numeración *dentro* de las listas
  (disciplinas, método, OASIS) porque ahí es recurso gráfico, no índice.
- **Fotos repetidas resueltas.** Los nombres de archivo NO describen su contenido
  (herencia de la extracción del PDF). Mapa real verificado a ojo, y reparto sin
  repetir escena: los dos carruseles de Instalaciones no comparten ninguna
  escena entre sí, y Comunidad usa tres fotos distintas (`trainer`, `gym-wide`,
  `gym-dark`). Escenas duplicadas conocidas en el pool:
  `rope-back`≈`runners` (abdominales), `chalk-plate`≈`deadlift` (balón),
  `medball`≈`scream` (sala), `rope-jump`≈`training` (cuerda).
- **Cierre en negro pleno** (`#000`), sin el degradado marrón anterior.
- **Foto del hero enmarcada, conservando la diagonal.** Ya no sangra a la
  izquierda: vive dentro del amarillo con margen, pero **mantiene el corte
  diagonal a la derecha** (era innegociable; un primer intento con `inset()`
  rectangular lo perdió y se rehízo). Se resuelve con un único
  `--photo-shape: polygon(...)` que comparten la foto, su viñeta y el recorte
  bicolor del wordmark, así el cambio blanco→negro cae exactamente sobre la
  diagonal. Sombra con `drop-shadow` (no `box-shadow`, que el clip recorta) y
  entrada desplegándose desde el borde izquierdo. El hero pasa a tema amarillo
  (header en negro). Sin `border-radius`: `polygon()` no lo admite y la forma
  diagonal manda.
- La curva de alpha de la pesa es asimétrica: **aparece tarde** (último 38% del
  tramo) y **desaparece pronto** (primer 30%), para no fantasmear al entrar ni
  invadir la sección siguiente al salir.

**8. Hero: bloque al filo y profundidad 2.5D.**
- El bloque de foto sube casi al borde (`--ph-t: 1.6%`) para que **el logo del
  header quede dentro de la imagen**. Eso obligó a un tema de header nuevo,
  `data-theme="photo"`: logotipo en blanco con isotipo amarillo y el botón
  ÚNETE en negro (vive sobre el amarillo, a la derecha).
- **Puntas redondeadas**: `clip-path: polygon()` no admite radio, así que el
  recorte se genera en `ui.ts` como `path()` con arcos cuadráticos en los cuatro
  vértices (incluida la punta aguda de la diagonal). Se recalcula en `resize` y
  lo comparten foto, viñeta y recorte del wordmark. Hay un `polygon()` de
  respaldo en CSS por si el script no corre.
- **Separación fondo / atleta**: se segmentó `HERO1` con `rembg` (u2net) y se
  limpió la máscara con OpenCV (componente conectado mayor, cierre morfológico,
  erosión y desvanecido de la cola sucia inferior derecha) →
  `hero1-subject.webp` (51 KB, con alpha). La capa del atleta se superpone
  alineada con el fondo y se mueve **mucho más** que él con el cursor
  (−30px vs −9px) más una rotación mínima: da profundidad real sin desalinear.
  - Nota: `alpha_matting` de rembg no se pudo usar (numba roto en este equipo);
    la máscara sin matting fue suficiente tras la limpieza.
  - El recorte ampliado del atleta (`--sj-*`) **solo se abre por arriba**: por la
    diagonal derecha asomaba fondo negro arrastrado y se veía sucio.
  - Un intento de afinar la máscara multiplicando por luminancia se descartó:
    se comía las zonas oscuras del propio atleta (shorts, piernas).

**9. Fondo del hero sin personaje + listas sin reglas.**
- Angel entregó `brand/HERO1BG.png`: la **misma toma sin el atleta**, del mismo
  tamaño exacto (1672×941), así que las dos capas encajan al pixel. Pasa a ser
  `hero1-bg.jpg` (133 KB) y sustituye a `hero1.jpg` como capa de fondo. Con el
  fondo limpio ya no hay personaje duplicado, así que el parallax se pudo
  abrir de verdad: el fondo se mueve **con** el cursor (+14px) y el atleta
  **en contra** (−34px) con rotación y escala; la separación se lee clarísima.
- **Fuera las líneas separadoras** de todas las listas (disciplinas, timeline de
  Un Día, servicios de OASIS) y del pie: ahora sólo texto, con algo menos de
  padding vertical para compensar. Se conservan el filete superior del ticker
  (borde del panel) y el subrayado del link de Instagram, que no son
  separadores.

**10. Cinta, sello, KPIs y reveals bidireccionales.**
- **Ticker inferior**: negro pleno (`#000`) y, sobre todo, **ya no se corta**.
  Antes eran dos copias en el HTML animadas con `translateX(-50%)`: si esas dos
  copias medían menos que la ventana, el ciclo dejaba hueco. Ahora `fillTrack()`
  clona el contenido hasta cubrir 2,5× el ancho visible y el desplazamiento va
  en el bucle, reiniciando por múltiplos del ancho de una copia. Verificado:
  3,2× el viewport, 6 copias. La misma protección se aplicó a los carruseles.
- Fuera las dos **barras diagonales gigantes** de la esquina superior derecha
  del hero; queda sólo el sello circular, algo más grande.
- **Isotipo centrado** dentro del sello con `left/top: 50%` + `translate(-50%,-50%)`
  en vez de porcentajes calculados a mano.
- **KPIs animados**: contador de 0 al valor (`data-count`, con `data-prefix` /
  `data-suffix` para `+40` y `24/7`), con easing y `tabular-nums` para que no
  bailen las cifras. Se relanza cada vez que entran en pantalla.
- **Reveals bidireccionales**: el observer ya no hace `unobserve`; al salir se
  quita `.in` y se marca `.above` según el bloque haya quedado por encima o por
  debajo, de modo que el desplazamiento de entrada y salida sigue el sentido
  del scroll (bajando salen hacia arriba, subiendo vuelven desde arriba).

**11. Coreografía del hero y optimización de FPS.**
- **Secuencia de entrada de ~4,5 s** (antes pasaba de golpe), en este orden:
  cortina que revela la foto de izquierda a derecha (0,2–1,9 s) → kicker →
  atleta recortado → **DINAMO letra a letra alternando** (D baja, I sube, N
  baja… hasta la O, 1,15–3,2 s) → el sello emerge desde el centro → los KPIs
  entran uno a uno desde la izquierda con el contador subiendo → subtítulo.
  Patrón usado: la transición **larga con retardo vive en el estado final**
  (`.hero-in`) y una **corta en el estado base**, para que la entrada sea
  cinemática pero la salida al scrollear siga siendo ágil. Es reversible: al
  volver al hero la secuencia se reproduce entera.
- Sello alineado al mismo eje derecho que los KPIs y el botón del header;
  trapecio de la foto estrechado (`--ph-ct` 88→81 %, `--ph-cb` 68→66 %) para
  equilibrar con la zona amarilla, y wordmark reajustado para que la O no roce
  la diagonal. Subtítulo más grande y con subrayado blanco.
- **FPS en la transición hero → primera sección** (medido en Chrome con un
  scroll programado de 70 frames):
  - Antes: **41 fps de media, peor frame 217 ms**.
  - Después: **146 fps de media, peor frame 13 ms**.
  - Causa: filtros CSS a pantalla completa que se recalculaban en cada frame
    porque las capas se mueven con el parallax — sobre todo dos `drop-shadow`
    (uno sobre una imagen con alpha y otro sobre el `clip-path` complejo).
  - Arreglo: los ajustes de imagen se **hornearon en los archivos** (las fotos
    ya eran b/n, así que `grayscale()` sobraba), se eliminaron ambas sombras,
    se añadió un *dirty check* para no reescribir `transform` con el mismo
    valor, las cintas sólo se animan si están en pantalla, el canvas WebGL
    baja a DPR 1,5 (−45 % de píxeles) y sale temprano del frame cuando no hay
    nada visible que dibujar.

**12. Scrollytelling completo, lienzo continuo y grano.**
- **Reveals por variante**: cada tipo de elemento entra distinto (`left`, `rise`,
  `scale`, `up`) para dar ritmo al recorrido en vez de que todo aparezca igual.
  Las variantes se asignan por selector desde `ui.ts` (mapa `REVEAL_VARIANTS`)
  y no elemento por elemento en el HTML, así se mantienen en un solo sitio.
  65 bloques animados; verificado sección por sección que todos alcanzan `.in`.
- **Parallax interno en las fotos** (`data-imgpar`): la imagen se desplaza
  dentro de su marco según su posición en el viewport (marco de Entrenamiento,
  tarjetas de OASIS y fotos de Comunidad). Van con `scale(1.18)` para tener
  recorrido sin descubrir bordes.
- Se **descartó el sprinter recortado** de El Club (petición de Angel) — el
  recorte bueno quedó documentado abajo por si se retoma.
- **Un solo lienzo de fondo**: The Lab, OASIS y el cierre dejaron de pintar su
  propio `background`; el color lo lleva el `.backdrop` global, cuya transición
  subió a 1,4 s. La aurora de OASIS se funde por arriba y por abajo con
  `mask-image`; ojo: la aurora sobresale un 20 % por cada lado, así que los
  puntos del degradado van en 14–33 % y 68–86 % para que el desvanecido caiga
  **dentro** de la parte visible (con 0–16 % el corte seguía viéndose).
- **Textura porosa**: `grain.png` de 180×180 generado con NumPy (negro con
  alpha aleatorio, 25 KB) repetido en una capa fija sobre todo el sitio al
  32 % de opacidad. Unifica los cambios de color y da cuerpo al plano.
  Es estático a propósito: animarlo repinta a pantalla completa cada frame y
  se comería los FPS recuperados.

**13. Fondo: vuelta al fundido de color (y por qué).**
Se probó sustituir el fundido por un **degradado continuo** del alto de todo el
documento desplazado con el scroll. Técnicamente elimina cualquier costura,
pero visualmente **no gustó**: al scrollear se ven colores intermedios sucios
(amarillos lavados, azules apagados) y se pierde la sensación de que el fondo
"cambia" al entrar en una sección. Se revirtió.
Sistema final: un color plano a pantalla completa que se funde en 0,9 s al
cambiar de sección, **y las secciones sin fondo propio** (The Lab, OASIS y el
cierre lo tenían: eso era lo que producía el corte). El caso de OASIS se
resuelve además con el `mask-image` de la aurora, cuyos puntos van en 14–33 % y
68–86 % porque la aurora sobresale un 20 % por cada lado.

**14. Textura geométrica y hover del timeline.**
- La textura pasó de **grano aleatorio a trama geométrica**: dos rejillas de
  puntos desfasadas media celda (4 px, 3 px en pantallas HiDPI) hechas con
  `radial-gradient` en CSS puro — sin archivo de imagen, más fina y moderna.
  Se eliminó `grain.png`.
- Hover de las filas de *Un día en DINAMO*: **amarillo sólido con texto negro**.
  Angel lo pidió "con texto contraste blanco", pero blanco sobre amarillo no
  alcanza contraste legible (~1,1:1); se usó negro, que además es la pareja de
  la marca. Queda anotado por si prefiere revisarlo.

**15. Cierre líquido en claro.**
- La sección final pasa de negro pleno a **blanco homogéneo**: la marea líquida
  cubre toda la sección (no sólo el pie) y los textos van en negro; el botón
  cambia a negro con texto amarillo, que es lo que más resalta sobre claro, y
  el `<mark>` de HERE se invierte a bloque negro con texto amarillo.
- **Marea líquida** (`footer-gl.ts`, WebGL2 a mano): un frente de fluido cuya
  altura sale de tres senos de periodo inconmensurable más una deriva de fbm,
  con una "lengua" que entra por la izquierda. El tramado de puntos va girado
  45° (el ángulo del isotipo) y **el radio del punto depende del valor del
  campo**: con radio > 0,707 la celda queda cubierta, así el interior es
  sólido y el tramado sólo se disgrega en el borde — que es lo que da la
  lectura de líquido. Un primer intento con *metaballs* redondos se descartó:
  leía como manchas, no como fluido.
- El pie se bajó de ~55 % a ~36 % de la pantalla (logo, paddings y márgenes)
  porque rompía el cierre.
- El canvas sólo dibuja mientras la sección está en pantalla y respeta
  `prefers-reduced-motion` (pinta un fotograma fijo).

**16. La textura pasa al fondo (y no al contenido).**
La trama estaba en una capa fija por encima de todo (`z-index: 45`), así que
granulaba también los textos y las fotos. Ahora vive **en los fondos**:
- en `.backdrop` (el lienzo global), como `background-image` sobre el color;
- en `.hero` y en `.oasis-aurora`, que pintan su propio fondo;
- y en `.bgword`, donde se rellena el propio texto con `background-clip: text`
  — sin eso las palabras gigantes quedaban planas y se perdían contra el fondo
  (petición de Angel: esas sí deben verse texturizadas).
El overlay `.grain` se eliminó por completo. Resultado: tipografía y fotos
limpias, fondos con cuerpo.
Remate: la franja de copyright va a todo el ancho en amarillo sólido, para
cerrar homogéneo con la marea del pie.

**17. Variedad de animaciones y dos bugs de fondo.**
- **Variantes de entrada por bloque** (`left`, `right`, `down`, `rise`,
  `scale`, `tilt`/`tiltr`, `wipe`/`wiper`, `mask`), asignadas por selector en
  `REVEAL_VARIANTS`. Las listas alternan lado con un array que cicla por
  índice: 19 bloques entran por la izquierda y 16 por la derecha, más los que
  suben, escalan o se inclinan.
- **Titulares por líneas**: se parten por `<br>` y cada línea sube desde su
  propia máscara. OJO: la máscara recorta tildes; hay que dejar
  `padding-top: .14em; margin-top: -.14em` en `.ln` o "MÁS" se lee "MAS".
- **Palabras gigantes**: ENERGÍA entra desde fuera por la derecha, FUERZA por
  la izquierda y MÉTODO cae desde arriba. Se animan con la propiedad
  `translate` (no `transform`) porque el bucle usa `transform` para su
  parallax y si no se pisan.

**Bug 1 — el scroll del documento se quedó clavado.** El remate del pie a
`width: 100vw` con margen negativo generó desbordamiento horizontal; con
`overflow-x: hidden` en `body`, el body pasó a ser el contenedor de scroll y
`scrollY` se quedó en 0 (nada se revelaba y ningún `scrollTo` respondía).
Se arregla con **`overflow-x: clip`**, que recorta sin crear un contenedor de
scroll.

**Bug 2 — reveals que no llegaban.** Con `IntersectionObserver`, los bloques
que arrancan ocultos (`wipe`, palabras gigantes) se quedaban invisibles para
siempre si el scroll saltaba: el observer no entrega de forma fiable en esos
casos. Ahora el estado se calcula **en el bucle** comparando posiciones
cacheadas (`absTop` + alto) contra el viewport — determinista y sin
`getBoundingClientRect` por frame. Misma lección que con `syncSection`.

**Fondo que llegaba tarde.** Al quitar el fondo propio de las secciones
oscuras, el color depende del fundido global; con 0,9 s, al entrar rápido en
*Un día*, The Lab u OASIS el texto claro quedaba sobre fondo claro. Se corrige
por partida doble: el color se **adelanta** (se resuelve con una sonda a 92 %
del viewport, mientras el tema del header sigue a 42 %) y el fundido baja a
**0,45 s**.

**Nota de método:** al depurar con la pestaña sin pintar, `requestAnimationFrame`
se congela: el bucle no corre, los colores quedan a medias y un bucle de scroll
con `await rAF` **cuelga el evaluador**. Hay que provocar el pintado (captura)
y, mejor aún, verificar con scroll real de rueda.

**18. Textura desactivada (con interruptor) y dos saltos corregidos.**
- La **trama de puntos está apagada, no borrada**. Vive en dos variables de
  `:root` (`--tex-1`, `--tex-2`) puestas a `none`, con los gradientes reales
  justo debajo comentados. Para reactivarla basta con intercambiar esas dos
  líneas: la usan `.backdrop`, `.hero`, `.oasis-aurora` y `.bgword` a través
  de las variables, así que no hay que tocar nada más.
  (El tramado de la marea del pie es del shader y sigue activo: es el efecto,
  no la textura de fondo.)
- **Fondo revertido**: se quitó el adelanto de la sonda; vuelve a resolverse
  al 42 % del viewport con fundido de 0,9 s, como estaba.
- **El pie daba saltos continuos** por dos realimentaciones de layout:
  1. el canvas tenía un `ResizeObserver` sobre sí mismo y ajustar sus
     atributos `width`/`height` volvía a dispararlo, en bucle. Ahora el tamaño
     se comprueba dentro del frame y sólo cada 30 frames (medir fuerza reflow);
  2. el `ResizeObserver` del `body` remedía ~70 nodos leyendo
     `offsetTop`/`offsetHeight` — reflow que volvía a disparar al observador.
     Ahora se agrupa en el siguiente frame y **sólo remide si cambió el alto
     del documento**.
  Verificado: 25 muestras de la posición del pie en un segundo, oscilación 0.

**19. Ajuste final de la marea del pie.**
Se probaron dos variantes antes de acertar:
1. subir la amplitud del frente único → el amarillo invadía la sección y
   rompía el equilibrio claro/oscuro;
2. **cintas onduladas** (tres bandas horizontales combinadas con `max()`,
   al estilo de la referencia) → gráficamente correcto, pero no era lo que se
   buscaba para el pie.
Versión final: vuelve el **frente único**, con la base bajada a `0.17` y las
amplitudes calibradas para que en sus picos **la marea llegue justo a cubrir
el logotipo del pie y no más**. Así el titular, el botón y el bloque de datos
quedan siempre sobre blanco. La ondulación es más marcada que la original
(ondas más largas y algo más de amplitud) pero sin ponerse nerviosa.

**20. Mar vivo en el pie, y el parpadeo del pie resuelto.**
- **Oleaje**: dos trenes de olas cruzados que viajan en sentidos opuestos a
  distinta velocidad (sus crestas se refuerzan y cancelan sin repetirse), con
  un perfil que **afila la cresta y ensancha el valle** — la silueta real del
  oleaje, no un seno puro. Encima: marejada de fondo, chapoteo contra las
  paredes, ruido lento y una espuma que hace "hervir" el borde del frente.
  La velocidad se multiplicó por 2,5 (0,22 → 0,55): era la razón principal de
  que el movimiento pasara desapercibido.
- **El pie "brincaba" entre aparecer y desaparecer.** Los bloques del pie caen
  justo en el umbral de visibilidad y entraban/salían en frames alternos. Se
  añadió **histéresis**: entrar exige cumplir el umbral, pero para salir hace
  falta alejarse un 10 % de pantalla más. Además, al llegar al final del
  documento ya no se descuenta el margen inferior del 6 %, que dejaba el
  copyright pegado al límite.

### Recorte del sprinter (por si se retoma)
`rembg` con el modelo **`u2net_human_seg`** (el genérico se comía dedos y
antebrazo), apertura morfológica de sólo 3×3, sin erosión, componente conectado
mayor y feather de 1,4 px. El script quedó en el scratchpad de la sesión.

### Qué se decidió

- El color de fondo es **una sola capa global que se funde**, no fondos por
  sección: así la transición entre secciones es un cambio de ambiente continuo.
- La legibilidad manda sobre el efecto: el texto siempre por delante del 3D.
- `syncSection` en el bucle (no IntersectionObserver) por robustez ante saltos.

### Qué quedó abierto

- CTA "ÚNETE AHORA" sigue apuntando a instagram.com/dinamo_mexico: falta
  destino real (formulario / WhatsApp / membresías).
- Datos de las métricas del hero (+40 clases, 3 pisos, 24/7) son **placeholder**:
  confirmar con el cliente antes de publicar.
- Móvil sin probar en dispositivo real; SEO/OG pendiente; hosting por decidir;
  licencia web de Acumin por confirmar.

### Validado (no volver a revisar)

- Hero v3, Entrenamiento (fondo amarillo OK), Método (cards con radius y la pesa
  pasando por detrás), Un Día (la pesa cruza por detrás de OASIS/CONNECT),
  Comunidad (parallax y cruce de capas), YOU VS YOU y OASIS: revisados en Chrome.
- `npm run build` limpio, sin errores de consola.
- OJO al depurar: `requestAnimationFrame` se congela mientras se evalúa JS con
  la pestaña sin pintar; leer estado tras un screenshot, no tras un `setTimeout`,
  o parecerá que el bucle está muerto.

---

## 2026-08-18 — Rediseño MVP: hero split, tono de producto, pesa hiperrealista

### Qué se hizo

**Feedback de Angel sobre la v1 (70%):** hero flojo, tono de "propuesta de marca"
en vez de entregable, y pesa que se veía animada. Se atacaron los tres.

1. **Hero nuevo estilo editorial/vento** — split diagonal: mitad izquierda foto
   b/n de atleta (cuerda, haz de luz), mitad derecha amarillo #FFE700 pleno con
   formas geométricas (barras del isotipo gigantes, círculo delineado, punto
   flotante, banda de rayas a 45°). Wordmark DINAMO gigante partido en dos
   colores por la MISMA diagonal (blanco sobre foto, negro sobre amarillo, vía
   clip-path duplicado). Ticker inferior en marquesina continua. "YOU VS YOU"
   vertical en el borde.
   - La imagen del hero vive en una caja al 64% del ancho (no full-bleed) para
     que el crop vertical no haga zoom excesivo. Foto: `training.jpg`.
2. **Se eliminó todo el tono de propuesta.** Fuera: percepción de la marca,
   paleta de color con hex, especímenes tipográficos, racional "Thunder".
   La página ahora es el sitio del gimnasio: Hero → 01 El Club (manifiesto como
   voz propia) → 02 Entrenamiento (5 disciplinas con imagen sticky que cambia
   al hover) → 03 Instalaciones (galería marquee) → You vs You → the lab →
   OASIS → Únete/Footer. Los chips de the lab pasaron de hex a producto
   (PROTEÍNA · RECUPERACIÓN · ENERGÍA). CTA "ÚNETE" fijo en el header.
3. **Pesa hiperrealista** (todo procedural en el fragment shader, sin texturas
   de archivo): moleteado (knurling) de rombos en las zonas de agarre de la
   barra, acero pulido con reflexión de entorno de estudio (softbox + relleno +
   rebote amarillo), discos bumper de caucho con vetas concéntricas de moldeado,
   estrías en el canto, chaflanes reales en la geometría (perfil con CH=0.012),
   micro-rugosidad por hash, modelo specular/fresnel tipo PBR simplificado.
   Discos ahora separados sobre el manguito como en una barra real. Giro
   limitado (±30°) para que nunca se vea de frente plano; bob idle sutil.

### Qué se decidió

- El sitio es un **entregable MVP**, no una presentación de marca. Nada de
  lenguaje meta ("logotipo", "paleta", "tipografía") en el contenido.
- Hero: diagonal a 45° (la del isotipo) como corte maestro; foto SIEMPRE con
  persona, no interiores vacíos.
- Nombres de archivo de fotos NO coinciden con su contenido real (el mapeo
  original del PDF quedó desfasado): `training.jpg` = atleta con cuerda,
  `deadlift.jpg` = lanzamiento de balón, `portrait.jpg` = interior gym.
  Si se reorganizan, revisar hero + disciplinas + marquees.

### Qué quedó abierto

- **CTA "ÚNETE AHORA"** apunta a instagram.com/dinamo_mexico; falta destino real
  (formulario / WhatsApp / membresías).
- **Móvil**: breakpoints presentes (diagonal más vertical <760px) pero sin
  prueba en dispositivo real.
- **SEO/OG**: falta og:image y metadatos sociales.
- **Deploy**: `dist/` listo; falta hosting (Vercel/Netlify/CF Pages).
- Renombrar las fotos a nombres veraces (riesgo de confusión futura).
- Licencia web de Acumin (Adobe) por confirmar antes de publicar.

### Validado (no volver a revisar)

- Hero split verificado en Chrome: diagonal, wordmark bicolor alineado, ticker,
  formas, foto con sujeto visible.
- Pesa: winding/normales correctos, moleteado y vetas visibles, sin errores de
  consola; coreografía re-mapeada a las nuevas secciones (ids: hero, club,
  entrenamiento, instalaciones, youvsyou, thelab, oasis, unete) y el fantasma
  en OASIS resuelto (key extra a 0.9·vh antes de #unete).
- Hover de disciplinas cambia la imagen sticky. `npm run build` limpio.

### Cómo correr

```
cd web
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```

---

## 2026-08-17 — Experiencia web 3D scrolltelling (primera versión completa)

### Qué se hizo

**Sitio nuevo en `web/`** — Astro 5, cero frameworks CSS (todo CSS a mano), WebGL2
escrito a mano (sin Three.js). Una sola página scrolltelling que recorre el
brandbook completo:

1. **Hero** — wordmark DINAMO gigante, isotipo Thunder animado, slogan YOU VS YOU.
2. **Manifiesto** — copy literal del brandbook (p.5), título palabra a palabra.
3. **Thunder** — racional del imagotipo (p.11), isotipo SVG con entrada animada.
4. **Percepción** — las 8 escalas del brandbook (p.7 y p.9) con dots animados.
5. **Color** — 6 swatches interactivos (click = copiar hex) + barra de proporciones.
6. **Tipografía** — Acumin Variable Concept real (OTF del kit); "ENERGÍA"
   interactiva que muta wght/wdth con el cursor + specimen de 6 estilos.
7. **Fotografía** — 20 fotos extraídas del PDF del brandbook, doble marquee
   infinito, b/n → color al hover.
8. **YOU VS YOU** — sección amarilla con tipografía cinética ligada al scroll.
9. **Ecosistema** — puerta a las sub-marcas.
10. **the lab** — shake bar (morados #24083E/#301B59, magenta #E3197F, scanlines,
    marquee "SCIENCE IN EVERY SHAKE").
11. **OASIS** — wellness (aurora gradient animado, 5 servicios, las 3 piezas
    gráficas reales como cards con tilt 3D).
12. **CTA/Footer** — LEVEL UP, botón magnético, logo blanco real, dirección
    Polanco, @dinamo_mexico.

**WebGL (src/scripts/gl.ts)** — una barra olímpica 3D generada por revolución de
perfil (discos negros, collares amarillo 803 C, barra acero), halo aditivo
billboard y ~90 partículas "thunder" (rayas diagonales a 45°, como el isotipo).
La barra viaja por toda la página con keyframes anclados al `offsetTop` real de
cada sección, amortiguados con `exp(-dt/τ)`; parallax sutil con el mouse;
respeta `prefers-reduced-motion`.

**Assets extraídos del material fuente** (`brand/`):
- Fotos: sacadas del PDF DINAMO-BRANDBOOK con PyMuPDF → `web/public/img/*.jpg` (optimizadas).
- Isotipo: trazado exacto con OpenCV desde el PNG (3 barras 767×153 a 45°) → SVG inline y favicon.
- Logos blancos PNG (simple y con slogan) → footer.
- Fuente AcuminVariableConcept.otf → `web/public/fonts/` (ejes: wght 100–900, wdth 50–115, slnt 0–12).

### Qué se decidió

- **Astro sobre Next**: página estática única, no necesita React; bundle JS ≈ 15 KB.
- **WebGL2 a mano sobre Three.js**: el objeto (barra) se describe con números,
  registro estilizado no-PBR → criterio de la skill webgl-animacion.
- **DINAMO es lo principal; the lab y OASIS son secundarias** (indicación de
  Angel): viven como secciones dentro de la misma página, cada una con su
  lenguaje visual propio, tras la sección YOU VS YOU.
- Copys de secciones the lab/OASIS: el material fuente casi no trae texto; los
  párrafos cortos descriptivos son **propuesta editable**, no del brandbook.
- Paleta y proporciones: colores exactos del PDF dinamo_colores. Los anchos de
  la barra de proporciones son aproximación visual del brandbook (no hay cifras
  en el PDF).

### Qué quedó abierto

- **CTA "ÚNETE AHORA"** apunta a instagram.com/dinamo_mexico; falta destino real
  (formulario / WhatsApp / link de membresías).
- **Móvil**: hay breakpoints CSS en todas las secciones pero no se probó en
  dispositivo real; revisar hero (wordmark 14.5vw) y marquees en <400px.
- **SEO/OG**: falta og:image y metadatos sociales.
- **Deploy**: `dist/` listo (2.8 MB); falta decidir hosting (Vercel/Netlify/CF Pages).
- La licencia de Acumin (Adobe) para self-hosting web conviene confirmarla antes
  de publicar.

### Validado (no volver a revisar)

- Los 3 PDFs y assets del brand explorados al 100 % (72 págs DINAMO, 5 the lab,
  colores, logos, fuente, 3 piezas OASIS). Colores confirmados:
  #282420 / #FFE700 / #949290 / #C9C9C8 · lab #24083E #301B59 #E3197F.
- WebGL sin errores de consola; winding y normales de la malla correctos
  (culling activo); reveals, marquees, copiar-hex, tipografía variable y
  coreografía de scroll verificados visualmente sección por sección en Chrome.
- `npm run build` compila limpio.

### Cómo correr

```
cd web
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```
