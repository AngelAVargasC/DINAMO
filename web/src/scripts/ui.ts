// ============================================================
// DINAMO — interacciones (sin librerías)
//
// Todo el estado visual se resuelve en un único bucle rAF con
// posiciones cacheadas: es determinista aunque el scroll salte,
// y evita leer el layout una vez por elemento y frame.
// ============================================================

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
/* ---------- utilidades ---------- */
function absTop(el: HTMLElement) {
  let y = 0;
  let n: HTMLElement | null = el;
  while (n) {
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return y;
}

const lastVal = new WeakMap<HTMLElement, string>();
function setVar(el: HTMLElement, name: string, value: string) {
  if (lastVal.get(el) === value) return;
  lastVal.set(el, value);
  el.style.setProperty(name, value);
}

/* ---------- reveals ---------- */
type Reveal = {
  el: HTMLElement; top: number; h: number; on: boolean; above: boolean;
};
let reveals: Reveal[] = [];

function measureReveals() {
  reveals = Array.from(
    document.querySelectorAll<HTMLElement>(".rv, .rv-img")
  ).map((el) => ({
    el,
    top: absTop(el),
    h: el.offsetHeight,
    on: el.classList.contains("in"),
    above: el.classList.contains("above"),
  }));
}

// Bidireccional: el bloque entra al acercarse y se repliega al salir, siempre
// en el sentido del scroll. La histéresis (entrar cuesta menos que salir) evita
// que un bloque justo en el umbral parpadee entre frames.
function syncReveals(sy: number) {
  const viewTop = sy;
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  const atBottom = sy >= maxScroll - 4;
  const viewBottom = sy + innerHeight * (atBottom ? 1 : 0.9);

  for (const r of reveals) {
    const enter = r.top + r.h * 0.1 < viewBottom && r.top + r.h * 0.9 > viewTop;
    const stay =
      r.top < viewBottom + innerHeight * 0.12 &&
      r.top + r.h > viewTop - innerHeight * 0.12;
    const visible = r.on ? stay : enter;

    if (visible !== r.on) {
      r.on = visible;
      r.el.classList.toggle("in", visible);
      if (visible && r.above) {
        r.above = false;
        r.el.classList.remove("above");
      }
    }
    if (!visible) {
      const isAbove = r.top + r.h < viewTop + innerHeight * 0.5;
      if (isAbove !== r.above) {
        r.above = isAbove;
        r.el.classList.toggle("above", isAbove);
      }
    }
  }
}

/* ---------- titulares: línea, y dentro palabra a palabra ----------
   Cada línea vive en su máscara y dentro suben las palabras escalonadas. El
   troceo se hace sobre los nodos de texto, no sobre innerHTML: así el <em> de
   la palabra en amarillo sobrevive entero en vez de partirse por la mitad. */
function trocearPalabras(linea: HTMLElement, desde: number) {
  let n = desde;
  for (const nodo of Array.from(linea.childNodes)) {
    if (nodo.nodeType === Node.TEXT_NODE) {
      const txt = nodo.textContent ?? "";
      if (!txt.trim()) continue;
      const frag = document.createDocumentFragment();
      // el separador se conserva aparte: sin él las palabras en inline-block
      // se pegarían unas a otras
      txt.split(/(\s+)/).forEach((trozo) => {
        if (!trozo) return;
        if (/^\s+$/.test(trozo)) { frag.appendChild(document.createTextNode(trozo)); return; }
        // La puntuación suelta («.», «,») no es una palabra: si se le da su
        // propio turno entra tarde y se despega de la palabra que cierra.
        const soloSigno = !/[\p{L}\p{N}]/u.test(trozo);
        const previa = frag.lastElementChild as HTMLElement | null;
        if (soloSigno && previa?.classList.contains("wd")) {
          previa.textContent = (previa.textContent ?? "") + trozo;
          return;
        }
        const b = document.createElement("b");
        b.className = "wd";
        b.style.setProperty("--wi", String(n++));
        b.textContent = trozo;
        frag.appendChild(b);
      });
      linea.replaceChild(frag, nodo);
    } else if (nodo.nodeType === Node.ELEMENT_NODE) {
      // un <em> entra como una sola palabra, sin tocar su contenido
      const el = nodo as HTMLElement;
      const b = document.createElement("b");
      b.className = "wd";
      b.style.setProperty("--wi", String(n++));
      linea.replaceChild(b, el);
      b.appendChild(el);
      // si justo después viene un signo pegado, viaja con esta misma palabra
      const sig = b.nextSibling;
      if (sig?.nodeType === Node.TEXT_NODE) {
        const t = sig.textContent ?? "";
        const m = t.match(/^[^\s\p{L}\p{N}]+/u);
        if (m) {
          b.appendChild(document.createTextNode(m[0]));
          sig.textContent = t.slice(m[0].length);
        }
      }
    }
  }
  return n;
}

document.querySelectorAll<HTMLElement>("[data-lines]").forEach((el) => {
  const parts = el.innerHTML.split(/<br\s*\/?>/i);
  if (parts.length < 2) return;
  el.innerHTML = parts
    .map((p, i) => `<span class="ln" style="--li:${i}"><i>${p.trim()}</i></span>`)
    .join("");
  let n = 0;
  for (const linea of Array.from(el.querySelectorAll<HTMLElement>(".ln > i"))) {
    n = trocearPalabras(linea, n);
  }
});

/* ---------- enlaces de rodillo ----------
   La etiqueta se duplica y las dos copias suben a la vez: la de arriba sale y
   la de abajo ocupa su sitio. El duplicado va oculto al lector de pantalla. */
for (const caja of Array.from(document.querySelectorAll<HTMLElement>(".menu-nav a > i"))) {
  const texto = caja.textContent ?? "";
  caja.textContent = "";
  const a = document.createElement("span");
  a.className = "roll";
  a.textContent = texto;
  const b = document.createElement("span");
  b.className = "roll roll-2";
  b.setAttribute("aria-hidden", "true");
  b.textContent = texto;
  caja.append(a, b);
}

/* ---------- profundidad del hero ----------
   Cada capa se desplaza en proporción a su data-depth: el fondo poco, el
   isotipo mucho. Ese desfase entre capas es lo que el ojo lee como distancia.
   La figura va con factor negativo para que se mueva contra el fondo. */
const heroSec = document.getElementById("hero");
const capas = Array.from(
  document.querySelectorAll<HTMLElement>("#hero [data-depth]")
).map((el) => ({
  el: el.classList.contains("hero-figure") ? (el.querySelector("img") ?? el) : el,
  k: Number(el.dataset.depth) || 1,
  contra: el.classList.contains("hero-figure"),
}));

if (heroSec && capas.length && !reduced) {
  heroSec.addEventListener("pointermove", (e) => {
    const r = heroSec.getBoundingClientRect();
    const fx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const fy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    for (const c of capas) {
      const s = c.contra ? -1 : 1;
      setVar(c.el, "--dx", `${(fx * c.k * 14 * s).toFixed(1)}px`);
      setVar(c.el, "--dy", `${(fy * c.k * 9 * s).toFixed(1)}px`);
    }
  });
  heroSec.addEventListener("pointerleave", () => {
    for (const c of capas) {
      setVar(c.el, "--dx", "0px");
      setVar(c.el, "--dy", "0px");
    }
  });
}

/* ---------- botones magnéticos ----------
   El botón se inclina hacia el puntero dentro de su propia caja: el desvío es
   pequeño a propósito, lo justo para que se sienta vivo al acercarse. */
for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-magnet]"))) {
  if (reduced) break;
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    el.style.setProperty("--mx", `${(dx * 9).toFixed(1)}px`);
    el.style.setProperty("--my", `${(dy * 5).toFixed(1)}px`);
  });
  el.addEventListener("pointerleave", () => {
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
  });
}

