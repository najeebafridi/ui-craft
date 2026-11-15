// The Studio's Immersive preview: three documents (invoice, reminder, receipt) as real 3D slabs, hand-written WebGL, no library.
// Everything visible comes from the theme tokens: colours, corner radius, border weight, depth style, motion tempo.
// build-studio.mjs inlines this after theme-bridge.js and scene-shell.js (readTheme, mountScene are in scope).
const stage = document.getElementById("imm-stage"), imm = stage.closest(".imm"), beats = [...imm.querySelectorAll("[data-beat]")];
const DEG = Math.PI / 180, HALF = [0.75, 1.0];
let theme = readTheme(), opts = { level: 2, fx: "full", depth: "soft" }, scene = null, G = null;

// ---- small matrix kit (column-major) ----
const mul = (a, b) => { const o = new Float32Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3]; return o; };
const persp = (fov, asp, n, f) => { const t = 1 / Math.tan(fov / 2), o = new Float32Array(16); o[0] = t / asp; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = (2 * f * n) / (n - f); return o; };
const look = (e, c) => {
  let zx = e[0] - c[0], zy = e[1] - c[1], zz = e[2] - c[2], l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l;
  let xx = zz, xz = -zx; l = Math.hypot(xx, xz); xx /= l; xz /= l;
  const yx = zy * xz, yy = zz * xx - zx * xz, yz = -zy * xx;
  return new Float32Array([xx, yx, zx, 0, 0, yy, zy, 0, xz, yz, zz, 0, -(xx * e[0] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1]);
};
const model = ([x, y, z, rx, ry, rz]) => {
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz);
  return new Float32Array([cy * cz + sy * sx * sz, cx * sz, -sy * cz + cy * sx * sz, 0, -cy * sz + sy * sx * cz, cx * cz, sy * sz + cy * sx * cz, 0, sy * cx, -sx, cy * cx, 0, x, y, z, 1]);
};

// ---- poses: [x, y, z, rx, ry, rz] for invoice, reminder, receipt at each beat ----
const P = (x, y, z, rx, ry, rz) => [x, y, z, rx * DEG, ry * DEG, rz * DEG];
const POSES = [
  [P(-0.74, 0.92, 0.8, -46, 12, -6), P(0.06, 1.0, 0.0, -48, 2, 2), P(0.88, 1.08, -0.8, -50, -10, 8)],      // 0 the set
  [P(0.0, 1.22, 0.75, -24, 0, 0), P(-0.98, 0.62, -0.75, -64, 20, -10), P(0.98, 0.58, -0.9, -64, -20, 10)],  // 1 sent
  [P(-1.02, 0.6, -0.8, -64, 20, -8), P(0.0, 1.22, 0.75, -24, 0, 0), P(1.0, 0.58, -0.9, -64, -20, 10)],     // 2 reminded
  [P(-0.42, 0.72, -0.55, -52, 9, -6), P(0.36, 0.84, -0.25, -50, -6, 6), P(0.0, 1.2, 0.55, -30, 0, 0)],          // 3 paid
];
const START = [P(-1.3, 0.2, 0.2, -78, 30, -22), P(0.2, 0.1, -0.6, -80, -6, 10), P(1.4, 0.15, -0.9, -78, -30, 24)];
const cur = START.map((p) => p.slice()), vel = cur.map(() => [0, 0, 0, 0, 0, 0]);
let progress = 0, paid = 0, paidNow = 0, lastInput = 0, tilt = [0, 0], tiltNow = [0, 0], centres = [], entered = false;

