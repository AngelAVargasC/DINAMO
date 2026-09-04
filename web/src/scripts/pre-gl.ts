// ============================================================
// DINAMO — precargador con el isotipo montándose en 3D.
// Las tres barras entran separadas y giradas, y convergen hasta formar la
// marca. Sólo entonces sube el telón y aparece el hero, donde el mismo
// isotipo sigue viviendo en el fondo.
//
// El telón lleva animación CSS de reserva: si este módulo no llega a
// ejecutarse, la página no se queda tapada para siempre.
// ============================================================

import {
  VS_BARRAS, FS_BARRAS, perspectiva, multiplica, modelo, creaPrograma, subeIsotipo,
} from "./iso3d";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Duración mínima del montaje. La carga en local termina en milisegundos: sin
// este suelo, la animación se saltaría entera y no se vería nunca.
const MONTAJE = 2.2;
const REPOSO = 0.45;
const SALIDA = 0.95;   // las letras se van y el isotipo se viene encima
const TOPE = 8;

const suave = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
const acota = (x: number) => Math.min(Math.max(x, 0), 1);
/* arranca lenta y se dispara: sin la aceleración el isotipo no se siente
   lanzado, sólo se acerca */
const embiste = (x: number) => x * x * x;
const rgb = (c: number[]) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
const mezcla = (a: number[], b: number[], t: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(a[1] + (b[1] - a[1]) * t)}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`;

// El telón vira de gris a blanco antes de levantarse, así el corte hacia el
// hero claro deja de existir: cuando sube, ya son del mismo color.
const GRIS = [74, 72, 69];
const BLANCO = [255, 255, 255];
const HUESO = [244, 241, 236];
const TINTA = [20, 19, 15];

function init() {
  const pre = document.getElementById("pre");
  const canvas = document.getElementById("preGl") as HTMLCanvasElement | null;
  if (!pre) return;

  const raiz = document.documentElement;
  const cerrar = () => {
    if (!pre.isConnected) return;
    raiz.classList.remove("cargando");
    // arranca la entrada en secuencia; el fondo GL escucha el mismo aviso
    raiz.classList.add("entrando");
    dispatchEvent(new CustomEvent("dinamo:entrada"));
    // Cuando la secuencia termina, las animaciones CSS sueltan el mando y lo
    // recoge el scroll: si ambos escribieran transform y opacity a la vez,
    // pelearían por la misma propiedad.
    setTimeout(() => {
      raiz.classList.remove("entrando");
      raiz.classList.add("entrada-lista");
    }, 2700);
    pre.classList.add("done");
    // Con el telón puesto no hay barra de scroll y la ventana es ~15 px más
    // ancha: cualquier posición medida entonces queda desviada.
    dispatchEvent(new Event("resize"));
    setTimeout(() => {
      // liberar el contexto: hay un máximo de contextos vivos por pestaña
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      pre.remove();
    }, 480);
  };

  if (reduced) { pre.remove(); return; }
  raiz.classList.add("cargando");

  const gl = canvas
    ? canvas.getContext("webgl2", { alpha: true, antialias: true, premultipliedAlpha: true })
    : null;

  let prog: WebGLProgram | null = null;
  let iso: { vao: WebGLVertexArrayObject; cuenta: number } | null = null;
  let uMvp: WebGLUniformLocation | null = null;
  let uNor: WebGLUniformLocation | null = null;
  let uOp: WebGLUniformLocation | null = null;
  let uSep: WebGLUniformLocation | null = null;
  let W = 1, H = 1;

  if (gl && canvas) {
    prog = creaPrograma(gl, VS_BARRAS, FS_BARRAS, "pre-gl");
    iso = subeIsotipo(gl, prog);
    uMvp = gl.getUniformLocation(prog, "u_mvp");
    uNor = gl.getUniformLocation(prog, "u_nor");
    uOp = gl.getUniformLocation(prog, "u_op");
    uSep = gl.getUniformLocation(prog, "u_sep");
  } else if (canvas) {
    canvas.style.display = "none";
  }

  function medir() {
    if (!canvas) return;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if (w === W && h === H) return;
    W = w; H = h; canvas.width = W; canvas.height = H;
  }
  medir();

  let cargado = document.readyState === "complete";
  if (!cargado) addEventListener("load", () => { cargado = true; }, { once: true });

  // Dispersión de partida de cada letra, escrita a mano y no al azar: así el
  // desorden está compuesto y se repite igual en cada carga.
  // [x px, y px, z px, rotX, rotY, rotZ]
  const DISPERSION: number[][] = [
    [-190, -70, -320, 28, -46, -20],
    [110, 96, -190, -34, 28, 14],
    [-90, 128, -430, 18, 40, -28],
    [156, -104, -250, -22, -34, 22],
    [-130, 84, -170, 34, 22, -16],
    [86, -128, -380, -28, -40, 18],
  ];
  const letras = Array.from(document.querySelectorAll<HTMLElement>(".pre-l"));

  let tick = 0;
  const t0 = performance.now();

  function frame(now: number) {
    const t = (now - t0) / 1000;
    if (tick++ % 20 === 0) medir();

    // avance del montaje: separación, giro y escala convergen a la vez
    const p = suave(t / MONTAJE);
    // avance de la salida, que arranca tras el reposo
    const sp = acota((t - MONTAJE - REPOSO) / SALIDA);
    const sep = (1 - p) * 3.1;
    const ry = (1 - p) * -1.15;
    const rx = (1 - p) * 0.55;
    const esc = 0.55 + p * 0.45;

    if (gl && iso && prog) {
      const g = gl;
      g.viewport(0, 0, W, H);
      g.clearColor(0, 0, 0, 0);
      g.clear(g.COLOR_BUFFER_BIT);
      g.enable(g.BLEND);
      g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA);
      g.disable(g.DEPTH_TEST);

      // Salida: el isotipo se abalanza sobre la cámara. Crece por acercarse,
      // no por escalarse, que es lo que hace que se sienta lanzado a la cara.
      //
      // Objetivo largo (17°) y marca centrada en el eje. Con la lente angular
      // de antes (35°) y el isotipo desplazado del centro, la perspectiva lo
      // deformaba en trapecio y se veía torcido: la geometría es exacta al
      // SVG —centros y proporción 5:1 comprobados—, la culpa era de la lente.
      const z = -23 + embiste(sp) * 22.4;
      const proj = perspectiva(0.30, W / Math.max(H, 1), 0.1, 60);
      // Sube para despejar la palabra, que le tapaba la barra de abajo. El
      // alzado va proporcional a la distancia: la posición proyectada es
      // ty/|z|, así que con un valor fijo la marca se escaparía hacia arriba
      // según se acerca en la embestida, en vez de venirse de frente.
      // Con el objetivo largo, este desvío del eje no introduce deformación
      // apreciable.
      const ty = 0.8 * (-z / 23);
      const mv = modelo(rx, ry, 0, ty, z, esc);
      g.useProgram(prog);
      g.bindVertexArray(iso.vao);
      g.uniformMatrix4fv(uMvp, false, multiplica(proj, mv));
      g.uniformMatrix3fv(uNor, false, new Float32Array([
        mv[0], mv[1], mv[2], mv[4], mv[5], mv[6], mv[8], mv[9], mv[10],
      ]));
      g.uniform1f(uSep, sep);
      // entra de menos a más y se apaga en el último tramo de la embestida,
      // cuando ya ha desbordado la pantalla
      const desvanece = 1 - acota((sp - 0.72) / 0.28);
      g.uniform1f(uOp, (0.35 + 0.65 * p) * desvanece);
      g.drawElements(g.TRIANGLES, iso.cuenta, g.UNSIGNED_SHORT, 0);
    }

      // El fondo vira de gris a blanco y las letras cambian de tono con él, para
    // que no se pierdan al llegar al blanco.
    //
    // El cambio es DISCRETO y no un fundido: cualquier transición continua de
    // claro a oscuro atraviesa por fuerza la luminancia del fondo, y en ese
    // punto las letras desaparecen (medido: 1.1:1 con un fundido directo, y
    // 1.48:1 pasando por el amarillo de marca). Saltando de golpe no existe
    // color intermedio. El umbral 0.24 sale de barrer todos los posibles y
    // quedarse con el que maximiza el peor contraste del recorrido: 3.99:1,
    // por encima del mínimo de 3:1 para texto grande.
    const tono = suave(acota((t - 0.5) / (MONTAJE * 0.85)));
    pre.style.backgroundColor = mezcla(GRIS, BLANCO, tono);
    const colorTexto = tono < 0.24 ? rgb(HUESO) : rgb(TINTA);

  // las letras se acomodan escalonadas, cada una con su propio retardo
    letras.forEach((el, k) => {
      const d = DISPERSION[k % DISPERSION.length];
      // el escalonado reparte la entrada; el 0.55 deja que se solapen en vez
      // de ir una detrás de otra, que se sentiría como una lista
      const lp = suave((t - 0.25 - k * 0.09) / (MONTAJE * 0.55));
      const q = 1 - lp;
      el.style.transform =
        `translate3d(${(d[0] * q).toFixed(1)}px, ${(d[1] * q).toFixed(1)}px, ${(d[2] * q).toFixed(1)}px)` +
        ` rotateX(${(d[3] * q).toFixed(1)}deg) rotateY(${(d[4] * q).toFixed(1)}deg)` +
        ` rotateZ(${(d[5] * q).toFixed(1)}deg)`;
      // en la salida se van hacia la derecha, escalonadas: las de la izquierda
      // arrancan las últimas, así la palabra se deshila en vez de irse en bloque
      const fuga = embiste(acota((sp - k * 0.05) / (1 - k * 0.05)));
      const dx = fuga * (70 + k * 6);
      el.style.transform =
        `translate3d(${((d[0] * q) + dx * 16).toFixed(1)}px, ${(d[1] * q).toFixed(1)}px, ${(d[2] * q).toFixed(1)}px)` +
        ` rotateX(${(d[3] * q).toFixed(1)}deg) rotateY(${(d[4] * q).toFixed(1)}deg)` +
        ` rotateZ(${(d[5] * q).toFixed(1)}deg)`;
      el.style.opacity = String(Math.min(1, lp * 1.4) * (1 - acota((fuga - 0.45) / 0.4)));
      el.style.color = colorTexto;
    });

    if ((cargado && sp >= 1) || t > TOPE) {
      cerrar();
      return;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

init();

export {};
