// ============================================================
// DINAMO — el isotipo en 3D, compartido.
// Lo usan el fondo del hero y el precargador. Vive aquí para que la marca se
// construya en un solo sitio: si cambian las proporciones, cambian en los dos.
// ============================================================

export const VS_BARRAS = `#version 300 es
in vec3 a_pos;
in vec3 a_nor;
in float a_bar;
uniform mat4 u_mvp;
uniform mat3 u_nor;
uniform float u_sep;
out vec3 v_nor;
void main(){
  v_nor = normalize(u_nor * a_nor);
  // Cada barra se desplaza por su propia diagonal según u_sep. Va en el
  // vertex shader y no en la geometría: así el montaje del logo se anima sin
  // volver a subir vértices en cada frame.
  vec3 eje = vec3(0.7071, 0.7071, 0.0);
  vec3 p = a_pos + (a_bar - 1.0) * u_sep * eje;
  gl_Position = u_mvp * vec4(p, 1.0);
}`;

export const FS_BARRAS = `#version 300 es
precision highp float;
in vec3 v_nor;
uniform float u_op;
out vec4 outColor;
void main(){
  vec3 n = normalize(v_nor);
  vec3 luz = normalize(vec3(-0.35, 0.8, 0.6));
  float dif = max(dot(n, luz), 0.0);
  // fresnel suave: marca el canto de cada barra y evita que se lean planas
  float fres = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);
  // Amarillo OFICIAL (#FFE700) a valor pleno y opaco: la versión anterior
  // sombreaba al 74 % y pintaba con alpha 0.4–0.8, y las barras se veían
  // apagadas y lavadas (corrección pedida por Angel). Queda un matiz mínimo
  // en caras y cantos, lo justo para que el volumen se lea.
  vec3 marca = vec3(1.0, 0.906, 0.0);
  vec3 col = mix(marca * 0.94, marca, dif);
  col = mix(col, vec3(1.0, 0.95, 0.25), fres * 0.15);
  float a = u_op;
  outColor = vec4(col * a, a);
}`;

/* ---------- geometría: una caja por barra ---------- */
function caja(cx: number, cy: number, w: number, h: number, d: number, giro: number) {
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  const hw = w / 2, hh = h / 2, hd = d / 2;
  const c = Math.cos(giro), s = Math.sin(giro);
  // Seis caras con normal propia. Compartiendo vértices entre caras las
  // normales se promedian y la barra pierde sus aristas.
  const caras: Array<[number[], number[]]> = [
    [[hw, hh, hd, -hw, hh, hd, -hw, -hh, hd, hw, -hh, hd], [0, 0, 1]],
    [[-hw, hh, -hd, hw, hh, -hd, hw, -hh, -hd, -hw, -hh, -hd], [0, 0, -1]],
    [[hw, hh, -hd, hw, hh, hd, hw, -hh, hd, hw, -hh, -hd], [1, 0, 0]],
    [[-hw, hh, hd, -hw, hh, -hd, -hw, -hh, -hd, -hw, -hh, hd], [-1, 0, 0]],
    [[hw, hh, -hd, -hw, hh, -hd, -hw, hh, hd, hw, hh, hd], [0, 1, 0]],
    [[hw, -hh, hd, -hw, -hh, hd, -hw, -hh, -hd, hw, -hh, -hd], [0, -1, 0]],
  ];
  for (const [v, n] of caras) {
    const base = pos.length / 3;
    for (let i = 0; i < 4; i++) {
      const x = v[i * 3], y = v[i * 3 + 1], z = v[i * 3 + 2];
      pos.push(x * c - y * s + cx, x * s + y * c + cy, z);
      nor.push(n[0] * c - n[1] * s, n[0] * s + n[1] * c, n[2]);
    }
    idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  return { pos, nor, idx };
}

/** Centros de las tres barras, tal y como los da el SVG del isotipo. */
export const CENTROS: Array<[number, number]> = [
  [-0.53, 0.44],
  [0.60, 0.0],
  [-0.60, -0.43],
];

/** Geometría del isotipo, con el índice de barra por vértice para poder
 *  separarlas desde el shader. */
export function geometriaIsotipo() {
  // El SVG mide su Y hacia abajo y GL hacia arriba: el -45° del original se
  // convierte en +45° aquí. Con el signo del SVG las barras salían
  // descendentes, al revés que la marca.
  const giro = Math.PI / 4;
  const P: number[] = [], N: number[] = [], I: number[] = [], B: number[] = [];
  CENTROS.forEach(([cx, cy], k) => {
    const g = caja(cx, cy, 1.33, 0.266, 0.16, giro);
    const off = P.length / 3;
    for (const v of g.pos) P.push(v);
    for (const v of g.nor) N.push(v);
    for (const i of g.idx) I.push(i + off);
    for (let n = 0; n < g.pos.length / 3; n++) B.push(k);
  });
  return {
    pos: new Float32Array(P), nor: new Float32Array(N),
    bar: new Float32Array(B), idx: new Uint16Array(I),
  };
}

/* ---------- matrices ---------- */
export function perspectiva(fov: number, ar: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2), d = near - far;
  return new Float32Array([
    f / ar, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / d, -1,
    0, 0, (2 * far * near) / d, 0,
  ]);
}