/* ---------- parallax de imágenes ---------- */
/* Toda la geometría se mide UNA vez (measureAll) y por frame sólo se resta el
   scroll: getBoundingClientRect por elemento y frame obligaba al motor a
   recalcular layout entre cada escritura de estilo (lectura-escritura
   alternada), que es justo lo que produce bajones de fps al scrollear. */
type Par = { box: HTMLElement; v: number; top: number; h: number; on: boolean };
let pars: Par[] = [];

function measurePars() {
  pars = Array.from(document.querySelectorAll<HTMLElement>("[data-par]")).map(
    (box) => ({ box, v: Number(box.dataset.par ?? 0.08), top: absTop(box), h: box.offsetHeight,
                on: box.classList.contains("par-on") })
  );
}

function syncPars(sy: number) {
  for (const p of pars) {
    const top = p.top - sy;
    // .par-on promueve la foto a capa de GPU exactamente mientras se le
    // escribe --py: ni una capa de más fuera de pantalla, ni un repintado
    // sin capa dentro. Fuera del margen no se toca nada.
    const near = !(top + p.h < -200 || top > innerHeight + 200);
    if (near !== p.on) { p.on = near; p.box.classList.toggle("par-on", near); }
    if (!near) continue;
    // -1 arriba del viewport, +1 abajo
    const f = (top + p.h / 2 - innerHeight / 2) / innerHeight;
    setVar(p.box, "--py", `${(-f * p.h * p.v).toFixed(1)}px`);
  }
}

/* ---------- parallax de ventana (data-fix) ----------
   La foto mide la pantalla (100vh) y se contra-desplaza una fracción de lo que
   su marco lleva recorrido. Con factor 1 quedaría clavada al viewport, pero
   entonces el deslizamiento relativo va a la misma velocidad que el scroll y
   se siente brusco; por debajo de 1 la foto acompaña un poco a la página y el
   gesto se vuelve suave. Se puede afinar por elemento con data-fix="0.3".
   El clamp evita descubrir los bordes cuando el marco asoma por arriba o abajo. */