// ---- geometry: one rounded slab ----
function slab(hw, hh, t, r, seg = 8) {
  r = Math.max(0.004, Math.min(r, hw, hh));
  const pts = [], v = [], z = t / 2;
  for (const [cx, cy, a0] of [[hw - r, hh - r, 0], [-hw + r, hh - r, 90], [-hw + r, -hh + r, 180], [hw - r, -hh + r, 270]])
    for (let i = 0; i <= seg; i++) { const a = (a0 + (90 * i) / seg) * DEG; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a), Math.cos(a), Math.sin(a)]); }
  const put = (x, y, zz, nx, ny, nz) => v.push(x, y, zz, nx, ny, nz);
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    put(0, 0, z, 0, 0, 1); put(a[0], a[1], z, 0, 0, 1); put(b[0], b[1], z, 0, 0, 1);
    put(0, 0, -z, 0, 0, -1); put(b[0], b[1], -z, 0, 0, -1); put(a[0], a[1], -z, 0, 0, -1);
    put(a[0], a[1], z, a[2], a[3], 0); put(a[0], a[1], -z, a[2], a[3], 0); put(b[0], b[1], -z, b[2], b[3], 0);
    put(a[0], a[1], z, a[2], a[3], 0); put(b[0], b[1], -z, b[2], b[3], 0); put(b[0], b[1], z, b[2], b[3], 0);
  }
  return new Float32Array(v);
}

