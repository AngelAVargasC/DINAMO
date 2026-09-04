// ============================================================
// DINAMO — fondo del hero en WebGL2, a mano.
// Dos pases sobre el mismo lienzo:
//   1. aurora: campo de color que fluye, en los tonos de la marca
//   2. isotipo: las tres barras extruidas, girando despacio
// Sobre fondo claro y con opacidad contenida: manda la atleta, no el fondo.
// ============================================================

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

const VS_AURORA = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const FS_AURORA = `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform float u_time;
out vec4 outColor;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float ar = u_res.x / max(u_res.y, 1.0);
  vec2 p = vec2(uv.x * ar, uv.y);
  float t = u_time * 0.045;

  // dos campos arrastrados en sentidos distintos: sin el cruce, la aurora se
  // lee como una textura que se desliza y no como algo vivo
  float a = fbm(p * 1.6 + vec2(t * 1.7, -t * 0.9));
  float b = fbm(p * 2.4 - vec2(t * 1.1, t * 1.5) + a * 0.6);
  float velo = smoothstep(0.25, 0.95, a * 0.65 + b * 0.55);

  // Aurora neutra: sólo variaciones de hueso y blanco. El amarillo salía por
  // la derecha y se leía como una niebla de color; ahora el único amarillo del
  // hero es el isotipo, que es donde tiene que estar.
  float lado = smoothstep(0.18, 1.0, uv.x);
  vec3 hueso = vec3(0.972, 0.968, 0.960);
  vec3 claro = vec3(1.0, 1.0, 0.998);

  vec3 col = mix(hueso, claro, velo);

  // se apaga contra los bordes para que no se vea el canto del lienzo
  float borde = smoothstep(0.0, 0.22, uv.y) * smoothstep(1.0, 0.72, uv.y);
  float alpha = (0.10 + 0.55 * velo * (0.35 + 0.65 * lado)) * borde;
  outColor = vec4(col * alpha, alpha);
}`;

import {
  VS_BARRAS, FS_BARRAS, perspectiva, multiplica, modelo, creaPrograma, subeIsotipo,
} from "./iso3d";