const FIX_SUAVE = 0.4;
let fixedBoxes: { box: HTMLElement; k: number; top: number; h: number }[] = [];
function measureFixed() {
  fixedBoxes = Array.from(document.querySelectorAll<HTMLElement>("[data-fix]")).map(
    (box) => ({ box, k: Number(box.dataset.fix) || FIX_SUAVE, top: absTop(box), h: box.offsetHeight })
  );
}

function syncFixed(sy: number) {
  for (const b of fixedBoxes) {
    const top = b.top - sy;
    if (top + b.h < 0 || top > innerHeight) continue;
    const fy = Math.min(0, Math.max(-(innerHeight - b.h), -top * b.k));
    setVar(b.box, "--fy", `${fy.toFixed(1)}px`);
  }
}

/* ---------- bandas cinéticas de las submarcas ----------
   Se desplazan según dónde estén en el viewport, no con el reloj: el gesto lo
   manda el scroll, igual que el resto del recorrido. */
let kinetics: { el: HTMLElement; dir: number; top: number; h: number }[] = [];
function measureKinetics() {
  kinetics = Array.from(document.querySelectorAll<HTMLElement>(".yvy-row, .lab-mrow")).map(
    (el) => ({ el, dir: Number(el.dataset.dir ?? 1), top: absTop(el), h: el.offsetHeight })
  );
}

function syncKinetics(sy: number) {
  for (const k of kinetics) {
    const top = k.top - sy;
    if (top + k.h < -200 || top > innerHeight + 200) continue;
    const f = (top + k.h / 2 - innerHeight / 2) / innerHeight;
    setVar(k.el, "--kx", `${(k.dir * f * -18).toFixed(2)}vw`);
  }
}

/* ---------- tarjetas OASIS: inclinación con el puntero ---------- */
for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"))) {
  if (reduced) break;
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width - 0.5;
    const fy = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tilt",
      `rotateY(${(fx * 14).toFixed(2)}deg) rotateX(${(-fy * 12).toFixed(2)}deg) scale(1.03)`);
  });
  el.addEventListener("pointerleave", () => el.style.removeProperty("--tilt"));
}

/* ---------- hero: salida y regreso con el scroll ----------
   La misma secuencia de la entrada, ahora atada al scroll y en los dos
   sentidos. Al bajar salen en orden —figura, texto y pie—; al volver, entran
   en el orden inverso porque cada tramo se recorre al revés. Los tramos se
   solapan a propósito: encadenados se leen como un gesto, uno detrás de otro
   se sentiría como una lista. */
const heroSalida = document.getElementById("hero");
const figuraEl = document.querySelector<HTMLElement>(".hero-figure");
const textoEl = document.querySelector<HTMLElement>(".hero-inner");
const pieEl = document.querySelector<HTMLElement>(".hero-foot");

