/* The homepage hero's prism: a form of liquid glass rendered live in WebGL, not an image.
   It is a distance field traced per pixel: a core and four droplets that each orbit,
   swell and pull away on their own rhythm, melting together where they meet. Light
   through it bends, and splits into a spectrum at the edges, over a studio lit in the
   site's own colours (--ink, --blue and --blue-light in theme.css).
   It renders only while the hero is on screen, lowers its resolution on a GPU that
   can't keep up, and leaves just the glow behind where WebGL2 is not available.
   For reduced motion it moves at half pace and ignores the pointer rather than
   freezing: Windows reports reduced motion whenever its "Animation effects" switch
   is off, and a still frame left the glass looking broken on those PCs. */
(function () {
  const canvas = document.querySelector('.prism-canvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true });
  if (!gl) { canvas.hidden = true; return; }

  const VERTEX = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec4 uDrop[5];
uniform vec3 uInk;
uniform vec3 uBlue;
uniform vec3 uSky;
out vec4 outColor;

const float BOUND = 1.32;
const float LENS = 0.33;
const vec3 EYE = vec3(0.0, 0.0, 4.0);

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

float map(vec3 p) {
  float d = length(p - uDrop[0].xyz) - uDrop[0].w;
  for (int i = 1; i < 5; i++) d = smin(d, length(p - uDrop[i].xyz) - uDrop[i].w, 0.5);
  // a slow swell across the surface, so the glass never quite settles
  return d + 0.022 * sin(3.3 * p.x + uTime) * sin(3.1 * p.y - 0.8 * uTime) * sin(3.5 * p.z + 0.7 * uTime);
}

vec3 normalAt(vec3 p) {
  const vec2 e = vec2(0.0012, -0.0012);
  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}

float line(float x, float width) { return 1.0 - smoothstep(0.0, width, abs(x)); }

// what the glass reflects and bends: ink walls, the page's blue glow behind it (brightest
// dead centre, so the lens has something to pull around), a white softbox overhead and a
// small blue one low right, a bright rim all round, and a thin line of light to split
vec3 studio(vec3 d) {
  vec3 c = uInk * (0.8 + 0.5 * d.y);
  float back = max(-d.z, 0.0);
  c += uBlue * (0.08 * back * back + 1.3 * pow(back, 8.0));
  c += uSky * 0.8 * pow(max(dot(d, normalize(vec3(0.9, -0.2, -0.4))), 0.0), 12.0);
  c += vec3(20.0) * smoothstep(0.985, 0.993, dot(d, normalize(vec3(-0.5, 0.75, 0.45))));
  c += uSky * 6.0 * smoothstep(0.988, 0.995, dot(d, normalize(vec3(0.6, -0.5, 0.6))));
  c += vec3(0.5) * pow(1.0 - abs(d.z), 6.0);
  c += vec3(1.4) * line(dot(d, normalize(vec3(0.7, 0.7, 0.0))) - 0.12, 0.028) * step(d.z, 0.0);
  return c;
}

// red at 0 through violet at 1
vec3 spectrum(float t) {
  return clamp(vec3(1.5 - abs(4.0 * t - 0.8), 1.5 - abs(4.0 * t - 2.0), 1.5 - abs(4.0 * t - 3.2)), 0.0, 1.0);
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - uRes) / min(uRes.x, uRes.y);
  vec3 rd = normalize(vec3(uv * LENS, -1.0));
  // most pixels miss the sphere the form lives in, and stop here
  float b = dot(EYE, rd), h = b * b - dot(EYE, EYE) + BOUND * BOUND;
  if (h < 0.0) { outColor = vec4(0.0); return; }
  h = sqrt(h);
  float t = -b - h, tEnd = -b + h;
  float pixel = 2.0 * LENS / min(uRes.x, uRes.y);
  float nearest = 1e9, nearestT = t;
  bool hit = false, through = false;
  for (int i = 0; i < 100; i++) {
    float d = map(EYE + rd * t);
    if (d / t < nearest) { nearest = d / t; nearestT = t; }
    if (d < 0.5 * pixel * t) { hit = true; break; }
    t += d * 0.9;
    if (t > tEnd) { through = true; break; }
  }
  // a ray still creeping along a crease when the steps run out is on the surface
  hit = hit || !through;
  // settle exactly onto the surface, or neighbouring pixels stop at different depths
  // and the creases between droplets draw as stripes
  if (hit) { t += map(EYE + rd * t); t += map(EYE + rd * t); }
  // a soft silhouette: rays that only graze the glass cover part of their pixel
  float cover = hit ? 1.0 : 1.0 - smoothstep(0.0, 1.5 * pixel, nearest);
  if (cover <= 0.0) { outColor = vec4(0.0); return; }
  vec3 p = EYE + rd * (hit ? t : nearestT);
  vec3 n = normalAt(p);
  float fresnel = 0.04 + 0.96 * pow(1.0 - max(dot(-rd, n), 0.0), 5.0);
  vec3 col = studio(reflect(rd, n)) * fresnel;

  // through the glass: follow the light inside to where it leaves...
  vec3 inside = refract(rd, n, 1.0 / 1.47);
  vec3 q = p - n * 0.006;
  float s = 0.0;
  for (int i = 0; i < 64; i++) {
    float d = -map(q + inside * s);
    if (d < 0.002) break;
    s += max(d, 0.004);
  }
  // land exactly on the far surface, or the exit angles band into rings
  s -= map(q + inside * s);
  s -= map(q + inside * s);
  q += inside * s;
  vec3 m = -normalAt(q);
  // ...where each colour in it leaves at an angle of its own
  vec3 light = vec3(0.0), weight = vec3(0.0);
  for (int i = 0; i < 6; i++) {
    float k = (float(i) + 0.5) / 6.0;
    vec3 ray = refract(inside, m, 1.40 + 0.14 * k);
    if (dot(ray, ray) == 0.0) ray = reflect(inside, m);
    vec3 w = spectrum(k);
    light += studio(ray) * w;
    weight += w;
  }
  // a little blue in the body, deeper where the glass is thicker
  col += light / weight * exp(-(s + 0.006) * vec3(0.9, 0.6, 0.22)) * (1.0 - fresnel);

  col = clamp((col * (2.51 * col + 0.03)) / (col * (2.43 * col + 0.59) + 0.14), 0.0, 1.0);
  outColor = vec4(pow(col, vec3(1.0 / 2.2)) * cover, cover);
}`;

  const shader = function (type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (err) {
    canvas.hidden = true;
    return;
  }
  gl.useProgram(program);

  // one triangle over the whole canvas; the fragment shader does the rest
  gl.bindVertexArray(gl.createVertexArray());
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = name => gl.getUniformLocation(program, name);
  const loc = { res: u('uRes'), time: u('uTime'), drop: u('uDrop') };
  const css = getComputedStyle(document.documentElement);
  // the tokens are sRGB; the shader lights in linear colour
  const linear = function (name) {
    const hex = css.getPropertyValue(name).trim().replace('#', '');
    const n = parseInt(hex.length === 3 ? hex.replace(/./g, '$&$&') : hex, 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (c) { return Math.pow(c / 255, 2.2); });
  };
  gl.uniform3fv(u('uInk'), linear('--ink'));
  gl.uniform3fv(u('uBlue'), linear('--blue'));
  gl.uniform3fv(u('uSky'), linear('--blue-light'));
  gl.clearColor(0, 0, 0, 0);

  // four droplets around the core: [orbit speed, phase, orbit lean, reach, radius]
  const DROPS = [
    [0.31, 0.0, 0.5, 0.86, 0.29],
    [-0.23, 2.1, -0.9, 0.9, 0.25],
    [0.19, 4.0, 1.4, 0.8, 0.27],
    [-0.27, 5.2, 2.3, 0.95, 0.21],
  ];
  const drops = new Float32Array(20);
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  // turn the whole form about the vertical, lean it towards the pointer, and store it
  const place = function (i, x, y, z, r, spin) {
    const ca = Math.cos(spin + tilt.y), sa = Math.sin(spin + tilt.y);
    const x1 = x * ca + z * sa, z1 = z * ca - x * sa;
    const cb = Math.cos(tilt.x), sb = Math.sin(tilt.x);
    drops.set([x1, y * cb - z1 * sb, y * sb + z1 * cb, r], i * 4);
  };

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = canvas.closest('.hero');
  if (hero && !reduced) {
    hero.addEventListener('pointermove', function (e) {
      const r = hero.getBoundingClientRect();
      tilt.tx = ((e.clientY - r.top) / r.height - 0.5) * 0.4;
      tilt.ty = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
    });
    hero.addEventListener('pointerleave', function () { tilt.tx = 0; tilt.ty = 0; });
  }

  // ponytail: quality only ever steps down; a GPU that struggled once keeps the lighter load
  let quality = 1, slow = 0, last = 0;
  let visible = true, frame = 0;
  const start = performance.now();
  const draw = function (now) {
    frame = 0;
    // frames slower than ~40fps, once the page has finished loading, count against the GPU
    if (last && now - start > 2000) slow = now - last > 24 ? slow + 1 : Math.max(0, slow - 1);
    if (slow > 20 && quality > 0.4) { quality = Math.max(0.4, quality * 0.75); slow = 0; }
    last = now;
    const t = (now - start) / 1000 * (reduced ? 0.5 : 1);
    // as sharp as the screen, within a budget of about 800,000 traced pixels
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    const scale = Math.min(window.devicePixelRatio || 1, Math.sqrt(8e5 / (cw * ch || 1))) * quality;
    const w = Math.round(cw * scale), h = Math.round(ch * scale);
    if (!w || !h) return;
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }

    tilt.x += (tilt.tx - tilt.x) * 0.05;
    tilt.y += (tilt.ty - tilt.y) * 0.05;
    const spin = t * 0.12;
    place(0, 0.06 * Math.sin(t * 0.4), 0.05 * Math.sin(t * 0.33), 0.06 * Math.cos(t * 0.37), 0.56 + 0.03 * Math.sin(t * 0.7), spin);
    DROPS.forEach(function (d, i) {
      const a = t * d[0] + d[1];
      const reach = d[3] * (0.62 + 0.38 * (0.5 + 0.5 * Math.sin(t * 0.41 + d[1] * 1.7)));
      const x = Math.cos(a) * reach, y = 0.12 * Math.sin(t * 0.5 + d[1]), z = Math.sin(a) * reach;
      const cl = Math.cos(d[2]), sl = Math.sin(d[2]);
      place(i + 1, x * cl - y * sl, x * sl + y * cl, z, d[4] * (0.9 + 0.1 * Math.sin(t * 0.6 + d[1])), spin);
    });

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(loc.res, w, h);
    gl.uniform1f(loc.time, t);
    gl.uniform4fv(loc.drop, drops);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    canvas.classList.add('is-drawn');
    if (visible) frame = requestAnimationFrame(draw);
    else last = 0;
  };
  const kick = function () { if (!frame) frame = requestAnimationFrame(draw); };
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible) kick();
  }).observe(canvas);
  // the first frame can come before layout has sized the canvas; start again once it has
  new ResizeObserver(kick).observe(canvas);
  kick();
})();