const VS = `attribute vec3 aPos; attribute vec3 aNor; uniform mat4 uVP, uM; varying vec3 vN, vW; varying vec2 vL; varying float vTop;
void main(){ vec4 w = uM * vec4(aPos, 1.); vW = w.xyz; vN = (uM * vec4(aNor, 0.)).xyz; vL = aPos.xy; vTop = aNor.z; gl_Position = uVP * w; }`;
const FS = `#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;
varying vec3 vN, vW; varying vec2 vL; varying float vTop;
uniform vec3 uSurf, uSurf2, uSurf3, uBorder, uText, uMuted, uAccent, uSoft, uFg, uSide, uEye, uLight;
uniform vec2 uHalf; uniform float uR, uRs, uGloss, uKind, uPaid, uRing, uRim;
float rb(vec2 p, vec2 c, vec2 h, float r){ r = min(r, min(h.x, h.y)); vec2 q = abs(p - c) - h + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
float aa(float d){
#ifdef GL_OES_standard_derivatives
  float w = fwidth(d);
#else
  float w = .004;
#endif
  return 1. - smoothstep(-w, w, d); }
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
vec3 enc(vec3 c){ c = clamp(c, 0., 1.); return mix(c * 12.92, 1.055 * pow(c, vec3(1. / 2.4)) - .055, step(.0031308, c)); }
void main(){
  vec3 N = normalize(vN), V = normalize(uEye - vW), L = normalize(-uLight), alb = uSide; float lip = 0.;
  if (vTop > .5) {
    vec2 p = vL; alb = uSurf; float d = rb(p, vec2(0.), uHalf, uR);
    if (uKind < .5) {                                                        // invoice
      alb = mix(alb, uAccent, aa(rb(p, vec2(-.53, .78), vec2(.09), uRs)));
      alb = mix(alb, uText, aa(rb(p, vec2(-.16, .78), vec2(.2, .034), .034)) * .92);
      alb = mix(alb, uMuted, aa(rb(p, vec2(.47, .78), vec2(.14, .026), .026)) * .7);
      alb = mix(alb, uBorder, aa(rb(p, vec2(0., .58), vec2(.62, .005), 0.)));
      for (int i = 0; i < 4; i++) { float f = float(i), y = .41 - .165 * f, w = .3 - .07 * mod(f, 2.);
        alb = mix(alb, uSurf3, aa(rb(p, vec2(-.62 + w, y), vec2(w, .028), .028)));
        alb = mix(alb, uMuted, aa(rb(p, vec2(.5, y), vec2(.12, .028), .028)) * .7); }
      alb = mix(alb, uBorder, aa(rb(p, vec2(0., -.25), vec2(.62, .005), 0.)));
      alb = mix(alb, uMuted, aa(rb(p, vec2(-.44, -.42), vec2(.18, .028), .028)) * .7);
      alb = mix(alb, uText, aa(rb(p, vec2(.36, -.42), vec2(.26, .055), .02)) * .95);
      alb = mix(alb, uSurf2, aa(rb(p, vec2(-.36, -.77), vec2(.26, .085), uRs * 1.4)));
      alb = mix(alb, uMuted, aa(length(p - vec2(-.52, -.77)) - .032));
      alb = mix(alb, uMuted, aa(rb(p, vec2(-.31, -.77), vec2(.12, .022), .022)) * .8);
    } else if (uKind < 1.5) {                                                // reminder
      alb = mix(alb, uAccent, aa(rb(p, vec2(-.53, .78), vec2(.09), uRs)));
      alb = mix(alb, uText, aa(rb(p, vec2(-.22, .5), vec2(.4, .04), .04)) * .92);
      for (int i = 0; i < 4; i++) { float f = float(i), w = .62 - .11 * mod(f * 2., 3.);
        alb = mix(alb, uSurf3, aa(rb(p, vec2(-.62 + w, .3 - .14 * f), vec2(w, .028), .028))); }
      alb = mix(alb, uSoft, aa(rb(p, vec2(0., -.42), vec2(.62, .17), uR * .6)));
      alb = mix(alb, uAccent, aa(rb(p, vec2(-.3, -.42), vec2(.2, .034), .034)) * .9);
      alb = mix(alb, uAccent, aa(rb(p, vec2(.4, -.42), vec2(.12, .05), .02)));
      alb = mix(alb, uAccent, aa(rb(p, vec2(-.3, -.79), vec2(.32, .085), uRs * 1.4)));
      alb = mix(alb, uFg, aa(rb(p, vec2(-.3, -.79), vec2(.17, .022), .022)) * .95);
    } else {                                                                 // receipt
      alb = mix(alb, mix(uSurf3, uAccent, uPaid), aa(length(p - vec2(0., .5)) - .23));
      float ck = min(seg(p, vec2(-.1, .5), vec2(-.03, .43)), seg(p, vec2(-.03, .43), vec2(.11, .59))) - .026;
      alb = mix(alb, mix(uMuted, uFg, uPaid), aa(ck));
      alb = mix(alb, uText, aa(rb(p, vec2(0., .08), vec2(.32, .06), .02)) * .95);
      alb = mix(alb, uMuted, aa(rb(p, vec2(0., -.07), vec2(.2, .026), .026)) * .7);
      alb = mix(alb, uBorder, aa(rb(p, vec2(0., -.25), vec2(.62, .005), 0.)));
      for (int i = 0; i < 2; i++) { float y = -.41 - .165 * float(i);
        alb = mix(alb, uSurf3, aa(rb(p, vec2(-.36, y), vec2(.26, .028), .028)));
        alb = mix(alb, uMuted, aa(rb(p, vec2(.5, y), vec2(.12, .028), .028)) * .7); }
      alb = mix(alb, uSurf3, aa(rb(p, vec2(0., -.8), vec2(.3, .022), .022)));
    }
    alb = mix(alb, uBorder, aa(abs(d + uRing * .5) - uRing * .5));           // the theme's border, as a ring
    lip = smoothstep(-.035, 0., d);
  } else if (vTop < -.5) alb = uSurf2;
  float dif = max(dot(N, L), 0.), sky = N.y * .5 + .5;
  vec3 col = alb * (mix(.34, .46, sky) + dif * .62);
  vec3 H = normalize(L + V);
  col += pow(max(dot(N, H), 0.), mix(12., 90., uGloss)) * uGloss * .55;
  col += lip * .05 * dif + pow(1. - max(dot(N, V), 0.), 3.) * uRim * uAccent;
  gl_FragColor = vec4(enc(col), 1.);
}`;
const SVS = `attribute vec2 aQ; uniform mat4 uVP, uM, uS; uniform vec2 uHalf; uniform float uGrow; varying vec2 vL;
void main(){ vL = aQ * (uHalf + uGrow); gl_Position = uVP * uS * uM * vec4(vL, 0., 1.); }`;
const SFS = `precision highp float; varying vec2 vL; uniform vec2 uHalf; uniform vec3 uCol; uniform float uR, uBlur, uAlpha;
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){ vec2 q = abs(vL) - uHalf + uR; float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - uR;
  float a = (1. - smoothstep(-uBlur, uBlur, d)) * uAlpha; a = max(0., a + (h(gl_FragCoord.xy) - .5) / 255.);
  gl_FragColor = vec4(uCol * a, a); }`;