function syncHeroSalida(sy: number) {
  if (!heroSalida) return;
  if (!document.documentElement.classList.contains("entrada-lista")) return;
  const alto = heroSalida.offsetHeight || innerHeight;
  const p = Math.min(1, Math.max(0, sy / alto));
  const tramo = (a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
  const curva = (x: number) => x * x * (3 - 2 * x);

  if (figuraEl) {
    const f = curva(tramo(0.04, 0.54));
    setVar(figuraEl, "--ex", `${(f * 9).toFixed(2)}%`);
    setVar(figuraEl, "--eop", (1 - f).toFixed(3));
  }
  if (textoEl) {
    const f = curva(tramo(0.14, 0.64));
    setVar(textoEl, "--ex", `${(-f * 2.4).toFixed(2)}rem`);
    setVar(textoEl, "--eop", (1 - f).toFixed(3));
  }
  if (pieEl) {
    const f = curva(tramo(0.24, 0.74));
    setVar(pieEl, "--ey", `${(f * 1.2).toFixed(2)}rem`);
    setVar(pieEl, "--eop", (1 - f).toFixed(3));
  }
}

/* ---------- recorrido virtual, en modal ----------
   El recorrido se guía por el scroll, pero dentro de una capa fija el de la
   página ya no vale: el modal es su propio contenedor de scroll y de ahí sale
   el avance. */
const tourModal = document.getElementById("tourModal");
const tourVid = document.getElementById("tourVideo") as HTMLVideoElement | null;
const tourPista = tourModal?.querySelector<HTMLElement>(".tour-pista") ?? null;
const tourProg = document.getElementById("tourProg");
const tourOpen = document.getElementById("tourOpen");
const tourClose = document.getElementById("tourClose");

// cada estación lleva su tramo escrito en el markup
const tourEst = Array.from(document.querySelectorAll<HTMLElement>(".tour-e")).map((el) => ({
  el,
  a: Number(el.dataset.a) || 0,
  b: Number(el.dataset.b) || 1,
}));

let tourAbierto = false;
let tourCargado = false;
let tourT = 0;

function abrirTour() {
  if (!tourModal || tourAbierto) return;
  tourAbierto = true;
  tourModal.hidden = false;
  document.documentElement.classList.add("tour-abierto");
  // El vídeo pesa varios megas: no se pide hasta que alguien abre el
  // recorrido, así no compite con la carga de la página.
  if (!tourCargado && tourVid?.dataset.src) {
    tourCargado = true;
    tourVid.src = tourVid.dataset.src;
    tourVid.load();
  }
  tourT = 0;
  // El scroll se pone a cero en el frame siguiente, no ahora: recién quitado
  // el hidden el contenido aún no tiene altura, scrollHeight es cero y la
  // asignación se pierde — el recorrido abría por la mitad.
  requestAnimationFrame(() => {
    tourModal.scrollTop = 0;
    tourModal.classList.add("open");
  });
  tourClose?.focus({ preventScroll: true });
}

function cerrarTour() {
  if (!tourModal || !tourAbierto) return;
  tourAbierto = false;
  tourModal.classList.remove("open");
  document.documentElement.classList.remove("tour-abierto");
  tourVid?.pause();
  setTimeout(() => { if (!tourAbierto) tourModal.hidden = true; }, 500);
  tourOpen?.focus({ preventScroll: true });
}

tourOpen?.addEventListener("click", abrirTour);
tourClose?.addEventListener("click", cerrarTour);
addEventListener("keydown", (e) => { if (e.key === "Escape" && tourAbierto) cerrarTour(); });

function syncTour(dt: number) {
  if (!tourAbierto || !tourModal || !tourVid || !tourPista) return;
  const recorrido = tourPista.offsetHeight - tourModal.clientHeight;
  if (recorrido <= 0) return;
  const p = Math.min(1, Math.max(0, tourModal.scrollTop / recorrido));

  if (tourProg) setVar(tourProg, "width", `${(p * 100).toFixed(1)}%`);

  // Cada estación entra por abajo en el primer cuarto de su tramo y se retira
  // por arriba en el último. Los tramos se solapan, así que una empieza a
  // llegar mientras la anterior aún se va: el relevo se siente continuo.
  for (const est of tourEst) {
    const q = (p - est.a) / (est.b - est.a);
    let o = 0;
    let y = 2.2;
    if (q >= 0 && q <= 1) {
      const entra = Math.min(1, Math.max(0, q / 0.26));
      const sale = Math.min(1, Math.max(0, (q - 0.74) / 0.26));
      const sube = entra * entra * (3 - 2 * entra);
      const va = sale * sale * (3 - 2 * sale);
      o = sube * (1 - va);
      y = (1 - sube) * 2.2 - va * 2.2;
    }
    setVar(est.el, "--o", o.toFixed(3));
    setVar(est.el, "--y", `${y.toFixed(2)}rem`);
  }

  const dur = tourVid.duration;
  if (!dur || !isFinite(dur)) return;
  const objetivo = p * dur;

  // El instante no salta al objetivo: lo persigue. La rueda del ratón avanza
  // a trancos de ~100 px y saltar a cada tranco se ve escalonado; persiguiendo
  // con amortiguación, el trayecto se desliza.
  // La amortiguación va por tiempo y no por frame: con un factor fijo, a
  // 144 Hz alcanzaría el objetivo al doble de rápido que a 60.
  tourT += (objetivo - tourT) * (1 - Math.exp(-dt / 0.18));

  // Cada asignación de currentTime dispara una búsqueda. Con un umbral por
  // debajo de un fotograma se encadenarían búsquedas que el decodificador no
  // llega a servir, y el recorrido se atasca en vez de avanzar.
  if (Math.abs(tourVid.currentTime - tourT) > 1 / 30) {
    tourVid.currentTime = tourT;
  }
}

/* ---------- carrusel de conceptos ---------- */
const ccTrack = document.getElementById("ccTrack");
const ccArrows = Array.from(document.querySelectorAll<HTMLButtonElement>(".cc-arrow"));
// deriva automática del carrusel; se asigna dentro del bloque y la llama el bucle
let ccDrift: (dt: number, sy: number) => void = () => {};
let ccTop = 0;
let ccH = 0;
function measureCc() {
  if (!ccTrack) return;
  ccTop = absTop(ccTrack);
  ccH = ccTrack.offsetHeight;
}

if (ccTrack) {
  const paso = () => {
    const card = ccTrack.querySelector<HTMLElement>(".cc-card");
    // el salto es una tarjeta más el hueco: así el siguiente encaje queda
    // alineado con el borde y no a medio corte
    return card ? card.getBoundingClientRect().width : ccTrack.clientWidth * 0.8;
  };

  function ccEstado() {
    // El estado se decide por geometría, no comparando scrollLeft con un
    // máximo: el encaje deja un residuo variable al reposar y cualquier umbral
    // fijo deja la flecha del extremo activa sin nada que recorrer.
    const cards = ccTrack!.querySelectorAll<HTMLElement>(".cc-card");
    if (!cards.length) return;
    const caja = ccTrack!.getBoundingClientRect();
    const primera = cards[0].getBoundingClientRect();
    const ultima = cards[cards.length - 1].getBoundingClientRect();
    for (const b of ccArrows) {
      b.disabled = Number(b.dataset.cc) < 0
        ? primera.left >= caja.left - 2
        : ultima.right <= caja.right + 2;
    }
  }
  ccTrack.addEventListener("scroll", ccEstado, { passive: true });
  addEventListener("resize", ccEstado);
  ccEstado();

  for (const b of ccArrows) {
    b.addEventListener("click", () => {
      ccTrack.scrollBy({ left: Number(b.dataset.cc) * paso(), behavior: reduced ? "auto" : "smooth" });
    });
  }

  ccTrack.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    ccTrack.scrollBy({ left: (e.key === "ArrowRight" ? 1 : -1) * paso(), behavior: reduced ? "auto" : "smooth" });
  });

  // Arrastre con el puntero. Mientras se arrastra se desactivan el encaje y el
  // desplazamiento suave: si no, el navegador pelea contra la mano.
  let arrastrando = false;
  let x0 = 0;
  let left0 = 0;
  let movido = 0;

  ccTrack.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return; // el táctil ya desplaza solo
    arrastrando = true;
    movido = 0;
    x0 = e.clientX;
    left0 = ccTrack.scrollLeft;
    ccTrack.classList.add("drag");
    ccTrack.setPointerCapture(e.pointerId);
  });
  ccTrack.addEventListener("pointermove", (e) => {
    if (!arrastrando) return;
    const dx = e.clientX - x0;
    movido = Math.max(movido, Math.abs(dx));
    ccTrack.scrollLeft = left0 - dx;
  });
  const soltar = (e: PointerEvent) => {
    if (!arrastrando) return;
    arrastrando = false;
    ccTrack.classList.remove("drag");
    if (ccTrack.hasPointerCapture(e.pointerId)) ccTrack.releasePointerCapture(e.pointerId);
  };
  ccTrack.addEventListener("pointerup", soltar);
  ccTrack.addEventListener("pointercancel", soltar);
  // un arrastre no debe activar lo que haya bajo el dedo
  ccTrack.addEventListener("click", (e) => { if (movido > 6) { e.preventDefault(); e.stopPropagation(); } }, true);

  /* Deriva automática: la galería se recorre sola, despacio, y cede el mando
     en cuanto el usuario interviene (hover, foco, arrastre, flechas, táctil,
     rueda). Al llegar a un extremo invierte el sentido: ping-pong, sin saltos.
     El avance acumula en float propio — a ~0.4 px/frame, confiar en el
     redondeo de scrollLeft podría dejarlo clavado. */
  let autoDir = 1;
  let autoHold = 0;
  let autoX = -1;
  const tregua = () => { autoHold = performance.now() + 3500; };
  // El cursor encima NO detiene la deriva (petición de Angel): la galería
  // sigue moviéndose mientras se mira. Sólo paran el arrastre y, unos
  // segundos, un gesto explícito (flechas, rueda, táctil).
  ccTrack.addEventListener("touchstart", tregua, { passive: true });
  ccTrack.addEventListener("wheel", tregua, { passive: true });
  for (const b of ccArrows) b.addEventListener("click", tregua);

  ccDrift = (dt: number, sy: number) => {
    const parado = arrastrando || document.hidden ||
      performance.now() < autoHold;
    if (parado) { ccTrack.classList.remove("auto"); autoX = -1; return; }
    const top = ccTop - sy;
    if (top + ccH < 0 || top > innerHeight) { ccTrack.classList.remove("auto"); autoX = -1; return; }
    const max = ccTrack.scrollWidth - ccTrack.clientWidth;
    if (max <= 0) return;
    // sin encaje ni scroll suave mientras deriva: pelearían contra el avance
    ccTrack.classList.add("auto");
    if (autoX < 0 || Math.abs(ccTrack.scrollLeft - autoX) > 2) autoX = ccTrack.scrollLeft;
    autoX += autoDir * dt * 26;
    if (autoX >= max) { autoX = max; autoDir = -1; }
    else if (autoX <= 0) { autoX = 0; autoDir = 1; }
    ccTrack.scrollLeft = autoX;
  };
}

