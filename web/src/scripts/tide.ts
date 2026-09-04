// ============================================================
// DINAMO — marea líquida del pie, en WebGL2 a mano.
// Un frente de fluido que ondula lentamente; el tramado de puntos
// (girado 45°, como el isotipo) vive sólo en el borde: sólido dentro,
// disgregado fuera. Blanco de fondo, amarillo de marca en el líquido.
// ============================================================

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("tideGl") as HTMLCanvasElement | null;

const VS = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const FS = `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform float u_time;
out vec4 outColor;

// ruido de valor barato, suficiente para deformar el frente
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

// Ola con la cresta más marcada y el valle más ancho que un seno puro: es lo
// que separa visualmente "onda" de "oleaje".
float wave(float p) {
  float s = sin(p);
  return s * (0.72 + 0.28 * s * s);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float ar = u_res.x / max(u_res.y, 1.0);
  float x = uv.x * ar;
  float t = u_time * 0.55;

  // Mar contenido en la vista. La lectura de "vivo" viene de superponer
  // trenes de ola que viajan en sentidos opuestos a distinta velocidad: las
  // crestas se cruzan, se refuerzan y se cancelan sin repetirse.
  float h = 0.30;

  // oleaje: dos trenes cruzados + rizado corto
  h += 0.082 * wave(x * 1.10 + t * 1.15);
  h += 0.052 * wave(x * 1.95 - t * 1.65);
  h += 0.030 * wave(x * 3.30 + t * 2.25);
  h += 0.016 * sin(x * 6.10 - t * 3.05);

  // marejada de fondo: el mar entero respira
  h += 0.050 * sin(t * 0.40) * cos(x * 0.45 + t * 0.18);

  // chapoteo contra las paredes del recipiente
  h += 0.048 * (uv.x - 0.5) * sin(t * 0.72);

  // ruido lento que rompe cualquier regularidad
  h += 0.042 * (fbm(vec2(x * 0.80, t * 0.45)) - 0.5);

  // lengua que trepa por la izquierda
  float tongue = 0.30 + 0.24 * sin(t * 0.31) - 0.55 * uv.x;
  h += 0.060 * smoothstep(0.0, 0.55, tongue) * (0.6 + 0.4 * sin(x * 1.9 - t * 0.5));

  float field = h - uv.y;

  // el borde hierve un poco: da la espuma del frente
  float foam = 0.012 * (fbm(vec2(x * 5.5, t * 1.6)) - 0.5);
  float v = smoothstep(-0.055 + foam, 0.058 + foam, field);

  // tramado a 45°, el ángulo del isotipo
  float cell = 5.0;
  mat2 R = mat2(0.7071, 0.7071, -0.7071, 0.7071);
  vec2 gp = R * gl_FragCoord.xy / cell;
  float d = length(fract(gp) - 0.5);
  // radio > 0.707 cubre la celda entera: interior sólido sin puntos visibles
  float radius = v * 0.80;
  float aa = 1.1 / cell;
  float ink = 1.0 - smoothstep(radius - aa, radius + aa, d);

  vec3 white = vec3(1.0);
  vec3 yellow = vec3(1.0, 0.906, 0.0);
  outColor = vec4(mix(white, yellow, ink), 1.0);
}`;

function init() {
  if (!canvas) return;
  const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
  if (!gl) { canvas.style.display = "none"; return; }

  const mk = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
      console.error("marea shader:", gl.getShaderInfoLog(sh));
    return sh;
  };
  const prg = gl.createProgram()!;
  gl.attachShader(prg, mk(gl.VERTEX_SHADER, VS));
  gl.attachShader(prg, mk(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prg);
  if (!gl.getProgramParameter(prg, gl.LINK_STATUS))
    console.error("marea link:", gl.getProgramInfoLog(prg));

  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prg, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prg, "u_res");
  const uTime = gl.getUniformLocation(prg, "u_time");

  let W = 1, H = 1;
  // Sin ResizeObserver sobre el canvas: cambiar sus atributos width/height
  // realimenta al observador y el pie termina dando saltos. El tamaño se
  // comprueba dentro del frame, que sólo corre con el pie a la vista.
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.25);
    const r = canvas!.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if (w === W && h === H) return;
    W = w; H = h;
    canvas!.width = W;
    canvas!.height = H;
  }
  resize();
  addEventListener("resize", resize);

  let visible = false;
  new IntersectionObserver(
    (entries) => { for (const e of entries) visible = e.isIntersecting; },
    { threshold: 0 }
  ).observe(canvas);

  let raf = 0;
  const t0 = performance.now();
  let drawnOnce = false;
  let tick = 0;

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (drawnOnce && (!visible || reduced)) return;
    // getBoundingClientRect fuerza reflow: se consulta de vez en cuando, no
    // en cada frame
    if (tick++ % 30 === 0) resize();
    const g = gl!;
    g.viewport(0, 0, W, H);
    g.useProgram(prg);
    g.bindVertexArray(vao);
    g.uniform2f(uRes, W, H);
    g.uniform1f(uTime, reduced ? 12 : (now - t0) / 1000);
    g.drawArrays(g.TRIANGLES, 0, 3);
    drawnOnce = true;
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
