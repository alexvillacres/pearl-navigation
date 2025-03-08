function Nn(t, e, n) {
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
const W = /* @__NO_SIDE_EFFECTS__ */ (t) => t;
let It = W;
const Te = /* @__NO_SIDE_EFFECTS__ */ (t, e, n) => {
  const s = e - t;
  return s === 0 ? 1 : (n - t) / s;
};
// @__NO_SIDE_EFFECTS__
function Ne(t) {
  let e;
  return () => (e === void 0 && (e = t()), e);
}
const Ln = /* @__PURE__ */ Ne(() => window.ScrollTimeline !== void 0);
class kn {
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
      if (Ln() && i.attachTimeline)
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
class Ot extends kn {
  then(e, n) {
    return Promise.all(this.animations).then(e).catch(n);
  }
}
const O = /* @__NO_SIDE_EFFECTS__ */ (t) => t * 1e3, B = /* @__NO_SIDE_EFFECTS__ */ (t) => t / 1e3, pe = 2e4;
function Le(t) {
  let e = 0;
  const n = 50;
  let s = t.next(e);
  for (; !s.done && e < pe; )
    e += n, s = t.next(e);
  return e >= pe ? 1 / 0 : e;
}
const Bt = (t, e, n = 10) => {
  let s = "";
  const i = Math.max(Math.round(e / n), 2);
  for (let r = 0; r < i; r++)
    s += t(/* @__PURE__ */ Te(0, i - 1, r)) + ", ";
  return `linear(${s.substring(0, s.length - 2)})`;
}, U = (t, e, n) => n > e ? e : n < t ? t : n;
function Kt(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const _n = 5;
function Nt(t, e, n) {
  const s = Math.max(e - _n, 0);
  return Kt(n - t(s), e - s);
}
const A = {
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
}, at = 1e-3;
function Wn({ duration: t = A.duration, bounce: e = A.bounce, velocity: n = A.velocity, mass: s = A.mass }) {
  let i, r, o = 1 - e;
  o = U(A.minDamping, A.maxDamping, o), t = U(A.minDuration, A.maxDuration, /* @__PURE__ */ B(t)), o < 1 ? (i = (c) => {
    const u = c * o, f = u * t, h = u - n, y = Pe(c, o), g = Math.exp(-f);
    return at - h / y * g;
  }, r = (c) => {
    const f = c * o * t, h = f * n + n, y = Math.pow(o, 2) * Math.pow(c, 2) * t, g = Math.exp(-f), b = Pe(Math.pow(c, 2), o);
    return (-i(c) + at > 0 ? -1 : 1) * ((h - y) * g) / b;
  }) : (i = (c) => {
    const u = Math.exp(-c * t), f = (c - n) * t + 1;
    return -1e-3 + u * f;
  }, r = (c) => {
    const u = Math.exp(-c * t), f = (n - c) * (t * t);
    return u * f;
  });
  const a = 5 / t, l = Gn(i, r, a);
  if (t = /* @__PURE__ */ O(t), isNaN(l))
    return {
      stiffness: A.stiffness,
      damping: A.damping,
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
const Un = 12;
function Gn(t, e, n) {
  let s = n;
  for (let i = 1; i < Un; i++)
    s = s - t(s) / e(s);
  return s;
}
function Pe(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const jn = ["duration", "bounce"], $n = ["stiffness", "damping", "mass"];
function lt(t, e) {
  return e.some((n) => t[n] !== void 0);
}
function zn(t) {
  let e = {
    velocity: A.velocity,
    stiffness: A.stiffness,
    damping: A.damping,
    mass: A.mass,
    isResolvedFromDuration: !1,
    ...t
  };
  if (!lt(t, $n) && lt(t, jn))
    if (t.visualDuration) {
      const n = t.visualDuration, s = 2 * Math.PI / (n * 1.2), i = s * s, r = 2 * U(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(i);
      e = {
        ...e,
        mass: A.mass,
        stiffness: i,
        damping: r
      };
    } else {
      const n = Wn(t);
      e = {
        ...e,
        ...n,
        mass: A.mass
      }, e.isResolvedFromDuration = !0;
    }
  return e;
}
function ke(t = A.visualDuration, e = A.bounce) {
  const n = typeof t != "object" ? {
    visualDuration: t,
    keyframes: [0, 1],
    bounce: e
  } : t;
  let { restSpeed: s, restDelta: i } = n;
  const r = n.keyframes[0], o = n.keyframes[n.keyframes.length - 1], a = { done: !1, value: r }, { stiffness: l, damping: c, mass: u, duration: f, velocity: h, isResolvedFromDuration: y } = zn({
    ...n,
    velocity: -/* @__PURE__ */ B(n.velocity || 0)
  }), g = h || 0, b = c / (2 * Math.sqrt(l * u)), T = o - r, p = /* @__PURE__ */ B(Math.sqrt(l / u)), V = Math.abs(T) < 5;
  s || (s = V ? A.restSpeed.granular : A.restSpeed.default), i || (i = V ? A.restDelta.granular : A.restDelta.default);
  let M;
  if (b < 1) {
    const m = Pe(p, b);
    M = (S) => {
      const P = Math.exp(-b * p * S);
      return o - P * ((g + b * p * T) / m * Math.sin(m * S) + T * Math.cos(m * S));
    };
  } else if (b === 1)
    M = (m) => o - Math.exp(-p * m) * (T + (g + p * T) * m);
  else {
    const m = p * Math.sqrt(b * b - 1);
    M = (S) => {
      const P = Math.exp(-b * p * S), v = Math.min(m * S, 300);
      return o - P * ((g + b * p * T) * Math.sinh(v) + m * T * Math.cosh(v)) / m;
    };
  }
  const w = {
    calculatedDuration: y && f || null,
    next: (m) => {
      const S = M(m);
      if (y)
        a.done = m >= f;
      else {
        let P = 0;
        b < 1 && (P = m === 0 ? /* @__PURE__ */ O(g) : Nt(M, m, S));
        const v = Math.abs(P) <= s, x = Math.abs(o - S) <= i;
        a.done = v && x;
      }
      return a.value = a.done ? o : S, a;
    },
    toString: () => {
      const m = Math.min(Le(w), pe), S = Bt((P) => w.next(m * P).value, m, 30);
      return m + "ms " + S;
    }
  };
  return w;
}
function qn(t, e = 100, n) {
  const s = n({ ...t, keyframes: [0, e] }), i = Math.min(Le(s), pe);
  return {
    type: "keyframes",
    ease: (r) => s.next(i * r).value / e,
    duration: /* @__PURE__ */ B(i)
  };
}
function Ve(t) {
  return typeof t == "function";
}
const Yn = (t, e, n) => {
  const s = e - t;
  return ((n - t) % s + s) % s + t;
}, Lt = (t) => Array.isArray(t) && typeof t[0] != "number";
function kt(t, e) {
  return Lt(t) ? t[Yn(0, t.length, e)] : t;
}
const re = (t, e, n) => t + (e - t) * n;
function _t(t, e) {
  const n = t[t.length - 1];
  for (let s = 1; s <= e; s++) {
    const i = /* @__PURE__ */ Te(0, e, s);
    t.push(re(n, 1, i));
  }
}
function Wt(t) {
  const e = [0];
  return _t(e, t.length - 1), e;
}
const F = (t) => !!(t && t.getVelocity);
function _e(t) {
  return typeof t == "object" && !Array.isArray(t);
}
function Ut(t, e, n, s) {
  return typeof t == "string" && _e(e) ? Nn(t, n, s) : t instanceof NodeList ? Array.from(t) : Array.isArray(t) ? t : [t];
}
function Hn(t, e, n) {
  return t * (e + 1);
}
function ut(t, e, n, s) {
  var i;
  return typeof e == "number" ? e : e.startsWith("-") || e.startsWith("+") ? Math.max(0, t + parseFloat(e)) : e === "<" ? n : (i = s.get(e)) !== null && i !== void 0 ? i : t;
}
function Xn(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function Gt(t, e) {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
function Zn(t, e, n) {
  for (let s = 0; s < t.length; s++) {
    const i = t[s];
    i.at > e && i.at < n && (Gt(t, i), s--);
  }
}
function Qn(t, e, n, s, i, r) {
  Zn(t, i, r);
  for (let o = 0; o < e.length; o++)
    t.push({
      value: e[o],
      at: re(i, r, s[o]),
      easing: kt(n, o)
    });
}
function Jn(t, e) {
  for (let n = 0; n < t.length; n++)
    t[n] = t[n] / (e + 1);
}
function es(t, e) {
  return t.at === e.at ? t.value === null ? 1 : e.value === null ? -1 : 0 : t.at - e.at;
}
const ts = "easeInOut";
function ns(t, { defaultTransition: e = {}, ...n } = {}, s, i) {
  const r = e.duration || 0.3, o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), l = {}, c = /* @__PURE__ */ new Map();
  let u = 0, f = 0, h = 0;
  for (let y = 0; y < t.length; y++) {
    const g = t[y];
    if (typeof g == "string") {
      c.set(g, f);
      continue;
    } else if (!Array.isArray(g)) {
      c.set(g.name, ut(f, g.at, u, c));
      continue;
    }
    let [b, T, p = {}] = g;
    p.at !== void 0 && (f = ut(f, p.at, u, c));
    let V = 0;
    const M = (w, m, S, P = 0, v = 0) => {
      const x = ss(w), { delay: D = 0, times: E = Wt(x), type: xe = "keyframes", repeat: le, repeatType: Rr, repeatDelay: Er = 0, ...Kn } = m;
      let { ease: K = e.ease || "easeOut", duration: R } = m;
      const tt = typeof D == "function" ? D(P, v) : D, nt = x.length, st = Ve(xe) ? xe : i == null ? void 0 : i[xe];
      if (nt <= 2 && st) {
        let X = 100;
        if (nt === 2 && os(x)) {
          const Z = x[1] - x[0];
          X = Math.abs(Z);
        }
        const ue = { ...Kn };
        R !== void 0 && (ue.duration = /* @__PURE__ */ O(R));
        const ce = qn(ue, X, st);
        K = ce.ease, R = ce.duration;
      }
      R ?? (R = r);
      const it = f + tt;
      E.length === 1 && E[0] === 0 && (E[1] = 1);
      const rt = E.length - x.length;
      if (rt > 0 && _t(E, rt), x.length === 1 && x.unshift(null), le) {
        R = Hn(R, le);
        const X = [...x], ue = [...E];
        K = Array.isArray(K) ? [...K] : [K];
        const ce = [...K];
        for (let Z = 0; Z < le; Z++) {
          x.push(...X);
          for (let Q = 0; Q < X.length; Q++)
            E.push(ue[Q] + (Z + 1)), K.push(Q === 0 ? "linear" : kt(ce, Q - 1));
        }
        Jn(E, le);
      }
      const ot = it + R;
      Qn(S, x, K, E, it, ot), V = Math.max(tt + R, V), h = Math.max(ot, h);
    };
    if (F(b)) {
      const w = ct(b, a);
      M(T, p, ft("default", w));
    } else {
      const w = Ut(b, T, s, l), m = w.length;
      for (let S = 0; S < m; S++) {
        T = T, p = p;
        const P = w[S], v = ct(P, a);
        for (const x in T)
          M(T[x], is(p, x), ft(x, v), S, m);
      }
    }
    u = f, f += V;
  }
  return a.forEach((y, g) => {
    for (const b in y) {
      const T = y[b];
      T.sort(es);
      const p = [], V = [], M = [];
      for (let m = 0; m < T.length; m++) {
        const { at: S, value: P, easing: v } = T[m];
        p.push(P), V.push(/* @__PURE__ */ Te(0, h, S)), M.push(v || "easeOut");
      }
      V[0] !== 0 && (V.unshift(0), p.unshift(p[0]), M.unshift(ts)), V[V.length - 1] !== 1 && (V.push(1), p.push(null)), o.has(g) || o.set(g, {
        keyframes: {},
        transition: {}
      });
      const w = o.get(g);
      w.keyframes[b] = p, w.transition[b] = {
        ...e,
        duration: h,
        ease: M,
        times: V,
        ...n
      };
    }
  }), o;
}
function ct(t, e) {
  return !e.has(t) && e.set(t, {}), e.get(t);
}
function ft(t, e) {
  return e[t] || (e[t] = []), e[t];
}
function ss(t) {
  return Array.isArray(t) ? t : [t];
}
function is(t, e) {
  return t && t[e] ? {
    ...t,
    ...t[e]
  } : { ...t };
}
const rs = (t) => typeof t == "number", os = (t) => t.every(rs), te = /* @__PURE__ */ new WeakMap();
function jt(t, e) {
  return t ? t[e] || t.default || t : void 0;
}
const z = [
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
], q = new Set(z), $t = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...z
]), as = (t) => Array.isArray(t), ls = (t) => as(t) ? t[t.length - 1] || 0 : t, us = {
  useManualTiming: !1
}, fe = [
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
function cs(t, e) {
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
const fs = 40;
function hs(t, e) {
  let n = !1, s = !0;
  const i = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, r = () => n = !0, o = fe.reduce((p, V) => (p[V] = cs(r), p), {}), { read: a, resolveKeyframes: l, update: c, preRender: u, render: f, postRender: h } = o, y = () => {
    const p = performance.now();
    n = !1, i.delta = s ? 1e3 / 60 : Math.max(Math.min(p - i.timestamp, fs), 1), i.timestamp = p, i.isProcessing = !0, a.process(i), l.process(i), c.process(i), u.process(i), f.process(i), h.process(i), i.isProcessing = !1, n && e && (s = !1, t(y));
  }, g = () => {
    n = !0, s = !0, i.isProcessing || t(y);
  };
  return { schedule: fe.reduce((p, V) => {
    const M = o[V];
    return p[V] = (w, m = !1, S = !1) => (n || g(), M.schedule(w, m, S)), p;
  }, {}), cancel: (p) => {
    for (let V = 0; V < fe.length; V++)
      o[fe[V]].cancel(p);
  }, state: i, steps: o };
}
const { schedule: I, cancel: Ce, state: me } = hs(typeof requestAnimationFrame < "u" ? requestAnimationFrame : W, !0);
let de;
function ds() {
  de = void 0;
}
const L = {
  now: () => (de === void 0 && L.set(me.isProcessing || us.useManualTiming ? me.timestamp : performance.now()), de),
  set: (t) => {
    de = t, queueMicrotask(ds);
  }
};
class zt {
  constructor() {
    this.subscriptions = [];
  }
  add(e) {
    return Xn(this.subscriptions, e), () => Gt(this.subscriptions, e);
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
const ht = 30, ps = (t) => !isNaN(parseFloat(t));
class ms {
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
      const r = L.now();
      this.updatedAt !== r && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(s), this.current !== this.prev && this.events.change && this.events.change.notify(this.current), i && this.events.renderRequest && this.events.renderRequest.notify(this.current);
    }, this.hasAnimated = !1, this.setCurrent(e), this.owner = n.owner;
  }
  setCurrent(e) {
    this.current = e, this.updatedAt = L.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = ps(this.current));
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
    return this.on("change", e);
  }
  on(e, n) {
    this.events[e] || (this.events[e] = new zt());
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
    const e = L.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > ht)
      return 0;
    const n = Math.min(this.updatedAt - this.prevUpdatedAt, ht);
    return Kt(parseFloat(this.current) - parseFloat(this.prevFrameValue), n);
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
function ne(t, e) {
  return new ms(t, e);
}
function dt(t) {
  const e = [{}, {}];
  return t == null || t.values.forEach((n, s) => {
    e[0][s] = n.get(), e[1][s] = n.getVelocity();
  }), e;
}
function qt(t, e, n, s) {
  if (typeof e == "function") {
    const [i, r] = dt(s);
    e = e(n !== void 0 ? n : t.custom, i, r);
  }
  if (typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function") {
    const [i, r] = dt(s);
    e = e(n !== void 0 ? n : t.custom, i, r);
  }
  return e;
}
function gs(t, e, n) {
  const s = t.getProps();
  return qt(s, e, s.custom, t);
}
function ys(t, e, n) {
  t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, ne(n));
}
function vs(t, e) {
  const n = gs(t, e);
  let { transitionEnd: s = {}, transition: i = {}, ...r } = n || {};
  r = { ...r, ...s };
  for (const o in r) {
    const a = ls(r[o]);
    ys(t, o, a);
  }
}
function bs(t) {
  return !!(F(t) && t.add);
}
function Ts(t, e) {
  const n = t.getValue("willChange");
  if (bs(n))
    return n.add(e);
}
const We = (t) => t.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), Vs = "framerAppearId", Ss = "data-" + We(Vs);
function xs(t) {
  return t.props[Ss];
}
function pt(t, e) {
  t.timeline = e, t.onfinish = null;
}
const Ue = (t) => Array.isArray(t) && typeof t[0] == "number", As = {
  linearEasing: void 0
};
function ws(t, e) {
  const n = /* @__PURE__ */ Ne(t);
  return () => {
    var s;
    return (s = As[e]) !== null && s !== void 0 ? s : n();
  };
}
const ge = /* @__PURE__ */ ws(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing");
function Yt(t) {
  return !!(typeof t == "function" && ge() || !t || typeof t == "string" && (t in Fe || ge()) || Ue(t) || Array.isArray(t) && t.every(Yt));
}
const J = ([t, e, n, s]) => `cubic-bezier(${t}, ${e}, ${n}, ${s})`, Fe = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ J([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ J([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ J([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ J([0.33, 1.53, 0.69, 0.99])
};
function Ht(t, e) {
  if (t)
    return typeof t == "function" && ge() ? Bt(t, e) : Ue(t) ? J(t) : Array.isArray(t) ? t.map((n) => Ht(n, e) || Fe.easeOut) : Fe[t];
}
const Xt = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t, Ms = 1e-7, Ps = 12;
function Cs(t, e, n, s, i) {
  let r, o, a = 0;
  do
    o = e + (n - e) / 2, r = Xt(o, s, i) - t, r > 0 ? n = o : e = o;
  while (Math.abs(r) > Ms && ++a < Ps);
  return o;
}
function oe(t, e, n, s) {
  if (t === e && n === s)
    return W;
  const i = (r) => Cs(r, 0, 1, t, n);
  return (r) => r === 0 || r === 1 ? r : Xt(i(r), e, s);
}
const Zt = (t) => (e) => e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2, Qt = (t) => (e) => 1 - t(1 - e), Jt = /* @__PURE__ */ oe(0.33, 1.53, 0.69, 0.99), Ge = /* @__PURE__ */ Qt(Jt), en = /* @__PURE__ */ Zt(Ge), tn = (t) => (t *= 2) < 1 ? 0.5 * Ge(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))), je = (t) => 1 - Math.sin(Math.acos(t)), Fs = Qt(je), nn = Zt(je), sn = (t) => /^0[^.\s]+$/u.test(t);
function Ds(t) {
  return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || sn(t) : !0;
}
const Y = {
  test: (t) => typeof t == "number",
  parse: parseFloat,
  transform: (t) => t
}, se = {
  ...Y,
  transform: (t) => U(0, 1, t)
}, he = {
  ...Y,
  default: 1
}, ee = (t) => Math.round(t * 1e5) / 1e5, $e = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function Rs(t) {
  return t == null;
}
const Es = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, ze = (t, e) => (n) => !!(typeof n == "string" && Es.test(n) && n.startsWith(t) || e && !Rs(n) && Object.prototype.hasOwnProperty.call(n, e)), rn = (t, e, n) => (s) => {
  if (typeof s != "string")
    return s;
  const [i, r, o, a] = s.match($e);
  return {
    [t]: parseFloat(i),
    [e]: parseFloat(r),
    [n]: parseFloat(o),
    alpha: a !== void 0 ? parseFloat(a) : 1
  };
}, Is = (t) => U(0, 255, t), Ae = {
  ...Y,
  transform: (t) => Math.round(Is(t))
}, k = {
  test: /* @__PURE__ */ ze("rgb", "red"),
  parse: /* @__PURE__ */ rn("red", "green", "blue"),
  transform: ({ red: t, green: e, blue: n, alpha: s = 1 }) => "rgba(" + Ae.transform(t) + ", " + Ae.transform(e) + ", " + Ae.transform(n) + ", " + ee(se.transform(s)) + ")"
};
function Os(t) {
  let e = "", n = "", s = "", i = "";
  return t.length > 5 ? (e = t.substring(1, 3), n = t.substring(3, 5), s = t.substring(5, 7), i = t.substring(7, 9)) : (e = t.substring(1, 2), n = t.substring(2, 3), s = t.substring(3, 4), i = t.substring(4, 5), e += e, n += n, s += s, i += i), {
    red: parseInt(e, 16),
    green: parseInt(n, 16),
    blue: parseInt(s, 16),
    alpha: i ? parseInt(i, 16) / 255 : 1
  };
}
const De = {
  test: /* @__PURE__ */ ze("#"),
  parse: Os,
  transform: k.transform
}, ae = (t) => ({
  test: (e) => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
  parse: parseFloat,
  transform: (e) => `${e}${t}`
}), N = /* @__PURE__ */ ae("deg"), j = /* @__PURE__ */ ae("%"), d = /* @__PURE__ */ ae("px"), Bs = /* @__PURE__ */ ae("vh"), Ks = /* @__PURE__ */ ae("vw"), mt = {
  ...j,
  parse: (t) => j.parse(t) / 100,
  transform: (t) => j.transform(t * 100)
}, G = {
  test: /* @__PURE__ */ ze("hsl", "hue"),
  parse: /* @__PURE__ */ rn("hue", "saturation", "lightness"),
  transform: ({ hue: t, saturation: e, lightness: n, alpha: s = 1 }) => "hsla(" + Math.round(t) + ", " + j.transform(ee(e)) + ", " + j.transform(ee(n)) + ", " + ee(se.transform(s)) + ")"
}, C = {
  test: (t) => k.test(t) || De.test(t) || G.test(t),
  parse: (t) => k.test(t) ? k.parse(t) : G.test(t) ? G.parse(t) : De.parse(t),
  transform: (t) => typeof t == "string" ? t : t.hasOwnProperty("red") ? k.transform(t) : G.transform(t)
}, Ns = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function Ls(t) {
  var e, n;
  return isNaN(t) && typeof t == "string" && (((e = t.match($e)) === null || e === void 0 ? void 0 : e.length) || 0) + (((n = t.match(Ns)) === null || n === void 0 ? void 0 : n.length) || 0) > 0;
}
const on = "number", an = "color", ks = "var", _s = "var(", gt = "${}", Ws = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function ie(t) {
  const e = t.toString(), n = [], s = {
    color: [],
    number: [],
    var: []
  }, i = [];
  let r = 0;
  const a = e.replace(Ws, (l) => (C.test(l) ? (s.color.push(r), i.push(an), n.push(C.parse(l))) : l.startsWith(_s) ? (s.var.push(r), i.push(ks), n.push(l)) : (s.number.push(r), i.push(on), n.push(parseFloat(l))), ++r, gt)).split(gt);
  return { values: n, split: a, indexes: s, types: i };
}
function ln(t) {
  return ie(t).values;
}
function un(t) {
  const { split: e, types: n } = ie(t), s = e.length;
  return (i) => {
    let r = "";
    for (let o = 0; o < s; o++)
      if (r += e[o], i[o] !== void 0) {
        const a = n[o];
        a === on ? r += ee(i[o]) : a === an ? r += C.transform(i[o]) : r += i[o];
      }
    return r;
  };
}
const Us = (t) => typeof t == "number" ? 0 : t;
function Gs(t) {
  const e = ln(t);
  return un(t)(e.map(Us));
}
const H = {
  test: Ls,
  parse: ln,
  createTransformer: un,
  getAnimatableNone: Gs
}, js = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function $s(t) {
  const [e, n] = t.slice(0, -1).split("(");
  if (e === "drop-shadow")
    return t;
  const [s] = n.match($e) || [];
  if (!s)
    return t;
  const i = n.replace(s, "");
  let r = js.has(e) ? 1 : 0;
  return s !== n && (r *= 100), e + "(" + r + i + ")";
}
const zs = /\b([a-z-]*)\(.*?\)/gu, Re = {
  ...H,
  getAnimatableNone: (t) => {
    const e = t.match(zs);
    return e ? e.map($s).join(" ") : t;
  }
}, qs = {
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
}, Ys = {
  rotate: N,
  rotateX: N,
  rotateY: N,
  rotateZ: N,
  scale: he,
  scaleX: he,
  scaleY: he,
  scaleZ: he,
  skew: N,
  skewX: N,
  skewY: N,
  distance: d,
  translateX: d,
  translateY: d,
  translateZ: d,
  x: d,
  y: d,
  z: d,
  perspective: d,
  transformPerspective: d,
  opacity: se,
  originX: mt,
  originY: mt,
  originZ: d
}, yt = {
  ...Y,
  transform: Math.round
}, qe = {
  ...qs,
  ...Ys,
  zIndex: yt,
  size: d,
  // SVG
  fillOpacity: se,
  strokeOpacity: se,
  numOctaves: yt
}, Hs = {
  ...qe,
  // Color props
  color: C,
  backgroundColor: C,
  outlineColor: C,
  fill: C,
  stroke: C,
  // Border props
  borderColor: C,
  borderTopColor: C,
  borderRightColor: C,
  borderBottomColor: C,
  borderLeftColor: C,
  filter: Re,
  WebkitFilter: Re
}, Ye = (t) => Hs[t];
function cn(t, e) {
  let n = Ye(t);
  return n !== Re && (n = H), n.getAnimatableNone ? n.getAnimatableNone(e) : void 0;
}
const Xs = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function Zs(t, e, n) {
  let s = 0, i;
  for (; s < t.length && !i; ) {
    const r = t[s];
    typeof r == "string" && !Xs.has(r) && ie(r).values.length && (i = t[s]), s++;
  }
  if (i && n)
    for (const r of e)
      t[r] = cn(n, i);
}
const vt = (t) => t === Y || t === d, bt = (t, e) => parseFloat(t.split(", ")[e]), Tt = (t, e) => (n, { transform: s }) => {
  if (s === "none" || !s)
    return 0;
  const i = s.match(/^matrix3d\((.+)\)$/u);
  if (i)
    return bt(i[1], e);
  {
    const r = s.match(/^matrix\((.+)\)$/u);
    return r ? bt(r[1], t) : 0;
  }
}, Qs = /* @__PURE__ */ new Set(["x", "y", "z"]), Js = z.filter((t) => !Qs.has(t));
function ei(t) {
  const e = [];
  return Js.forEach((n) => {
    const s = t.getValue(n);
    s !== void 0 && (e.push([n, s.get()]), s.set(n.startsWith("scale") ? 1 : 0));
  }), e;
}
const $ = {
  // Dimensions
  width: ({ x: t }, { paddingLeft: e = "0", paddingRight: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
  height: ({ y: t }, { paddingTop: e = "0", paddingBottom: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  // Transform
  x: Tt(4, 13),
  y: Tt(5, 14)
};
$.translateX = $.x;
$.translateY = $.y;
const _ = /* @__PURE__ */ new Set();
let Ee = !1, Ie = !1;
function fn() {
  if (Ie) {
    const t = Array.from(_).filter((s) => s.needsMeasurement), e = new Set(t.map((s) => s.element)), n = /* @__PURE__ */ new Map();
    e.forEach((s) => {
      const i = ei(s);
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
  Ie = !1, Ee = !1, _.forEach((t) => t.complete()), _.clear();
}
function hn() {
  _.forEach((t) => {
    t.readKeyframes(), t.needsMeasurement && (Ie = !0);
  });
}
function ti() {
  hn(), fn();
}
class He {
  constructor(e, n, s, i, r, o = !1) {
    this.isComplete = !1, this.isAsync = !1, this.needsMeasurement = !1, this.isScheduled = !1, this.unresolvedKeyframes = [...e], this.onComplete = n, this.name = s, this.motionValue = i, this.element = r, this.isAsync = o;
  }
  scheduleResolve() {
    this.isScheduled = !0, this.isAsync ? (_.add(this), Ee || (Ee = !0, I.read(hn), I.resolveKeyframes(fn))) : (this.readKeyframes(), this.complete());
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
    this.isComplete = !0, this.onComplete(this.unresolvedKeyframes, this.finalKeyframe), _.delete(this);
  }
  cancel() {
    this.isComplete || (this.isScheduled = !1, _.delete(this));
  }
  resume() {
    this.isComplete || this.scheduleResolve();
  }
}
const dn = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t), pn = (t) => (e) => typeof e == "string" && e.startsWith(t), mn = /* @__PURE__ */ pn("--"), ni = /* @__PURE__ */ pn("var(--"), Xe = (t) => ni(t) ? si.test(t.split("/*")[0].trim()) : !1, si = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, ii = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function ri(t) {
  const e = ii.exec(t);
  if (!e)
    return [,];
  const [, n, s, i] = e;
  return [`--${n ?? s}`, i];
}
function gn(t, e, n = 1) {
  const [s, i] = ri(t);
  if (!s)
    return;
  const r = window.getComputedStyle(e).getPropertyValue(s);
  if (r) {
    const o = r.trim();
    return dn(o) ? parseFloat(o) : o;
  }
  return Xe(i) ? gn(i, e, n + 1) : i;
}
const yn = (t) => (e) => e.test(t), oi = {
  test: (t) => t === "auto",
  parse: (t) => t
}, vn = [Y, d, j, N, Ks, Bs, oi], Vt = (t) => vn.find(yn(t));
class bn extends He {
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
      if (typeof c == "string" && (c = c.trim(), Xe(c))) {
        const u = gn(c, n.current);
        u !== void 0 && (e[l] = u), l === e.length - 1 && (this.finalKeyframe = c);
      }
    }
    if (this.resolveNoneKeyframes(), !$t.has(s) || e.length !== 2)
      return;
    const [i, r] = e, o = Vt(i), a = Vt(r);
    if (o !== a)
      if (vt(o) && vt(a))
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
      Ds(e[i]) && s.push(i);
    s.length && Zs(e, s, n);
  }
  measureInitialState() {
    const { element: e, unresolvedKeyframes: n, name: s } = this;
    if (!e || !e.current)
      return;
    s === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = $[s](e.measureViewportBox(), window.getComputedStyle(e.current)), n[0] = this.measuredOrigin;
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
    i[o] = $[s](n.measureViewportBox(), window.getComputedStyle(n.current)), a !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = a), !((e = this.removedTransforms) === null || e === void 0) && e.length && this.removedTransforms.forEach(([l, c]) => {
      n.getValue(l).set(c);
    }), this.resolveNoneKeyframes();
  }
}
const St = (t, e) => e === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && // It's animatable if we have a string
(H.test(t) || t === "0") && // And it contains numbers and/or colors
!t.startsWith("url("));
function ai(t) {
  const e = t[0];
  if (t.length === 1)
    return !0;
  for (let n = 0; n < t.length; n++)
    if (t[n] !== e)
      return !0;
}
function li(t, e, n, s) {
  const i = t[0];
  if (i === null)
    return !1;
  if (e === "display" || e === "visibility")
    return !0;
  const r = t[t.length - 1], o = St(i, e), a = St(r, e);
  return !o || !a ? !1 : ai(t) || (n === "spring" || Ve(n)) && s;
}
const ui = (t) => t !== null;
function Se(t, { repeat: e, repeatType: n = "loop" }, s) {
  const i = t.filter(ui), r = e && n !== "loop" && e % 2 === 1 ? 0 : i.length - 1;
  return !r || s === void 0 ? i[r] : s;
}
const ci = 40;
class Tn {
  constructor({ autoplay: e = !0, delay: n = 0, type: s = "keyframes", repeat: i = 0, repeatDelay: r = 0, repeatType: o = "loop", ...a }) {
    this.isStopped = !1, this.hasAttemptedResolve = !1, this.createdAt = L.now(), this.options = {
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
    return this.resolvedAt ? this.resolvedAt - this.createdAt > ci ? this.resolvedAt : this.createdAt : this.createdAt;
  }
  /**
   * A getter for resolved data. If keyframes are not yet resolved, accessing
   * this.resolved will synchronously flush all pending keyframe resolvers.
   * This is a deoptimisation, but at its worst still batches read/writes.
   */
  get resolved() {
    return !this._resolved && !this.hasAttemptedResolve && ti(), this._resolved;
  }
  /**
   * A method to be called when the keyframes resolver completes. This method
   * will check if its possible to run the animation and, if not, skip it.
   * Otherwise, it will call initPlayback on the implementing class.
   */
  onKeyframesResolved(e, n) {
    this.resolvedAt = L.now(), this.hasAttemptedResolve = !0;
    const { name: s, type: i, velocity: r, delay: o, onComplete: a, onUpdate: l, isGenerator: c } = this.options;
    if (!c && !li(e, s, i, r))
      if (o)
        this.options.duration = 0;
      else {
        l && l(Se(e, this.options, n)), a && a(), this.resolveFinishedPromise();
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
function we(t, e, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t;
}
function fi({ hue: t, saturation: e, lightness: n, alpha: s }) {
  t /= 360, e /= 100, n /= 100;
  let i = 0, r = 0, o = 0;
  if (!e)
    i = r = o = n;
  else {
    const a = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - a;
    i = we(l, a, t + 1 / 3), r = we(l, a, t), o = we(l, a, t - 1 / 3);
  }
  return {
    red: Math.round(i * 255),
    green: Math.round(r * 255),
    blue: Math.round(o * 255),
    alpha: s
  };
}
function ye(t, e) {
  return (n) => n > 0 ? e : t;
}
const Me = (t, e, n) => {
  const s = t * t, i = n * (e * e - s) + s;
  return i < 0 ? 0 : Math.sqrt(i);
}, hi = [De, k, G], di = (t) => hi.find((e) => e.test(t));
function xt(t) {
  const e = di(t);
  if (!e)
    return !1;
  let n = e.parse(t);
  return e === G && (n = fi(n)), n;
}
const At = (t, e) => {
  const n = xt(t), s = xt(e);
  if (!n || !s)
    return ye(t, e);
  const i = { ...n };
  return (r) => (i.red = Me(n.red, s.red, r), i.green = Me(n.green, s.green, r), i.blue = Me(n.blue, s.blue, r), i.alpha = re(n.alpha, s.alpha, r), k.transform(i));
}, pi = (t, e) => (n) => e(t(n)), Ze = (...t) => t.reduce(pi), Oe = /* @__PURE__ */ new Set(["none", "hidden"]);
function mi(t, e) {
  return Oe.has(t) ? (n) => n <= 0 ? t : e : (n) => n >= 1 ? e : t;
}
function gi(t, e) {
  return (n) => re(t, e, n);
}
function Qe(t) {
  return typeof t == "number" ? gi : typeof t == "string" ? Xe(t) ? ye : C.test(t) ? At : bi : Array.isArray(t) ? Vn : typeof t == "object" ? C.test(t) ? At : yi : ye;
}
function Vn(t, e) {
  const n = [...t], s = n.length, i = t.map((r, o) => Qe(r)(r, e[o]));
  return (r) => {
    for (let o = 0; o < s; o++)
      n[o] = i[o](r);
    return n;
  };
}
function yi(t, e) {
  const n = { ...t, ...e }, s = {};
  for (const i in n)
    t[i] !== void 0 && e[i] !== void 0 && (s[i] = Qe(t[i])(t[i], e[i]));
  return (i) => {
    for (const r in s)
      n[r] = s[r](i);
    return n;
  };
}
function vi(t, e) {
  var n;
  const s = [], i = { color: 0, var: 0, number: 0 };
  for (let r = 0; r < e.values.length; r++) {
    const o = e.types[r], a = t.indexes[o][i[o]], l = (n = t.values[a]) !== null && n !== void 0 ? n : 0;
    s[r] = l, i[o]++;
  }
  return s;
}
const bi = (t, e) => {
  const n = H.createTransformer(e), s = ie(t), i = ie(e);
  return s.indexes.var.length === i.indexes.var.length && s.indexes.color.length === i.indexes.color.length && s.indexes.number.length >= i.indexes.number.length ? Oe.has(t) && !i.values.length || Oe.has(e) && !s.values.length ? mi(t, e) : Ze(Vn(vi(s, i), i.values), n) : ye(t, e);
};
function Sn(t, e, n) {
  return typeof t == "number" && typeof e == "number" && typeof n == "number" ? re(t, e, n) : Qe(t)(t, e);
}
function wt({ keyframes: t, velocity: e = 0, power: n = 0.8, timeConstant: s = 325, bounceDamping: i = 10, bounceStiffness: r = 500, modifyTarget: o, min: a, max: l, restDelta: c = 0.5, restSpeed: u }) {
  const f = t[0], h = {
    done: !1,
    value: f
  }, y = (v) => a !== void 0 && v < a || l !== void 0 && v > l, g = (v) => a === void 0 ? l : l === void 0 || Math.abs(a - v) < Math.abs(l - v) ? a : l;
  let b = n * e;
  const T = f + b, p = o === void 0 ? T : o(T);
  p !== T && (b = p - f);
  const V = (v) => -b * Math.exp(-v / s), M = (v) => p + V(v), w = (v) => {
    const x = V(v), D = M(v);
    h.done = Math.abs(x) <= c, h.value = h.done ? p : D;
  };
  let m, S;
  const P = (v) => {
    y(h.value) && (m = v, S = ke({
      keyframes: [h.value, g(h.value)],
      velocity: Nt(M, v, h.value),
      // TODO: This should be passing * 1000
      damping: i,
      stiffness: r,
      restDelta: c,
      restSpeed: u
    }));
  };
  return P(0), {
    calculatedDuration: null,
    next: (v) => {
      let x = !1;
      return !S && m === void 0 && (x = !0, w(v), P(v)), m !== void 0 && v >= m ? S.next(v - m) : (!x && w(v), h);
    }
  };
}
const Ti = /* @__PURE__ */ oe(0.42, 0, 1, 1), Vi = /* @__PURE__ */ oe(0, 0, 0.58, 1), xn = /* @__PURE__ */ oe(0.42, 0, 0.58, 1), Si = {
  linear: W,
  easeIn: Ti,
  easeInOut: xn,
  easeOut: Vi,
  circIn: je,
  circInOut: nn,
  circOut: Fs,
  backIn: Ge,
  backInOut: en,
  backOut: Jt,
  anticipate: tn
}, Mt = (t) => {
  if (Ue(t)) {
    It(t.length === 4);
    const [e, n, s, i] = t;
    return oe(e, n, s, i);
  } else if (typeof t == "string")
    return Si[t];
  return t;
};
function xi(t, e, n) {
  const s = [], i = n || Sn, r = t.length - 1;
  for (let o = 0; o < r; o++) {
    let a = i(t[o], t[o + 1]);
    if (e) {
      const l = Array.isArray(e) ? e[o] || W : e;
      a = Ze(l, a);
    }
    s.push(a);
  }
  return s;
}
function Ai(t, e, { clamp: n = !0, ease: s, mixer: i } = {}) {
  const r = t.length;
  if (It(r === e.length), r === 1)
    return () => e[0];
  if (r === 2 && e[0] === e[1])
    return () => e[1];
  const o = t[0] === t[1];
  t[0] > t[r - 1] && (t = [...t].reverse(), e = [...e].reverse());
  const a = xi(e, s, i), l = a.length, c = (u) => {
    if (o && u < t[0])
      return e[0];
    let f = 0;
    if (l > 1)
      for (; f < t.length - 2 && !(u < t[f + 1]); f++)
        ;
    const h = /* @__PURE__ */ Te(t[f], t[f + 1], u);
    return a[f](h);
  };
  return n ? (u) => c(U(t[0], t[r - 1], u)) : c;
}
function wi(t, e) {
  return t.map((n) => n * e);
}
function Mi(t, e) {
  return t.map(() => e || xn).splice(0, t.length - 1);
}
function ve({ duration: t = 300, keyframes: e, times: n, ease: s = "easeInOut" }) {
  const i = Lt(s) ? s.map(Mt) : Mt(s), r = {
    done: !1,
    value: e[0]
  }, o = wi(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    n && n.length === e.length ? n : Wt(e),
    t
  ), a = Ai(o, e, {
    ease: Array.isArray(i) ? i : Mi(e, i)
  });
  return {
    calculatedDuration: t,
    next: (l) => (r.value = a(l), r.done = l >= t, r)
  };
}
const Pi = (t) => {
  const e = ({ timestamp: n }) => t(n);
  return {
    start: () => I.update(e, !0),
    stop: () => Ce(e),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => me.isProcessing ? me.timestamp : L.now()
  };
}, Ci = {
  decay: wt,
  inertia: wt,
  tween: ve,
  keyframes: ve,
  spring: ke
}, Fi = (t) => t / 100;
class Je extends Tn {
  constructor(e) {
    super(e), this.holdTime = null, this.cancelTime = null, this.currentTime = 0, this.playbackSpeed = 1, this.pendingPlayState = "running", this.startTime = null, this.state = "idle", this.stop = () => {
      if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
        return;
      this.teardown();
      const { onStop: l } = this.options;
      l && l();
    };
    const { name: n, motionValue: s, element: i, keyframes: r } = this.options, o = (i == null ? void 0 : i.KeyframeResolver) || He, a = (l, c) => this.onKeyframesResolved(l, c);
    this.resolver = new o(r, a, n, s, i), this.resolver.scheduleResolve();
  }
  flatten() {
    super.flatten(), this._resolved && Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
  }
  initPlayback(e) {
    const { type: n = "keyframes", repeat: s = 0, repeatDelay: i = 0, repeatType: r, velocity: o = 0 } = this.options, a = Ve(n) ? n : Ci[n] || ve;
    let l, c;
    a !== ve && typeof e[0] != "number" && (l = Ze(Fi, Sn(e[0], e[1])), e = [0, 100]);
    const u = a({ ...this.options, keyframes: e });
    r === "mirror" && (c = a({
      ...this.options,
      keyframes: [...e].reverse(),
      velocity: -o
    })), u.calculatedDuration === null && (u.calculatedDuration = Le(u));
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
    let M = this.currentTime, w = r;
    if (y) {
      const v = Math.min(this.currentTime, u) / f;
      let x = Math.floor(v), D = v % 1;
      !D && v >= 1 && (D = 1), D === 1 && x--, x = Math.min(x, y + 1), !!(x % 2) && (g === "reverse" ? (D = 1 - D, b && (D -= b / f)) : g === "mirror" && (w = o)), M = U(0, 1, D) * f;
    }
    const m = V ? { done: !1, value: l[0] } : w.next(M);
    a && (m.value = a(m.value));
    let { done: S } = m;
    !V && c !== null && (S = this.speed >= 0 ? this.currentTime >= u : this.currentTime <= 0);
    const P = this.holdTime === null && (this.state === "finished" || this.state === "running" && S);
    return P && i !== void 0 && (m.value = Se(l, this.options, i)), T && T(m.value), P && this.finish(), m;
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
    const { driver: e = Pi, onPlay: n, startTime: s } = this.options;
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
const Di = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]);
function Ri(t, e, n, { delay: s = 0, duration: i = 300, repeat: r = 0, repeatType: o = "loop", ease: a = "easeInOut", times: l } = {}) {
  const c = { [e]: n };
  l && (c.offset = l);
  const u = Ht(a, i);
  return Array.isArray(u) && (c.easing = u), t.animate(c, {
    delay: s,
    duration: i,
    easing: Array.isArray(u) ? "linear" : u,
    fill: "both",
    iterations: r + 1,
    direction: o === "reverse" ? "alternate" : "normal"
  });
}
const Ei = /* @__PURE__ */ Ne(() => Object.hasOwnProperty.call(Element.prototype, "animate")), be = 10, Ii = 2e4;
function Oi(t) {
  return Ve(t.type) || t.type === "spring" || !Yt(t.ease);
}
function Bi(t, e) {
  const n = new Je({
    ...e,
    keyframes: t,
    repeat: 0,
    delay: 0,
    isGenerator: !0
  });
  let s = { done: !1, value: t[0] };
  const i = [];
  let r = 0;
  for (; !s.done && r < Ii; )
    s = n.sample(r), i.push(s.value), r += be;
  return {
    times: void 0,
    keyframes: i,
    duration: r - be,
    ease: "linear"
  };
}
const An = {
  anticipate: tn,
  backInOut: en,
  circInOut: nn
};
function Ki(t) {
  return t in An;
}
class Pt extends Tn {
  constructor(e) {
    super(e);
    const { name: n, motionValue: s, element: i, keyframes: r } = this.options;
    this.resolver = new bn(r, (o, a) => this.onKeyframesResolved(o, a), n, s, i), this.resolver.scheduleResolve();
  }
  initPlayback(e, n) {
    let { duration: s = 300, times: i, ease: r, type: o, motionValue: a, name: l, startTime: c } = this.options;
    if (!a.owner || !a.owner.current)
      return !1;
    if (typeof r == "string" && ge() && Ki(r) && (r = An[r]), Oi(this.options)) {
      const { onComplete: f, onUpdate: h, motionValue: y, element: g, ...b } = this.options, T = Bi(e, b);
      e = T.keyframes, e.length === 1 && (e[1] = e[0]), s = T.duration, i = T.times, r = T.ease, o = "keyframes";
    }
    const u = Ri(a.owner.current, l, e, { ...this.options, duration: s, times: i, ease: r });
    return u.startTime = c ?? this.calcStartTime(), this.pendingTimeline ? (pt(u, this.pendingTimeline), this.pendingTimeline = void 0) : u.onfinish = () => {
      const { onComplete: f } = this.options;
      a.set(Se(e, this.options, n)), f && f(), this.cancel(), this.resolveFinishedPromise();
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
        return W;
      const { animation: s } = n;
      pt(s, e);
    }
    return W;
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
      const { motionValue: c, onUpdate: u, onComplete: f, element: h, ...y } = this.options, g = new Je({
        ...y,
        keyframes: s,
        duration: i,
        type: r,
        ease: o,
        times: a,
        isGenerator: !0
      }), b = /* @__PURE__ */ O(this.time);
      c.setWithVelocity(g.sample(b - be).value, g.sample(b).value, be);
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
    return Ei() && s && Di.has(s) && /**
     * If we're outputting values to onUpdate then we can't use WAAPI as there's
     * no way to read the value from WAAPI every frame.
     */
    !l && !c && !i && r !== "mirror" && o !== 0 && a !== "inertia";
  }
}
const Ni = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, Li = (t) => ({
  type: "spring",
  stiffness: 550,
  damping: t === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), ki = {
  type: "keyframes",
  duration: 0.8
}, _i = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, Wi = (t, { keyframes: e }) => e.length > 2 ? ki : q.has(t) ? t.startsWith("scale") ? Li(e[1]) : Ni : _i;
function Ui({ when: t, delay: e, delayChildren: n, staggerChildren: s, staggerDirection: i, repeat: r, repeatType: o, repeatDelay: a, from: l, elapsed: c, ...u }) {
  return !!Object.keys(u).length;
}
const wn = (t, e, n, s = {}, i, r) => (o) => {
  const a = jt(s, t) || {}, l = a.delay || s.delay || 0;
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
  Ui(a) || (u = {
    ...u,
    ...Wi(t, u)
  }), u.duration && (u.duration = /* @__PURE__ */ O(u.duration)), u.repeatDelay && (u.repeatDelay = /* @__PURE__ */ O(u.repeatDelay)), u.from !== void 0 && (u.keyframes[0] = u.from);
  let f = !1;
  if ((u.type === !1 || u.duration === 0 && !u.repeatDelay) && (u.duration = 0, u.delay === 0 && (f = !0)), f && !r && e.get() !== void 0) {
    const h = Se(u.keyframes, a);
    if (h !== void 0)
      return I.update(() => {
        u.onUpdate(h), u.onComplete();
      }), new Ot([]);
  }
  return !r && Pt.supports(u) ? new Pt(u) : new Je(u);
};
function Gi({ protectedKeys: t, needsAnimating: e }, n) {
  const s = t.hasOwnProperty(n) && e[n] !== !0;
  return e[n] = !1, s;
}
function ji(t, e, { delay: n = 0, transitionOverride: s, type: i } = {}) {
  var r;
  let { transition: o = t.getDefaultTransition(), transitionEnd: a, ...l } = e;
  s && (o = s);
  const c = [], u = i && t.animationState && t.animationState.getState()[i];
  for (const f in l) {
    const h = t.getValue(f, (r = t.latestValues[f]) !== null && r !== void 0 ? r : null), y = l[f];
    if (y === void 0 || u && Gi(u, f))
      continue;
    const g = {
      delay: n,
      ...jt(o || {}, f)
    };
    let b = !1;
    if (window.MotionHandoffAnimation) {
      const p = xs(t);
      if (p) {
        const V = window.MotionHandoffAnimation(p, f, I);
        V !== null && (g.startTime = V, b = !0);
      }
    }
    Ts(t, f), h.start(wn(f, h, y, t.shouldReduceMotion && $t.has(f) ? { type: !1 } : g, t, b));
    const T = h.animation;
    T && c.push(T);
  }
  return a && Promise.all(c).then(() => {
    I.update(() => {
      a && vs(t, a);
    });
  }), c;
}
function $i(t) {
  return t instanceof SVGElement && t.tagName !== "svg";
}
const Ct = () => ({ min: 0, max: 0 }), et = () => ({
  x: Ct(),
  y: Ct()
}), Ft = {
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
}, Be = {};
for (const t in Ft)
  Be[t] = {
    isEnabled: (e) => Ft[t].some((n) => !!e[n])
  };
const zi = typeof window < "u", Ke = { current: null }, Mn = { current: !1 };
function qi() {
  if (Mn.current = !0, !!zi)
    if (window.matchMedia) {
      const t = window.matchMedia("(prefers-reduced-motion)"), e = () => Ke.current = t.matches;
      t.addListener(e), e();
    } else
      Ke.current = !1;
}
const Yi = [...vn, C, H], Hi = (t) => Yi.find(yn(t));
function Xi(t) {
  return t !== null && typeof t == "object" && typeof t.start == "function";
}
function Zi(t) {
  return typeof t == "string" || Array.isArray(t);
}
const Qi = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], Ji = ["initial", ...Qi];
function Pn(t) {
  return Xi(t.animate) || Ji.some((e) => Zi(t[e]));
}
function er(t) {
  return !!(Pn(t) || t.variants);
}
function tr(t, e, n) {
  for (const s in e) {
    const i = e[s], r = n[s];
    if (F(i))
      t.addValue(s, i);
    else if (F(r))
      t.addValue(s, ne(i, { owner: t }));
    else if (r !== i)
      if (t.hasValue(s)) {
        const o = t.getValue(s);
        o.liveStyle === !0 ? o.jump(i) : o.hasAnimated || o.set(i);
      } else {
        const o = t.getStaticValue(s);
        t.addValue(s, ne(o !== void 0 ? o : i, { owner: t }));
      }
  }
  for (const s in n)
    e[s] === void 0 && t.removeValue(s);
  return e;
}
const Dt = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class Cn {
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
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = He, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const y = L.now();
      this.renderScheduledAt < y && (this.renderScheduledAt = y, I.render(this.render, !1, !0));
    };
    const { latestValues: l, renderState: c, onUpdate: u } = o;
    this.onUpdate = u, this.latestValues = l, this.baseTarget = { ...l }, this.initialValues = n.initial ? { ...l } : {}, this.renderState = c, this.parent = e, this.props = n, this.presenceContext = s, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = i, this.options = a, this.blockInitialAnimation = !!r, this.isControllingVariants = Pn(n), this.isVariantNode = er(n), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
    const { willChange: f, ...h } = this.scrapeMotionValuesFromProps(n, {}, this);
    for (const y in h) {
      const g = h[y];
      l[y] !== void 0 && F(g) && g.set(l[y], !1);
    }
  }
  mount(e) {
    this.current = e, te.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, s) => this.bindToMotionValue(s, n)), Mn.current || qi(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : Ke.current, this.parent && this.parent.children.add(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    this.projection && this.projection.unmount(), Ce(this.notifyUpdate), Ce(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent && this.parent.children.delete(this);
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
    const s = q.has(e);
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
    for (e in Be) {
      const n = Be[e];
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
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : et();
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
    for (let s = 0; s < Dt.length; s++) {
      const i = Dt[s];
      this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
      const r = "on" + i, o = e[r];
      o && (this.propEventSubscriptions[i] = this.on(i, o));
    }
    this.prevMotionValues = tr(this, this.scrapeMotionValuesFromProps(e, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue(), this.onUpdate && this.onUpdate(this);
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
    return s === void 0 && n !== void 0 && (s = ne(n === null ? void 0 : n, { owner: this }), this.addValue(e, s)), s;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(e, n) {
    var s;
    let i = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : (s = this.getBaseTargetFromProps(this.props, e)) !== null && s !== void 0 ? s : this.readValueFromInstance(this.current, e, this.options);
    return i != null && (typeof i == "string" && (dn(i) || sn(i)) ? i = parseFloat(i) : !Hi(i) && H.test(n) && (i = cn(e, n)), this.setBaseTarget(e, F(i) ? i.get() : i)), F(i) ? i.get() : i;
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
      const o = qt(this.props, s, (n = this.presenceContext) === null || n === void 0 ? void 0 : n.custom);
      o && (i = o[e]);
    }
    if (s && i !== void 0)
      return i;
    const r = this.getBaseTargetFromProps(this.props, e);
    return r !== void 0 && !F(r) ? r : this.initialValues[e] !== void 0 && i === void 0 ? void 0 : this.baseTarget[e];
  }
  on(e, n) {
    return this.events[e] || (this.events[e] = new zt()), this.events[e].add(n);
  }
  notify(e, ...n) {
    this.events[e] && this.events[e].notify(...n);
  }
}
class Fn extends Cn {
  constructor() {
    super(...arguments), this.KeyframeResolver = bn;
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
    F(e) && (this.childSubscription = e.on("change", (n) => {
      this.current && (this.current.textContent = `${n}`);
    }));
  }
}
const Dn = (t, e) => e && typeof t == "number" ? e.transform(t) : t, nr = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, sr = z.length;
function ir(t, e, n) {
  let s = "", i = !0;
  for (let r = 0; r < sr; r++) {
    const o = z[r], a = t[o];
    if (a === void 0)
      continue;
    let l = !0;
    if (typeof a == "number" ? l = a === (o.startsWith("scale") ? 1 : 0) : l = parseFloat(a) === 0, !l || n) {
      const c = Dn(a, qe[o]);
      if (!l) {
        i = !1;
        const u = nr[o] || o;
        s += `${u}(${c}) `;
      }
      n && (e[o] = c);
    }
  }
  return s = s.trim(), n ? s = n(e, i ? "" : s) : i && (s = "none"), s;
}
function Rn(t, e, n) {
  const { style: s, vars: i, transformOrigin: r } = t;
  let o = !1, a = !1;
  for (const l in e) {
    const c = e[l];
    if (q.has(l)) {
      o = !0;
      continue;
    } else if (mn(l)) {
      i[l] = c;
      continue;
    } else {
      const u = Dn(c, qe[l]);
      l.startsWith("origin") ? (a = !0, r[l] = u) : s[l] = u;
    }
  }
  if (e.transform || (o || n ? s.transform = ir(e, t.transform, n) : s.transform && (s.transform = "none")), a) {
    const { originX: l = "50%", originY: c = "50%", originZ: u = 0 } = r;
    s.transformOrigin = `${l} ${c} ${u}`;
  }
}
const rr = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, or = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function ar(t, e, n = 1, s = 0, i = !0) {
  t.pathLength = 1;
  const r = i ? rr : or;
  t[r.offset] = d.transform(-s);
  const o = d.transform(e), a = d.transform(n);
  t[r.array] = `${o} ${a}`;
}
function Rt(t, e, n) {
  return typeof t == "string" ? t : d.transform(e + n * t);
}
function lr(t, e, n) {
  const s = Rt(e, t.x, t.width), i = Rt(n, t.y, t.height);
  return `${s} ${i}`;
}
function ur(t, {
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
  if (Rn(t, c, f), u) {
    t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
    return;
  }
  t.attrs = t.style, t.style = {};
  const { attrs: h, style: y, dimensions: g } = t;
  h.transform && (g && (y.transform = h.transform), delete h.transform), g && (i !== void 0 || r !== void 0 || y.transform) && (y.transformOrigin = lr(g, i !== void 0 ? i : 0.5, r !== void 0 ? r : 0.5)), e !== void 0 && (h.x = e), n !== void 0 && (h.y = n), s !== void 0 && (h.scale = s), o !== void 0 && ar(h, o, a, l, !1);
}
const En = /* @__PURE__ */ new Set([
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
]), cr = (t) => typeof t == "string" && t.toLowerCase() === "svg";
function fr(t, e) {
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
function In(t, { style: e, vars: n }, s, i) {
  Object.assign(t.style, e, i && i.getProjectionStyles(s));
  for (const r in n)
    t.style.setProperty(r, n[r]);
}
function hr(t, e, n, s) {
  In(t, e, void 0, s);
  for (const i in e.attrs)
    t.setAttribute(En.has(i) ? i : We(i), e.attrs[i]);
}
const dr = {};
function pr(t, { layout: e, layoutId: n }) {
  return q.has(t) || t.startsWith("origin") || (e || n !== void 0) && (!!dr[t] || t === "opacity");
}
function On(t, e, n) {
  var s;
  const { style: i } = t, r = {};
  for (const o in i)
    (F(i[o]) || e.style && F(e.style[o]) || pr(o, t) || ((s = n == null ? void 0 : n.getValue(o)) === null || s === void 0 ? void 0 : s.liveStyle) !== void 0) && (r[o] = i[o]);
  return r;
}
function mr(t, e, n) {
  const s = On(t, e, n);
  for (const i in t)
    if (F(t[i]) || F(e[i])) {
      const r = z.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
      s[r] = t[i];
    }
  return s;
}
class gr extends Fn {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = et, this.updateDimensions = () => {
      this.current && !this.renderState.dimensions && fr(this.current, this.renderState);
    };
  }
  getBaseTargetFromProps(e, n) {
    return e[n];
  }
  readValueFromInstance(e, n) {
    if (q.has(n)) {
      const s = Ye(n);
      return s && s.default || 0;
    }
    return n = En.has(n) ? n : We(n), e.getAttribute(n);
  }
  scrapeMotionValuesFromProps(e, n, s) {
    return mr(e, n, s);
  }
  onBindTransform() {
    this.current && !this.renderState.dimensions && I.postRender(this.updateDimensions);
  }
  build(e, n, s) {
    ur(e, n, this.isSVGTag, s.transformTemplate);
  }
  renderInstance(e, n, s, i) {
    hr(e, n, s, i);
  }
  mount(e) {
    this.isSVGTag = cr(e.tagName), super.mount(e);
  }
}
function yr({ top: t, left: e, right: n, bottom: s }) {
  return {
    x: { min: e, max: n },
    y: { min: t, max: s }
  };
}
function vr(t, e) {
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
function br(t, e) {
  return yr(vr(t.getBoundingClientRect(), e));
}
function Tr(t) {
  return window.getComputedStyle(t);
}
class Vr extends Fn {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = In;
  }
  readValueFromInstance(e, n) {
    if (q.has(n)) {
      const s = Ye(n);
      return s && s.default || 0;
    } else {
      const s = Tr(e), i = (mn(n) ? s.getPropertyValue(n) : s[n]) || 0;
      return typeof i == "string" ? i.trim() : i;
    }
  }
  measureInstanceViewportBox(e, { transformPagePoint: n }) {
    return br(e, n);
  }
  build(e, n, s) {
    Rn(e, n, s.transformTemplate);
  }
  scrapeMotionValuesFromProps(e, n, s) {
    return On(e, n, s);
  }
}
function Sr(t, e) {
  return t in e;
}
class xr extends Cn {
  constructor() {
    super(...arguments), this.type = "object";
  }
  readValueFromInstance(e, n) {
    if (Sr(n, e)) {
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
    return et();
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
function Ar(t) {
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
  }, n = $i(t) ? new gr(e) : new Vr(e);
  n.mount(t), te.set(t, n);
}
function wr(t) {
  const e = {
    presenceContext: null,
    props: {},
    visualState: {
      renderState: {
        output: {}
      },
      latestValues: {}
    }
  }, n = new xr(e);
  n.mount(t), te.set(t, n);
}
function Mr(t, e, n) {
  const s = F(t) ? t : ne(t);
  return s.start(wn("", s, e, n)), s.animation;
}
function Pr(t, e) {
  return F(t) || typeof t == "number" || typeof t == "string" && !_e(e);
}
function Bn(t, e, n, s) {
  const i = [];
  if (Pr(t, e))
    i.push(Mr(t, _e(e) && e.default || e, n && (n.default || n)));
  else {
    const r = Ut(t, e, s), o = r.length;
    for (let a = 0; a < o; a++) {
      const l = r[a], c = l instanceof Element ? Ar : wr;
      te.has(l) || c(l);
      const u = te.get(l), f = { ...n };
      "delay" in f && typeof f.delay == "function" && (f.delay = f.delay(a, o)), i.push(...ji(u, { ...e, transition: f }, {}));
    }
  }
  return i;
}
function Cr(t, e, n) {
  const s = [];
  return ns(t, e, n, { spring: ke }).forEach(({ keyframes: r, transition: o }, a) => {
    s.push(...Bn(a, r, o));
  }), s;
}
function Fr(t) {
  return Array.isArray(t) && t.some(Array.isArray);
}
function Dr(t) {
  function e(n, s, i) {
    let r = [];
    return Fr(n) ? r = Cr(n, s, t) : r = Bn(n, s, i, t), new Ot(r);
  }
  return e;
}
const Et = Dr();
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
      }), r.classList.contains("open") ? i(o, r) : (o.style.display = "flex", Et(
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
    Et(
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