// depth style of the direction -> how the 3D slabs sit: gloss, shadow softness and strength, slab thickness
const DEPTH3D = { soft: [0.14, 1, 0.3, 0.05], hairline: [0.04, 0.6, 0.12, 0.03], crisp: [0.42, 0.7, 0.42, 0.055], diffuse: [0.2, 1.7, 0.22, 0.05], none: [0, 1, 0, 0.02], lip: [0, 0.04, 1, 0.14] };

function program(gl, vs, fs, attribs) {
  const p = gl.createProgram(); attribs.forEach((name, i) => gl.bindAttribLocation(p, i, name));
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); gl.attachShader(p, s); }
  gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {}; for (let i = 0, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i < n; i++) { const name = gl.getActiveUniform(p, i).name; u[name] = gl.getUniformLocation(p, name); }
  return { p, u };
}

function buildGeometry() {
  const gl = G.gl, [, , , thick] = DEPTH3D[opts.depth] || DEPTH3D.soft;
  G.r = Math.min(0.3, theme.shape.radiusLg * 0.0085); G.rs = Math.min(0.09, theme.shape.radiusSm * 0.0085);
  const data = slab(HALF[0], HALF[1], thick, G.r);
  gl.bindBuffer(gl.ARRAY_BUFFER, G.slab); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); G.count = data.length / 6;
}