/* ---------- franja de disciplinas ---------- */
// Se clona el contenido hasta cubrir el doble del ancho visible: si el texto
// mide menos que la ventana, el ciclo dejaría hueco al desplazarse.
const stripTrack = document.querySelector<HTMLElement>(".strip p");
let stripX = 0;
let stripUnit = 0;
let stripTop = 0;
let stripH = 0;
function measureStrip() {
  if (!stripTrack) return;
  const originals = Array.from(stripTrack.children) as HTMLElement[];
  let guard = 0;
  while (stripTrack.scrollWidth < innerWidth * 2.5 && guard < 30) {
    for (const el of originals) stripTrack.appendChild(el.cloneNode(true));
    guard++;
  }
  const first = stripTrack.firstElementChild as HTMLElement | null;
  stripUnit = first ? first.getBoundingClientRect().width : 0;
  stripTop = absTop(stripTrack);
  stripH = stripTrack.offsetHeight;
}

/* ---------- cabecera ---------- */
const hd = document.getElementById("hd");
const navLinks = Array.from(document.querySelectorAll<HTMLElement>(".menu-nav a"));
const burger = document.getElementById("hdBurger");
const menu = document.getElementById("menu");

/* ---------- menú a pantalla completa ---------- */
let menuOpen = false;
function setMenu(open: boolean) {
  if (open === menuOpen) return;
  menuOpen = open;
  menu?.classList.toggle("open", open);
  hd?.classList.toggle("open", open);
  // con el menú abierto la cabecera no puede esconderse: el botón de cerrar
  // vive en ella
  if (open) hd?.classList.remove("hide");
  menu?.setAttribute("aria-hidden", open ? "false" : "true");
  burger?.setAttribute("aria-expanded", open ? "true" : "false");
  burger?.setAttribute("aria-label", open ? "Cerrar el menú" : "Abrir el menú");
  document.documentElement.classList.toggle("menu-lock", open);
  if (open) menu?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
  else burger?.focus({ preventScroll: true });
}
burger?.addEventListener("click", () => setMenu(!menuOpen));
// al elegir sección el menú se retira y deja ver el destino
for (const a of Array.from(menu?.querySelectorAll("a") ?? [])) {
  a.addEventListener("click", () => setMenu(false));
}
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuOpen) setMenu(false);
});
const secs = Array.from(document.querySelectorAll<HTMLElement>(".sec[id]"));
let bounds: { el: HTMLElement; top: number; bottom: number }[] = [];
let activeSec: HTMLElement | null = null;

