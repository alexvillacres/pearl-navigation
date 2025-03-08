function $n(t, e, n) {
  var s;
  if (t instanceof EventTarget)
    return [t];
  if (typeof t == "string") {
    let i = document;
    const r = (s = n == null ? void 0 : n[t]) !== null && s !== void 0 ? s : i.querySelectorAll(t);
    return r ? Array.from(r) : [];
  }
  return Array.from(t);
}
const L = /* @__NO_SIDE_EFFECTS__ */ (t) => t;
let le = L, _ = L;
process.env.NODE_ENV !== "production" && (le = (t, e) => {
  !t && typeof console < "u" && console.warn(e);
}, _ = (t, e) => {
  if (!t)
    throw new Error(e);
});
const Se = /* @__NO_SIDE_EFFECTS__ */ (t, e, n) => {
  const s = e - t;
  return s === 0 ? 1 : (n - t) / s;
};
// @__NO_SIDE_EFFECTS__
function Le(t) {
  let e;
  return () => (e === void 0 && (e = t()), e);
}
const Un = /* @__PURE__ */ Le(() => window.ScrollTimeline !== void 0);
class Wn {
  constructor(e) {
    this.stop = () => this.runAll("stop"), this.animations = e.filter(Boolean);
  }
  get finished() {
    return Promise.all(this.animations.map((e) => "finished" in e ? e.finished : e));
  }
  /**
   * TODO: Filter out cancelled or stopped animations before returning
   */
  getAll(e) {
    return this.animations[0][e];
  }
  setAll(e, n) {
    for (let s = 0; s < this.animations.length; s++)
      this.animations[s][e] = n;
  }
  attachTimeline(e, n) {
    const s = this.animations.map((i) => {
      if (Un() && i.attachTimeline)
        return i.attachTimeline(e);
      if (typeof n == "function")
        return n(i);
    });
    return () => {
      s.forEach((i, r) => {
        i && i(), this.animations[r].stop();
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(e) {
    this.setAll("time", e);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(e) {
    this.setAll("speed", e);
  }
  get startTime() {
    return this.getAll("startTime");
  }
  get duration() {
    let e = 0;
    for (let n = 0; n < this.animations.length; n++)
      e = Math.max(e, this.animations[n].duration);
    return e;
  }
  runAll(e) {
    this.animations.forEach((n) => n[e]());
  }
  flatten() {
    this.runAll("flatten");
  }
  play() {
    this.runAll("play");
  }
  pause() {
    this.runAll("pause");
  }
  cancel() {
    this.runAll("cancel");
  }
  complete() {
    this.runAll("complete");
  }
}
class kt extends Wn {
  then(e, n) {
    return Promise.all(this.animations).then(e).catch(n);
  }
}
const O = /* @__NO_SIDE_EFFECTS__ */ (t) => t * 1e3, B = /* @__NO_SIDE_EFFECTS__ */ (t) => t / 1e3, ye = 2e4;
function _e(t) {
  let e = 0;
  const n = 50;
  let s = t.next(e);
  for (; !s.done && e < ye; )
    e += n, s = t.next(e);
  return e >= ye ? 1 / 0 : e;
}
const Lt = (t, e, n = 10) => {
  let s = "";
  const i = Math.max(Math.round(e / n), 2);
  for (let r = 0; r < i; r++)
    s += t(/* @__PURE__ */ Se(0, i - 1, r)) + ", ";
  return `linear(${s.substring(0, s.length - 2)})`;
}, W = (t, e, n) => n > e ? e : n < t ? t : n;
function _t(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const Gn = 5;
function $t(t, e, n) {
  const s = Math.max(e - Gn, 0);
  return _t(n - t(s), e - s);
}
const w = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
}, ct = 1e-3;
function jn({ duration: t = w.duration, bounce: e = w.bounce, velocity: n = w.velocity, mass: s = w.mass }) {
  let i, r;
  le(t <= /* @__PURE__ */ O(w.maxDuration), "Spring duration must be 10 seconds or less");
  let o = 1 - e;
  o = W(w.minDamping, w.maxDamping, o), t = W(w.minDuration, w.maxDuration, /* @__PURE__ */ B(t)), o < 1 ? (i = (c) => {
    const u = c * o, f = u * t, h = u - n, y = De(c, o), g = Math.exp(-f);
    return ct - h / y * g;
  }, r = (c) => {
    const f = c * o * t, h = f * n + n, y = Math.pow(o, 2) * Math.pow(c, 2) * t, g = Math.exp(-f), b = De(Math.pow(c, 2), o);
    return (-i(c) + ct > 0 ? -1 : 1) * ((h - y) * g) / b;
  }) : (i = (c) => {
    const u = Math.exp(-c * t), f = (c - n) * t + 1;
    return -1e-3 + u * f;
  }, r = (c) => {
    const u = Math.exp(-c * t), f = (n - c) * (t * t);
    return u * f;
  });
  const a = 5 / t, l = qn(i, r, a);
  if (t = /* @__PURE__ */ O(t), isNaN(l))
    return {
      stiffness: w.stiffness,
      damping: w.damping,
      duration: t
    };
  {
    const c = Math.pow(l, 2) * s;
    return {
      stiffness: c,
      damping: o * 2 * Math.sqrt(s * c),
      duration: t
    };
  }
}
const zn = 12;
function qn(t, e, n) {
  let s = n;
  for (let i = 1; i < zn; i++)
    s = s - t(s) / e(s);
  return s;
}
function De(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const Yn = ["duration", "bounce"], Xn = ["stiffness", "damping", "mass"];
function ft(t, e) {
  return e.some((n) => t[n] !== void 0);
}
function Hn(t) {
  let e = {
    velocity: w.velocity,
    stiffness: w.stiffness,
    damping: w.damping,
    mass: w.mass,
    isResolvedFromDuration: !1,
    ...t
  };
  if (!ft(t, Xn) && ft(t, Yn))
    if (t.visualDuration) {
      const n = t.visualDuration, s = 2 * Math.PI / (n * 1.2), i = s * s, r = 2 * W(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(i);
      e = {
        ...e,
        mass: w.mass,
        stiffness: i,
        damping: r
      };
    } else {
      const n = jn(t);
      e = {
        ...e,
        ...n,
        mass: w.mass
      }, e.isResolvedFromDuration = !0;
    }
  return e;
}
function $e(t = w.visualDuration, e = w.bounce) {
  const n = typeof t != "object" ? {
    visualDuration: t,
    keyframes: [0, 1],
    bounce: e
  } : t;
  let { restSpeed: s, restDelta: i } = n;
  const r = n.keyframes[0], o = n.keyframes[n.keyframes.length - 1], a = { done: !1, value: r }, { stiffness: l, damping: c, mass: u, duration: f, velocity: h, isResolvedFromDuration: y } = Hn({
    ...n,
    velocity: -/* @__PURE__ */ B(n.velocity || 0)
  }), g = h || 0, b = c / (2 * Math.sqrt(l * u)), T = o - r, p = /* @__PURE__ */ B(Math.sqrt(l / u)), V = Math.abs(T) < 5;
  s || (s = V ? w.restSpeed.granular : w.restSpeed.default), i || (i = V ? w.restDelta.granular : w.restDelta.default);
  let M;
  if (b < 1) {
    const m = De(p, b);
    M = (S) => {
      const C = Math.exp(-b * p * S);
      return o - C * ((g + b * p * T) / m * Math.sin(m * S) + T * Math.cos(m * S));
    };
  } else if (b === 1)
    M = (m) => o - Math.exp(-p * m) * (T + (g + p * T) * m);
  else {
    const m = p * Math.sqrt(b * b - 1);
    M = (S) => {
      const C = Math.exp(-b * p * S), v = Math.min(m * S, 300);
      return o - C * ((g + b * p * T) * Math.sinh(v) + m * T * Math.cosh(v)) / m;
    };
  }
  const A = {
    calculatedDuration: y && f || null,
    next: (m) => {
      const S = M(m);
      if (y)
        a.done = m >= f;
      else {
        let C = 0;
        b < 1 && (C = m === 0 ? /* @__PURE__ */ O(g) : $t(M, m, S));
        const v = Math.abs(C) <= s, x = Math.abs(o - S) <= i;
        a.done = v && x;
      }
      return a.value = a.done ? o : S, a;
    },
    toString: () => {
      const m = Math.min(_e(A), ye), S = Lt((C) => A.next(m * C).value, m, 30);
      return m + "ms " + S;
    }
  };
  return A;
}
function Zn(t, e = 100, n) {
  const s = n({ ...t, keyframes: [0, e] }), i = Math.min(_e(s), ye);
  return {
    type: "keyframes",
    ease: (r) => s.next(i * r).value / e,
    duration: /* @__PURE__ */ B(i)
  };
}
function xe(t) {
  return typeof t == "function";
}
const Qn = (t, e, n) => {
  const s = e - t;
  return ((n - t) % s + s) % s + t;
}, Ut = (t) => Array.isArray(t) && typeof t[0] != "number";
function Wt(t, e) {
  return Ut(t) ? t[Qn(0, t.length, e)] : t;
}
const ue = (t, e, n) => t + (e - t) * n;
function Gt(t, e) {
  const n = t[t.length - 1];
  for (let s = 1; s <= e; s++) {
    const i = /* @__PURE__ */ Se(0, e, s);
    t.push(ue(n, 1, i));
  }
}
function jt(t) {
  const e = [0];
  return Gt(e, t.length - 1), e;
}
const D = (t) => !!(t && t.getVelocity);
function Ue(t) {
  return typeof t == "object" && !Array.isArray(t);
}
function zt(t, e, n, s) {
  return typeof t == "string" && Ue(e) ? $n(t, n, s) : t instanceof NodeList ? Array.from(t) : Array.isArray(t) ? t : [t];
}
function Jn(t, e, n) {
  return t * (e + 1);
}
function ht(t, e, n, s) {
  var i;
  return typeof e == "number" ? e : e.startsWith("-") || e.startsWith("+") ? Math.max(0, t + parseFloat(e)) : e === "<" ? n : (i = s.get(e)) !== null && i !== void 0 ? i : t;
}
function es(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function qt(t, e) {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
function ts(t, e, n) {
  for (let s = 0; s < t.length; s++) {
    const i = t[s];
    i.at > e && i.at < n && (qt(t, i), s--);
  }
}
function ns(t, e, n, s, i, r) {
  ts(t, i, r);
  for (let o = 0; o < e.length; o++)
    t.push({
      value: e[o],
      at: ue(i, r, s[o]),
      easing: Wt(n, o)
    });
}
function ss(t, e) {
  for (let n = 0; n < t.length; n++)
    t[n] = t[n] / (e + 1);
}
function is(t, e) {
  return t.at === e.at ? t.value === null ? 1 : e.value === null ? -1 : 0 : t.at - e.at;
}
const rs = "easeInOut", os = 20;
function as(t, { defaultTransition: e = {}, ...n } = {}, s, i) {
  const r = e.duration || 0.3, o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), l = {}, c = /* @__PURE__ */ new Map();
  let u = 0, f = 0, h = 0;
  for (let y = 0; y < t.length; y++) {
    const g = t[y];
    if (typeof g == "string") {
      c.set(g, f);
      continue;
    } else if (!Array.isArray(g)) {
      c.set(g.name, ht(f, g.at, u, c));
      continue;
    }
    let [b, T, p = {}] = g;
    p.at !== void 0 && (f = ht(f, p.at, u, c));
    let V = 0;
    const M = (A, m, S, C = 0, v = 0) => {
      const x = ls(A), { delay: F = 0, times: R = jt(x), type: Ae = "keyframes", repeat: Z, repeatType: Nr, repeatDelay: Kr = 0, ..._n } = m;
      let { ease: N = e.ease || "easeOut", duration: E } = m;
      const it = typeof F == "function" ? F(C, v) : F, rt = x.length, ot = xe(Ae) ? Ae : i == null ? void 0 : i[Ae];
      if (rt <= 2 && ot) {
        let Q = 100;
        if (rt === 2 && fs(x)) {
          const J = x[1] - x[0];
          Q = Math.abs(J);
        }
        const he = { ..._n };
        E !== void 0 && (he.duration = /* @__PURE__ */ O(E));
        const de = Zn(he, Q, ot);
        N = de.ease, E = de.duration;
      }
      E ?? (E = r);
      const at = f + it;
      R.length === 1 && R[0] === 0 && (R[1] = 1);
      const lt = R.length - x.length;
      if (lt > 0 && Gt(R, lt), x.length === 1 && x.unshift(null), Z) {
        _(Z < os, "Repeat count too high, must be less than 20"), E = Jn(E, Z);
        const Q = [...x], he = [...R];
        N = Array.isArray(N) ? [...N] : [N];
        const de = [...N];
        for (let J = 0; J < Z; J++) {
          x.push(...Q);
          for (let ee = 0; ee < Q.length; ee++)
            R.push(he[ee] + (J + 1)), N.push(ee === 0 ? "linear" : Wt(de, ee - 1));
        }
        ss(R, Z);
      }
      const ut = at + E;
      ns(S, x, N, R, at, ut), V = Math.max(it + E, V), h = Math.max(ut, h);
    };
    if (D(b)) {
      const A = dt(b, a);
      M(T, p, pt("default", A));
    } else {
      const A = zt(b, T, s, l), m = A.length;
      for (let S = 0; S < m; S++) {
        T = T, p = p;
        const C = A[S], v = dt(C, a);
        for (const x in T)
          M(T[x], us(p, x), pt(x, v), S, m);
      }
    }
    u = f, f += V;
  }
  return a.forEach((y, g) => {
    for (const b in y) {
      const T = y[b];
      T.sort(is);
      const p = [], V = [], M = [];
      for (let m = 0; m < T.length; m++) {
        const { at: S, value: C, easing: v } = T[m];
        p.push(C), V.push(/* @__PURE__ */ Se(0, h, S)), M.push(v || "easeOut");
      }
      V[0] !== 0 && (V.unshift(0), p.unshift(p[0]), M.unshift(rs)), V[V.length - 1] !== 1 && (V.push(1), p.push(null)), o.has(g) || o.set(g, {
        keyframes: {},
        transition: {}
      });
      const A = o.get(g);
      A.keyframes[b] = p, A.transition[b] = {
        ...e,
        duration: h,
        ease: M,
        times: V,
        ...n
      };
    }
  }), o;
}
function dt(t, e) {
  return !e.has(t) && e.set(t, {}), e.get(t);
}
function pt(t, e) {
  return e[t] || (e[t] = []), e[t];
}
function ls(t) {
  return Array.isArray(t) ? t : [t];
}
function us(t, e) {
  return t && t[e] ? {
    ...t,
    ...t[e]
  } : { ...t };
}
const cs = (t) => typeof t == "number", fs = (t) => t.every(cs), ie = /* @__PURE__ */ new WeakMap();
function Yt(t, e) {
  return t ? t[e] || t.default || t : void 0;
}
const q = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], Y = new Set(q), Xt = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...q
]), hs = (t) => Array.isArray(t), ds = (t) => hs(t) ? t[t.length - 1] || 0 : t, ps = {
  useManualTiming: !1
}, pe = [
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function ms(t, e) {
  let n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), i = !1, r = !1;
  const o = /* @__PURE__ */ new WeakSet();
  let a = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function l(u) {
    o.has(u) && (c.schedule(u), t()), u(a);
  }
  const c = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (u, f = !1, h = !1) => {
      const g = h && i ? n : s;
      return f && o.add(u), g.has(u) || g.add(u), u;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (u) => {
      s.delete(u), o.delete(u);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (u) => {
      if (a = u, i) {
        r = !0;
        return;
      }
      i = !0, [n, s] = [s, n], n.forEach(l), n.clear(), i = !1, r && (r = !1, c.process(u));
    }
  };
  return c;
}
const gs = 40;
function ys(t, e) {
  let n = !1, s = !0;
  const i = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, r = () => n = !0, o = pe.reduce((p, V) => (p[V] = ms(r), p), {}), { read: a, resolveKeyframes: l, update: c, preRender: u, render: f, postRender: h } = o, y = () => {
    const p = performance.now();
    n = !1, i.delta = s ? 1e3 / 60 : Math.max(Math.min(p - i.timestamp, gs), 1), i.timestamp = p, i.isProcessing = !0, a.process(i), l.process(i), c.process(i), u.process(i), f.process(i), h.process(i), i.isProcessing = !1, n && e && (s = !1, t(y));
  }, g = () => {
    n = !0, s = !0, i.isProcessing || t(y);
  };
  return { schedule: pe.reduce((p, V) => {
    const M = o[V];
    return p[V] = (A, m = !1, S = !1) => (n || g(), M.schedule(A, m, S)), p;
  }, {}), cancel: (p) => {
    for (let V = 0; V < pe.length; V++)
      o[pe[V]].cancel(p);
  }, state: i, steps: o };
}
const { schedule: I, cancel: Fe, state: ve } = ys(typeof requestAnimationFrame < "u" ? requestAnimationFrame : L, !0);
let ge;
function vs() {
  ge = void 0;
}
const k = {
  now: () => (ge === void 0 && k.set(ve.isProcessing || ps.useManualTiming ? ve.timestamp : performance.now()), ge),
  set: (t) => {
    ge = t, queueMicrotask(vs);
  }
};
class Ht {
  constructor() {
    this.subscriptions = [];
  }
  add(e) {
    return es(this.subscriptions, e), () => qt(this.subscriptions, e);
  }
  notify(e, n, s) {
    const i = this.subscriptions.length;
    if (i)
      if (i === 1)
        this.subscriptions[0](e, n, s);
      else
        for (let r = 0; r < i; r++) {
          const o = this.subscriptions[r];
          o && o(e, n, s);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const mt = /* @__PURE__ */ new Set();
function We(t, e, n) {
  t || mt.has(e) || (console.warn(e), mt.add(e));
}
const gt = 30, bs = (t) => !isNaN(parseFloat(t));
class Ts {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   *
   * @internal
   */
  constructor(e, n = {}) {
    this.version = "12.4.10", this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (s, i = !0) => {
      const r = k.now();
      this.updatedAt !== r && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(s), this.current !== this.prev && this.events.change && this.events.change.notify(this.current), i && this.events.renderRequest && this.events.renderRequest.notify(this.current);
    }, this.hasAnimated = !1, this.setCurrent(e), this.owner = n.owner;
  }
  setCurrent(e) {
    this.current = e, this.updatedAt = k.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = bs(this.current));
  }
  setPrevFrameValue(e = this.current) {
    this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(e) {
    return process.env.NODE_ENV !== "production" && We(!1, 'value.onChange(callback) is deprecated. Switch to value.on("change", callback).'), this.on("change", e);
  }
  on(e, n) {
    this.events[e] || (this.events[e] = new Ht());
    const s = this.events[e].add(n);
    return e === "change" ? () => {
      s(), I.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : s;
  }
  clearListeners() {
    for (const e in this.events)
      this.events[e].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   *
   * @internal
   */
  attach(e, n) {
    this.passiveEffect = e, this.stopPassiveEffect = n;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(e, n = !0) {
    !n || !this.passiveEffect ? this.updateAndNotify(e, n) : this.passiveEffect(e, this.updateAndNotify);
  }
  setWithVelocity(e, n, s) {
    this.set(n), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - s;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(e, n = !0) {
    this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, n && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const e = k.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > gt)
      return 0;
    const n = Math.min(this.updatedAt - this.prevUpdatedAt, gt);
    return _t(parseFloat(this.current) - parseFloat(this.prevFrameValue), n);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   *
   * @internal
   */
  start(e) {
    return this.stop(), new Promise((n) => {
      this.hasAnimated = !0, this.animation = e(n), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function re(t, e) {
  return new Ts(t, e);
}
function yt(t) {
  const e = [{}, {}];
  return t == null || t.values.forEach((n, s) => {
    e[0][s] = n.get(), e[1][s] = n.getVelocity();
  }), e;
}
function Zt(t, e, n, s) {
  if (typeof e == "function") {
    const [i, r] = yt(s);
    e = e(n !== void 0 ? n : t.custom, i, r);
  }
  if (typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function") {
    const [i, r] = yt(s);
    e = e(n !== void 0 ? n : t.custom, i, r);
  }
  return e;
}
function Vs(t, e, n) {
  const s = t.getProps();
  return Zt(s, e, s.custom, t);
}
function Ss(t, e, n) {
  t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, re(n));
}
function xs(t, e) {
  const n = Vs(t, e);
  let { transitionEnd: s = {}, transition: i = {}, ...r } = n || {};
  r = { ...r, ...s };
  for (const o in r) {
    const a = ds(r[o]);
    Ss(t, o, a);
  }
}
function ws(t) {
  return !!(D(t) && t.add);
}
function As(t, e) {
  const n = t.getValue("willChange");
  if (ws(n))
    return n.add(e);
}
const Ge = (t) => t.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), Ms = "framerAppearId", Cs = "data-" + Ge(Ms);
function Ps(t) {
  return t.props[Cs];
}
function vt(t, e) {
  t.timeline = e, t.onfinish = null;
}
const je = (t) => Array.isArray(t) && typeof t[0] == "number", Ds = {
  linearEasing: void 0
};
function Fs(t, e) {
  const n = /* @__PURE__ */ Le(t);
  return () => {
    var s;
    return (s = Ds[e]) !== null && s !== void 0 ? s : n();
  };
}
const be = /* @__PURE__ */ Fs(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing");
function Qt(t) {
  return !!(typeof t == "function" && be() || !t || typeof t == "string" && (t in Ee || be()) || je(t) || Array.isArray(t) && t.every(Qt));
}
const te = ([t, e, n, s]) => `cubic-bezier(${t}, ${e}, ${n}, ${s})`, Ee = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ te([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ te([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ te([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ te([0.33, 1.53, 0.69, 0.99])
};
function Jt(t, e) {
  if (t)
    return typeof t == "function" && be() ? Lt(t, e) : je(t) ? te(t) : Array.isArray(t) ? t.map((n) => Jt(n, e) || Ee.easeOut) : Ee[t];
}
const en = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t, Es = 1e-7, Rs = 12;
function Os(t, e, n, s, i) {
  let r, o, a = 0;
  do
    o = e + (n - e) / 2, r = en(o, s, i) - t, r > 0 ? n = o : e = o;
  while (Math.abs(r) > Es && ++a < Rs);
  return o;
}
function ce(t, e, n, s) {
  if (t === e && n === s)
    return L;
  const i = (r) => Os(r, 0, 1, t, n);
  return (r) => r === 0 || r === 1 ? r : en(i(r), e, s);
}
const tn = (t) => (e) => e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2, nn = (t) => (e) => 1 - t(1 - e), sn = /* @__PURE__ */ ce(0.33, 1.53, 0.69, 0.99), ze = /* @__PURE__ */ nn(sn), rn = /* @__PURE__ */ tn(ze), on = (t) => (t *= 2) < 1 ? 0.5 * ze(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))), qe = (t) => 1 - Math.sin(Math.acos(t)), Is = nn(qe), an = tn(qe), ln = (t) => /^0[^.\s]+$/u.test(t);
function Bs(t) {
  return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || ln(t) : !0;
}
const X = {
  test: (t) => typeof t == "number",
  parse: parseFloat,
  transform: (t) => t
}, oe = {
  ...X,
  transform: (t) => W(0, 1, t)
}, me = {
  ...X,
  default: 1
}, ne = (t) => Math.round(t * 1e5) / 1e5, Ye = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function Ns(t) {
  return t == null;
}
const Ks = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, Xe = (t, e) => (n) => !!(typeof n == "string" && Ks.test(n) && n.startsWith(t) || e && !Ns(n) && Object.prototype.hasOwnProperty.call(n, e)), un = (t, e, n) => (s) => {
  if (typeof s != "string")
    return s;
  const [i, r, o, a] = s.match(Ye);
  return {
    [t]: parseFloat(i),
    [e]: parseFloat(r),
    [n]: parseFloat(o),
    alpha: a !== void 0 ? parseFloat(a) : 1
  };
}, ks = (t) => W(0, 255, t), Me = {
  ...X,
  transform: (t) => Math.round(ks(t))
}, $ = {
  test: /* @__PURE__ */ Xe("rgb", "red"),
  parse: /* @__PURE__ */ un("red", "green", "blue"),
  transform: ({ red: t, green: e, blue: n, alpha: s = 1 }) => "rgba(" + Me.transform(t) + ", " + Me.transform(e) + ", " + Me.transform(n) + ", " + ne(oe.transform(s)) + ")"
};
function Ls(t) {
  let e = "", n = "", s = "", i = "";
  return t.length > 5 ? (e = t.substring(1, 3), n = t.substring(3, 5), s = t.substring(5, 7), i = t.substring(7, 9)) : (e = t.substring(1, 2), n = t.substring(2, 3), s = t.substring(3, 4), i = t.substring(4, 5), e += e, n += n, s += s, i += i), {
    red: parseInt(e, 16),
    green: parseInt(n, 16),
    blue: parseInt(s, 16),
    alpha: i ? parseInt(i, 16) / 255 : 1
  };
}
const Re = {
  test: /* @__PURE__ */ Xe("#"),
  parse: Ls,
  transform: $.transform
}, fe = (t) => ({
  test: (e) => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
  parse: parseFloat,
  transform: (e) => `${e}${t}`
}), K = /* @__PURE__ */ fe("deg"), j = /* @__PURE__ */ fe("%"), d = /* @__PURE__ */ fe("px"), _s = /* @__PURE__ */ fe("vh"), $s = /* @__PURE__ */ fe("vw"), bt = {
  ...j,
  parse: (t) => j.parse(t) / 100,
  transform: (t) => j.transform(t * 100)
}, G = {
  test: /* @__PURE__ */ Xe("hsl", "hue"),
  parse: /* @__PURE__ */ un("hue", "saturation", "lightness"),
  transform: ({ hue: t, saturation: e, lightness: n, alpha: s = 1 }) => "hsla(" + Math.round(t) + ", " + j.transform(ne(e)) + ", " + j.transform(ne(n)) + ", " + ne(oe.transform(s)) + ")"
}, P = {
  test: (t) => $.test(t) || Re.test(t) || G.test(t),
  parse: (t) => $.test(t) ? $.parse(t) : G.test(t) ? G.parse(t) : Re.parse(t),
  transform: (t) => typeof t == "string" ? t : t.hasOwnProperty("red") ? $.transform(t) : G.transform(t)
}, Us = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function Ws(t) {
  var e, n;
  return isNaN(t) && typeof t == "string" && (((e = t.match(Ye)) === null || e === void 0 ? void 0 : e.length) || 0) + (((n = t.match(Us)) === null || n === void 0 ? void 0 : n.length) || 0) > 0;
}
const cn = "number", fn = "color", Gs = "var", js = "var(", Tt = "${}", zs = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function ae(t) {
  const e = t.toString(), n = [], s = {
    color: [],
    number: [],
    var: []
  }, i = [];
  let r = 0;
  const a = e.replace(zs, (l) => (P.test(l) ? (s.color.push(r), i.push(fn), n.push(P.parse(l))) : l.startsWith(js) ? (s.var.push(r), i.push(Gs), n.push(l)) : (s.number.push(r), i.push(cn), n.push(parseFloat(l))), ++r, Tt)).split(Tt);
  return { values: n, split: a, indexes: s, types: i };
}
function hn(t) {
  return ae(t).values;
}
function dn(t) {
  const { split: e, types: n } = ae(t), s = e.length;
  return (i) => {
    let r = "";
    for (let o = 0; o < s; o++)
      if (r += e[o], i[o] !== void 0) {
        const a = n[o];
        a === cn ? r += ne(i[o]) : a === fn ? r += P.transform(i[o]) : r += i[o];
      }
    return r;
  };
}
const qs = (t) => typeof t == "number" ? 0 : t;
function Ys(t) {
  const e = hn(t);
  return dn(t)(e.map(qs));
}
const H = {
  test: Ws,
  parse: hn,
  createTransformer: dn,
  getAnimatableNone: Ys
}, Xs = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function Hs(t) {
  const [e, n] = t.slice(0, -1).split("(");
  if (e === "drop-shadow")
    return t;
  const [s] = n.match(Ye) || [];
  if (!s)
    return t;
  const i = n.replace(s, "");
  let r = Xs.has(e) ? 1 : 0;
  return s !== n && (r *= 100), e + "(" + r + i + ")";
}
const Zs = /\b([a-z-]*)\(.*?\)/gu, Oe = {
  ...H,
  getAnimatableNone: (t) => {
    const e = t.match(Zs);
    return e ? e.map(Hs).join(" ") : t;
  }
}, Qs = {
  // Border props
  borderWidth: d,
  borderTopWidth: d,
  borderRightWidth: d,
  borderBottomWidth: d,
  borderLeftWidth: d,
  borderRadius: d,
  radius: d,
  borderTopLeftRadius: d,
  borderTopRightRadius: d,
  borderBottomRightRadius: d,
  borderBottomLeftRadius: d,
  // Positioning props
  width: d,
  maxWidth: d,
  height: d,
  maxHeight: d,
  top: d,
  right: d,
  bottom: d,
  left: d,
  // Spacing props
  padding: d,
  paddingTop: d,
  paddingRight: d,
  paddingBottom: d,
  paddingLeft: d,
  margin: d,
  marginTop: d,
  marginRight: d,
  marginBottom: d,
  marginLeft: d,
  // Misc
  backgroundPositionX: d,
  backgroundPositionY: d
}, Js = {
  rotate: K,
  rotateX: K,
  rotateY: K,
  rotateZ: K,
  scale: me,
  scaleX: me,
  scaleY: me,
  scaleZ: me,
  skew: K,
  skewX: K,
  skewY: K,
  distance: d,
  translateX: d,
  translateY: d,
  translateZ: d,
  x: d,
  y: d,
  z: d,
  perspective: d,
  transformPerspective: d,
  opacity: oe,
  originX: bt,
  originY: bt,
  originZ: d
}, Vt = {
  ...X,
  transform: Math.round
}, He = {
  ...Qs,
  ...Js,
  zIndex: Vt,
  size: d,
  // SVG
  fillOpacity: oe,
  strokeOpacity: oe,
  numOctaves: Vt
}, ei = {
  ...He,
  // Color props
  color: P,
  backgroundColor: P,
  outlineColor: P,
  fill: P,
  stroke: P,
  // Border props
  borderColor: P,
  borderTopColor: P,
  borderRightColor: P,
  borderBottomColor: P,
  borderLeftColor: P,
  filter: Oe,
  WebkitFilter: Oe
}, Ze = (t) => ei[t];
function pn(t, e) {
  let n = Ze(t);
  return n !== Oe && (n = H), n.getAnimatableNone ? n.getAnimatableNone(e) : void 0;
}
const ti = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function ni(t, e, n) {
  let s = 0, i;
  for (; s < t.length && !i; ) {
    const r = t[s];
    typeof r == "string" && !ti.has(r) && ae(r).values.length && (i = t[s]), s++;
  }
  if (i && n)
    for (const r of e)
      t[r] = pn(n, i);
}
const St = (t) => t === X || t === d, xt = (t, e) => parseFloat(t.split(", ")[e]), wt = (t, e) => (n, { transform: s }) => {
  if (s === "none" || !s)
    return 0;
  const i = s.match(/^matrix3d\((.+)\)$/u);
  if (i)
    return xt(i[1], e);
  {
    const r = s.match(/^matrix\((.+)\)$/u);
    return r ? xt(r[1], t) : 0;
  }
}, si = /* @__PURE__ */ new Set(["x", "y", "z"]), ii = q.filter((t) => !si.has(t));
function ri(t) {
  const e = [];
  return ii.forEach((n) => {
    const s = t.getValue(n);
    s !== void 0 && (e.push([n, s.get()]), s.set(n.startsWith("scale") ? 1 : 0));
  }), e;
}
const z = {
  // Dimensions
  width: ({ x: t }, { paddingLeft: e = "0", paddingRight: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
  height: ({ y: t }, { paddingTop: e = "0", paddingBottom: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  // Transform
  x: wt(4, 13),
  y: wt(5, 14)
};
z.translateX = z.x;
z.translateY = z.y;
const U = /* @__PURE__ */ new Set();
let Ie = !1, Be = !1;
function mn() {
  if (Be) {
    const t = Array.from(U).filter((s) => s.needsMeasurement), e = new Set(t.map((s) => s.element)), n = /* @__PURE__ */ new Map();
    e.forEach((s) => {
      const i = ri(s);
      i.length && (n.set(s, i), s.render());
    }), t.forEach((s) => s.measureInitialState()), e.forEach((s) => {
      s.render();
      const i = n.get(s);
      i && i.forEach(([r, o]) => {
        var a;
        (a = s.getValue(r)) === null || a === void 0 || a.set(o);
      });
    }), t.forEach((s) => s.measureEndState()), t.forEach((s) => {
      s.suspendedScrollY !== void 0 && window.scrollTo(0, s.suspendedScrollY);
    });
  }
  Be = !1, Ie = !1, U.forEach((t) => t.complete()), U.clear();
}
function gn() {
  U.forEach((t) => {
    t.readKeyframes(), t.needsMeasurement && (Be = !0);
  });
}
function oi() {
  gn(), mn();
}
class Qe {
  constructor(e, n, s, i, r, o = !1) {
    this.isComplete = !1, this.isAsync = !1, this.needsMeasurement = !1, this.isScheduled = !1, this.unresolvedKeyframes = [...e], this.onComplete = n, this.name = s, this.motionValue = i, this.element = r, this.isAsync = o;
  }
  scheduleResolve() {
    this.isScheduled = !0, this.isAsync ? (U.add(this), Ie || (Ie = !0, I.read(gn), I.resolveKeyframes(mn))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, name: n, element: s, motionValue: i } = this;
    for (let r = 0; r < e.length; r++)
      if (e[r] === null)
        if (r === 0) {
          const o = i == null ? void 0 : i.get(), a = e[e.length - 1];
          if (o !== void 0)
            e[0] = o;
          else if (s && n) {
            const l = s.readValue(n, a);
            l != null && (e[0] = l);
          }
          e[0] === void 0 && (e[0] = a), i && o === void 0 && i.set(e[0]);
        } else
          e[r] = e[r - 1];
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete() {
    this.isComplete = !0, this.onComplete(this.unresolvedKeyframes, this.finalKeyframe), U.delete(this);
  }
  cancel() {
    this.isComplete || (this.isScheduled = !1, U.delete(this));
  }
  resume() {
    this.isComplete || this.scheduleResolve();
  }
}
const yn = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t), vn = (t) => (e) => typeof e == "string" && e.startsWith(t), bn = /* @__PURE__ */ vn("--"), ai = /* @__PURE__ */ vn("var(--"), Je = (t) => ai(t) ? li.test(t.split("/*")[0].trim()) : !1, li = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, ui = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function ci(t) {
  const e = ui.exec(t);
  if (!e)
    return [,];
  const [, n, s, i] = e;
  return [`--${n ?? s}`, i];
}
const fi = 4;
function Tn(t, e, n = 1) {
  _(n <= fi, `Max CSS variable fallback depth detected in property "${t}". This may indicate a circular fallback dependency.`);
  const [s, i] = ci(t);
  if (!s)
    return;
  const r = window.getComputedStyle(e).getPropertyValue(s);
  if (r) {
    const o = r.trim();
    return yn(o) ? parseFloat(o) : o;
  }
  return Je(i) ? Tn(i, e, n + 1) : i;
}
const Vn = (t) => (e) => e.test(t), hi = {
  test: (t) => t === "auto",
  parse: (t) => t
}, Sn = [X, d, j, K, $s, _s, hi], At = (t) => Sn.find(Vn(t));
class xn extends Qe {
  constructor(e, n, s, i, r) {
    super(e, n, s, i, r, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, element: n, name: s } = this;
    if (!n || !n.current)
      return;
    super.readKeyframes();
    for (let l = 0; l < e.length; l++) {
      let c = e[l];
      if (typeof c == "string" && (c = c.trim(), Je(c))) {
        const u = Tn(c, n.current);
        u !== void 0 && (e[l] = u), l === e.length - 1 && (this.finalKeyframe = c);
      }
    }
    if (this.resolveNoneKeyframes(), !Xt.has(s) || e.length !== 2)
      return;
    const [i, r] = e, o = At(i), a = At(r);
    if (o !== a)
      if (St(o) && St(a))
        for (let l = 0; l < e.length; l++) {
          const c = e[l];
          typeof c == "string" && (e[l] = parseFloat(c));
        }
      else
        this.needsMeasurement = !0;
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: e, name: n } = this, s = [];
    for (let i = 0; i < e.length; i++)
      Bs(e[i]) && s.push(i);
    s.length && ni(e, s, n);
  }
  measureInitialState() {
    const { element: e, unresolvedKeyframes: n, name: s } = this;
    if (!e || !e.current)
      return;
    s === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = z[s](e.measureViewportBox(), window.getComputedStyle(e.current)), n[0] = this.measuredOrigin;
    const i = n[n.length - 1];
    i !== void 0 && e.getValue(s, i).jump(i, !1);
  }
  measureEndState() {
    var e;
    const { element: n, name: s, unresolvedKeyframes: i } = this;
    if (!n || !n.current)
      return;
    const r = n.getValue(s);
    r && r.jump(this.measuredOrigin, !1);
    const o = i.length - 1, a = i[o];
    i[o] = z[s](n.measureViewportBox(), window.getComputedStyle(n.current)), a !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = a), !((e = this.removedTransforms) === null || e === void 0) && e.length && this.removedTransforms.forEach(([l, c]) => {
      n.getValue(l).set(c);
    }), this.resolveNoneKeyframes();
  }
}
const Mt = (t, e) => e === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && // It's animatable if we have a string
(H.test(t) || t === "0") && // And it contains numbers and/or colors
!t.startsWith("url("));
function di(t) {
  const e = t[0];
  if (t.length === 1)
    return !0;
  for (let n = 0; n < t.length; n++)
    if (t[n] !== e)
      return !0;
}
function pi(t, e, n, s) {
  const i = t[0];
  if (i === null)
    return !1;
  if (e === "display" || e === "visibility")
    return !0;
  const r = t[t.length - 1], o = Mt(i, e), a = Mt(r, e);
  return le(o === a, `You are trying to animate ${e} from "${i}" to "${r}". ${i} is not an animatable value - to enable this animation set ${i} to a value animatable to ${r} via the \`style\` property.`), !o || !a ? !1 : di(t) || (n === "spring" || xe(n)) && s;
}
const mi = (t) => t !== null;
function we(t, { repeat: e, repeatType: n = "loop" }, s) {
  const i = t.filter(mi), r = e && n !== "loop" && e % 2 === 1 ? 0 : i.length - 1;
  return !r || s === void 0 ? i[r] : s;
}
const gi = 40;
class wn {
  constructor({ autoplay: e = !0, delay: n = 0, type: s = "keyframes", repeat: i = 0, repeatDelay: r = 0, repeatType: o = "loop", ...a }) {
    this.isStopped = !1, this.hasAttemptedResolve = !1, this.createdAt = k.now(), this.options = {
      autoplay: e,
      delay: n,
      type: s,
      repeat: i,
      repeatDelay: r,
      repeatType: o,
      ...a
    }, this.updateFinishedPromise();
  }
  /**
   * This method uses the createdAt and resolvedAt to calculate the
   * animation startTime. *Ideally*, we would use the createdAt time as t=0
   * as the following frame would then be the first frame of the animation in
   * progress, which would feel snappier.
   *
   * However, if there's a delay (main thread work) between the creation of
   * the animation and the first commited frame, we prefer to use resolvedAt
   * to avoid a sudden jump into the animation.
   */
  calcStartTime() {
    return this.resolvedAt ? this.resolvedAt - this.createdAt > gi ? this.resolvedAt : this.createdAt : this.createdAt;
  }
  /**
   * A getter for resolved data. If keyframes are not yet resolved, accessing
   * this.resolved will synchronously flush all pending keyframe resolvers.
   * This is a deoptimisation, but at its worst still batches read/writes.
   */
  get resolved() {
    return !this._resolved && !this.hasAttemptedResolve && oi(), this._resolved;
  }
  /**
   * A method to be called when the keyframes resolver completes. This method
   * will check if its possible to run the animation and, if not, skip it.
   * Otherwise, it will call initPlayback on the implementing class.
   */
  onKeyframesResolved(e, n) {
    this.resolvedAt = k.now(), this.hasAttemptedResolve = !0;
    const { name: s, type: i, velocity: r, delay: o, onComplete: a, onUpdate: l, isGenerator: c } = this.options;
    if (!c && !pi(e, s, i, r))
      if (o)
        this.options.duration = 0;
      else {
        l && l(we(e, this.options, n)), a && a(), this.resolveFinishedPromise();
        return;
      }
    const u = this.initPlayback(e, n);
    u !== !1 && (this._resolved = {
      keyframes: e,
      finalKeyframe: n,
      ...u
    }, this.onPostResolved());
  }
  onPostResolved() {
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(e, n) {
    return this.currentFinishedPromise.then(e, n);
  }
  flatten() {
    this.options.type = "keyframes", this.options.ease = "linear";
  }
  updateFinishedPromise() {
    this.currentFinishedPromise = new Promise((e) => {
      this.resolveFinishedPromise = e;
    });
  }
}
function Ce(t, e, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t;
}
function yi({ hue: t, saturation: e, lightness: n, alpha: s }) {
  t /= 360, e /= 100, n /= 100;
  let i = 0, r = 0, o = 0;
  if (!e)
    i = r = o = n;
  else {
    const a = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - a;
    i = Ce(l, a, t + 1 / 3), r = Ce(l, a, t), o = Ce(l, a, t - 1 / 3);
  }
  return {
    red: Math.round(i * 255),
    green: Math.round(r * 255),
    blue: Math.round(o * 255),
    alpha: s
  };
}
function Te(t, e) {
  return (n) => n > 0 ? e : t;
}
const Pe = (t, e, n) => {
  const s = t * t, i = n * (e * e - s) + s;
  return i < 0 ? 0 : Math.sqrt(i);
}, vi = [Re, $, G], bi = (t) => vi.find((e) => e.test(t));
function Ct(t) {
  const e = bi(t);
  if (le(!!e, `'${t}' is not an animatable color. Use the equivalent color code instead.`), !e)
    return !1;
  let n = e.parse(t);
  return e === G && (n = yi(n)), n;
}
const Pt = (t, e) => {
  const n = Ct(t), s = Ct(e);
  if (!n || !s)
    return Te(t, e);
  const i = { ...n };
  return (r) => (i.red = Pe(n.red, s.red, r), i.green = Pe(n.green, s.green, r), i.blue = Pe(n.blue, s.blue, r), i.alpha = ue(n.alpha, s.alpha, r), $.transform(i));
}, Ti = (t, e) => (n) => e(t(n)), et = (...t) => t.reduce(Ti), Ne = /* @__PURE__ */ new Set(["none", "hidden"]);
function Vi(t, e) {
  return Ne.has(t) ? (n) => n <= 0 ? t : e : (n) => n >= 1 ? e : t;
}
function Si(t, e) {
  return (n) => ue(t, e, n);
}
function tt(t) {
  return typeof t == "number" ? Si : typeof t == "string" ? Je(t) ? Te : P.test(t) ? Pt : Ai : Array.isArray(t) ? An : typeof t == "object" ? P.test(t) ? Pt : xi : Te;
}
function An(t, e) {
  const n = [...t], s = n.length, i = t.map((r, o) => tt(r)(r, e[o]));
  return (r) => {
    for (let o = 0; o < s; o++)
      n[o] = i[o](r);
    return n;
  };
}
function xi(t, e) {
  const n = { ...t, ...e }, s = {};
  for (const i in n)
    t[i] !== void 0 && e[i] !== void 0 && (s[i] = tt(t[i])(t[i], e[i]));
  return (i) => {
    for (const r in s)
      n[r] = s[r](i);
    return n;
  };
}
function wi(t, e) {
  var n;
  const s = [], i = { color: 0, var: 0, number: 0 };
  for (let r = 0; r < e.values.length; r++) {
    const o = e.types[r], a = t.indexes[o][i[o]], l = (n = t.values[a]) !== null && n !== void 0 ? n : 0;
    s[r] = l, i[o]++;
  }
  return s;
}
const Ai = (t, e) => {
  const n = H.createTransformer(e), s = ae(t), i = ae(e);
  return s.indexes.var.length === i.indexes.var.length && s.indexes.color.length === i.indexes.color.length && s.indexes.number.length >= i.indexes.number.length ? Ne.has(t) && !i.values.length || Ne.has(e) && !s.values.length ? Vi(t, e) : et(An(wi(s, i), i.values), n) : (le(!0, `Complex values '${t}' and '${e}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`), Te(t, e));
};
function Mn(t, e, n) {
  return typeof t == "number" && typeof e == "number" && typeof n == "number" ? ue(t, e, n) : tt(t)(t, e);
}
function Dt({ keyframes: t, velocity: e = 0, power: n = 0.8, timeConstant: s = 325, bounceDamping: i = 10, bounceStiffness: r = 500, modifyTarget: o, min: a, max: l, restDelta: c = 0.5, restSpeed: u }) {
  const f = t[0], h = {
    done: !1,
    value: f
  }, y = (v) => a !== void 0 && v < a || l !== void 0 && v > l, g = (v) => a === void 0 ? l : l === void 0 || Math.abs(a - v) < Math.abs(l - v) ? a : l;
  let b = n * e;
  const T = f + b, p = o === void 0 ? T : o(T);
  p !== T && (b = p - f);
  const V = (v) => -b * Math.exp(-v / s), M = (v) => p + V(v), A = (v) => {
    const x = V(v), F = M(v);
    h.done = Math.abs(x) <= c, h.value = h.done ? p : F;
  };
  let m, S;
  const C = (v) => {
    y(h.value) && (m = v, S = $e({
      keyframes: [h.value, g(h.value)],
      velocity: $t(M, v, h.value),
      // TODO: This should be passing * 1000
      damping: i,
      stiffness: r,
      restDelta: c,
      restSpeed: u
    }));
  };
  return C(0), {
    calculatedDuration: null,
    next: (v) => {
      let x = !1;
      return !S && m === void 0 && (x = !0, A(v), C(v)), m !== void 0 && v >= m ? S.next(v - m) : (!x && A(v), h);
    }
  };
}
const Mi = /* @__PURE__ */ ce(0.42, 0, 1, 1), Ci = /* @__PURE__ */ ce(0, 0, 0.58, 1), Cn = /* @__PURE__ */ ce(0.42, 0, 0.58, 1), Ft = {
  linear: L,
  easeIn: Mi,
  easeInOut: Cn,
  easeOut: Ci,
  circIn: qe,
  circInOut: an,
  circOut: Is,
  backIn: ze,
  backInOut: rn,
  backOut: sn,
  anticipate: on
}, Et = (t) => {
  if (je(t)) {
    _(t.length === 4, "Cubic bezier arrays must contain four numerical values.");
    const [e, n, s, i] = t;
    return ce(e, n, s, i);
  } else if (typeof t == "string")
    return _(Ft[t] !== void 0, `Invalid easing type '${t}'`), Ft[t];
  return t;
};
function Pi(t, e, n) {
  const s = [], i = n || Mn, r = t.length - 1;
  for (let o = 0; o < r; o++) {
    let a = i(t[o], t[o + 1]);
    if (e) {
      const l = Array.isArray(e) ? e[o] || L : e;
      a = et(l, a);
    }
    s.push(a);
  }
  return s;
}
function Di(t, e, { clamp: n = !0, ease: s, mixer: i } = {}) {
  const r = t.length;
  if (_(r === e.length, "Both input and output ranges must be the same length"), r === 1)
    return () => e[0];
  if (r === 2 && e[0] === e[1])
    return () => e[1];
  const o = t[0] === t[1];
  t[0] > t[r - 1] && (t = [...t].reverse(), e = [...e].reverse());
  const a = Pi(e, s, i), l = a.length, c = (u) => {
    if (o && u < t[0])
      return e[0];
    let f = 0;
    if (l > 1)
      for (; f < t.length - 2 && !(u < t[f + 1]); f++)
        ;
    const h = /* @__PURE__ */ Se(t[f], t[f + 1], u);
    return a[f](h);
  };
  return n ? (u) => c(W(t[0], t[r - 1], u)) : c;
}
function Fi(t, e) {
  return t.map((n) => n * e);
}
function Ei(t, e) {
  return t.map(() => e || Cn).splice(0, t.length - 1);
}
function se({ duration: t = 300, keyframes: e, times: n, ease: s = "easeInOut" }) {
  const i = Ut(s) ? s.map(Et) : Et(s), r = {
    done: !1,
    value: e[0]
  }, o = Fi(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    n && n.length === e.length ? n : jt(e),
    t
  ), a = Di(o, e, {
    ease: Array.isArray(i) ? i : Ei(e, i)
  });
  return {
    calculatedDuration: t,
    next: (l) => (r.value = a(l), r.done = l >= t, r)
  };
}
const Ri = (t) => {
  const e = ({ timestamp: n }) => t(n);
  return {
    start: () => I.update(e, !0),
    stop: () => Fe(e),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => ve.isProcessing ? ve.timestamp : k.now()
  };
}, Oi = {
  decay: Dt,
  inertia: Dt,
  tween: se,
  keyframes: se,
  spring: $e
}, Ii = (t) => t / 100;
class nt extends wn {
  constructor(e) {
    super(e), this.holdTime = null, this.cancelTime = null, this.currentTime = 0, this.playbackSpeed = 1, this.pendingPlayState = "running", this.startTime = null, this.state = "idle", this.stop = () => {
      if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
        return;
      this.teardown();
      const { onStop: l } = this.options;
      l && l();
    };
    const { name: n, motionValue: s, element: i, keyframes: r } = this.options, o = (i == null ? void 0 : i.KeyframeResolver) || Qe, a = (l, c) => this.onKeyframesResolved(l, c);
    this.resolver = new o(r, a, n, s, i), this.resolver.scheduleResolve();
  }
  flatten() {
    super.flatten(), this._resolved && Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
  }
  initPlayback(e) {
    const { type: n = "keyframes", repeat: s = 0, repeatDelay: i = 0, repeatType: r, velocity: o = 0 } = this.options, a = xe(n) ? n : Oi[n] || se;
    let l, c;
    process.env.NODE_ENV !== "production" && a !== se && _(e.length <= 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${e}`), a !== se && typeof e[0] != "number" && (l = et(Ii, Mn(e[0], e[1])), e = [0, 100]);
    const u = a({ ...this.options, keyframes: e });
    r === "mirror" && (c = a({
      ...this.options,
      keyframes: [...e].reverse(),
      velocity: -o
    })), u.calculatedDuration === null && (u.calculatedDuration = _e(u));
    const { calculatedDuration: f } = u, h = f + i, y = h * (s + 1) - i;
    return {
      generator: u,
      mirroredGenerator: c,
      mapPercentToKeyframes: l,
      calculatedDuration: f,
      resolvedDuration: h,
      totalDuration: y
    };
  }
  onPostResolved() {
    const { autoplay: e = !0 } = this.options;
    this.play(), this.pendingPlayState === "paused" || !e ? this.pause() : this.state = this.pendingPlayState;
  }
  tick(e, n = !1) {
    const { resolved: s } = this;
    if (!s) {
      const { keyframes: v } = this.options;
      return { done: !0, value: v[v.length - 1] };
    }
    const { finalKeyframe: i, generator: r, mirroredGenerator: o, mapPercentToKeyframes: a, keyframes: l, calculatedDuration: c, totalDuration: u, resolvedDuration: f } = s;
    if (this.startTime === null)
      return r.next(0);
    const { delay: h, repeat: y, repeatType: g, repeatDelay: b, onUpdate: T } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - u / this.speed, this.startTime)), n ? this.currentTime = e : this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = Math.round(e - this.startTime) * this.speed;
    const p = this.currentTime - h * (this.speed >= 0 ? 1 : -1), V = this.speed >= 0 ? p < 0 : p > u;
    this.currentTime = Math.max(p, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = u);
    let M = this.currentTime, A = r;
    if (y) {
      const v = Math.min(this.currentTime, u) / f;
      let x = Math.floor(v), F = v % 1;
      !F && v >= 1 && (F = 1), F === 1 && x--, x = Math.min(x, y + 1), !!(x % 2) && (g === "reverse" ? (F = 1 - F, b && (F -= b / f)) : g === "mirror" && (A = o)), M = W(0, 1, F) * f;
    }
    const m = V ? { done: !1, value: l[0] } : A.next(M);
    a && (m.value = a(m.value));
    let { done: S } = m;
    !V && c !== null && (S = this.speed >= 0 ? this.currentTime >= u : this.currentTime <= 0);
    const C = this.holdTime === null && (this.state === "finished" || this.state === "running" && S);
    return C && i !== void 0 && (m.value = we(l, this.options, i)), T && T(m.value), C && this.finish(), m;
  }
  get duration() {
    const { resolved: e } = this;
    return e ? /* @__PURE__ */ B(e.calculatedDuration) : 0;
  }
  get time() {
    return /* @__PURE__ */ B(this.currentTime);
  }
  set time(e) {
    e = /* @__PURE__ */ O(e), this.currentTime = e, this.holdTime !== null || this.speed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.speed);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(e) {
    const n = this.playbackSpeed !== e;
    this.playbackSpeed = e, n && (this.time = /* @__PURE__ */ B(this.currentTime));
  }
  play() {
    if (this.resolver.isScheduled || this.resolver.resume(), !this._resolved) {
      this.pendingPlayState = "running";
      return;
    }
    if (this.isStopped)
      return;
    const { driver: e = Ri, onPlay: n, startTime: s } = this.options;
    this.driver || (this.driver = e((r) => this.tick(r))), n && n();
    const i = this.driver.now();
    this.holdTime !== null ? this.startTime = i - this.holdTime : this.startTime ? this.state === "finished" && (this.startTime = i) : this.startTime = s ?? this.calcStartTime(), this.state === "finished" && this.updateFinishedPromise(), this.cancelTime = this.startTime, this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    var e;
    if (!this._resolved) {
      this.pendingPlayState = "paused";
      return;
    }
    this.state = "paused", this.holdTime = (e = this.currentTime) !== null && e !== void 0 ? e : 0;
  }
  complete() {
    this.state !== "running" && this.play(), this.pendingPlayState = this.state = "finished", this.holdTime = null;
  }
  finish() {
    this.teardown(), this.state = "finished";
    const { onComplete: e } = this.options;
    e && e();
  }
  cancel() {
    this.cancelTime !== null && this.tick(this.cancelTime), this.teardown(), this.updateFinishedPromise();
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.resolveFinishedPromise(), this.updateFinishedPromise(), this.startTime = this.cancelTime = null, this.resolver.cancel();
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(e) {
    return this.startTime = 0, this.tick(e, !0);
  }
}
const Bi = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]);
function Ni(t, e, n, { delay: s = 0, duration: i = 300, repeat: r = 0, repeatType: o = "loop", ease: a = "easeInOut", times: l } = {}) {
  const c = { [e]: n };
  l && (c.offset = l);
  const u = Jt(a, i);
  return Array.isArray(u) && (c.easing = u), t.animate(c, {
    delay: s,
    duration: i,
    easing: Array.isArray(u) ? "linear" : u,
    fill: "both",
    iterations: r + 1,
    direction: o === "reverse" ? "alternate" : "normal"
  });
}
const Ki = /* @__PURE__ */ Le(() => Object.hasOwnProperty.call(Element.prototype, "animate")), Ve = 10, ki = 2e4;
function Li(t) {
  return xe(t.type) || t.type === "spring" || !Qt(t.ease);
}
function _i(t, e) {
  const n = new nt({
    ...e,
    keyframes: t,
    repeat: 0,
    delay: 0,
    isGenerator: !0
  });
  let s = { done: !1, value: t[0] };
  const i = [];
  let r = 0;
  for (; !s.done && r < ki; )
    s = n.sample(r), i.push(s.value), r += Ve;
  return {
    times: void 0,
    keyframes: i,
    duration: r - Ve,
    ease: "linear"
  };
}
const Pn = {
  anticipate: on,
  backInOut: rn,
  circInOut: an
};
function $i(t) {
  return t in Pn;
}
class Rt extends wn {
  constructor(e) {
    super(e);
    const { name: n, motionValue: s, element: i, keyframes: r } = this.options;
    this.resolver = new xn(r, (o, a) => this.onKeyframesResolved(o, a), n, s, i), this.resolver.scheduleResolve();
  }
  initPlayback(e, n) {
    let { duration: s = 300, times: i, ease: r, type: o, motionValue: a, name: l, startTime: c } = this.options;
    if (!a.owner || !a.owner.current)
      return !1;
    if (typeof r == "string" && be() && $i(r) && (r = Pn[r]), Li(this.options)) {
      const { onComplete: f, onUpdate: h, motionValue: y, element: g, ...b } = this.options, T = _i(e, b);
      e = T.keyframes, e.length === 1 && (e[1] = e[0]), s = T.duration, i = T.times, r = T.ease, o = "keyframes";
    }
    const u = Ni(a.owner.current, l, e, { ...this.options, duration: s, times: i, ease: r });
    return u.startTime = c ?? this.calcStartTime(), this.pendingTimeline ? (vt(u, this.pendingTimeline), this.pendingTimeline = void 0) : u.onfinish = () => {
      const { onComplete: f } = this.options;
      a.set(we(e, this.options, n)), f && f(), this.cancel(), this.resolveFinishedPromise();
    }, {
      animation: u,
      duration: s,
      times: i,
      type: o,
      ease: r,
      keyframes: e
    };
  }
  get duration() {
    const { resolved: e } = this;
    if (!e)
      return 0;
    const { duration: n } = e;
    return /* @__PURE__ */ B(n);
  }
  get time() {
    const { resolved: e } = this;
    if (!e)
      return 0;
    const { animation: n } = e;
    return /* @__PURE__ */ B(n.currentTime || 0);
  }
  set time(e) {
    const { resolved: n } = this;
    if (!n)
      return;
    const { animation: s } = n;
    s.currentTime = /* @__PURE__ */ O(e);
  }
  get speed() {
    const { resolved: e } = this;
    if (!e)
      return 1;
    const { animation: n } = e;
    return n.playbackRate;
  }
  set speed(e) {
    const { resolved: n } = this;
    if (!n)
      return;
    const { animation: s } = n;
    s.playbackRate = e;
  }
  get state() {
    const { resolved: e } = this;
    if (!e)
      return "idle";
    const { animation: n } = e;
    return n.playState;
  }
  get startTime() {
    const { resolved: e } = this;
    if (!e)
      return null;
    const { animation: n } = e;
    return n.startTime;
  }
  /**
   * Replace the default DocumentTimeline with another AnimationTimeline.
   * Currently used for scroll animations.
   */
  attachTimeline(e) {
    if (!this._resolved)
      this.pendingTimeline = e;
    else {
      const { resolved: n } = this;
      if (!n)
        return L;
      const { animation: s } = n;
      vt(s, e);
    }
    return L;
  }
  play() {
    if (this.isStopped)
      return;
    const { resolved: e } = this;
    if (!e)
      return;
    const { animation: n } = e;
    n.playState === "finished" && this.updateFinishedPromise(), n.play();
  }
  pause() {
    const { resolved: e } = this;
    if (!e)
      return;
    const { animation: n } = e;
    n.pause();
  }
  stop() {
    if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
      return;
    this.resolveFinishedPromise(), this.updateFinishedPromise();
    const { resolved: e } = this;
    if (!e)
      return;
    const { animation: n, keyframes: s, duration: i, type: r, ease: o, times: a } = e;
    if (n.playState === "idle" || n.playState === "finished")
      return;
    if (this.time) {
      const { motionValue: c, onUpdate: u, onComplete: f, element: h, ...y } = this.options, g = new nt({
        ...y,
        keyframes: s,
        duration: i,
        type: r,
        ease: o,
        times: a,
        isGenerator: !0
      }), b = /* @__PURE__ */ O(this.time);
      c.setWithVelocity(g.sample(b - Ve).value, g.sample(b).value, Ve);
    }
    const { onStop: l } = this.options;
    l && l(), this.cancel();
  }
  complete() {
    const { resolved: e } = this;
    e && e.animation.finish();
  }
  cancel() {
    const { resolved: e } = this;
    e && e.animation.cancel();
  }
  static supports(e) {
    const { motionValue: n, name: s, repeatDelay: i, repeatType: r, damping: o, type: a } = e;
    if (!n || !n.owner || !(n.owner.current instanceof HTMLElement))
      return !1;
    const { onUpdate: l, transformTemplate: c } = n.owner.getProps();
    return Ki() && s && Bi.has(s) && /**
     * If we're outputting values to onUpdate then we can't use WAAPI as there's
     * no way to read the value from WAAPI every frame.
     */
    !l && !c && !i && r !== "mirror" && o !== 0 && a !== "inertia";
  }
}
const Ui = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, Wi = (t) => ({
  type: "spring",
  stiffness: 550,
  damping: t === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), Gi = {
  type: "keyframes",
  duration: 0.8
}, ji = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, zi = (t, { keyframes: e }) => e.length > 2 ? Gi : Y.has(t) ? t.startsWith("scale") ? Wi(e[1]) : Ui : ji;
function qi({ when: t, delay: e, delayChildren: n, staggerChildren: s, staggerDirection: i, repeat: r, repeatType: o, repeatDelay: a, from: l, elapsed: c, ...u }) {
  return !!Object.keys(u).length;
}
const Dn = (t, e, n, s = {}, i, r) => (o) => {
  const a = Yt(s, t) || {}, l = a.delay || s.delay || 0;
  let { elapsed: c = 0 } = s;
  c = c - /* @__PURE__ */ O(l);
  let u = {
    keyframes: Array.isArray(n) ? n : [null, n],
    ease: "easeOut",
    velocity: e.getVelocity(),
    ...a,
    delay: -c,
    onUpdate: (h) => {
      e.set(h), a.onUpdate && a.onUpdate(h);
    },
    onComplete: () => {
      o(), a.onComplete && a.onComplete();
    },
    name: t,
    motionValue: e,
    element: r ? void 0 : i
  };
  qi(a) || (u = {
    ...u,
    ...zi(t, u)
  }), u.duration && (u.duration = /* @__PURE__ */ O(u.duration)), u.repeatDelay && (u.repeatDelay = /* @__PURE__ */ O(u.repeatDelay)), u.from !== void 0 && (u.keyframes[0] = u.from);
  let f = !1;
  if ((u.type === !1 || u.duration === 0 && !u.repeatDelay) && (u.duration = 0, u.delay === 0 && (f = !0)), f && !r && e.get() !== void 0) {
    const h = we(u.keyframes, a);
    if (h !== void 0)
      return I.update(() => {
        u.onUpdate(h), u.onComplete();
      }), new kt([]);
  }
  return !r && Rt.supports(u) ? new Rt(u) : new nt(u);
};
function Yi({ protectedKeys: t, needsAnimating: e }, n) {
  const s = t.hasOwnProperty(n) && e[n] !== !0;
  return e[n] = !1, s;
}
function Xi(t, e, { delay: n = 0, transitionOverride: s, type: i } = {}) {
  var r;
  let { transition: o = t.getDefaultTransition(), transitionEnd: a, ...l } = e;
  s && (o = s);
  const c = [], u = i && t.animationState && t.animationState.getState()[i];
  for (const f in l) {
    const h = t.getValue(f, (r = t.latestValues[f]) !== null && r !== void 0 ? r : null), y = l[f];
    if (y === void 0 || u && Yi(u, f))
      continue;
    const g = {
      delay: n,
      ...Yt(o || {}, f)
    };
    let b = !1;
    if (window.MotionHandoffAnimation) {
      const p = Ps(t);
      if (p) {
        const V = window.MotionHandoffAnimation(p, f, I);
        V !== null && (g.startTime = V, b = !0);
      }
    }
    As(t, f), h.start(Dn(f, h, y, t.shouldReduceMotion && Xt.has(f) ? { type: !1 } : g, t, b));
    const T = h.animation;
    T && c.push(T);
  }
  return a && Promise.all(c).then(() => {
    I.update(() => {
      a && xs(t, a);
    });
  }), c;
}
function Hi(t) {
  return t instanceof SVGElement && t.tagName !== "svg";
}
const Ot = () => ({ min: 0, max: 0 }), st = () => ({
  x: Ot(),
  y: Ot()
}), It = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
}, Ke = {};
for (const t in It)
  Ke[t] = {
    isEnabled: (e) => It[t].some((n) => !!e[n])
  };
const Zi = typeof window < "u", ke = { current: null }, Fn = { current: !1 };
function Qi() {
  if (Fn.current = !0, !!Zi)
    if (window.matchMedia) {
      const t = window.matchMedia("(prefers-reduced-motion)"), e = () => ke.current = t.matches;
      t.addListener(e), e();
    } else
      ke.current = !1;
}
const Ji = [...Sn, P, H], er = (t) => Ji.find(Vn(t));
function tr(t) {
  return t !== null && typeof t == "object" && typeof t.start == "function";
}
function nr(t) {
  return typeof t == "string" || Array.isArray(t);
}
const sr = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], ir = ["initial", ...sr];
function En(t) {
  return tr(t.animate) || ir.some((e) => nr(t[e]));
}
function rr(t) {
  return !!(En(t) || t.variants);
}
function or(t, e, n) {
  for (const s in e) {
    const i = e[s], r = n[s];
    if (D(i))
      t.addValue(s, i), process.env.NODE_ENV === "development" && We(i.version === "12.4.10", `Attempting to mix Motion versions ${i.version} with 12.4.10 may not work as expected.`);
    else if (D(r))
      t.addValue(s, re(i, { owner: t }));
    else if (r !== i)
      if (t.hasValue(s)) {
        const o = t.getValue(s);
        o.liveStyle === !0 ? o.jump(i) : o.hasAnimated || o.set(i);
      } else {
        const o = t.getStaticValue(s);
        t.addValue(s, re(o !== void 0 ? o : i, { owner: t }));
      }
  }
  for (const s in n)
    e[s] === void 0 && t.removeValue(s);
  return e;
}
const Bt = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class Rn {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(e, n, s) {
    return {};
  }
  constructor({ parent: e, props: n, presenceContext: s, reducedMotionConfig: i, blockInitialAnimation: r, visualState: o }, a = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Qe, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const y = k.now();
      this.renderScheduledAt < y && (this.renderScheduledAt = y, I.render(this.render, !1, !0));
    };
    const { latestValues: l, renderState: c, onUpdate: u } = o;
    this.onUpdate = u, this.latestValues = l, this.baseTarget = { ...l }, this.initialValues = n.initial ? { ...l } : {}, this.renderState = c, this.parent = e, this.props = n, this.presenceContext = s, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = i, this.options = a, this.blockInitialAnimation = !!r, this.isControllingVariants = En(n), this.isVariantNode = rr(n), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
    const { willChange: f, ...h } = this.scrapeMotionValuesFromProps(n, {}, this);
    for (const y in h) {
      const g = h[y];
      l[y] !== void 0 && D(g) && g.set(l[y], !1);
    }
  }
  mount(e) {
    this.current = e, ie.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, s) => this.bindToMotionValue(s, n)), Fn.current || Qi(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : ke.current, process.env.NODE_ENV !== "production" && We(this.shouldReduceMotion !== !0, "You have Reduced Motion enabled on your device. Animations may not appear as expected."), this.parent && this.parent.children.add(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    this.projection && this.projection.unmount(), Fe(this.notifyUpdate), Fe(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent && this.parent.children.delete(this);
    for (const e in this.events)
      this.events[e].clear();
    for (const e in this.features) {
      const n = this.features[e];
      n && (n.unmount(), n.isMounted = !1);
    }
    this.current = null;
  }
  bindToMotionValue(e, n) {
    this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)();
    const s = Y.has(e);
    s && this.onBindTransform && this.onBindTransform();
    const i = n.on("change", (a) => {
      this.latestValues[e] = a, this.props.onUpdate && I.preRender(this.notifyUpdate), s && this.projection && (this.projection.isTransformDirty = !0);
    }), r = n.on("renderRequest", this.scheduleRender);
    let o;
    window.MotionCheckAppearSync && (o = window.MotionCheckAppearSync(this, e, n)), this.valueSubscriptions.set(e, () => {
      i(), r(), o && o(), n.owner && n.stop();
    });
  }
  sortNodePosition(e) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
  }
  updateFeatures() {
    let e = "animation";
    for (e in Ke) {
      const n = Ke[e];
      if (!n)
        continue;
      const { isEnabled: s, Feature: i } = n;
      if (!this.features[e] && i && s(this.props) && (this.features[e] = new i(this)), this.features[e]) {
        const r = this.features[e];
        r.isMounted ? r.update() : (r.mount(), r.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : st();
  }
  getStaticValue(e) {
    return this.latestValues[e];
  }
  setStaticValue(e, n) {
    this.latestValues[e] = n;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(e, n) {
    (e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = n;
    for (let s = 0; s < Bt.length; s++) {
      const i = Bt[s];
      this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
      const r = "on" + i, o = e[r];
      o && (this.propEventSubscriptions[i] = this.on(i, o));
    }
    this.prevMotionValues = or(this, this.scrapeMotionValuesFromProps(e, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue(), this.onUpdate && this.onUpdate(this);
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(e) {
    return this.props.variants ? this.props.variants[e] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(e) {
    const n = this.getClosestVariantNode();
    if (n)
      return n.variantChildren && n.variantChildren.add(e), () => n.variantChildren.delete(e);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(e, n) {
    const s = this.values.get(e);
    n !== s && (s && this.removeValue(e), this.bindToMotionValue(e, n), this.values.set(e, n), this.latestValues[e] = n.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(e) {
    this.values.delete(e);
    const n = this.valueSubscriptions.get(e);
    n && (n(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(e) {
    return this.values.has(e);
  }
  getValue(e, n) {
    if (this.props.values && this.props.values[e])
      return this.props.values[e];
    let s = this.values.get(e);
    return s === void 0 && n !== void 0 && (s = re(n === null ? void 0 : n, { owner: this }), this.addValue(e, s)), s;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(e, n) {
    var s;
    let i = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : (s = this.getBaseTargetFromProps(this.props, e)) !== null && s !== void 0 ? s : this.readValueFromInstance(this.current, e, this.options);
    return i != null && (typeof i == "string" && (yn(i) || ln(i)) ? i = parseFloat(i) : !er(i) && H.test(n) && (i = pn(e, n)), this.setBaseTarget(e, D(i) ? i.get() : i)), D(i) ? i.get() : i;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(e, n) {
    this.baseTarget[e] = n;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(e) {
    var n;
    const { initial: s } = this.props;
    let i;
    if (typeof s == "string" || typeof s == "object") {
      const o = Zt(this.props, s, (n = this.presenceContext) === null || n === void 0 ? void 0 : n.custom);
      o && (i = o[e]);
    }
    if (s && i !== void 0)
      return i;
    const r = this.getBaseTargetFromProps(this.props, e);
    return r !== void 0 && !D(r) ? r : this.initialValues[e] !== void 0 && i === void 0 ? void 0 : this.baseTarget[e];
  }
  on(e, n) {
    return this.events[e] || (this.events[e] = new Ht()), this.events[e].add(n);
  }
  notify(e, ...n) {
    this.events[e] && this.events[e].notify(...n);
  }
}
class On extends Rn {
  constructor() {
    super(...arguments), this.KeyframeResolver = xn;
  }
  sortInstanceNodePosition(e, n) {
    return e.compareDocumentPosition(n) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(e, n) {
    return e.style ? e.style[n] : void 0;
  }
  removeValueFromRenderState(e, { vars: n, style: s }) {
    delete n[e], delete s[e];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: e } = this.props;
    D(e) && (this.childSubscription = e.on("change", (n) => {
      this.current && (this.current.textContent = `${n}`);
    }));
  }
}
const In = (t, e) => e && typeof t == "number" ? e.transform(t) : t, ar = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, lr = q.length;
function ur(t, e, n) {
  let s = "", i = !0;
  for (let r = 0; r < lr; r++) {
    const o = q[r], a = t[o];
    if (a === void 0)
      continue;
    let l = !0;
    if (typeof a == "number" ? l = a === (o.startsWith("scale") ? 1 : 0) : l = parseFloat(a) === 0, !l || n) {
      const c = In(a, He[o]);
      if (!l) {
        i = !1;
        const u = ar[o] || o;
        s += `${u}(${c}) `;
      }
      n && (e[o] = c);
    }
  }
  return s = s.trim(), n ? s = n(e, i ? "" : s) : i && (s = "none"), s;
}
function Bn(t, e, n) {
  const { style: s, vars: i, transformOrigin: r } = t;
  let o = !1, a = !1;
  for (const l in e) {
    const c = e[l];
    if (Y.has(l)) {
      o = !0;
      continue;
    } else if (bn(l)) {
      i[l] = c;
      continue;
    } else {
      const u = In(c, He[l]);
      l.startsWith("origin") ? (a = !0, r[l] = u) : s[l] = u;
    }
  }
  if (e.transform || (o || n ? s.transform = ur(e, t.transform, n) : s.transform && (s.transform = "none")), a) {
    const { originX: l = "50%", originY: c = "50%", originZ: u = 0 } = r;
    s.transformOrigin = `${l} ${c} ${u}`;
  }
}
const cr = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, fr = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function hr(t, e, n = 1, s = 0, i = !0) {
  t.pathLength = 1;
  const r = i ? cr : fr;
  t[r.offset] = d.transform(-s);
  const o = d.transform(e), a = d.transform(n);
  t[r.array] = `${o} ${a}`;
}
function Nt(t, e, n) {
  return typeof t == "string" ? t : d.transform(e + n * t);
}
function dr(t, e, n) {
  const s = Nt(e, t.x, t.width), i = Nt(n, t.y, t.height);
  return `${s} ${i}`;
}
function pr(t, {
  attrX: e,
  attrY: n,
  attrScale: s,
  originX: i,
  originY: r,
  pathLength: o,
  pathSpacing: a = 1,
  pathOffset: l = 0,
  // This is object creation, which we try to avoid per-frame.
  ...c
}, u, f) {
  if (Bn(t, c, f), u) {
    t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
    return;
  }
  t.attrs = t.style, t.style = {};
  const { attrs: h, style: y, dimensions: g } = t;
  h.transform && (g && (y.transform = h.transform), delete h.transform), g && (i !== void 0 || r !== void 0 || y.transform) && (y.transformOrigin = dr(g, i !== void 0 ? i : 0.5, r !== void 0 ? r : 0.5)), e !== void 0 && (h.x = e), n !== void 0 && (h.y = n), s !== void 0 && (h.scale = s), o !== void 0 && hr(h, o, a, l, !1);
}
const Nn = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]), mr = (t) => typeof t == "string" && t.toLowerCase() === "svg";
function gr(t, e) {
  try {
    e.dimensions = typeof t.getBBox == "function" ? t.getBBox() : t.getBoundingClientRect();
  } catch {
    e.dimensions = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }
}
function Kn(t, { style: e, vars: n }, s, i) {
  Object.assign(t.style, e, i && i.getProjectionStyles(s));
  for (const r in n)
    t.style.setProperty(r, n[r]);
}
function yr(t, e, n, s) {
  Kn(t, e, void 0, s);
  for (const i in e.attrs)
    t.setAttribute(Nn.has(i) ? i : Ge(i), e.attrs[i]);
}
const vr = {};
function br(t, { layout: e, layoutId: n }) {
  return Y.has(t) || t.startsWith("origin") || (e || n !== void 0) && (!!vr[t] || t === "opacity");
}
function kn(t, e, n) {
  var s;
  const { style: i } = t, r = {};
  for (const o in i)
    (D(i[o]) || e.style && D(e.style[o]) || br(o, t) || ((s = n == null ? void 0 : n.getValue(o)) === null || s === void 0 ? void 0 : s.liveStyle) !== void 0) && (r[o] = i[o]);
  return r;
}
function Tr(t, e, n) {
  const s = kn(t, e, n);
  for (const i in t)
    if (D(t[i]) || D(e[i])) {
      const r = q.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
      s[r] = t[i];
    }
  return s;
}
class Vr extends On {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = st, this.updateDimensions = () => {
      this.current && !this.renderState.dimensions && gr(this.current, this.renderState);
    };
  }
  getBaseTargetFromProps(e, n) {
    return e[n];
  }
  readValueFromInstance(e, n) {
    if (Y.has(n)) {
      const s = Ze(n);
      return s && s.default || 0;
    }
    return n = Nn.has(n) ? n : Ge(n), e.getAttribute(n);
  }
  scrapeMotionValuesFromProps(e, n, s) {
    return Tr(e, n, s);
  }
  onBindTransform() {
    this.current && !this.renderState.dimensions && I.postRender(this.updateDimensions);
  }
  build(e, n, s) {
    pr(e, n, this.isSVGTag, s.transformTemplate);
  }
  renderInstance(e, n, s, i) {
    yr(e, n, s, i);
  }
  mount(e) {
    this.isSVGTag = mr(e.tagName), super.mount(e);
  }
}
function Sr({ top: t, left: e, right: n, bottom: s }) {
  return {
    x: { min: e, max: n },
    y: { min: t, max: s }
  };
}
function xr(t, e) {
  if (!e)
    return t;
  const n = e({ x: t.left, y: t.top }), s = e({ x: t.right, y: t.bottom });
  return {
    top: n.y,
    left: n.x,
    bottom: s.y,
    right: s.x
  };
}
function wr(t, e) {
  return Sr(xr(t.getBoundingClientRect(), e));
}
function Ar(t) {
  return window.getComputedStyle(t);
}
class Mr extends On {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = Kn;
  }
  readValueFromInstance(e, n) {
    if (Y.has(n)) {
      const s = Ze(n);
      return s && s.default || 0;
    } else {
      const s = Ar(e), i = (bn(n) ? s.getPropertyValue(n) : s[n]) || 0;
      return typeof i == "string" ? i.trim() : i;
    }
  }
  measureInstanceViewportBox(e, { transformPagePoint: n }) {
    return wr(e, n);
  }
  build(e, n, s) {
    Bn(e, n, s.transformTemplate);
  }
  scrapeMotionValuesFromProps(e, n, s) {
    return kn(e, n, s);
  }
}
function Cr(t, e) {
  return t in e;
}
class Pr extends Rn {
  constructor() {
    super(...arguments), this.type = "object";
  }
  readValueFromInstance(e, n) {
    if (Cr(n, e)) {
      const s = e[n];
      if (typeof s == "string" || typeof s == "number")
        return s;
    }
  }
  getBaseTargetFromProps() {
  }
  removeValueFromRenderState(e, n) {
    delete n.output[e];
  }
  measureInstanceViewportBox() {
    return st();
  }
  build(e, n) {
    Object.assign(e.output, n);
  }
  renderInstance(e, { output: n }) {
    Object.assign(e, n);
  }
  sortInstanceNodePosition() {
    return 0;
  }
}
function Dr(t) {
  const e = {
    presenceContext: null,
    props: {},
    visualState: {
      renderState: {
        transform: {},
        transformOrigin: {},
        style: {},
        vars: {},
        attrs: {}
      },
      latestValues: {}
    }
  }, n = Hi(t) ? new Vr(e) : new Mr(e);
  n.mount(t), ie.set(t, n);
}
function Fr(t) {
  const e = {
    presenceContext: null,
    props: {},
    visualState: {
      renderState: {
        output: {}
      },
      latestValues: {}
    }
  }, n = new Pr(e);
  n.mount(t), ie.set(t, n);
}
function Er(t, e, n) {
  const s = D(t) ? t : re(t);
  return s.start(Dn("", s, e, n)), s.animation;
}
function Rr(t, e) {
  return D(t) || typeof t == "number" || typeof t == "string" && !Ue(e);
}
function Ln(t, e, n, s) {
  const i = [];
  if (Rr(t, e))
    i.push(Er(t, Ue(e) && e.default || e, n && (n.default || n)));
  else {
    const r = zt(t, e, s), o = r.length;
    _(!!o, "No valid elements provided.");
    for (let a = 0; a < o; a++) {
      const l = r[a], c = l instanceof Element ? Dr : Fr;
      ie.has(l) || c(l);
      const u = ie.get(l), f = { ...n };
      "delay" in f && typeof f.delay == "function" && (f.delay = f.delay(a, o)), i.push(...Xi(u, { ...e, transition: f }, {}));
    }
  }
  return i;
}
function Or(t, e, n) {
  const s = [];
  return as(t, e, n, { spring: $e }).forEach(({ keyframes: r, transition: o }, a) => {
    s.push(...Ln(a, r, o));
  }), s;
}
function Ir(t) {
  return Array.isArray(t) && t.some(Array.isArray);
}
function Br(t) {
  function e(n, s, i) {
    let r = [];
    return Ir(n) ? r = Or(n, s, t) : r = Ln(n, s, i, t), new kt(r);
  }
  return e;
}
const Kt = Br();
document.addEventListener("DOMContentLoaded", () => {
  const t = document.querySelectorAll(
    ".nav_links_link.is-dropdown"
  ), e = document.getElementById("mobile-menu-btn"), n = document.getElementById("mobile-menu-close"), s = document.getElementById("mobile-menu");
  t.forEach((r) => {
    const o = r.nextElementSibling;
    r.addEventListener("click", (a) => {
      a.preventDefault(), t.forEach((l) => {
        if (l !== r && l.classList.contains("open")) {
          const c = l.nextElementSibling;
          i(c, l);
        }
      }), r.classList.contains("open") ? i(o, r) : (o.style.display = "flex", Kt(
        o,
        {
          opacity: 1,
          scale: [0.6, 1]
        },
        {
          ease: [0.165, 0.84, 0.44, 1],
          duration: 0.25
        }
      ), r.classList.add("open"));
    });
  }), document.addEventListener("click", (r) => {
    t.forEach((o) => {
      const a = o.nextElementSibling;
      o.classList.contains("open") && !o.contains(r.target) && !a.contains(r.target) && i(a, o);
    });
  }), e.addEventListener("click", (r) => {
    r.preventDefault(), s.style.transform = "translateY(-100%)", s.style.display = "flex", window.getComputedStyle(s).transform, setTimeout(() => {
      s.style.transition = "transform 0.7s cubic-bezier(0.32, 0.72, 0, 1)", s.style.transform = "translateY(0%)";
    }, 10);
  }), n.addEventListener("click", (r) => {
    r.preventDefault(), s.style.transition = "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)", s.style.transform = "translateY(-100%)", setTimeout(() => {
      s.style.display = "none";
    }, 300);
  });
  const i = (r, o) => {
    Kt(
      r,
      {
        opacity: 0,
        scale: 0.6
      },
      {
        duration: 0.2,
        easing: [0.55, 0.085, 0.68, 0.53],
        onComplete: () => {
          r.style.display = "none", o.classList.remove("open");
        }
      }
    );
  };
});