const hooks = {
  init(canvas, st) {
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: "low-power" });
    if (!gl) return false;
    gl.getExtension("OES_standard_derivatives");
    G = { gl, plate: program(gl, VS, FS, ["aPos", "aNor"]), shadow: program(gl, SVS, SFS, ["aQ"]), slab: gl.createBuffer(), quad: gl.createBuffer() };
    gl.bindBuffer(gl.ARRAY_BUFFER, G.quad); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
    buildGeometry();
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);
    if (opts.level < 2 || st.reduced) { POSES[0].forEach((p, i) => cur[i] = p.slice()); entered = true; }
    lastInput = performance.now(); measureBeats();
  },
  resize(w, h, pr) { const c = G.gl.canvas; c.width = Math.round(w * pr); c.height = Math.round(h * pr); G.gl.viewport(0, 0, c.width, c.height); },
  frame(now, delta, st) {
    const gl = G.gl, c = theme.color, m = theme.motion, [gloss, soft, strength] = DEPTH3D[opts.depth] || DEPTH3D.soft;
    // where the story is: whole beats only (cuts) under reduced motion, a smooth scrub otherwise
    let p = st.reduced ? Math.round(progress) : progress;
    const i0 = Math.min(POSES.length - 2, Math.floor(p)), f = p - i0, e = f * f * (3 - 2 * f);
    paid = opts.level === 3 ? Math.min(1, Math.max(0, p - 2)) : opts.level === 2 ? Math.min(1, p / 3) : 0;
    const A = opts.level === 2 ? POSES[0] : POSES[i0], B = opts.level === 2 ? POSES[3] : POSES[i0 + 1], k = opts.level === 2 ? Math.min(1, p / 3) : e;
    // the motion tokens set the tempo: instant themes follow the scroll tightly, slow themes glide, bouncy themes overshoot
    const w = (6 / ((m.slow / 1000) * 2.2)) * (m.tempo < 0.8 ? 2 : 1), zeta = m.bouncy ? 0.5 : 1, dt = Math.min(0.033, delta / 1000) / 2;
    let moving = false;
    for (let s = 0; s < 2; s++) for (let i = 0; i < 3; i++) for (let j = 0; j < 6; j++) {
      const target = A[i][j] + (B[i][j] - A[i][j]) * k;
      if (st.reduced) { cur[i][j] = target; vel[i][j] = 0; continue; }
      vel[i][j] += (-w * w * (cur[i][j] - target) - 2 * zeta * w * vel[i][j]) * dt; cur[i][j] += vel[i][j] * dt;
      if (Math.abs(cur[i][j] - target) > 0.0015 || Math.abs(vel[i][j]) > 0.004) moving = true;
    }
    paidNow = st.reduced ? paid : paidNow + (paid - paidNow) * Math.min(1, delta * 0.006 / m.tempo); if (Math.abs(paid - paidNow) > 0.004) moving = true;
    for (let j = 0; j < 2; j++) { tiltNow[j] = st.reduced ? 0 : tiltNow[j] + (tilt[j] - tiltNow[j]) * Math.min(1, delta * 0.005); if (Math.abs(tilt[j] - tiltNow[j]) > 0.004) moving = true; }
    // ambient float rests by itself: full for 3.5s after the last input, gone by 5s (nothing moves for ever without a pause)
    const since = now - lastInput, env = st.reduced || opts.level < 1 ? 0 : Math.min(1, Math.max(0, (5000 - since) / 1500)), amp = Math.max(0, m.tempo - 0.6) * 0.03 * env;
    if (amp > 0.0002) moving = true;

    const asp = st.width / st.height, fov = 26 * DEG, dist = Math.max(1.55, 2.3 / asp) / Math.tan(fov / 2);
    const at = [0, 0.82, 0], eye = [at[0] + tiltNow[0] * 0.5, at[1] + dist * 0.42 - tiltNow[1] * 0.3, at[2] + dist * 0.91];
    const VP = mul(persp(fov, asp, 0.5, 60), look(eye, at));
    const S = new Float32Array([1, 0, 0, 0, 0.14, 0, -0.1, 0, 0, 0, 1, 0, 0, 0.001, 0, 1]);
    const mats = cur.map((q, i) => model([q[0], q[1] + amp * Math.sin(now * 0.0011 + i * 2.1), q[2], q[3], q[4], q[5] + amp * 0.6 * Math.sin(now * 0.0009 + i * 1.3)]));

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // contact shadows on the page itself (the canvas is transparent, so the page is the floor)
    if (strength > 0) {
      const { p: prog, u } = G.shadow, lipStyle = opts.depth === "lip";
      gl.useProgram(prog); gl.disable(gl.DEPTH_TEST); gl.depthMask(false);
      gl.bindBuffer(gl.ARRAY_BUFFER, G.quad); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.disableVertexAttribArray(1);
      gl.uniformMatrix4fv(u.uVP, false, VP); gl.uniformMatrix4fv(u.uS, false, S); gl.uniform2fv(u.uHalf, HALF); gl.uniform1f(u.uR, Math.max(0.004, G.r));
      gl.uniform3fv(u.uCol, lipStyle ? c.border.srgb : theme.shadow.color.map((v) => Math.sqrt(v)));
      for (let i = 0; i < 3; i++) {
        const height = Math.max(0.1, cur[i][1]), blur = lipStyle ? 0.01 : (0.1 + height * 0.42) * soft;
        gl.uniformMatrix4fv(u.uM, false, mats[i]); gl.uniform1f(u.uGrow, blur * 1.2); gl.uniform1f(u.uBlur, blur);
        gl.uniform1f(u.uAlpha, lipStyle ? 1 : Math.min(0.5, (strength * theme.shadow.strength * (theme.dark ? 1.5 : 1)) / (0.7 + height * 0.9)));
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    }
    const { p: prog, u } = G.plate;
    gl.useProgram(prog); gl.enable(gl.DEPTH_TEST); gl.depthMask(true);
    gl.bindBuffer(gl.ARRAY_BUFFER, G.slab); gl.enableVertexAttribArray(0); gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
    gl.uniformMatrix4fv(u.uVP, false, VP); gl.uniform3fv(u.uEye, eye); gl.uniform3f(u.uLight, -0.25, -0.75, -0.6); gl.uniform2fv(u.uHalf, HALF);
    const set = (name, col) => gl.uniform3fv(u[name], col.linear);
    set("uSurf", c.surface); set("uSurf2", c.surface2 || c.surface); set("uSurf3", c.surface3 || c.border); set("uBorder", c.border); set("uText", c.text); set("uMuted", c.textMuted || c.text);
    set("uAccent", c.accent); set("uSoft", c.accentSoft || c.surface); set("uFg", c.accentFg || c.surface); set("uSide", opts.depth === "lip" ? c.border : c.surface3 || c.border);
    gl.uniform1f(u.uR, G.r); gl.uniform1f(u.uRs, G.rs); gl.uniform1f(u.uGloss, gloss); gl.uniform1f(u.uPaid, paidNow);
    gl.uniform1f(u.uRing, 0.008 * theme.shape.borderW); gl.uniform1f(u.uRim, theme.dark ? 0.22 : 0.05);
    for (let i = 0; i < 3; i++) { gl.uniformMatrix4fv(u.uM, false, mats[i]); gl.uniform1f(u.uKind, i); gl.drawArrays(gl.TRIANGLES, 0, G.count); }
    return moving;
  },
  dispose() { G?.gl.getExtension("WEBGL_lose_context")?.loseContext(); G = null; },
};