function measureSecs() {
  bounds = secs.map((el) => ({
    el,
    top: absTop(el),
    bottom: absTop(el) + el.offsetHeight,
  }));
}

// Ocultar por dirección, con un acumulador en vez del delta de un frame: a
// velocidad baja el delta por frame es de un píxel y ningún umbral llegaría a
// dispararse; acumulando el recorrido en un mismo sentido hace falta un gesto
// deliberado para que la barra cambie de estado.
let lastY = 0;
let acc = 0;
let hidden = false;

function syncHeader(sy: number) {
  if (!hd) return;
  hd.classList.toggle("solid", sy > innerHeight * 0.86 && !menuOpen);

  const dy = sy - lastY;
  lastY = sy;
  if ((dy > 0) !== (acc > 0)) acc = 0;
  acc += dy;
  if (menuOpen || sy < innerHeight * 0.55) {
    if (hidden) { hidden = false; hd.classList.remove("hide"); }
  } else if (acc > 110 && !hidden) {
    hidden = true;
    hd.classList.add("hide");
  } else if (acc < -70 && hidden) {
    hidden = false;
    hd.classList.remove("hide");
  }

  const probe = sy + innerHeight * 0.42;
  let found: HTMLElement | null = null;
  for (const b of bounds) {
    if (probe >= b.top && probe < b.bottom) {
      found = b.el;
      break;
    }
  }
  if (!found || found === activeSec) return;
  activeSec = found;
  for (const a of navLinks) a.classList.toggle("on", a.dataset.sec === found!.id);
}

/* ---------- visor de la experiencia ---------- */
const expItems = Array.from(document.querySelectorAll<HTMLElement>(".exp-item"));
const expImgs = Array.from(
  document.querySelectorAll<HTMLElement>("#expViewer img")
);
function showExp(i: number) {
  expItems.forEach((el, k) => el.classList.toggle("on", k === i));
  expImgs.forEach((el, k) => el.classList.toggle("on", k === i));
}
expItems.forEach((li, i) => {
  const act = () => showExp(i);
  li.addEventListener("pointerenter", act);
  li.querySelector("button")?.addEventListener("focus", act);
  li.querySelector("button")?.addEventListener("click", act);
});

/* ---------- fondos de membresías ---------- */
// Cada plan rota su set de fotos en fundido. Los intervalos van desfasados
// para que las tres tarjetas no cambien a la vez, y sólo se avanza a una foto
// ya cargada: fundir hacia una imagen diferida a medias deja la tarjeta vacía.
if (!reduced) {
  document.querySelectorAll<HTMLElement>(".plan-bg").forEach((bg, k) => {
    const imgs = Array.from(bg.querySelectorAll("img"));
    if (imgs.length < 2) return;
    let i = imgs.findIndex((im) => im.classList.contains("on"));
    if (i < 0) i = 0;
    setTimeout(() => {
      setInterval(() => {
        // Sin pintado no hay transición: avanzar clases con la pestaña oculta
        // deja los fundidos congelados a medias al volver.
        if (document.hidden) return;
        const r = bg.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const next = (i + 1) % imgs.length;
        if (!imgs[next].complete || imgs[next].naturalWidth === 0) return;
        imgs[i].classList.remove("on");
        imgs[next].classList.add("on");
        i = next;
      }, 4800);
    }, k * 1600);
  });
}

/* ---------- universo flotante ----------
   El scroll de la sección mueve la cámara (--cam) a través de la nube 3D.
   Cada foto aparece desde el fondo y se apaga justo antes de cruzar el plano
   de la cámara: sin ese fundido, al pasar el plano la perspectiva la escala
   a lo bestia y revienta el cuadro. */