function init() {
  const canvas = document.getElementById("heroGl") as HTMLCanvasElement | null;
  if (!canvas) return;
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
  });
  // sin WebGL2 el hero se queda con sus capas CSS, que ya se bastan solas
  if (!gl) { canvas.style.display = "none"; return; }

  const programa = (vs: string, fs: string) => creaPrograma(gl, vs, fs, "hero-gl");

  // a partir de aquí el contexto es válido: se apagan los sustitutos CSS
  canvas.closest(".hero")?.classList.add("gl-on");

  const pAurora = programa(VS_AURORA, FS_AURORA);
  const pBarras = programa(VS_BARRAS, FS_BARRAS);

  // aurora: un solo triángulo que cubre la pantalla
  const vaoA = gl.createVertexArray()!;
  gl.bindVertexArray(vaoA);
  const bufA = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, bufA);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const locA = gl.getAttribLocation(pAurora, "a_pos");
  gl.enableVertexAttribArray(locA);
  gl.vertexAttribPointer(locA, 2, gl.FLOAT, false, 0, 0);

  const iso = subeIsotipo(gl, pBarras);

  // localizaciones resueltas una vez, nunca por frame
  const uResA = gl.getUniformLocation(pAurora, "u_res");
  const uTimeA = gl.getUniformLocation(pAurora, "u_time");
  const uMvp = gl.getUniformLocation(pBarras, "u_mvp");
  const uNor = gl.getUniformLocation(pBarras, "u_nor");
  const uOp = gl.getUniformLocation(pBarras, "u_op");
  const uSep = gl.getUniformLocation(pBarras, "u_sep");

  let W = 1, H = 1;
  function medir() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const r = canvas!.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if (w === W && h === H) return;
    W = w; H = h;
    canvas!.width = W;
    canvas!.height = H;
  }
  medir();
  addEventListener("resize", medir);

  // Sin ResizeObserver sobre el propio lienzo: cambiar sus atributos width y
  // height realimenta al observador. El tamaño se revisa dentro del frame.
  let visible = true;
  new IntersectionObserver(
    (es) => { for (const e of es) visible = e.isIntersecting; },
    { threshold: 0 }
  ).observe(canvas);

  // ---------- parallax ----------
  // El isotipo ya no gira: se queda en la orientación de la marca y sólo se
  // desplaza. El objetivo lo marcan el puntero y el scroll; el valor real lo
  // persigue con amortiguación por tiempo, no por frame — si no, a 144 Hz
  // llegaría al doble de rápido que a 60.
  const obj = { x: 0, y: 0, rx: 0, ry: 0 };
  const act = { x: 0, y: 0, rx: 0, ry: 0 };
  const hero = canvas.closest(".hero") as HTMLElement | null;

  function desdePuntero(e: PointerEvent) {
    if (!hero) return;
    const r = hero.getBoundingClientRect();
    const fx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const fy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    // Parallax 3D: manda el giro, no el desplazamiento. La marca se vuelve
    // hacia el puntero y enseña el grosor de sus barras — que es justo lo que
    // justifica hacerlo en WebGL y no con un translate de CSS.
    obj.ry = fx * 0.42;
    obj.rx = -fy * 0.30;
    obj.x = fx * 0.16;
    obj.y = -fy * 0.10;
  }
  hero?.addEventListener("pointermove", desdePuntero);
  hero?.addEventListener("pointerleave", () => {
    obj.x = 0; obj.y = 0; obj.rx = 0; obj.ry = 0;
  });

  let despl = 0;
  let salida = 0;
  function desdeScroll() {
    // al bajar, la marca sube más despacio que la página: es el parallax
    despl = (scrollY / Math.max(innerHeight, 1)) * 1.15;
    // y se retira la primera, igual que entró: mismo orden en los dos sentidos
    const alto = hero?.offsetHeight || innerHeight;
    const x = Math.min(1, Math.max(0, scrollY / alto / 0.5));
    salida = x * x * (3 - 2 * x);
  }
  desdeScroll();
  addEventListener("scroll", desdeScroll, { passive: true });

  // Las barras son lo primero que entra tras el telón. Si hay precargador se
  // espera a su aviso; si no lo hay —o si se pidió movimiento reducido— entran
  // desde el principio, para que nunca queden invisibles esperando un evento
  // que no va a llegar.
  const hayTelon = !!document.getElementById("pre") && !reduced;
  let tEntrada: number | null = hayTelon ? null : performance.now();
  addEventListener("dinamo:entrada", () => {
    if (tEntrada === null) tEntrada = performance.now();
  }, { once: true });

  let raf = 0;
  let tick = 0;
  let pintadoUna = false;
  let tPrev = performance.now();
  const t0 = performance.now();

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (pintadoUna && (!visible || reduced)) return;
    // getBoundingClientRect fuerza reflow: se consulta de vez en cuando
    if (tick++ % 30 === 0) medir();

    const t = reduced ? 8 : (now - t0) / 1000;
    const g = gl!;
    g.viewport(0, 0, W, H);
    g.clearColor(0, 0, 0, 0);
    g.clear(g.COLOR_BUFFER_BIT);
    g.enable(g.BLEND);
    g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA);
    g.disable(g.DEPTH_TEST);

    g.useProgram(pAurora);
    g.bindVertexArray(vaoA);
    g.uniform2f(uResA, W, H);
    g.uniform1f(uTimeA, t);
    g.drawArrays(g.TRIANGLES, 0, 3);

    // las barras encima, quietas en la orientación del logo
    const dt = Math.min(0.05, (now - tPrev) / 1000);
    tPrev = now;
    const k = 1 - Math.exp(-dt / 0.22);
    act.x += (obj.x - act.x) * k;
    act.y += (obj.y - act.y) * k;
    act.rx += (obj.rx - act.rx) * k;
    act.ry += (obj.ry - act.ry) * k;

    // Colocación fija de la marca: alejada para que no domine y corrida al
    // hueco entre el titular y la figura. Girando pasaba desapercibida, pero
    // quieta y grande se comía la escena.
    const BASE_X = 0.62, BASE_Y = 0.42, BASE_Z = -9.2;
    const ESCALA = 4; // cuatro veces el tamaño anterior
    const ar = W / Math.max(H, 1);
    const proj = perspectiva(0.62, ar, 0.1, 30);

    // Entrada del isotipo: llega en diagonal desde la esquina superior derecha
    // hasta su sitio. La curva frena al final, así que el último tramo es el
    // más lento y el aterrizaje se siente suave.
    // Se calcula AQUÍ, antes de la matriz: declarada más abajo caía en zona
    // muerta temporal y el frame lanzaba excepción en cada vuelta.
    const avance = tEntrada === null ? 0 : Math.min(1, (now - tEntrada) / 1250);
    const entrada = 1 - Math.pow(1 - avance, 3);
    // recorrido que le queda: arriba y a la derecha al empezar, cero al llegar
    const resto = 1 - entrada;
    const mv = modelo(
      act.rx, act.ry,
      BASE_X + act.x + resto * 3.4,
      BASE_Y + act.y + despl + resto * 2.2,
      BASE_Z, ESCALA
    );
    g.useProgram(pBarras);
    g.bindVertexArray(iso.vao);
    g.uniformMatrix4fv(uMvp, false, multiplica(proj, mv));
    g.uniformMatrix3fv(uNor, false, new Float32Array([
      mv[0], mv[1], mv[2],
      mv[4], mv[5], mv[6],
      mv[8], mv[9], mv[10],
    ]));
    g.uniform1f(uOp, 0.5 * entrada * (1 - salida));
    g.uniform1f(uSep, 0);
    g.drawElements(g.TRIANGLES, iso.cuenta, g.UNSIGNED_SHORT, 0);

    pintadoUna = true;
  }
  raf = requestAnimationFrame(frame);

  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
  });
  canvas.addEventListener("webglcontextrestored", () => init());
}

init();

export {};