// ---- scroll: which beat is the page on? Layout is read once per resize, never per frame. ----
const story = () => opts.level === 3 && scene && scene.state.mode !== "fallback";
function measureBeats() {
  const y = scrollY; centres = beats.map((b) => { const r = b.getBoundingClientRect(); return r.top + y + r.height / 2; });
}
function onScroll() {
  lastInput = performance.now();
  if (opts.level === 3 && story()) {
    const stuck = getComputedStyle(stage).position === "sticky" && stage.offsetHeight < innerHeight * 0.7;      // phone: the scene is pinned on top
    const line = scrollY + (stuck ? stage.offsetHeight + (innerHeight - stage.offsetHeight) / 2 : innerHeight / 2);
    let p = 0;
    for (let i = 0; i < centres.length - 1; i++) if (line > centres[i]) p = i + Math.min(1, (line - centres[i]) / (centres[i + 1] - centres[i]));
    progress = Math.min(centres.length - 1, p);
  } else if (opts.level === 2) progress = Math.min(3, Math.max(0, (scrollY / Math.max(1, stage.offsetHeight * 0.8)) * 3));
  else progress = 0;
  const active = Math.round(progress);
  beats.forEach((b, i) => b.classList.toggle("is-active", story() && i === active));
  scene?.invalidate();
}
addEventListener("scroll", onScroll, { passive: true });
new ResizeObserver(() => { measureBeats(); onScroll(); }).observe(imm);
stage.addEventListener("pointermove", (e) => {
  if (opts.level < 2 || !matchMedia("(hover: hover)").matches) return;
  const r = stage.getBoundingClientRect(); tilt = [((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2]; lastInput = performance.now(); scene?.invalidate();
});
stage.addEventListener("pointerleave", () => { tilt = [0, 0]; scene?.invalidate(); });

// ---- mount, and remount when the Studio changes level or preview mode ----
function mount() {
  scene?.destroy(); scene = null; stage.querySelector("canvas")?.remove();
  imm.dataset.level = opts.level; delete imm.dataset.story;
  if (opts.level === 0 || opts.fx === "nogl") { stage.dataset.scene = "fallback"; onScroll(); return; }
  cur.forEach((p, i) => { START[i].forEach((v, j) => { p[j] = v; vel[i][j] = 0; }); });
  scene = mountScene(stage, hooks, { reduced: opts.fx === "reduced" ? true : undefined, lazy: false });
  new MutationObserver(() => {                                   // the story layout exists only while the scene really runs
    const on = story(); if (on !== ("story" in imm.dataset)) { on ? (imm.dataset.story = "") : delete imm.dataset.story; requestAnimationFrame(() => { measureBeats(); onScroll(); }); }
  }).observe(stage, { attributes: true, attributeFilter: ["data-scene"] });
}
window.__imm = {
  update(next = {}) {
    const remount = !scene && stage.dataset.scene === undefined || ["level", "fx"].some((k) => k in next && next[k] !== opts[k]);
    Object.assign(opts, next);
    requestAnimationFrame(() => {                               // after the new theme styles have applied
      theme = readTheme();
      if (remount) mount(); else if (G) { buildGeometry(); lastInput = performance.now(); scene.invalidate(); }
    });
  },
  get state() { return { ...opts, mode: stage.dataset.scene, progress, story: story() }; },
};