const uniSec = document.getElementById("universo");
const uniCloud = document.getElementById("uniCloud");
const uniItems = uniCloud
  ? Array.from(uniCloud.querySelectorAll<HTMLElement>(".uni-it")).map((el) => ({
      el,
      z: parseFloat(el.style.getPropertyValue("--uz")) || 0,
    }))
  : [];
const UNI_TRAVEL = 2600;
let uniP = 0;

let uniTop = 0;
let uniH = 0;
function measureUni() {
  if (!uniSec) return;
  uniTop = absTop(uniSec);
  uniH = uniSec.offsetHeight;
}

function syncUni(dt: number, sy: number) {
  if (!uniSec || !uniCloud || !uniItems.length) return;
  const top = uniTop - sy;
  if (top + uniH < 0 || top > innerHeight) return;
  const total = Math.max(1, uniH - innerHeight);
  const objetivo = Math.max(0, Math.min(1, -top / total));

  // El avance persigue a la posición del scroll en vez de copiarla. Con un
  // desplazamiento brusco, la cámara ya no salta de golpe: recorre la nube y
  // llega, así que el trayecto se mantiene legible por rápido que se scrollee.
  // La amortiguación va por tiempo y no por frame: con un factor fijo, a
  // 144 Hz llegaría al doble de rápido que a 60.
  uniP += (objetivo - uniP) * (1 - Math.exp(-dt / 0.20));
  // al llegar se ancla, para no dejar residuo cerca de los extremos
  if (Math.abs(objetivo - uniP) < 0.0008) uniP = objetivo;
  const p = uniP;
  const c01 = (v: number) => Math.max(0, Math.min(1, v));
  const suave = (v: number) => v * v * (3 - 2 * v);
  // Secuencia en tres actos bien separados (petición de Angel):
  // 1) p 0→0.10: el copy sube de abajo arriba, aún sobre hueso (en tinta);
  // 2) p 0.14→0.40: el fondo funde a negro, lento (el copy vira a hueso);
  // 3) p 0.42→0.88: sólo entonces aparecen las fotos y navega la cámara.
  // A la salida, la partitura se toca al revés.
  const utext = suave(Math.min(c01(p / 0.1), c01((1 - p) / 0.05)));
  setVar(uniSec, "--utext", utext.toFixed(3));
  const udark = suave(Math.min(c01((p - 0.14) / 0.26), c01((1 - p - 0.04) / 0.14)));
  setVar(uniSec, "--udark", udark.toFixed(3));
  const uimg = suave(Math.min(c01((p - 0.42) / 0.1), c01((1 - p - 0.16) / 0.1)));
  const cam = c01((p - 0.42) / 0.46) * UNI_TRAVEL;
  setVar(uniCloud, "--cam", `${cam.toFixed(1)}px`);
  for (const it of uniItems) {
    const zE = it.z + cam;
    const entra = Math.max(0, Math.min(1, (zE + 2500) / 480));
    const sale = Math.max(0, Math.min(1, 1 - (zE - 320) / 260));
    // las fotos sólo existen en el acto 3, con la sala ya a oscuras
    setVar(it.el, "--uo", (entra * sale * uimg).toFixed(3));
  }
}

/* ---------- selector de Un día ---------- */
// La primera fila arranca preseleccionada y su foto llena el marco de la
// derecha. Hover o toque eligen fila: la activa queda en amarillo y su foto
// funde en el marco. La selección persiste (no se pliega al salir).
{
  const dayList = document.querySelector<HTMLElement>(".day");
  const peek = document.querySelector<HTMLElement>(".day-peek");
  if (dayList && peek) {
    const peekImgs = Array.from(peek.querySelectorAll("img"));
    const rows = Array.from(dayList.querySelectorAll<HTMLElement>(".day-row"));
    const elegir = (i: number) => {
      rows.forEach((r, k) => r.classList.toggle("on", k === i));
      peekImgs.forEach((im, k) => im.classList.toggle("on", k === i));
    };
    elegir(0);
    rows.forEach((row, i) => {
      row.addEventListener("pointerenter", () => elegir(i));
      row.addEventListener("click", () => elegir(i));
    });
  }
}

/* ---------- contadores ---------- */
function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count ?? 0);
  if (!target || el.dataset.done === "1") return;
  el.dataset.done = "1";
  const prefix = el.dataset.prefix ?? "";
  if (reduced) {
    el.textContent = `${prefix}${target}`;
    return;
  }
  const dur = 1600;
  const t0 = performance.now();
  const step = (now: number) => {
    const f = Math.min(1, (now - t0) / dur);
    el.textContent = `${prefix}${Math.round(target * (1 - Math.pow(1 - f, 3)))}`;
    if (f < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

let counters: { el: HTMLElement; top: number }[] = [];
function measureCounters() {
  counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]")).map(
    (el) => ({ el, top: absTop(el) })
  );
}
function syncCounters(sy: number) {
  const bottom = sy + innerHeight * 0.85;
  for (const c of counters) {
    if (c.el.dataset.done !== "1" && c.top < bottom) countUp(c.el);
  }
}