export function multiplica(a: Float32Array, b: Float32Array) {
  const o = new Float32Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k];
      o[i * 4 + j] = s;
    }
  }
  return o;
}

export function modelo(
  rx: number, ry: number, tx: number, ty: number, tz: number, e: number
) {
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const cy = Math.cos(ry), sy = Math.sin(ry);
  // la escala va en las columnas de rotación; las normales se renormalizan en
  // el vertex shader, así que un factor uniforme no las estropea
  return new Float32Array([
    cy * e, sx * sy * e, -cx * sy * e, 0,
    0, cx * e, sx * e, 0,
    sy * e, -sx * cy * e, cx * cy * e, 0,
    tx, ty, tz, 1,
  ]);
}

/* ---------- utilidades de programa ---------- */
export function creaPrograma(gl: WebGL2RenderingContext, vs: string, fs: string, tag: string) {
  const compila = (tipo: number, src: string) => {
    const sh = gl.createShader(tipo)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    // WebGL no lanza excepción si un shader no compila: simplemente no dibuja
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error(tag + " shader:", gl.getShaderInfoLog(sh));
    }
    return sh;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, compila(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compila(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error(tag + " link:", gl.getProgramInfoLog(p));
  }
  return p;
}

/** Sube la geometría del isotipo a un VAO listo para dibujar. */
export function subeIsotipo(gl: WebGL2RenderingContext, prog: WebGLProgram) {
  const geo = geometriaIsotipo();
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);

  const bp = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, bp);
  gl.bufferData(gl.ARRAY_BUFFER, geo.pos, gl.STATIC_DRAW);
  const lp = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(lp);
  gl.vertexAttribPointer(lp, 3, gl.FLOAT, false, 0, 0);

  const bn = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, bn);
  gl.bufferData(gl.ARRAY_BUFFER, geo.nor, gl.STATIC_DRAW);
  const ln = gl.getAttribLocation(prog, "a_nor");
  gl.enableVertexAttribArray(ln);
  gl.vertexAttribPointer(ln, 3, gl.FLOAT, false, 0, 0);

  const bb = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, bb);
  gl.bufferData(gl.ARRAY_BUFFER, geo.bar, gl.STATIC_DRAW);
  const lb = gl.getAttribLocation(prog, "a_bar");
  gl.enableVertexAttribArray(lb);
  gl.vertexAttribPointer(lb, 1, gl.FLOAT, false, 0, 0);

  const bi = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bi);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geo.idx, gl.STATIC_DRAW);

  return { vao, cuenta: geo.idx.length };
}