/* ---------- dolly-in del collage en cruz ----------
   Las piezas no se mueven de su sitio (la foto se ve completa en su marco);
   lo que avanza es la CÁMARA: cada foto hace zoom hacia dentro conforme la
   sección recorre el viewport, con más recorrido cuanto más al frente está
   la pieza (data-depth) — la sensación de irse metiendo en las imágenes. */
const crossEl = document.querySelector<HTMLElement>(".cross");
const crossTiles = crossEl
  ? Array.from(crossEl.querySelectorAll<HTMLElement>(".cross-t")).map((el) => ({
      el,
      k: Number(el.dataset.depth ?? 0.2),
    }))
  : [];

let crossTop = 0;
let crossH = 0;
function measureCross() {
  if (!crossEl) return;
  crossTop = absTop(crossEl);
  crossH = crossEl.offsetHeight;
}

function syncCross(sy: number) {
  if (!crossEl || !crossTiles.length) return;
  const top = crossTop - sy;
  if (top + crossH < -150 || top > innerHeight + 150) return;
  // +1 con la cruz abajo del viewport, 0 centrada, -1 ya arriba
  const f = Math.max(-1, Math.min(1,
    (top + crossH / 2 - innerHeight / 2) / innerHeight));
  for (const t of crossTiles) {
    // z crece de forma monótona al avanzar: 1 al llegar, 1+k al salir
    const z = 1 + (1 - f) * 0.5 * t.k;
    setVar(t.el, "--cz", z.toFixed(3));
  }
}

/* ---------- medición y bucle ---------- */
let dirty = true;
function measureAll() {
  measureReveals();
  measurePars();
  measureFixed();
  measureKinetics();
  measureUni();
  measureCross();
  measureCounters();
  measureCc();
  measureSecs();
  measureStrip();
  dirty = true;
}
// Varias causas pueden pedir remedir en el mismo instante (resize, fuentes,
// load): se agrupan en un solo frame. Antes cada foto diferida al cargar
// lanzaba una medición completa (cientos de lecturas de layout) en pleno
// scroll: ésa era la fuente principal de los bajones en frío. Ahora los
// cambios de alto los detecta el ResizeObserver de abajo, una vez por frame.
let measureQueued = false;
function requestMeasure() {
  if (measureQueued) return;
  measureQueued = true;
  requestAnimationFrame(() => { measureQueued = false; measureAll(); });
}
measureAll();
addEventListener("resize", requestMeasure);
if (document.fonts) document.fonts.ready.then(requestMeasure);
addEventListener("load", requestMeasure);

/* ---------- visibilidad por sección ----------
   Las animaciones CSS infinitas (aurora de OASIS, zoom de las tarjetas de
   marcas, pulso del hero) y la nube 3D del universo sólo trabajan mientras su
   sección está cerca del viewport: fuera, el compositor no tiene por qué
   tocarlas en cada frame. La clase .vis la pone este observador. */
{
  const watched = Array.from(document.querySelectorAll<HTMLElement>(
    "#hero, #universo, #ecosistema, #oasis, .cross"
  ));
  if (watched.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) (e.target as HTMLElement).classList.toggle("vis", e.isIntersecting);
    }, { rootMargin: "25% 0px 25% 0px" });
    for (const el of watched) io.observe(el);
  } else {
    for (const el of watched) el.classList.add("vis");
  }
}

// El observador se agrupa en el siguiente frame y sólo remide si el documento
// cambió de alto: leer el layout en el propio callback se realimenta.
let queued = false;
let lastH = document.documentElement.scrollHeight;
new ResizeObserver(() => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    const h = document.documentElement.scrollHeight;
    if (h !== lastH) {
      lastH = h;
      measureAll();
    }
  });
}).observe(document.body);

let lastT = performance.now();
let lastSy = -1;
function frame(now: number) {
  const dt = Math.min(0.05, (now - lastT) / 1000);
  lastT = now;
  const sy = document.documentElement.scrollTop;
  // Con la página quieta no hay nada que recalcular: todo lo atado al scroll
  // se salta hasta que cambie (o hasta que una medición nueva lo pida).
  const moved = sy !== lastSy || dirty;
  lastSy = sy;
  dirty = false;
  if (moved) {
    syncHeader(sy);
    syncReveals(sy);
    syncCounters(sy);
  }
  syncHeroSalida(sy);
  syncTour(dt);
  if (!reduced) {
    if (moved) {
      syncPars(sy);
      syncFixed(sy);
      syncCross(sy);
      syncKinetics(sy);
    }
    syncUni(dt, sy);
    ccDrift(dt, sy);
    if (stripTrack && stripUnit > 0) {
      // sólo avanza en pantalla: fuera de cuadro el transform por frame es
      // trabajo tirado (y el gesto no se pierde, es un ciclo continuo)
      const st = stripTop - sy;
      if (st + stripH > 0 && st < innerHeight) {
        stripX -= dt * 34;
        if (stripX <= -stripUnit) stripX += stripUnit;
        stripTrack.style.transform = `translateX(${stripX.toFixed(1)}px)`;
      }
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

export {};
