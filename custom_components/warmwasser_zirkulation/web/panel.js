/**
* @vue/shared v3.5.46
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function Ln(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const q = {}, Qe = [], et = () => {
}, Us = () => !1, sn = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), rn = (e) => e.startsWith("onUpdate:"), ue = Object.assign, Bs = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Ji = Object.prototype.hasOwnProperty, B = (e, t) => Ji.call(e, t), H = Array.isArray, We = (e) => ht(e) === "[object Map]", Le = (e) => ht(e) === "[object Set]", fs = (e) => ht(e) === "[object Date]", j = (e) => typeof e == "function", ee = (e) => typeof e == "string", $e = (e) => typeof e == "symbol", G = (e) => e !== null && typeof e == "object", Ks = (e) => (G(e) || j(e)) && j(e.then) && j(e.catch), js = Object.prototype.toString, ht = (e) => js.call(e), Yi = (e) => ht(e).slice(8, -1), Ws = (e) => ht(e) === "[object Object]", Nn = (e) => ee(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, _t = /* @__PURE__ */ Ln(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Xi = 1e4, ln = (e) => {
  let t = /* @__PURE__ */ Object.create(null), n = 0;
  return ((s) => {
    const i = t[s];
    return i !== void 0 ? i : (++n > Xi && (t = /* @__PURE__ */ Object.create(null), n = 1), t[s] = e(s));
  });
}, Qi = /-\w/g, ye = /* @__PURE__ */ ln((e) => e.replace(Qi, (t) => t.slice(1).toUpperCase())), er = /\B([A-Z])/g, st = /* @__PURE__ */ ln(
  (e) => e.replace(er, "-$1").toLowerCase()
), zs = /* @__PURE__ */ ln((e) => e.charAt(0).toUpperCase() + e.slice(1)), yn = /* @__PURE__ */ ln((e) => e ? `on${zs(e)}` : ""), Me = (e, t) => !Object.is(e, t), zt = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, Zs = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, It = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let ds;
const on = () => ds || (ds = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Mt(e) {
  if (H(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = ee(s) ? ir(s) : Mt(s);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (ee(e) || G(e))
    return e;
}
const tr = /;(?![^(]*\))/g, nr = /:([^]+)/, sr = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function ir(e) {
  const t = {};
  return e.replace(sr, (n) => n.startsWith("/*") ? "" : n).split(tr).forEach((n) => {
    if (n) {
      const s = n.split(nr);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function Rt(e) {
  let t = "";
  if (ee(e))
    t = e;
  else if (H(e))
    for (let n = 0; n < e.length; n++) {
      const s = Rt(e[n]);
      s && (t += s + " ");
    }
  else if (G(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const rr = "itemscope,allowfullscreen,disablepictureinpicture,disableremoteplayback,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly", lr = /* @__PURE__ */ Ln(rr);
function qs(e) {
  return !!e || e === "";
}
function or(e, t, n) {
  if (e.length !== t.length) return !1;
  let s = !0;
  for (let i = 0; s && i < e.length; i++)
    s = Ne(e[i], t[i], n);
  return s;
}
function hs(e, t, n) {
  if (e.size !== t.size) return !1;
  const s = Array.from(t), i = new Uint8Array(s.length);
  for (const r of e) {
    let l = -1;
    for (let o = 0; o < s.length; o++)
      if (!i[o] && Ne(r, s[o], n)) {
        l = o;
        break;
      }
    if (l < 0) return !1;
    i[l] = 1;
  }
  return !0;
}
function ar(e, t, n) {
  let s = We(e), i = We(t);
  if (s || i || (s = Le(e), i = Le(t), s || i))
    return s && i ? hs(e, t, n) : !1;
  const r = Object.keys(e).length, l = Object.keys(t).length;
  if (r !== l)
    return !1;
  for (const o in e) {
    const a = B(e, o), d = B(t, o);
    if (a && !d || !a && d || !Ne(e[o], t[o], n))
      return !1;
  }
  return gs(e) === gs(t);
}
function ps(e, t, n, s) {
  n || (n = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [i, r] = n;
  if (i.has(e) || r.has(t))
    return i.get(e) === t && r.get(t) === e;
  i.set(e, t), r.set(t, e);
  const l = s(e, t, n);
  return i.delete(e), r.delete(t), l;
}
function Ne(e, t, n) {
  if (e === t) return !0;
  let s = fs(e), i = fs(t);
  return s || i ? s && i ? e.getTime() === t.getTime() : !1 : (s = $e(e), i = $e(t), s || i ? e === t : (s = H(e), i = H(t), s || i ? s && i ? ps(e, t, n, or) : !1 : (s = G(e), i = G(t), s || i ? !s || !i ? !1 : ps(e, t, n, ar) : String(e) === String(t))));
}
function Un(e, t) {
  return e.findIndex((n) => Ne(n, t));
}
function gs(e) {
  return Object.getPrototypeOf(e) === null && e[Symbol.toPrimitive] == null && typeof e.toString != "function" && typeof e.valueOf != "function" ? ht(e) : String(e);
}
const Gs = (e) => !!(e && e.__v_isRef === !0), V = (e) => ee(e) ? e : e == null ? "" : H(e) || G(e) && (e.toString === js || !j(e.toString)) ? Gs(e) ? V(e.value) : JSON.stringify(e, Js, 2) : String(e), Js = (e, t) => Gs(t) ? Js(e, t.value) : We(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, i], r) => (n[bn(s, r) + " =>"] = i, n),
    {}
  )
} : Le(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => bn(n))
} : $e(t) ? bn(t) : G(t) && !H(t) && !Ws(t) ? String(t) : t, bn = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    $e(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.46
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let ne;
class ur {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && ne && (ne.active ? (this.parent = ne, this.index = (ne.scopes || (ne.scopes = [])).push(
      this
    ) - 1) : (this._active = !1, this._warnOnRun = !1));
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes) {
        const s = this.scopes.slice();
        for (t = 0, n = s.length; t < n; t++)
          s[t].pause();
      }
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes) {
        const i = this.scopes.slice();
        for (t = 0, n = i.length; t < n; t++)
          i[t].resume();
      }
      const s = this.effects.slice();
      for (t = 0, n = s.length; t < n; t++)
        s[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = ne;
      try {
        return ne = this, t();
      } finally {
        ne = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = ne, ne = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (ne === this)
        ne = this.prevScope;
      else {
        let t = ne;
        for (; t; ) {
          if (t.prevScope === this) {
            t.prevScope = this.prevScope;
            break;
          }
          t = t.prevScope;
        }
      }
      this.prevScope = void 0;
    }
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, s = this.cleanups.length; n < s; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        const i = this.scopes.slice();
        for (n = 0, s = i.length; n < s; n++)
          i[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const i = this.parent.scopes.pop();
        i && i !== this && (this.parent.scopes[this.index] = i, i.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function cr() {
  return ne;
}
let z;
const _n = /* @__PURE__ */ new WeakSet();
class Ys {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, ne && (ne.active ? ne.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, _n.has(this) && (_n.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Qs(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, ms(this), ei(this);
    const t = z, n = be;
    z = this, be = !0;
    try {
      return this.fn();
    } finally {
      ti(this), z = t, be = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        jn(t);
      this.deps = this.depsTail = void 0, ms(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? _n.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    $n(this) && this.run();
  }
  get dirty() {
    return $n(this);
  }
}
let Xs = 0, vt, wt;
function Qs(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = wt, wt = e;
    return;
  }
  e.next = vt, vt = e;
}
function Bn() {
  Xs++;
}
function Kn() {
  if (--Xs > 0)
    return;
  if (wt) {
    let t = wt;
    for (wt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; vt; ) {
    let t = vt;
    for (vt = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function ei(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function ti(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), jn(s), fr(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function $n(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (ni(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function ni(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Et) || (e.globalVersion = Et, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !$n(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = z, s = be;
  z = e, be = !0;
  try {
    ei(e);
    const i = e.fn(e._value);
    (t.version === 0 || Me(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    z = n, be = s, ti(e), e.flags &= -3;
  }
}
function jn(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (s && (s.nextSub = i, e.prevSub = void 0), i && (i.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      jn(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function fr(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let be = !0;
const si = [];
function Ze() {
  si.push(be), be = !1;
}
function qe() {
  const e = si.pop();
  be = e === void 0 ? !0 : e;
}
function ms(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = z;
    z = void 0;
    try {
      t();
    } finally {
      z = n;
    }
  }
}
let Et = 0;
class dr {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Wn {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!z || !be || z === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== z)
      n = this.activeLink = new dr(z, this), z.deps ? (n.prevDep = z.depsTail, z.depsTail.nextDep = n, z.depsTail = n) : z.deps = z.depsTail = n, ii(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = z.depsTail, n.nextDep = void 0, z.depsTail.nextDep = n, z.depsTail = n, z.deps === n && (z.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, Et++, this.notify(t);
  }
  notify(t) {
    Bn();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Kn();
    }
  }
}
function ii(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        ii(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const kn = /* @__PURE__ */ new WeakMap(), tt = /* @__PURE__ */ Symbol(
  ""
), On = /* @__PURE__ */ Symbol(
  ""
), $t = /* @__PURE__ */ Symbol(
  ""
);
function se(e, t, n) {
  if (be && z) {
    let s = kn.get(e);
    s || kn.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new Wn()), i.map = s, i.key = n), i.track();
  }
}
function He(e, t, n, s, i, r) {
  const l = kn.get(e);
  if (!l) {
    Et++;
    return;
  }
  const o = (a) => {
    a && a.trigger();
  };
  if (Bn(), t === "clear")
    l.forEach(o);
  else {
    const a = H(e), d = a && Nn(n);
    if (a && n === "length") {
      const f = Number(s);
      l.forEach((h, v) => {
        (v === "length" || v === $t || !$e(v) && v >= f) && o(h);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && o(l.get(n)), d && o(l.get($t)), t) {
        case "add":
          a ? d && o(l.get("length")) : (o(l.get(tt)), We(e) && o(l.get(On)));
          break;
        case "delete":
          a || (o(l.get(tt)), We(e) && o(l.get(On)));
          break;
        case "set":
          We(e) && o(l.get(tt));
          break;
      }
  }
  Kn();
}
function rt(e) {
  const t = /* @__PURE__ */ U(e);
  return t === e || (se(t, "iterate", $t), /* @__PURE__ */ de(e)) ? t : /* @__PURE__ */ ke(e) ? /* @__PURE__ */ ze(e) ? t.map((n) => Ge(he(n))) : t.map(Ge) : t.map(he);
}
function an(e) {
  return se(e = /* @__PURE__ */ U(e), "iterate", $t), e;
}
function Ce(e, t) {
  return /* @__PURE__ */ ke(e) ? Ge(/* @__PURE__ */ ze(e) ? he(t) : t) : he(t);
}
const hr = {
  __proto__: null,
  [Symbol.iterator]() {
    return vn(this, Symbol.iterator, (e) => Ce(this, e));
  },
  concat(...e) {
    return rt(this).concat(
      ...e.map((t) => H(t) ? rt(t) : t)
    );
  },
  entries() {
    return vn(this, "entries", (e) => (e[1] = Ce(this, e[1]), e));
  },
  every(e, t) {
    return Pe(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Pe(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => Ce(this, s)),
      arguments
    );
  },
  find(e, t) {
    return Pe(
      this,
      "find",
      e,
      t,
      (n) => Ce(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return Pe(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Pe(
      this,
      "findLast",
      e,
      t,
      (n) => Ce(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return Pe(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Pe(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return wn(this, "includes", e);
  },
  indexOf(...e) {
    return wn(this, "indexOf", e);
  },
  join(e) {
    return rt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return wn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Pe(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return mt(this, "pop");
  },
  push(...e) {
    return mt(this, "push", e);
  },
  reduce(e, ...t) {
    return bs(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return bs(this, "reduceRight", e, t);
  },
  shift() {
    return mt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Pe(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return mt(this, "splice", e);
  },
  toReversed() {
    return rt(this).toReversed();
  },
  toSorted(e) {
    return rt(this).toSorted(e);
  },
  toSpliced(...e) {
    return rt(this).toSpliced(...e);
  },
  unshift(...e) {
    return mt(this, "unshift", e);
  },
  values() {
    return vn(this, "values", (e) => Ce(this, e));
  }
};
function vn(e, t, n) {
  const s = an(e), i = s[t], r = i.call(s);
  if (s !== e && !/* @__PURE__ */ de(e)) {
    if (r[Symbol.toStringTag] === "Array Iterator") {
      const l = Object.create(Object.getPrototypeOf(r));
      return l.next = () => ys(r.next(), n), i !== ri[t] && Object.defineProperties(l, {
        return: {
          get() {
            const o = r.return;
            return typeof o == "function" ? o.bind(r) : o;
          }
        },
        throw: {
          get() {
            const o = r.throw;
            return typeof o == "function" ? o.bind(r) : o;
          }
        }
      }), l;
    }
    r._next = r.next, r.next = () => ys(r._next(), n);
  }
  return r;
}
function ys(e, t) {
  return e.done || (e.value = t(e.value)), e;
}
const ri = Array.prototype;
function Pe(e, t, n, s, i, r) {
  const l = an(e), o = l !== e && !/* @__PURE__ */ de(e), a = l[t];
  if (a !== ri[t]) {
    const h = a.apply(e, r);
    return o ? he(h) : h;
  }
  let d = n;
  l !== e && (o ? d = function(h, v) {
    return n.call(this, Ce(e, h), v, e);
  } : n.length > 2 && (d = function(h, v) {
    return n.call(this, h, v, e);
  }));
  const f = a.call(l, d, s);
  return o && i ? i(f) : f;
}
function bs(e, t, n, s) {
  const i = an(e), r = i !== e && !/* @__PURE__ */ de(e);
  let l = n, o = !1;
  i !== e && (r ? (o = s.length === 0, l = function(d, f, h) {
    return o && (o = !1, d = Ce(e, d)), n.call(this, d, Ce(e, f), h, e);
  }) : n.length > 3 && (l = function(d, f, h) {
    return n.call(this, d, f, h, e);
  }));
  const a = i[t](l, ...s);
  return o ? Ce(e, a) : a;
}
function wn(e, t, n) {
  const s = /* @__PURE__ */ U(e);
  se(s, "iterate", $t);
  const i = s[t](...n);
  return (i === -1 || i === !1) && /* @__PURE__ */ Gn(n[0]) ? (n[0] = /* @__PURE__ */ U(n[0]), s[t](...n)) : i;
}
function mt(e, t, n = []) {
  Ze(), Bn();
  const s = (/* @__PURE__ */ U(e))[t].apply(e, n);
  return Kn(), qe(), s;
}
const pr = /* @__PURE__ */ Ln("__proto__,__v_isRef,__isVue"), li = /* @__PURE__ */ new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter($e)
);
function gr(e) {
  $e(e) || (e = String(e));
  const t = /* @__PURE__ */ U(this);
  return se(t, "has", e), t.hasOwnProperty(e);
}
class oi {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const i = this._isReadonly, r = this._isShallow;
    if (n === "__v_isReactive")
      return !i;
    if (n === "__v_isReadonly")
      return i;
    if (n === "__v_isShallow")
      return r;
    if (n === "__v_raw")
      return s === (i ? r ? Ar : fi : r ? ci : ui).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const l = H(t);
    if (!i) {
      let a;
      if (l && (a = hr[n]))
        return a;
      if (n === "hasOwnProperty")
        return gr;
    }
    const o = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ le(t) ? t : s
    );
    if (($e(n) ? li.has(n) : pr(n)) || (i || se(t, "get", n), r))
      return o;
    if (/* @__PURE__ */ le(o)) {
      const a = l && Nn(n) ? o : o.value;
      return i && G(a) ? /* @__PURE__ */ Pn(a) : a;
    }
    return G(o) ? i ? /* @__PURE__ */ Pn(o) : /* @__PURE__ */ Zn(o) : o;
  }
}
class ai extends oi {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    const l = H(t) && Nn(n);
    if (!this._isShallow) {
      const d = /* @__PURE__ */ ke(r);
      if (!/* @__PURE__ */ de(s) && !/* @__PURE__ */ ke(s) && (r = /* @__PURE__ */ U(r), s = /* @__PURE__ */ U(s)), !l && /* @__PURE__ */ le(r) && !/* @__PURE__ */ le(s))
        return d || (r.value = s), !0;
    }
    const o = l ? Number(n) < t.length : B(t, n), a = Reflect.set(
      t,
      n,
      s,
      /* @__PURE__ */ le(t) ? t : i
    );
    return t === /* @__PURE__ */ U(i) && a && (o ? Me(s, r) && He(t, "set", n, s) : He(t, "add", n, s)), a;
  }
  deleteProperty(t, n) {
    const s = B(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && He(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!$e(n) || !li.has(n)) && se(t, "has", n), s;
  }
  ownKeys(t) {
    return se(
      t,
      "iterate",
      H(t) ? "length" : tt
    ), Reflect.ownKeys(t);
  }
}
class mr extends oi {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const yr = /* @__PURE__ */ new ai(), br = /* @__PURE__ */ new mr(), _r = /* @__PURE__ */ new ai(!0);
const Fn = (e) => e, Nt = (e) => Reflect.getPrototypeOf(e);
function vr(e, t, n) {
  return function(...s) {
    const i = this.__v_raw, r = /* @__PURE__ */ U(i), l = We(r), o = e === "entries" || e === Symbol.iterator && l, a = e === "keys" && l, d = i[e](...s), f = n ? Fn : t ? Ge : he;
    return !t && se(
      r,
      "iterate",
      a ? On : tt
    ), ue(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: h, done: v } = d.next();
          return v ? { value: h, done: v } : {
            value: o ? [f(h[0]), f(h[1])] : f(h),
            done: v
          };
        }
      }
    );
  };
}
function Ut(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function wr(e, t) {
  const n = {
    get(i) {
      const r = this.__v_raw, l = /* @__PURE__ */ U(r), o = /* @__PURE__ */ U(i);
      e || (Me(i, o) && se(l, "get", i), se(l, "get", o));
      const { has: a } = Nt(l), d = t ? Fn : e ? Ge : he;
      if (a.call(l, i))
        return d(r.get(i));
      if (a.call(l, o))
        return d(r.get(o));
      r !== l && r.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && se(/* @__PURE__ */ U(i), "iterate", tt), i.size;
    },
    has(i) {
      const r = this.__v_raw, l = /* @__PURE__ */ U(r), o = /* @__PURE__ */ U(i);
      return e || (Me(i, o) && se(l, "has", i), se(l, "has", o)), i === o ? r.has(i) : r.has(i) || r.has(o);
    },
    forEach(i, r) {
      const l = this, o = l.__v_raw, a = /* @__PURE__ */ U(o), d = t ? Fn : e ? Ge : he;
      return !e && se(a, "iterate", tt), o.forEach((f, h) => i.call(r, d(f), d(h), l));
    }
  };
  return ue(
    n,
    e ? {
      add: Ut("add"),
      set: Ut("set"),
      delete: Ut("delete"),
      clear: Ut("clear")
    } : {
      add(i) {
        const r = /* @__PURE__ */ U(this), l = Nt(r), o = /* @__PURE__ */ U(i), a = !t && !/* @__PURE__ */ de(i) && !/* @__PURE__ */ ke(i) ? o : i;
        return l.has.call(r, a) || Me(i, a) && l.has.call(r, i) || Me(o, a) && l.has.call(r, o) || (r.add(a), He(r, "add", a, a)), this;
      },
      set(i, r) {
        !t && !/* @__PURE__ */ de(r) && !/* @__PURE__ */ ke(r) && (r = /* @__PURE__ */ U(r));
        const l = /* @__PURE__ */ U(this), { has: o, get: a } = Nt(l);
        let d = o.call(l, i);
        d || (i = /* @__PURE__ */ U(i), d = o.call(l, i));
        const f = a.call(l, i);
        return l.set(i, r), d ? Me(r, f) && He(l, "set", i, r) : He(l, "add", i, r), this;
      },
      delete(i) {
        const r = /* @__PURE__ */ U(this), { has: l, get: o } = Nt(r);
        let a = l.call(r, i);
        a || (i = /* @__PURE__ */ U(i), a = l.call(r, i)), o && o.call(r, i);
        const d = r.delete(i);
        return a && He(r, "delete", i, void 0), d;
      },
      clear() {
        const i = /* @__PURE__ */ U(this), r = i.size !== 0, l = i.clear();
        return r && He(
          i,
          "clear",
          void 0,
          void 0
        ), l;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((i) => {
    n[i] = vr(i, e, t);
  }), n;
}
function zn(e, t) {
  const n = wr(e, t);
  return (s, i, r) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? s : Reflect.get(
    B(n, i) && i in s ? n : s,
    i,
    r
  );
}
const Sr = {
  get: /* @__PURE__ */ zn(!1, !1)
}, xr = {
  get: /* @__PURE__ */ zn(!1, !0)
}, Cr = {
  get: /* @__PURE__ */ zn(!0, !1)
};
const ui = /* @__PURE__ */ new WeakMap(), ci = /* @__PURE__ */ new WeakMap(), fi = /* @__PURE__ */ new WeakMap(), Ar = /* @__PURE__ */ new WeakMap();
function Tr(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
// @__NO_SIDE_EFFECTS__
function Zn(e) {
  return /* @__PURE__ */ ke(e) ? e : qn(
    e,
    !1,
    yr,
    Sr,
    ui
  );
}
// @__NO_SIDE_EFFECTS__
function Mr(e) {
  return qn(
    e,
    !1,
    _r,
    xr,
    ci
  );
}
// @__NO_SIDE_EFFECTS__
function Pn(e) {
  return qn(
    e,
    !0,
    br,
    Cr,
    fi
  );
}
function qn(e, t, n, s, i) {
  if (!G(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const r = i.get(e);
  if (r)
    return r;
  const l = Tr(Yi(e));
  if (l === 0)
    return e;
  const o = new Proxy(
    e,
    l === 2 ? s : n
  );
  return i.set(e, o), o;
}
// @__NO_SIDE_EFFECTS__
function ze(e) {
  return /* @__PURE__ */ ke(e) ? /* @__PURE__ */ ze(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function ke(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function de(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Gn(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function U(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ U(t) : e;
}
function Er(e) {
  return !B(e, "__v_skip") && Object.isExtensible(e) && Zs(e, "__v_skip", !0), e;
}
const he = (e) => G(e) ? /* @__PURE__ */ Zn(e) : e, Ge = (e) => G(e) ? /* @__PURE__ */ Pn(e) : e;
// @__NO_SIDE_EFFECTS__
function le(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function ce(e) {
  return $r(e, !1);
}
function $r(e, t) {
  return /* @__PURE__ */ le(e) ? e : new kr(e, t);
}
class kr {
  constructor(t, n) {
    this.dep = new Wn(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ U(t), this._value = n ? t : he(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || /* @__PURE__ */ de(t) || /* @__PURE__ */ ke(t);
    t = s ? t : /* @__PURE__ */ U(t), Me(t, n) && (this._rawValue = t, this._value = s ? t : he(t), this.dep.trigger());
  }
}
function In(e) {
  return /* @__PURE__ */ le(e) ? e.value : e;
}
const Or = {
  get: (e, t, n) => t === "__v_raw" ? e : In(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const i = e[t];
    return /* @__PURE__ */ le(i) && !/* @__PURE__ */ le(n) ? (i.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function di(e) {
  return /* @__PURE__ */ ze(e) ? e : new Proxy(e, Or);
}
class Fr {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new Wn(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Et - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    z !== this)
      return Qs(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return ni(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function Pr(e, t, n = !1) {
  let s, i;
  return j(e) ? s = e : (s = e.get, i = e.set), new Fr(s, i, n);
}
const Bt = {}, Gt = /* @__PURE__ */ new WeakMap();
let Xe;
function Ir(e, t = !1, n = Xe) {
  if (n) {
    let s = Gt.get(n);
    s || Gt.set(n, s = []), s.push(e);
  }
}
function Rr(e, t, n = q) {
  const { immediate: s, deep: i, once: r, scheduler: l, augmentJob: o, call: a } = n, d = (M) => i ? M : /* @__PURE__ */ de(M) || i === !1 || i === 0 ? Ve(M, 1) : Ve(M);
  let f, h, v, T, P = !1, k = !1;
  if (/* @__PURE__ */ le(e) ? (h = () => e.value, P = /* @__PURE__ */ de(e)) : /* @__PURE__ */ ze(e) ? (h = () => d(e), P = !0) : H(e) ? (k = !0, P = e.some((M) => /* @__PURE__ */ ze(M) || /* @__PURE__ */ de(M)), h = () => e.map((M) => {
    if (/* @__PURE__ */ le(M))
      return M.value;
    if (/* @__PURE__ */ ze(M))
      return d(M);
    if (j(M))
      return a ? a(M, 2) : M();
  })) : j(e) ? t ? h = a ? () => a(e, 2) : e : h = () => {
    if (v) {
      Ze();
      try {
        v();
      } finally {
        qe();
      }
    }
    const M = Xe;
    Xe = f;
    try {
      return a ? a(e, 3, [T]) : e(T);
    } finally {
      Xe = M;
    }
  } : h = et, t && i) {
    const M = h, Y = i === !0 ? 1 / 0 : i;
    h = () => Ve(M(), Y);
  }
  const D = cr(), w = () => {
    f.stop(), D && D.active && Bs(D.effects, f);
  };
  if (r && t) {
    const M = t;
    t = (...Y) => {
      try {
        return M(...Y);
      } finally {
        w();
      }
    };
  }
  let F = k ? new Array(e.length).fill(Bt) : Bt;
  const L = (M) => {
    if (!(!(f.flags & 1) || !f.dirty && !M))
      if (t) {
        const Y = f.run();
        if (M || i || P || (k ? Y.some((pe, Be) => Me(pe, F[Be])) : Me(Y, F))) {
          const pe = Xe;
          Ze();
          try {
            v && v(), Xe = f;
            const Be = [
              Y,
              // pass undefined as the old value when it's changed for the first time
              F === Bt ? void 0 : k && F[0] === Bt ? [] : F,
              T
            ];
            F = Y, a ? a(t, 3, Be) : (
              // @ts-expect-error
              t(...Be)
            );
          } finally {
            Xe = pe, qe();
          }
        }
      } else
        f.run();
  };
  return o && o(L), f = new Ys(h), f.scheduler = l ? () => l(L, !1) : L, T = (M) => Ir(M, !1, f), v = f.onStop = () => {
    const M = Gt.get(f);
    if (M) {
      if (a)
        a(M, 4);
      else
        for (const Y of M) Y();
      Gt.delete(f);
    }
  }, t ? s ? L(!0) : F = f.run() : l ? l(L.bind(null, !0), !0) : f.run(), w.pause = f.pause.bind(f), w.resume = f.resume.bind(f), w.stop = w, w;
}
function Ve(e, t = 1 / 0, n) {
  if (t <= 0 || !G(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ le(e))
    Ve(e.value, t, n);
  else if (H(e))
    for (let s = 0; s < e.length; s++)
      Ve(e[s], t, n);
  else if (Le(e) || We(e))
    e.forEach((s) => {
      Ve(s, t, n);
    });
  else if (Ws(e)) {
    for (const s in e)
      Ve(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && Ve(e[s], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.46
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function Ht(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (i) {
    un(i, t, n);
  }
}
function Ue(e, t, n, s) {
  if (j(e)) {
    const i = Ht(e, t, n, s);
    return i && Ks(i) && i.catch((r) => {
      un(r, t, n, void 0, !0);
    }), i;
  }
  if (H(e)) {
    const i = [];
    for (let r = 0; r < e.length; r++)
      i.push(Ue(e[r], t, n, s));
    return i;
  }
}
function un(e, t, n, s = !0, i = !1) {
  const r = t ? t.vnode : null, { errorHandler: l, throwUnhandledErrorInProduction: o } = t && t.appContext.config || q;
  if (t) {
    let a = t.parent;
    const d = t.proxy, f = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; a; ) {
      const h = a.ec;
      if (h && !a.isUnmounted && // Async failures may outlive stopped scopes whose unmount effects
      // are deferred or discarded by Suspense.
      (!i || a.scope.active)) {
        for (let v = 0; v < h.length; v++)
          if (h[v](e, d, f) === !1)
            return;
      }
      a = a.parent;
    }
    if (l) {
      Ze(), Ht(l, null, 10, [
        e,
        d,
        f
      ]), qe();
      return;
    }
  }
  Hr(e, n, r, s, o);
}
function Hr(e, t, n, s = !0, i = !1) {
  if (i)
    throw e;
  console.error(e);
}
const re = [];
let me = -1;
const Ae = [];
let Ke = null, ot = 0;
const hi = /* @__PURE__ */ Promise.resolve();
let Jt = null;
function Jn(e) {
  const t = Jt || hi;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Vr(e) {
  let t = me + 1, n = re.length;
  for (; t < n; ) {
    const s = t + n >>> 1, i = re[s], r = kt(i);
    r < e || r === e && i.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function Yn(e) {
  if (!(e.flags & 1)) {
    const t = kt(e), n = re[re.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= kt(n) ? re.push(e) : re.splice(Vr(t), 0, e), e.flags |= 1, pi();
  }
}
function pi() {
  Jt || (Jt = hi.then(yi));
}
function Dr(e) {
  if (!H(e))
    Ke && e.id === -1 ? Ke.splice(ot + 1, 0, e) : e.flags & 1 || (Ae.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      Ae.push(e[t]);
  pi();
}
function gi(e, t, n, s = me + 1) {
  for (; s < re.length; s++) {
    const i = re[s];
    if (i && i.flags & 2) {
      if (e && i.id !== e.uid || t !== void 0 && !(i.id >= t))
        continue;
      re.splice(s, 1), s = e ? s - 1 : me, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function mi(e, t, n = 0) {
  if (Ae.length) {
    let s = Ae, i = 0;
    if (t) {
      s = [];
      for (let l = 0; l < Ae.length; l++) {
        const o = Ae[l];
        (o.i !== void 0 ? !o.i || o.i.uid < n : t.has(o)) ? Ae[i++] = o : s.push(o);
      }
    }
    const r = [...new Set(s)].sort((l, o) => kt(l) - kt(o));
    if (Ae.length = i, Ke) {
      for (let l = 0; l < r.length; l++)
        Ke.push(r[l]);
      return;
    }
    for (Ke = r, ot = 0; ot < Ke.length; ot++) {
      const l = Ke[ot];
      l.flags & 4 && (l.flags &= -2), l.flags & 8 || l(), l.flags &= -2;
    }
    Ke = null, ot = 0;
  }
}
let Sn = !1;
function Lr(e, t) {
  if (Sn) {
    e();
    return;
  }
  const n = t === void 0 ? void 0 : new Set(Ae);
  e(), Sn = !0;
  try {
    gi(void 0, t), mi(void 0, n, t);
  } finally {
    Sn = !1;
  }
}
const kt = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function yi(e) {
  try {
    for (me = 0; me < re.length; me++) {
      const t = re[me];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Ht(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; me < re.length; me++) {
      const t = re[me];
      t && (t.flags &= -2);
    }
    me = -1, re.length = 0, mi(), Jt = null, (re.length || Ae.length) && yi();
  }
}
let fe = null, bi = null;
function Yt(e) {
  const t = fe;
  return fe = e, bi = e && e.type.__scopeId || null, t;
}
function Nr(e, t = fe, n) {
  if (!t || e._n)
    return e;
  const s = (...i) => {
    s._d && As(-1);
    const r = Yt(t), l = nt.length;
    let o;
    try {
      o = e(...i);
    } finally {
      for (let a = nt.length; a > l; a--) Ii();
      Yt(r), s._d && As(1);
    }
    return o;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function lt(e, t) {
  if (fe === null)
    return e;
  const n = hn(fe), s = e.dirs || (e.dirs = []);
  for (let i = 0; i < t.length; i++) {
    let [r, l, o, a = q] = t[i];
    r && (j(r) && (r = {
      mounted: r,
      updated: r
    }), r.deep && Ve(l), s.push({
      dir: r,
      instance: n,
      value: l,
      oldValue: void 0,
      arg: o,
      modifiers: a
    }));
  }
  return e;
}
function Je(e, t, n, s) {
  let i = e;
  if (s === "beforeMount")
    e._mount = e;
  else if (s === "beforeUpdate") {
    const o = t && t._mount;
    o && (o._latest = e, e._mount = o);
  } else if (s === "mounted") {
    const o = e._latest;
    e._mount = e._latest = void 0, o && (i = o, o._mount = void 0);
  }
  const r = i.dirs, l = t && t.dirs;
  for (let o = 0; o < r.length; o++) {
    let a = r[o];
    l ? a.oldValue = l[o].value : s === "mounted" && a.oldValue !== void 0 && (a = ue({}, a, { oldValue: void 0 }));
    let d = a.dir[s];
    d && (Ze(), Ue(d, n, 8, [
      e.el,
      a,
      i,
      t
    ]), qe());
  }
}
function Ur(e, t, n = !1) {
  const s = Al();
  if (s || at) {
    let i = at ? at._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (i && e in i)
      return i[e];
    if (arguments.length > 1)
      return n && j(t) ? t.call(s && s.proxy) : t;
  }
}
const Br = /* @__PURE__ */ Symbol.for("v-scx"), Kr = () => Ur(Br);
function jr(e, t, n) {
  return Wr(e, t, n);
}
function Wr(e, t, n = q) {
  const { immediate: s, deep: i, flush: r, once: l } = n, o = ue({}, n), a = t && s || !t && r !== "post";
  let d;
  if (nn) {
    if (r === "sync") {
      const T = Kr();
      d = T.__watcherHandles || (T.__watcherHandles = []);
    } else if (!a) {
      const T = () => {
      };
      return T.stop = et, T.resume = et, T.pause = et, T;
    }
  }
  const f = ct;
  o.call = (T, P, k) => Ue(T, f, P, k);
  let h = !1;
  r === "post" ? o.scheduler = (T) => {
    T.i = f, ie(T, f && f.suspense);
  } : r !== "sync" && (h = !0, o.scheduler = (T, P) => {
    P ? T() : Yn(T);
  }), o.augmentJob = (T) => {
    t && (T.flags |= 4), h && (T.flags |= 2, f && (T.id = f.uid, T.i = f));
  };
  const v = Rr(e, t, o);
  return nn && (d ? d.push(v) : a && v()), v;
}
const zr = /* @__PURE__ */ Symbol("_vte"), cn = (e) => e.__isTeleport, xn = /* @__PURE__ */ Symbol("_leaveCb");
function Zr(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== ve) {
        t = n;
        break;
      }
  }
  return t;
}
function _i(e) {
  if (!vi(e))
    return cn(e.type) && e.children ? Zr(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && j(n.default))
      return n.default();
  }
}
function St(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    St(
      cn(n.type) && _i(n) || n,
      t
    );
  } else if (e.shapeFlag & 128) {
    const n = e.suspense;
    if (n) {
      const s = n.isHydrating ? n.pendingBranch : n.activeBranch;
      s && St(s, t.clone(s));
    } else
      e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
  } else if (e.transition = t, e.type === Z && H(e.children)) {
    const n = Si(e.children, !1);
    n && St(n, t);
  }
}
function Rn(e) {
  if (e.component)
    return Rn(e.component.subTree);
  if (e.type === Z) {
    const t = H(e.children) && Si(e.children, !1);
    return t ? Rn(t) : void 0;
  }
  if (e.type !== ve)
    return e;
}
// @__NO_SIDE_EFFECTS__
function Vt(e, t) {
  return j(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    ue({ name: e.name }, t, { setup: e })
  ) : e;
}
function qr(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function _s(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const Xt = /* @__PURE__ */ new WeakMap();
function xt(e, t, n, s, i = !1) {
  if (H(e)) {
    e.forEach(
      (k, D) => xt(
        k,
        t && (H(t) ? t[D] : t),
        n,
        s,
        i
      )
    );
    return;
  }
  if (Ct(s) && !i) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && xt(e, t, n, s.component.subTree);
    return;
  }
  const r = s.shapeFlag & 4 ? hn(s.component) : s.el, l = i ? null : r, { i: o, r: a } = e, d = t && t.r, f = o.refs === q ? o.refs = {} : o.refs, h = o.setupState, v = /* @__PURE__ */ U(h), T = h === q ? Us : (k) => _s(f, k) ? !1 : B(v, k), P = (k, D) => !(D && _s(f, D));
  if (d != null && d !== a) {
    if (vs(t), ee(d))
      f[d] = null, T(d) && (h[d] = null);
    else if (/* @__PURE__ */ le(d)) {
      const k = t;
      P(d, k.k) && (d.value = null), k.k && (f[k.k] = null);
    }
  }
  if (j(a))
    Ht(a, o, 12, [l, f]);
  else {
    const k = ee(a), D = /* @__PURE__ */ le(a);
    if (k || D) {
      const w = () => {
        if (e.f) {
          const F = k ? T(a) ? h[a] : f[a] : P() || !e.k ? a.value : f[e.k];
          if (i)
            H(F) && Bs(F, r);
          else if (H(F))
            F.includes(r) || F.push(r);
          else if (k)
            f[a] = [r], T(a) && (h[a] = f[a]);
          else {
            const L = [r];
            P(a, e.k) && (a.value = L), e.k && (f[e.k] = L);
          }
        } else k ? (f[a] = l, T(a) && (h[a] = l)) : D && (P(a, e.k) && (a.value = l), e.k && (f[e.k] = l));
      };
      if (l) {
        const F = () => {
          w(), Xt.delete(e);
        };
        F.id = -1, Xt.set(e, F), ie(F, n);
      } else
        vs(e), w();
    }
  }
}
function vs(e) {
  const t = Xt.get(e);
  t && (t.flags |= 8, Xt.delete(e));
}
on().requestIdleCallback;
on().cancelIdleCallback;
const Ct = (e) => !!e.type.__asyncLoader, vi = (e) => e.type.__isKeepAlive, Gr = /* @__PURE__ */ Symbol.for("v-ndc");
function De(e, t, n, s) {
  let i;
  const r = n, l = H(e);
  if (l || ee(e)) {
    const o = l && /* @__PURE__ */ ze(e);
    let a = !1, d = !1;
    o && (a = !/* @__PURE__ */ de(e), d = /* @__PURE__ */ ke(e), e = an(e)), i = new Array(e.length);
    for (let f = 0, h = e.length; f < h; f++)
      i[f] = t(
        a ? d ? Ge(he(e[f])) : he(e[f]) : e[f],
        f,
        void 0,
        r
      );
  } else if (typeof e == "number")
    if (!Number.isInteger(e) || e < 0)
      i = [];
    else {
      i = new Array(e);
      for (let o = 0; o < e; o++)
        i[o] = t(o + 1, o, void 0, r);
    }
  else if (G(e))
    if (e[Symbol.iterator])
      i = Array.from(
        e,
        (o, a) => t(o, a, void 0, r)
      );
    else {
      const o = Object.keys(e);
      i = new Array(o.length);
      for (let a = 0, d = o.length; a < d; a++) {
        const f = o[a];
        i[a] = t(e[f], f, a, r);
      }
    }
  else
    i = [];
  return i;
}
const Hn = (e) => e ? Li(e) ? hn(e) : Hn(e.parent) : null, At = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ ue(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Hn(e.parent),
    $root: (e) => Hn(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => e.type,
    $forceUpdate: (e) => e.f || (e.f = () => {
      Yn(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Jn.bind(e.proxy)),
    $watch: (e) => et
  })
), Cn = (e, t) => e !== q && !e.__isScriptSetup && B(e, t), Jr = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: i, props: r, accessCache: l, type: o, appContext: a } = e;
    if (t[0] !== "$") {
      const v = l[t];
      if (v !== void 0)
        switch (v) {
          case 1:
            return s[t];
          case 2:
            return i[t];
          case 4:
            return n[t];
          case 3:
            return r[t];
        }
      else {
        if (Cn(s, t))
          return l[t] = 1, s[t];
        if (B(r, t))
          return l[t] = 3, r[t];
        if (n !== q && B(n, t))
          return l[t] = 4, n[t];
        l[t] = 0;
      }
    }
    const d = At[t];
    let f, h;
    if (d)
      return t === "$attrs" && se(e.attrs, "get", ""), d(e);
    if (
      // css module (injected by vue-loader)
      (f = o.__cssModules) && (f = f[t])
    )
      return f;
    if (n !== q && B(n, t))
      return l[t] = 4, n[t];
    if (
      // global properties
      h = a.config.globalProperties, B(h, t)
    )
      return h[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: i, ctx: r } = e;
    return Cn(i, t) ? (i[t] = n, !0) : B(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (r[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: i, props: r, type: l }
  }, o) {
    let a;
    return !!(n[o] || Cn(t, o) || B(r, o) || B(s, o) || B(At, o) || B(i.config.globalProperties, o) || (a = l.__cssModules) && a[o]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : B(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function wi() {
  return {
    app: null,
    config: {
      isNativeTag: Us,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let Yr = 0;
function Xr(e, t) {
  return function(s, i = null) {
    j(s) || (s = ue({}, s)), i != null && !G(i) && (i = null);
    const r = wi(), l = /* @__PURE__ */ new WeakSet(), o = [];
    let a = !1;
    const d = r.app = {
      _uid: Yr++,
      _component: s,
      _props: i,
      _container: null,
      _context: r,
      _instance: null,
      version: Ol,
      get config() {
        return r.config;
      },
      set config(f) {
      },
      use(f, ...h) {
        return l.has(f) || (f && j(f.install) ? (l.add(f), f.install(d, ...h)) : j(f) && (l.add(f), f(d, ...h))), d;
      },
      mixin(f) {
        return d;
      },
      component(f, h) {
        return h ? (r.components[f] = h, d) : r.components[f];
      },
      directive(f, h) {
        return h ? (r.directives[f] = h, d) : r.directives[f];
      },
      mount(f, h, v) {
        if (!a) {
          const T = d._ceVNode || _e(s, i);
          return T.appContext = r, v === !0 ? v = "svg" : v === !1 && (v = void 0), e(T, f, v), a = !0, d._container = f, f.__vue_app__ = d, hn(T.component);
        }
      },
      onUnmount(f) {
        o.push(f);
      },
      unmount() {
        a && (Ue(
          o,
          d._instance,
          16
        ), e(null, d._container), delete d._container.__vue_app__);
      },
      provide(f, h) {
        return r.provides[f] = h, d;
      },
      runWithContext(f) {
        const h = at;
        at = d;
        try {
          return f();
        } finally {
          at = h;
        }
      }
    };
    return d;
  };
}
let at = null;
const Qr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${ye(t)}Modifiers`] || e[`${st(t)}Modifiers`];
function el(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || q;
  let i = n;
  const r = t.startsWith("update:"), l = r && Qr(s, t.slice(7));
  l && (l.trim && (i = n.map((f) => ee(f) ? f.trim() : f)), l.number && (i = i.map(It)));
  let o, a = s[o = yn(t)] || // also try camelCase event handler (#2249)
  s[o = yn(ye(t))];
  !a && r && (a = s[o = yn(st(t))]), a && Ue(
    a,
    e,
    6,
    i
  );
  const d = s[o + "Once"];
  if (d) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[o])
      return;
    e.emitted[o] = !0, Ue(
      d,
      e,
      6,
      i
    );
  }
}
function tl(e, t, n = !1) {
  const s = t.emitsCache, i = s.get(e);
  if (i !== void 0)
    return i;
  const r = e.emits;
  let l = {};
  return r ? (H(r) ? r.forEach((o) => l[o] = null) : ue(l, r), G(e) && s.set(e, l), l) : (G(e) && s.set(e, null), null);
}
function fn(e, t) {
  return !e || !sn(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), B(e, t[0].toLowerCase() + t.slice(1)) || B(e, st(t)) || B(e, t));
}
function ws(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: i,
    propsOptions: [r],
    slots: l,
    attrs: o,
    emit: a,
    render: d,
    renderCache: f,
    props: h,
    data: v,
    setupState: T,
    ctx: P,
    inheritAttrs: k
  } = e, D = Yt(e);
  let w, F;
  try {
    if (n.shapeFlag & 4) {
      const M = i || s, Y = M;
      w = Te(
        d.call(
          Y,
          M,
          f,
          h,
          T,
          v,
          P
        )
      ), F = o;
    } else {
      const M = t;
      w = Te(
        M.length > 1 ? M(
          h,
          { attrs: o, slots: l, emit: a }
        ) : M(
          h,
          null
        )
      ), F = t.props ? o : nl(o);
    }
  } catch (M) {
    nt.length = 0, un(M, e, 1), w = _e(ve);
  }
  let L = w;
  if (F && k !== !1) {
    const M = Object.keys(F), { shapeFlag: Y } = L;
    M.length && Y & 7 && (r && M.some(rn) && (F = sl(
      F,
      r
    )), L = ut(L, F, !1, !0));
  }
  if (n.dirs && (L = ut(L, null, !1, !0), L.dirs = L.dirs ? L.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const M = cn(L.type) && _i(L) || L;
    St(M, n.transition);
  }
  return w = L, Yt(D), w;
}
function Si(e, t = !0) {
  let n;
  for (let s = 0; s < e.length; s++) {
    const i = e[s];
    if (es(i)) {
      if (i.type !== ve || i.children === "v-if") {
        if (n)
          return;
        n = i;
      }
    } else
      return;
  }
  return n;
}
const nl = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || sn(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, sl = (e, t) => {
  const n = {};
  for (const s in e)
    (!rn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function il(e, t, n) {
  const { props: s, children: i, component: r } = e, { props: l, children: o, patchFlag: a } = t, d = r.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return s ? Ss(s, l, d) : !!l;
    if (a & 8) {
      const f = t.dynamicProps;
      for (let h = 0; h < f.length; h++) {
        const v = f[h];
        if (xi(l, s, v) && !fn(d, v))
          return !0;
      }
    }
  } else
    return (i || o) && (!o || !o.$stable) ? !0 : s === l ? !1 : s ? l ? Ss(s, l, d) : !0 : !!l;
  return !1;
}
function Ss(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let i = 0; i < s.length; i++) {
    const r = s[i];
    if (!B(e, r) || xi(t, e, r) && !fn(n, r))
      return !0;
  }
  return !1;
}
function xi(e, t, n) {
  const s = e[n], i = t[n];
  return n === "style" && G(s) && G(i) ? !Ne(s, i) : s !== i;
}
function rl({ vnode: e, parent: t, suspense: n }, s) {
  for (; t; ) {
    const i = t.subTree;
    if (i.suspense && i.suspense.activeBranch === e && (i.suspense.vnode.el = i.el = s, e = i), i === e)
      (e = t.vnode).el = s, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = s);
}
const Ci = {}, Ai = () => Object.create(Ci), Ti = (e) => Object.getPrototypeOf(e) === Ci;
function ll(e, t, n, s = !1) {
  const i = {}, r = Ai();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), Mi(e, t, i, r);
  for (const l in e.propsOptions[0])
    l in i || (i[l] = void 0);
  n ? e.props = s ? i : /* @__PURE__ */ Mr(i) : e.type.props ? e.props = i : e.props = r, e.attrs = r;
}
function ol(e, t, n, s) {
  const {
    props: i,
    attrs: r,
    vnode: { patchFlag: l }
  } = e, o = /* @__PURE__ */ U(i), [a] = e.propsOptions;
  let d = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || l > 0) && !(l & 16)
  ) {
    if (l & 8) {
      const f = e.vnode.dynamicProps;
      for (let h = 0; h < f.length; h++) {
        let v = f[h];
        if (fn(e.emitsOptions, v))
          continue;
        const T = t[v];
        if (a)
          if (B(r, v))
            T !== r[v] && (r[v] = T, d = !0);
          else {
            const P = ye(v);
            i[P] = Vn(
              a,
              o,
              P,
              T,
              e,
              !1
            );
          }
        else
          T !== r[v] && (r[v] = T, d = !0);
      }
    }
  } else {
    Mi(e, t, i, r) && (d = !0);
    let f;
    for (const h in o)
      (!t || // for camelCase
      !B(t, h) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((f = st(h)) === h || !B(t, f))) && (a ? n && // for camelCase
      (n[h] !== void 0 || // for kebab-case
      n[f] !== void 0) && (i[h] = Vn(
        a,
        o,
        h,
        void 0,
        e,
        !0
      )) : delete i[h]);
    if (r !== o)
      for (const h in r)
        (!t || !B(t, h)) && (delete r[h], d = !0);
  }
  d && He(e.attrs, "set", "");
}
function Mi(e, t, n, s) {
  const [i, r] = e.propsOptions;
  let l = !1, o;
  if (t)
    for (let a in t) {
      if (_t(a))
        continue;
      const d = t[a];
      let f;
      i && B(i, f = ye(a)) ? !r || !r.includes(f) ? n[f] = d : (o || (o = {}))[f] = d : fn(e.emitsOptions, a) || (!(a in s) || d !== s[a]) && (s[a] = d, l = !0);
    }
  if (r) {
    const a = /* @__PURE__ */ U(n), d = o || q;
    for (let f = 0; f < r.length; f++) {
      const h = r[f];
      n[h] = Vn(
        i,
        a,
        h,
        d[h],
        e,
        !B(d, h)
      );
    }
  }
  return l;
}
function Vn(e, t, n, s, i, r) {
  const l = e[n];
  if (l != null) {
    const o = B(l, "default");
    if (o && s === void 0) {
      const a = l.default;
      if (l.type !== Function && !l.skipFactory && j(a)) {
        const { propsDefaults: d } = i;
        if (n in d)
          s = d[n];
        else {
          const f = Di(i);
          s = d[n] = a.call(
            null,
            t
          ), f();
        }
      } else
        s = a;
      i.ce && i.ce._setProp(n, s);
    }
    l[
      0
      /* shouldCast */
    ] && (r && !o ? s = !1 : l[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === st(n)) && (s = !0));
  }
  return s;
}
function al(e, t, n = !1) {
  const s = t.propsCache, i = s.get(e);
  if (i)
    return i;
  const r = e.props, l = {}, o = [];
  if (!r)
    return G(e) && s.set(e, Qe), Qe;
  if (H(r))
    for (let d = 0; d < r.length; d++) {
      const f = ye(r[d]);
      xs(f) && (l[f] = q);
    }
  else if (r)
    for (const d in r) {
      const f = ye(d);
      if (xs(f)) {
        const h = r[d], v = l[f] = H(h) || j(h) ? { type: h } : ue({}, h), T = v.type;
        let P = !1, k = !0;
        if (H(T))
          for (let D = 0; D < T.length; ++D) {
            const w = T[D], F = j(w) && w.name;
            if (F === "Boolean") {
              P = !0;
              break;
            } else F === "String" && (k = !1);
          }
        else
          P = j(T) && T.name === "Boolean";
        v[
          0
          /* shouldCast */
        ] = P, v[
          1
          /* shouldCastTrue */
        ] = k, (P || B(v, "default")) && o.push(f);
      }
    }
  const a = [l, o];
  return G(e) && s.set(e, a), a;
}
function xs(e) {
  return e[0] !== "$" && !_t(e);
}
const Xn = (e) => e === "_" || e === "_ctx" || e === "$stable", Qn = (e) => H(e) ? e.map(Te) : [Te(e)], ul = (e, t, n) => {
  if (t._n)
    return t;
  const s = Nr((...i) => Qn(t(...i)), n);
  return s._c = !1, s;
}, Ei = (e, t, n) => {
  const s = e._ctx;
  for (const i in e) {
    if (Xn(i)) continue;
    const r = e[i];
    if (j(r))
      t[i] = ul(i, r, s);
    else if (r != null) {
      const l = Qn(r);
      t[i] = () => l;
    }
  }
}, $i = (e, t) => {
  const n = Qn(t);
  e.slots.default = () => n;
}, ki = (e, t, n) => {
  for (const s in t)
    (n || !Xn(s)) && (e[s] = t[s]);
}, cl = (e, t, n) => {
  const s = e.slots = Ai();
  if (e.vnode.shapeFlag & 32) {
    const i = t._;
    i ? (ki(s, t, n), n && Zs(s, "_", i, !0)) : Ei(t, s);
  } else t && $i(e, t);
}, fl = (e, t, n) => {
  const { vnode: s, slots: i } = e;
  let r = !0, l = q;
  if (s.shapeFlag & 32) {
    const o = t._;
    o ? n && o === 1 ? r = !1 : ki(i, t, n) : (r = !t.$stable, Ei(t, i)), l = t;
  } else t && ($i(e, t), l = { default: 1 });
  if (r)
    for (const o in i)
      !Xn(o) && l[o] == null && delete i[o];
}, ie = yl;
function dl(e) {
  return hl(e);
}
function hl(e, t) {
  const n = on();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: i,
    patchProp: r,
    createElement: l,
    createText: o,
    createComment: a,
    setText: d,
    setElementText: f,
    parentNode: h,
    nextSibling: v,
    setScopeId: T = et,
    insertStaticContent: P
  } = e, k = (u, c, p, _ = null, m = null, b = null, C = void 0, x = null, S = !!c.dynamicChildren) => {
    if (u === c)
      return;
    u && !yt(u, c) && (_ = Lt(u), Oe(u, m, b, !0), u = null), c.patchFlag === -2 && (S = !1, c.dynamicChildren = null), c.dynamicChildren && u && u.dynamicChildren && u.dynamicChildren.hasOnce && (c.dynamicChildren === Qe && (c.dynamicChildren = []), c.dynamicChildren.hasOnce = !0);
    const { type: y, ref: E, shapeFlag: A } = c;
    switch (y) {
      case dn:
        D(u, c, p, _);
        break;
      case ve:
        w(u, c, p, _);
        break;
      case Zt:
        u == null && F(c, p, _, C);
        break;
      case Z:
        Wi(
          u,
          c,
          p,
          _,
          m,
          b,
          C,
          x,
          S
        );
        break;
      default:
        A & 1 ? Y(
          u,
          c,
          p,
          _,
          m,
          b,
          C,
          x,
          S
        ) : A & 6 ? zi(
          u,
          c,
          p,
          _,
          m,
          b,
          C,
          x,
          S
        ) : (A & 64 || A & 128) && y.process(
          u,
          c,
          p,
          _,
          m,
          b,
          C,
          x,
          S,
          gt
        );
    }
    E != null && m ? xt(E, u && u.ref, b, c || u, !c) : E == null && u && u.ref != null && xt(u.ref, null, b, u, !0);
  }, D = (u, c, p, _) => {
    if (u == null)
      s(
        c.el = o(c.children),
        p,
        _
      );
    else {
      const m = c.el = u.el;
      c.children !== u.children && d(m, c.children);
    }
  }, w = (u, c, p, _) => {
    u == null ? s(
      c.el = a(c.children || ""),
      p,
      _
    ) : c.el = u.el;
  }, F = (u, c, p, _) => {
    [u.el, u.anchor] = P(
      u.children,
      c,
      p,
      _,
      u.el,
      u.anchor
    );
  }, L = ({ el: u, anchor: c }, p, _) => {
    let m;
    for (; u && u !== c; )
      m = v(u), s(u, p, _), u = m;
    s(c, p, _);
  }, M = ({ el: u, anchor: c }) => {
    let p;
    for (; u && u !== c; )
      p = v(u), i(u), u = p;
    i(c);
  }, Y = (u, c, p, _, m, b, C, x, S) => {
    if (c.type === "svg" ? C = "svg" : c.type === "math" && (C = "mathml"), u == null)
      pe(
        c,
        p,
        _,
        m,
        b,
        C,
        x,
        S
      );
    else {
      const y = u.el && u.el._isVueCE ? u.el : null;
      try {
        y && y._beginPatch(), ji(
          u,
          c,
          m,
          b,
          C,
          x,
          S
        );
      } finally {
        y && y._endPatch();
      }
    }
  }, pe = (u, c, p, _, m, b, C, x) => {
    let S, y;
    const { props: E, shapeFlag: A, transition: $, dirs: I } = u;
    if (S = u.el = l(
      u.type,
      b,
      E && E.is,
      E
    ), A & 8 ? f(S, u.children) : A & 16 && it(
      u.children,
      S,
      null,
      _,
      m,
      An(u, b),
      C,
      x
    ), I && Je(u, null, _, "created"), Be(S, u, u.scopeId, C, _), E) {
      for (const W in E)
        W !== "value" && !_t(W) && r(S, W, null, E[W], b, _);
      "value" in E && r(S, "value", null, E.value, b), (y = E.onVnodeBeforeMount) && xe(y, _, u);
    }
    I && Je(u, null, _, "beforeMount");
    const N = pl(m, $);
    N ? $.beforeEnter(S) : $ && !$.persisted && (S[ml] = !0), s(S, c, p), ((y = E && E.onVnodeMounted) || N || I) && ie(() => {
      try {
        y && xe(y, _, u), N && $.enter(S), I && Je(u, null, _, "mounted");
      } finally {
      }
    }, m);
  }, Be = (u, c, p, _, m) => {
    if (p && T(u, p), _)
      for (let b = 0; b < _.length; b++)
        T(u, _[b]);
    if (m) {
      let b = m.subTree;
      if (c === b || Pi(b.type) && (b.ssContent === c || b.ssFallback === c)) {
        const C = m.vnode;
        Be(
          u,
          C,
          C.scopeId,
          C.slotScopeIds,
          m.parent
        );
      }
    }
  }, it = (u, c, p, _, m, b, C, x, S = 0) => {
    for (let y = S; y < u.length; y++) {
      const E = u[y] = x ? Re(u[y]) : Te(u[y]);
      k(
        null,
        E,
        c,
        p,
        _,
        m,
        b,
        C,
        x
      );
    }
  }, ji = (u, c, p, _, m, b, C) => {
    const x = c.el = u.el;
    let { patchFlag: S, dynamicChildren: y, dirs: E } = c;
    S |= u.patchFlag & 16;
    const A = u.props || q, $ = c.props || q;
    let I;
    if (p && Ye(p, !1), (I = $.onVnodeBeforeUpdate) && xe(I, p, c, u), E && Je(c, u, p, "beforeUpdate"), p && Ye(p, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    y && (!u.dynamicChildren || u.dynamicChildren.length !== y.length) && (S = 0, C = !1, y = null), (A.innerHTML && $.innerHTML == null || A.textContent && $.textContent == null) && f(x, ""), y ? pn(
      u.dynamicChildren,
      y,
      x,
      p,
      _,
      An(c, m),
      b
    ) : C || mn(
      u,
      c,
      x,
      null,
      p,
      _,
      An(c, m),
      b,
      !1
    ), S > 0) {
      if (S & 16)
        ts(x, A, $, p, m);
      else if (S & 2 && A.class !== $.class && r(x, "class", null, $.class, m), S & 4 && r(x, "style", A.style, $.style, m), S & 8) {
        const N = c.dynamicProps;
        for (let W = 0; W < N.length; W++) {
          const K = N[W], Q = A[K], te = $[K];
          (te !== Q || K === "value") && r(x, K, Q, te, m, p);
        }
      }
      S & 1 && u.children !== c.children && f(x, c.children);
    } else !C && y == null && ts(x, A, $, p, m);
    ((I = $.onVnodeUpdated) || E) && ie(() => {
      I && xe(I, p, c, u), E && Je(c, u, p, "updated");
    }, _);
  }, pn = (u, c, p, _, m, b, C) => {
    for (let x = 0; x < c.length; x++) {
      const S = u[x], y = c[x], E = S.el || Tt(S), A = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        E && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (S.type === Z || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !yt(S, y) || // - In the case of a component, it could contain anything.
        S.shapeFlag & 198) ? h(E) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          p
        )
      );
      k(
        S,
        y,
        A,
        null,
        _,
        m,
        b,
        C,
        !0
      );
    }
  }, ts = (u, c, p, _, m) => {
    if (c !== p) {
      if (c !== q)
        for (const b in c)
          !_t(b) && !(b in p) && r(
            u,
            b,
            c[b],
            null,
            m,
            _
          );
      for (const b in p) {
        if (_t(b)) continue;
        const C = p[b], x = c[b];
        C !== x && b !== "value" && r(u, b, x, C, m, _);
      }
      "value" in p && r(u, "value", c.value, p.value, m);
    }
  }, Wi = (u, c, p, _, m, b, C, x, S) => {
    const y = c.el = u ? u.el : o(""), E = c.anchor = u ? u.anchor : o("");
    let { patchFlag: A, dynamicChildren: $, slotScopeIds: I } = c;
    I && (x = x ? x.concat(I) : I), u == null ? (s(y, p, _), s(E, p, _), it(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      c.children || [],
      p,
      E,
      m,
      b,
      C,
      x,
      S
    )) : A > 0 && A & 64 && $ && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    u.dynamicChildren && u.dynamicChildren.length === $.length ? (pn(
      u.dynamicChildren,
      $,
      p,
      m,
      b,
      C,
      x
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (c.key != null || m && c === m.subTree) && Oi(
      u,
      c,
      !0
      /* shallow */
    )) : mn(
      u,
      c,
      p,
      E,
      m,
      b,
      C,
      x,
      S
    );
  }, zi = (u, c, p, _, m, b, C, x, S) => {
    c.slotScopeIds = x, u == null ? c.shapeFlag & 512 ? m.ctx.activate(
      c,
      p,
      _,
      C,
      S
    ) : ns(
      c,
      p,
      _,
      m,
      b,
      C,
      S
    ) : Zi(u, c, S);
  }, ns = (u, c, p, _, m, b, C) => {
    const x = u.component = Cl(
      u,
      _,
      m
    );
    if (vi(u) && (x.ctx.renderer = gt), Tl(x, !1, C), x.asyncDep) {
      if (m && m.registerDep(
        x,
        ss,
        C,
        b
      ), !u.el) {
        const S = x.subTree = _e(ve);
        w(null, S, c, p), u.placeholder = S.el;
      }
    } else
      ss(
        x,
        u,
        c,
        p,
        m,
        b,
        C
      );
  }, Zi = (u, c, p) => {
    const _ = c.component = u.component;
    if (il(u, c, p))
      if (_.asyncDep && !_.asyncResolved) {
        c.el = u.el, c.placeholder = u.placeholder, gn(_, c, p);
        return;
      } else
        _.next = c, _.update();
    else
      c.el = u.el, c.placeholder = u.placeholder, _.vnode = c;
  }, ss = (u, c, p, _, m, b, C) => {
    const x = () => {
      if (u.isMounted) {
        let { next: A, bu: $, u: I, parent: N, vnode: W } = u;
        {
          const we = Fi(u);
          if (we) {
            A && (A.el = W.el, gn(u, A, C)), we.asyncDep.then(() => {
              const Fe = () => {
                u.job.flags & 8 || (m && m.pendingBranch ? ie(Fe, m) : y());
              };
              Fe.flags = 48, ie(Fe, m);
            });
            return;
          }
        }
        let K = A, Q;
        Ye(u, !1), A ? (A.el = W.el, gn(u, A, C)) : A = W, $ && zt($), (Q = A.props && A.props.onVnodeBeforeUpdate) && xe(Q, N, A, W), Ye(u, !0);
        const te = ws(u), ge = u.subTree;
        u.subTree = te, k(
          ge,
          te,
          // parent may have changed if it's in a teleport. a root that is a
          // pending async component only has its placeholder comment
          h(
            ge.el || Tt(ge)
          ),
          // anchor may have changed if it's in a fragment
          Lt(ge),
          u,
          m,
          b
        ), A.el = te.el, K === null && rl(u, te.el), I && ie(I, m), (Q = A.props && A.props.onVnodeUpdated) && ie(
          () => xe(Q, N, A, W),
          m
        );
      } else {
        let A;
        const { el: $, props: I } = c, { bm: N, m: W, parent: K, root: Q, type: te } = u, ge = Ct(c);
        Ye(u, !1), N && zt(N), !ge && (A = I && I.onVnodeBeforeMount) && xe(A, K, c), Ye(u, !0);
        {
          Q.ce && Q.ce._hasShadowRoot() && Q.ce._injectChildStyle(
            te,
            u.parent ? u.parent.type : void 0
          );
          const we = u.subTree = ws(u);
          k(
            null,
            we,
            p,
            _,
            u,
            m,
            b
          ), c.el = we.el;
        }
        if (W && ie(W, m), !ge && (A = I && I.onVnodeMounted)) {
          const we = c;
          ie(
            () => xe(A, K, we),
            m
          );
        }
        (c.shapeFlag & 256 || K && Ct(K.vnode) && K.vnode.shapeFlag & 256) && u.a && ie(u.a, m), u.isMounted = !0, c = p = _ = null;
      }
    };
    u.scope.on();
    const S = u.effect = new Ys(x);
    u.scope.off();
    const y = u.update = S.run.bind(S), E = u.job = S.runIfDirty.bind(S);
    E.i = u, E.id = u.uid, S.scheduler = () => Yn(E), Ye(u, !0), y();
  }, gn = (u, c, p) => {
    c.component = u;
    const _ = u.vnode.props;
    u.vnode = c, u.next = null, ol(u, c.props, _, p), fl(u, c.children, p), Ze(), gi(u), qe();
  }, mn = (u, c, p, _, m, b, C, x, S = !1) => {
    const y = u && u.children, E = u ? u.shapeFlag : 0, A = c.children, { patchFlag: $, shapeFlag: I } = c;
    if ($ > 0) {
      if ($ & 128) {
        is(
          y,
          A,
          p,
          _,
          m,
          b,
          C,
          x,
          S
        );
        return;
      } else if ($ & 256) {
        qi(
          y,
          A,
          p,
          _,
          m,
          b,
          C,
          x,
          S
        );
        return;
      }
    }
    I & 8 ? (E & 16 && pt(y, m, b), A !== y && f(p, A)) : E & 16 ? I & 16 ? is(
      y,
      A,
      p,
      _,
      m,
      b,
      C,
      x,
      S
    ) : pt(y, m, b, !0) : (E & 8 && f(p, ""), I & 16 && it(
      A,
      p,
      _,
      m,
      b,
      C,
      x,
      S
    ));
  }, qi = (u, c, p, _, m, b, C, x, S) => {
    u = u || Qe, c = c || Qe;
    const y = u.length, E = c.length, A = Math.min(y, E);
    let $;
    for ($ = 0; $ < A; $++) {
      const I = c[$] = S ? Re(c[$]) : Te(c[$]);
      k(
        u[$],
        I,
        p,
        null,
        m,
        b,
        C,
        x,
        S
      );
    }
    y > E ? pt(
      u,
      m,
      b,
      !0,
      !1,
      A
    ) : it(
      c,
      p,
      _,
      m,
      b,
      C,
      x,
      S,
      A
    );
  }, is = (u, c, p, _, m, b, C, x, S) => {
    let y = 0;
    const E = c.length;
    let A = u.length - 1, $ = E - 1;
    for (; y <= A && y <= $; ) {
      const I = u[y], N = c[y] = S ? Re(c[y]) : Te(c[y]);
      if (yt(I, N))
        k(
          I,
          N,
          p,
          null,
          m,
          b,
          C,
          x,
          S
        );
      else
        break;
      y++;
    }
    for (; y <= A && y <= $; ) {
      const I = u[A], N = c[$] = S ? Re(c[$]) : Te(c[$]);
      if (yt(I, N))
        k(
          I,
          N,
          p,
          null,
          m,
          b,
          C,
          x,
          S
        );
      else
        break;
      A--, $--;
    }
    if (y > A) {
      if (y <= $) {
        const I = $ + 1, N = I < E ? c[I].el : _;
        for (; y <= $; )
          k(
            null,
            c[y] = S ? Re(c[y]) : Te(c[y]),
            p,
            N,
            m,
            b,
            C,
            x,
            S
          ), y++;
      }
    } else if (y > $)
      for (; y <= A; )
        Oe(u[y], m, b, !0), y++;
    else {
      const I = y, N = y, W = /* @__PURE__ */ new Map();
      for (y = N; y <= $; y++) {
        const oe = c[y] = S ? Re(c[y]) : Te(c[y]);
        oe.key != null && W.set(oe.key, y);
      }
      let K, Q = 0;
      const te = $ - N + 1;
      let ge = !1, we = 0;
      const Fe = new Array(te);
      for (y = 0; y < te; y++) Fe[y] = 0;
      for (y = I; y <= A; y++) {
        const oe = u[y];
        if (Q >= te) {
          Oe(oe, m, b, !0);
          continue;
        }
        let Se;
        if (oe.key != null)
          Se = W.get(oe.key);
        else
          for (K = N; K <= $; K++)
            if (Fe[K - N] === 0 && yt(oe, c[K])) {
              Se = K;
              break;
            }
        Se === void 0 ? Oe(oe, m, b, !0) : (Fe[Se - N] = y + 1, Se >= we ? we = Se : ge = !0, k(
          oe,
          c[Se],
          p,
          null,
          m,
          b,
          C,
          x,
          S
        ), Q++);
      }
      const as = ge ? gl(Fe) : Qe;
      for (K = as.length - 1, y = te - 1; y >= 0; y--) {
        const oe = N + y, Se = c[oe], us = c[oe + 1], cs = oe + 1 < E ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          us.el || Tt(us)
        ) : _;
        Fe[y] === 0 ? k(
          null,
          Se,
          p,
          cs,
          m,
          b,
          C,
          x,
          S
        ) : ge && (K < 0 || y !== as[K] ? Dt(Se, p, cs, 2) : K--);
      }
    }
  }, Dt = (u, c, p, _, m = null) => {
    const { el: b, type: C, transition: x, children: S, shapeFlag: y } = u;
    if (y & 6) {
      Dt(u.component.subTree, c, p, _);
      return;
    }
    if (y & 128) {
      u.suspense.move(c, p, _);
      return;
    }
    if (y & 64) {
      C.move(u, c, p, gt);
      return;
    }
    if (C === Z) {
      s(b, c, p);
      for (let A = 0; A < S.length; A++)
        Dt(S[A], c, p, _);
      s(u.anchor, c, p);
      return;
    }
    if (C === Zt) {
      L(u, c, p);
      return;
    }
    if (_ !== 2 && y & 1 && x)
      if (_ === 0)
        x.persisted && !b[xn] ? s(b, c, p) : (x.beforeEnter(b), s(b, c, p), ie(() => x.enter(b), m));
      else {
        const { leave: A, delayLeave: $, afterLeave: I } = x, N = () => {
          u.ctx.isUnmounted ? i(b) : s(b, c, p);
        }, W = () => {
          const K = b._isLeaving || !!b[xn];
          b._isLeaving && b[xn](
            !0
            /* cancelled */
          ), x.persisted && !K ? N() : A(b, () => {
            N(), I && I();
          });
        };
        $ ? $(b, N, W) : W();
      }
    else
      s(b, c, p);
  }, Oe = (u, c, p, _ = !1, m = !1) => {
    const {
      type: b,
      props: C,
      ref: x,
      children: S,
      dynamicChildren: y,
      shapeFlag: E,
      patchFlag: A,
      dirs: $,
      cacheIndex: I,
      memo: N
    } = u;
    if ((A === -2 || y && y.hasOnce) && (m = !1), x != null && (Ze(), xt(x, null, p, u, !0), qe()), I != null && (!u.ctx || u.ctx === c) && (c.renderCache[I] = void 0), E & 256 && c.ctx.deactivate(u))
      return;
    const W = E & 1 && $, K = !Ct(u);
    let Q;
    if (K && (Q = C && C.onVnodeBeforeUnmount) && xe(Q, c, u), E & 6)
      Gi(u.component, p, _);
    else {
      if (E & 128) {
        u.suspense.unmount(p, _);
        return;
      }
      W && Je(u, null, c, "beforeUnmount"), E & 64 ? u.type.remove(
        u,
        c,
        p,
        gt,
        _
      ) : y && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !y.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (b !== Z || A > 0 && A & 64) ? pt(
        y,
        c,
        p,
        !1,
        !0
      ) : (b === Z && A & 384 || !m && E & 16) && pt(S, c, p), _ && rs(u);
    }
    const te = N != null && I == null;
    (K && (Q = C && C.onVnodeUnmounted) || W || te) && ie(() => {
      Q && xe(Q, c, u), W && Je(u, null, c, "unmounted"), te && (u.el = null);
    }, p);
  }, rs = (u) => {
    const { type: c, el: p, anchor: _, transition: m } = u, b = c === Z;
    if (b && !m) {
      ls(p, _);
      return;
    }
    if (c === Zt) {
      M(u), m && !m.persisted && m.afterLeave && m.afterLeave();
      return;
    }
    const C = b ? Rn(u) : u, x = () => {
      b ? h(p) && ls(p, _) : i(p), m && !m.persisted && m.afterLeave && m.afterLeave();
    };
    if (C && C.shapeFlag & 1 && m && !m.persisted) {
      const { leave: S, delayLeave: y } = m, E = C.el, A = () => S(E, x);
      y ? y(E, x, A) : A();
    } else
      x();
  }, ls = (u, c) => {
    let p;
    for (; u !== c; )
      p = v(u), i(u), u = p;
    i(c);
  }, Gi = (u, c, p) => {
    const { bum: _, scope: m, job: b, subTree: C, um: x, m: S, a: y } = u;
    Cs(S), Cs(y), _ && zt(_), m.stop(), b ? (b.flags |= 8, Oe(C, u, c, p)) : C && (C.transition = u.vnode.transition, Oe(C, u, c, p)), x && ie(x, c);
    const E = () => {
      u.isUnmounted = !0;
    };
    E.flags = 16, ie(E, c);
  }, pt = (u, c, p, _ = !1, m = !1, b = 0) => {
    for (let C = b; C < u.length; C++)
      Oe(u[C], c, p, _, m);
  }, Lt = (u) => {
    if (u.shapeFlag & 6)
      return Lt(u.component.subTree);
    if (u.shapeFlag & 128)
      return u.suspense.next();
    const c = v(u.anchor || u.el), p = c && c[zr];
    return p ? v(p) : c;
  }, os = (u, c, p) => {
    const _ = u && c._vnode ? void 0 : u && u.component ? u.component.uid : xl();
    Lr(() => {
      u == null ? c._vnode && Oe(c._vnode, null, null, !0) : k(
        c._vnode || null,
        u,
        c,
        null,
        null,
        null,
        p
      ), c._vnode = u;
    }, _);
  }, gt = {
    p: k,
    um: Oe,
    m: Dt,
    r: rs,
    mt: ns,
    mc: it,
    pc: mn,
    pbc: pn,
    n: Lt,
    o: e
  };
  return {
    render: os,
    hydrate: void 0,
    createApp: Xr(os)
  };
}
function An({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ye({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function pl(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Oi(e, t, n = !1) {
  const s = e.children, i = t.children;
  if (H(s) && H(i))
    for (let r = 0; r < s.length; r++) {
      const l = s[r];
      let o = i[r];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = i[r] = Re(i[r]), o.el = l.el), !n && o.patchFlag !== -2 && Oi(l, o)), o.type === dn && (o.patchFlag === -1 && (o = i[r] = Re(o)), o.el = l.el), o.type === ve && !o.el && (o.el = l.el);
    }
}
function gl(e) {
  const t = e.slice(), n = [0];
  let s, i, r, l, o;
  const a = e.length;
  for (s = 0; s < a; s++) {
    const d = e[s];
    if (d !== 0) {
      if (i = n[n.length - 1], e[i] < d) {
        t[s] = i, n.push(s);
        continue;
      }
      for (r = 0, l = n.length - 1; r < l; )
        o = r + l >> 1, e[n[o]] < d ? r = o + 1 : l = o;
      d < e[n[r]] && (r > 0 && (t[s] = n[r - 1]), n[r] = s);
    }
  }
  for (r = n.length, l = n[r - 1]; r-- > 0; )
    n[r] = l, l = t[l];
  return n;
}
function Fi(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : Fi(t);
}
function Cs(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function Tt(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  if (t)
    return Tt(t.subTree);
  const n = e.suspense;
  return n && n.activeBranch ? Tt(n.activeBranch) : null;
}
const Pi = (e) => e.__isSuspense, ml = /* @__PURE__ */ Symbol("_deferredEnter");
function yl(e, t) {
  t && t.pendingBranch ? H(e) ? t.effects.push(...e) : t.effects.push(e) : Dr(e);
}
const Z = /* @__PURE__ */ Symbol.for("v-fgt"), dn = /* @__PURE__ */ Symbol.for("v-txt"), ve = /* @__PURE__ */ Symbol.for("v-cmt"), Zt = /* @__PURE__ */ Symbol.for("v-stc"), nt = [];
let ae = null;
function O(e = !1) {
  nt.push(ae = e ? null : []);
}
function Ii() {
  nt.pop(), ae = nt[nt.length - 1] || null;
}
let Ot = 1;
function As(e, t = !1) {
  Ot += e, e < 0 && ae && t && (ae.hasOnce = !0);
}
function Ri(e) {
  return e.dynamicChildren = Ot > 0 ? ae || Qe : null, Ii(), Ot > 0 && ae && ae.push(e), e;
}
function R(e, t, n, s, i, r) {
  return Ri(
    g(
      e,
      t,
      n,
      s,
      i,
      r,
      !0
    )
  );
}
function Qt(e, t, n, s, i) {
  return Ri(
    _e(
      e,
      t,
      n,
      s,
      i,
      !0
    )
  );
}
function es(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function yt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Hi = ({ key: e }) => e ?? null, qt = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? ee(e) || /* @__PURE__ */ le(e) || j(e) ? { i: fe, r: e, k: t, f: !!n } : e : null);
function g(e, t = null, n = null, s = 0, i = null, r = e === Z ? 0 : 1, l = !1, o = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Hi(t),
    ref: t && qt(t),
    scopeId: bi,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: r,
    patchFlag: s,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: fe
  };
  return o ? (en(a, n), r & 128 && e.normalize(a)) : n && (a.shapeFlag |= ee(n) ? 8 : 16), Ot > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  ae && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && ae.push(a), a;
}
const _e = bl;
function bl(e, t = null, n = null, s = 0, i = null, r = !1) {
  if ((!e || e === Gr) && (e = ve), es(e)) {
    const o = ut(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && en(o, n), Ot > 0 && !r && ae && (o.shapeFlag & 6 ? ae[ae.indexOf(e)] = o : ae.push(o)), o.patchFlag = -2, o;
  }
  if (kl(e) && (e = e.__vccOpts), t) {
    t = _l(t);
    let { class: o, style: a } = t;
    o && !ee(o) && (t.class = Rt(o)), G(a) && (/* @__PURE__ */ Gn(a) && !H(a) && (a = ue({}, a)), t.style = Mt(a));
  }
  const l = ee(e) ? 1 : Pi(e) ? 128 : cn(e) ? 64 : G(e) ? 4 : j(e) ? 2 : 0;
  return g(
    e,
    t,
    n,
    s,
    i,
    l,
    r,
    !0
  );
}
function _l(e) {
  return e ? /* @__PURE__ */ Gn(e) ? ue({}, e) : Ti(e) ? ue({}, e[Ui] || e) : e : null;
}
function ut(e, t, n = !1, s = !1) {
  const { props: i, ref: r, patchFlag: l, children: o, transition: a } = e, d = t ? wl(i || {}, t) : i, f = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: d,
    key: d && Hi(d),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? H(r) ? r.concat(qt(t)) : [r, qt(t)] : qt(t)
    ) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: o,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Z ? l === -1 ? 16 : l | 16 : l,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: a,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && ut(e.ssContent),
    ssFallback: e.ssFallback && ut(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
    cacheIndex: e.cacheIndex
  };
  return a && s && St(
    f,
    a.clone(f)
  ), f;
}
function X(e = " ", t = 0) {
  return _e(dn, null, e, t);
}
function vl(e, t) {
  const n = _e(Zt, null, e);
  return n.staticCount = t, n;
}
function J(e = "", t = !1) {
  return t ? (O(), Qt(ve, null, e)) : _e(ve, null, e);
}
function Te(e) {
  return e == null || typeof e == "boolean" ? _e(ve) : H(e) ? _e(
    Z,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : es(e) ? Re(e) : _e(dn, null, String(e));
}
function Re(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : ut(e);
}
function en(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (H(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), en(e, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = t._;
      !i && !Ti(t) ? t._ctx = fe : i === 3 && fe && (fe.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (j(t)) {
    if (s & 65) {
      en(e, { default: t });
      return;
    }
    t = { default: t, _ctx: fe }, n = 32;
  } else
    t = String(t), s & 64 ? (n = 16, t = [X(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function wl(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const i in s)
      if (i === "class")
        t.class !== s.class && (t.class = Rt([t.class, s.class]));
      else if (i === "style")
        t.style = Mt([t.style, s.style]);
      else if (sn(i)) {
        const r = t[i], l = s[i];
        l && r !== l && !(H(r) && r.includes(l)) ? t[i] = r ? [].concat(r, l) : l : l == null && r == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !rn(i) && (t[i] = l);
      } else i !== "" && (t[i] = s[i]);
  }
  return t;
}
function xe(e, t, n, s = null) {
  Ue(e, t, 7, [
    n,
    s
  ]);
}
const Sl = /* @__PURE__ */ wi();
let Vi = 0;
function xl() {
  return Vi;
}
function Cl(e, t, n) {
  const s = e.type, i = (t ? t.appContext : e.appContext) || Sl, r = {
    uid: Vi++,
    vnode: e,
    type: s,
    parent: t,
    appContext: i,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new ur(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(i.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: al(s, i),
    emitsOptions: tl(s, i),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: q,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: q,
    data: q,
    props: q,
    attrs: q,
    slots: q,
    refs: q,
    setupState: q,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return r.ctx = { _: r }, r.root = t ? t.root : r, r.emit = el.bind(null, r), e.ce && e.ce(r), r;
}
let ct = null;
const Al = () => ct || fe;
let tn, Ft;
{
  const e = on(), t = (n, s) => {
    let i;
    return (i = e[n]) || (i = e[n] = []), i.push(s), (r) => {
      i.length > 1 ? i.forEach((l) => l(r)) : i[0](r);
    };
  };
  tn = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => ct = n
  ), Ft = t(
    "__VUE_SSR_SETTERS__",
    (n) => nn = n
  );
}
const Di = (e) => {
  const t = ct;
  return tn(e), e.scope.on(), () => {
    e.scope.off(), tn(t);
  };
}, Ts = () => {
  ct && ct.scope.off(), tn(null);
};
function Li(e) {
  return e.vnode.shapeFlag & 4;
}
let nn = !1;
function Tl(e, t = !1, n = !1) {
  t && Ft(t);
  const { props: s, children: i } = e.vnode, r = Li(e);
  ll(e, s, r, t), cl(e, i, n || t);
  const l = r ? Ml(e, t) : void 0;
  return t && Ft(!1), l;
}
function Ml(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Jr);
  const { setup: s } = n;
  if (s) {
    Ze();
    const i = e.setupContext = s.length > 1 ? $l(e) : null, r = Di(e), l = Ht(
      s,
      e,
      0,
      [
        e.props,
        i
      ]
    ), o = Ks(l);
    if (qe(), r(), (o || e.sp) && !Ct(e) && qr(e), o) {
      if (l.then(Ts, Ts), t)
        return l.then((a) => {
          Ft(!0);
          try {
            Ms(e, a, t);
          } finally {
            Ft(!1);
          }
        }).catch((a) => {
          un(a, e, 0, void 0, !0), e.ssrRender = (d, f) => f("<!---->");
        });
      e.asyncDep = l;
    } else
      Ms(e, l);
  } else
    Ni(e);
}
function Ms(e, t, n) {
  j(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : G(t) && (e.setupState = di(t)), Ni(e);
}
function Ni(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || et);
}
const Ui = /* @__PURE__ */ Symbol(), El = {
  get(e, t) {
    return se(e, "get", ""), t === Ui ? e : e[t];
  }
};
function $l(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, El),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function hn(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(di(Er(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in At)
        return At[n](e);
    },
    has(t, n) {
      return n in t || n in At;
    }
  })) : e.proxy;
}
function kl(e) {
  return j(e) && "__vccOpts" in e;
}
const ft = (e, t) => /* @__PURE__ */ Pr(e, t, nn), Ol = "3.5.46";
/**
* @vue/runtime-dom v3.5.46
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Dn;
const Es = typeof window < "u" && window.trustedTypes;
if (Es)
  try {
    Dn = /* @__PURE__ */ Es.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Bi = Dn ? (e) => Dn.createHTML(e) : (e) => e, Fl = "http://www.w3.org/2000/svg", Pl = "http://www.w3.org/1998/Math/MathML", Ie = typeof document < "u" ? document : null, $s = Ie && /* @__PURE__ */ Ie.createElement("template"), Il = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const i = t === "svg" ? Ie.createElementNS(Fl, e) : t === "mathml" ? Ie.createElementNS(Pl, e) : n ? Ie.createElement(e, { is: n }) : Ie.createElement(e);
    return e === "select" && s && s.multiple != null && i.setAttribute("multiple", s.multiple), i;
  },
  createText: (e) => Ie.createTextNode(e),
  createComment: (e) => Ie.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => Ie.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, s, i, r) {
    const l = n ? n.previousSibling : t.lastChild;
    if (i && (i === r || i.nextSibling))
      for (; t.insertBefore(i.cloneNode(!0), n), !(i === r || !(i = i.nextSibling)); )
        ;
    else {
      $s.innerHTML = Bi(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const o = $s.content;
      if (s === "svg" || s === "mathml") {
        const a = o.firstChild;
        for (; a.firstChild; )
          o.appendChild(a.firstChild);
        o.removeChild(a);
      }
      t.insertBefore(o, n);
    }
    return [
      // first
      l ? l.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, Rl = /* @__PURE__ */ Symbol("_vtc");
function Hl(e, t, n) {
  const s = e[Rl];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const ks = /* @__PURE__ */ Symbol("_vod"), Vl = /* @__PURE__ */ Symbol("_vsh"), Dl = /* @__PURE__ */ Symbol(""), Ll = /(?:^|;)\s*display\s*:/;
function Nl(e, t, n) {
  const s = e.style, i = ee(n);
  let r = !1;
  if (n && !i) {
    if (t)
      if (ee(t))
        for (const l of t.split(";")) {
          const o = l.slice(0, l.indexOf(":")).trim();
          n[o] == null && bt(s, o, "");
        }
      else
        for (const l in t)
          n[l] == null && bt(s, l, "");
    for (const l in n) {
      l === "display" && (r = !0);
      const o = n[l];
      o != null ? Bl(
        e,
        l,
        !ee(t) && t ? t[l] : void 0,
        o
      ) || bt(s, l, o) : bt(s, l, "");
    }
  } else if (i) {
    if (t !== n) {
      const l = s[Dl];
      l && (n += ";" + l), s.cssText = n, r = Ll.test(n);
    }
  } else t && e.removeAttribute("style");
  ks in e && ((!i || t !== n) && (e[ks] = r ? s.display : ""), e[Vl] && (s.display = "none"));
}
const Kt = /\s*!important$/;
function bt(e, t, n) {
  if (H(n))
    n.forEach((s) => bt(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    Kt.test(n) ? e.setProperty(t, n.replace(Kt, ""), "important") : e.setProperty(t, n);
  else {
    const s = Ul(e, t);
    Kt.test(n) ? e.setProperty(
      st(s),
      n.replace(Kt, ""),
      "important"
    ) : e[s] = n;
  }
}
const Os = ["Webkit", "Moz", "ms"], Tn = {};
function Ul(e, t) {
  const n = Tn[t];
  if (n)
    return n;
  let s = ye(t);
  if (s !== "filter" && s in e)
    return Tn[t] = s;
  s = zs(s);
  for (let i = 0; i < Os.length; i++) {
    const r = Os[i] + s;
    if (r in e)
      return Tn[t] = r;
  }
  return t;
}
function Bl(e, t, n, s) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && ee(s) && n === s;
}
const Fs = "http://www.w3.org/1999/xlink";
function Ps(e, t, n, s, i, r = lr(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Fs, t.slice(6, t.length)) : e.setAttributeNS(Fs, t, n) : n == null || r && !qs(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    r ? "" : $e(n) ? String(n) : n
  );
}
function Is(e, t, n, s, i) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Bi(n) : n);
    return;
  }
  const r = e.tagName;
  if (t === "value" && r !== "PROGRESS" && // custom elements may use _value internally
  !r.includes("-")) {
    const o = r === "OPTION" ? e.getAttribute("value") || "" : e.value, a = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (o !== a || !("_value" in e)) && (e.value = a), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let l = !1;
  if (n === "" || n == null) {
    const o = typeof e[t];
    o === "boolean" ? n = qs(n) : n == null && o === "string" ? (n = "", l = !0) : o === "number" && (n = 0, l = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  l && e.removeAttribute(i || t);
}
function je(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function Kl(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const Rs = /* @__PURE__ */ Symbol("_vei");
function jl(e, t, n, s, i = null) {
  const r = e[Rs] || (e[Rs] = {}), l = r[t];
  if (s && l)
    l.value = s;
  else {
    const [o, a] = Zl(t);
    if (s) {
      const d = r[t] = Jl(
        s,
        i
      );
      je(e, o, d, a);
    } else l && (Kl(e, o, l, a), r[t] = void 0);
  }
}
const Wl = /(Once|Passive|Capture)$/, zl = /^on:?(?:Once|Passive|Capture)$/;
function Zl(e) {
  let t, n;
  for (; (n = e.match(Wl)) && !zl.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : st(e.slice(2)), t];
}
let Mn = 0;
const ql = /* @__PURE__ */ Promise.resolve(), Gl = () => Mn || (ql.then(() => Mn = 0), Mn = Date.now());
function Jl(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    const i = n.value;
    if (H(i)) {
      const r = s.stopImmediatePropagation;
      s.stopImmediatePropagation = () => {
        r.call(s), s._stopped = !0;
      };
      const l = i.slice(), o = [s];
      for (let a = 0; a < l.length && !s._stopped; a++) {
        const d = l[a];
        d && Ue(
          d,
          t,
          5,
          o
        );
      }
    } else
      Ue(
        i,
        t,
        5,
        [s]
      );
  };
  return n.value = e, n.attached = Gl(), n;
}
const Hs = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Yl = (e, t, n, s, i, r) => {
  const l = i === "svg";
  t === "class" ? Hl(e, s, l) : t === "style" ? Nl(e, n, s) : sn(t) ? rn(t) || jl(e, t, n, s, r) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Xl(e, t, s, l)) ? (Is(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ps(e, t, s, l, r, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Ql(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !ee(s))) ? Is(e, ye(t), s, r, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), Ps(e, t, s, l));
};
function Xl(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && Hs(t) && j(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return Hs(t) && ee(n) ? !1 : t in e;
}
function Ql(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const s = ye(t);
  return Array.isArray(n) ? n.some((i) => ye(i) === s) : Object.keys(n).some((i) => ye(i) === s);
}
const dt = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return H(t) ? (n) => zt(t, n) : t;
};
function eo(e) {
  e.target.composing = !0;
}
function Vs(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const Ee = /* @__PURE__ */ Symbol("_assign"), jt = /* @__PURE__ */ Symbol("_initialValue");
function En(e, t, n) {
  return t && (e = e.trim()), n && (e = It(e)), e;
}
const Wt = {
  created(e, { modifiers: { lazy: t, trim: n, number: s } }, i) {
    e.parentNode && (e.type === "text" ? e[jt] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[jt] = e.defaultValue.replace(/\r\n?/g, `
`))), e[Ee] = dt(i);
    const r = s || i.props && i.props.type === "number";
    je(e, t ? "change" : "input", (l) => {
      l.target.composing || e[Ee](En(e.value, n, r));
    }), (n || r) && je(e, "change", () => {
      e.value = En(e.value, n, r);
    }), t || (je(e, "compositionstart", eo), je(e, "compositionend", Vs), je(e, "change", Vs));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t, modifiers: { trim: n, number: s } }) {
    const i = t ?? "", r = e[jt];
    delete e[jt], r !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== r ? e[Ee](En(e.value, n, s)) : e.value = i;
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: s, trim: i, number: r } }, l) {
    if (e[Ee] = dt(l), e.composing) return;
    const o = (r || e.type === "number") && !/^0\d/.test(e.value) ? It(e.value) : e.value, a = t ?? "";
    if (o === a)
      return;
    const d = e.getRootNode();
    (d instanceof Document || d instanceof ShadowRoot) && d.activeElement === e && e.type !== "range" && (s && t === n || i && e.value.trim() === a) || (e.value = a);
  }
}, to = {
  // #4096 array checkboxes need to be deep traversed
  deep: !0,
  created(e, t, n) {
    e[Ee] = dt(n), je(e, "change", () => {
      const s = e._modelValue, i = Pt(e), r = e.checked, l = e[Ee];
      if (H(s)) {
        const o = Un(s, i), a = o !== -1;
        if (r && !a)
          l(s.concat(i));
        else if (!r && a) {
          const d = [...s];
          d.splice(o, 1), l(d);
        }
      } else if (Le(s)) {
        const o = new Set(s);
        r ? o.add(i) : o.delete(i), l(o);
      } else
        l(Ki(e, r));
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: Ds,
  beforeUpdate(e, t, n) {
    e[Ee] = dt(n), Ds(e, t, n);
  }
};
function Ds(e, { value: t, oldValue: n }, s) {
  e._modelValue = t;
  let i;
  if (H(t))
    i = Un(t, s.props.value) > -1;
  else if (Le(t))
    i = t.has(s.props.value);
  else {
    if (t === n) return;
    i = Ne(t, Ki(e, !0));
  }
  e.checked !== i && (e.checked = i);
}
const no = {
  // <select multiple> value need to be deep traversed
  deep: !0,
  created(e, { value: t, modifiers: { number: n } }, s) {
    e._modelValue = t, je(e, "change", () => {
      const i = Array.prototype.filter.call(e.options, (a) => a.selected).map(
        (a) => n ? It(Pt(a)) : Pt(a)
      ), r = e.multiple, l = r ? Le(e._modelValue) ? new Set(i) : i : i[0], o = e._pendingValue = [
        r,
        r ? H(l) ? i.slice() : i : l
      ];
      try {
        e[Ee](l);
      } finally {
        Jn(() => {
          e._pendingValue === o && (e._pendingValue = void 0);
        });
      }
    }), e[Ee] = dt(s);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(e, { value: t, modifiers: { number: n } }) {
    Ls(e, t, n);
  },
  beforeUpdate(e, { value: t }, n) {
    e._modelValue = t, e[Ee] = dt(n);
  },
  updated(e, { value: t, modifiers: { number: n } }) {
    const s = e._pendingValue;
    e._pendingValue = void 0, (!s || s[0] !== e.multiple || !so(t, s[1], s[0])) && Ls(e, t, n);
  }
};
function so(e, t, n) {
  if (!n || H(e)) return Ne(e, t);
  if (Le(e)) {
    if (e.size !== t.length) return !1;
    for (const s of t)
      if (!e.has(s)) return !1;
    return !0;
  }
  return !1;
}
function Ls(e, t, n = !1) {
  const s = e.multiple, i = H(t);
  if (!(s && !i && !Le(t))) {
    for (let r = 0, l = e.options.length; r < l; r++) {
      const o = e.options[r], a = Pt(o);
      if (s)
        if (i) {
          const d = typeof a;
          d === "string" || d === "number" ? o.selected = t.some((f) => String(f) === String(a)) : o.selected = Un(t, a) > -1;
        } else
          o.selected = t.has(a) || n && typeof a == "string" && t.has(It(a));
      else if (Ne(Pt(o), t)) {
        e.selectedIndex !== r && (e.selectedIndex = r);
        return;
      }
    }
    !s && e.selectedIndex !== -1 && (e.selectedIndex = -1);
  }
}
function Pt(e) {
  return "_value" in e ? e._value : e.value;
}
function Ki(e, t) {
  const n = t ? "_trueValue" : "_falseValue";
  return n in e ? e[n] : t;
}
const io = ["ctrl", "shift", "alt", "meta"], ro = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => io.some((n) => e[`${n}Key`] && !t.includes(n))
}, lo = (e, t) => {
  if (!e) return e;
  const n = e._withMods || (e._withMods = {}), s = t.join(".");
  return n[s] || (n[s] = ((i, ...r) => {
    for (let l = 0; l < t.length; l++) {
      const o = ro[t[l]];
      if (o && o(i, t)) return;
    }
    return e(i, ...r);
  }));
}, oo = /* @__PURE__ */ ue({ patchProp: Yl }, Il);
let Ns;
function ao() {
  return Ns || (Ns = dl(oo));
}
const uo = ((...e) => {
  const t = ao().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const i = fo(s);
    if (!i) return;
    const r = t._component;
    !j(r) && !r.render && !r.template && (r.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
    const l = n(i, !1, co(i));
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), l;
  }, t;
});
function co(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function fo(e) {
  return ee(e) ? document.querySelector(e) : e;
}
const ho = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20256%20256'%20width='256'%20height='256'%20role='img'%20aria-labelledby='title'%3e%3ctitle%20id='title'%3eWarmwasser-Zirkulation:%20Wassertropfen%20mit%20Zirkulationspfeilen%3c/title%3e%3cg%20fill='none'%20stroke='%23087e87'%20stroke-width='18'%20stroke-linecap='round'%3e%3cpath%20d='M26%2096%20C43%2036%20100%2010%20152%2028%20C182%2037%20204%2059%20215%2082'/%3e%3cpath%20d='M230%20160%20C213%20220%20156%20246%20104%20228%20C74%20219%2052%20197%2041%20174'/%3e%3c/g%3e%3cg%20fill='%23087e87'%3e%3cpath%20d='M195%2076%20L231%20107%20L235%2062%20Z'/%3e%3cpath%20d='M61%20180%20L25%20149%20L21%20194%20Z'/%3e%3c/g%3e%3cpath%20fill='%23e97a32'%20d='M128%2060%20C120%2080%2085%20119%2085%20144%20C85%20168%20104%20187%20128%20187%20C152%20187%20171%20168%20171%20144%20C171%20119%20136%2080%20128%2060%20Z'/%3e%3cpath%20fill='none'%20stroke='%23ffffff'%20stroke-width='8'%20stroke-linecap='round'%20d='M103%20143%20C103%20155%20111%20166%20123%20168'/%3e%3c/svg%3e", po = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20256%20256'%20width='256'%20height='256'%20role='img'%20aria-labelledby='title'%3e%3ctitle%20id='title'%3eWarmwasser-Zirkulation:%20Wassertropfen%20mit%20Zirkulationspfeilen%3c/title%3e%3cg%20fill='none'%20stroke='%234ed1c6'%20stroke-width='18'%20stroke-linecap='round'%3e%3cpath%20d='M26%2096%20C43%2036%20100%2010%20152%2028%20C182%2037%20204%2059%20215%2082'/%3e%3cpath%20d='M230%20160%20C213%20220%20156%20246%20104%20228%20C74%20219%2052%20197%2041%20174'/%3e%3c/g%3e%3cg%20fill='%234ed1c6'%3e%3cpath%20d='M195%2076%20L231%20107%20L235%2062%20Z'/%3e%3cpath%20d='M61%20180%20L25%20149%20L21%20194%20Z'/%3e%3c/g%3e%3cpath%20fill='%23ffad67'%20d='M128%2060%20C120%2080%2085%20119%2085%20144%20C85%20168%20104%20187%20128%20187%20C152%20187%20171%20168%20171%20144%20C171%20119%20136%2080%20128%2060%20Z'/%3e%3cpath%20fill='none'%20stroke='%23ffffff'%20stroke-width='8'%20stroke-linecap='round'%20d='M103%20143%20C103%20155%20111%20166%20123%20168'/%3e%3c/svg%3e", go = {
  class: "history-status",
  "aria-label": "Historie und Lernplanung"
}, mo = { role: "status" }, yo = {
  key: 0,
  class: "calendar-hint"
}, bo = ["disabled"], _o = {
  key: 1,
  role: "status"
}, vo = {
  key: 2,
  role: "alert",
  class: "error"
}, wo = /* @__PURE__ */ Vt({
  __name: "HistoryStatus",
  props: {
    entry: {},
    importHistory: {}
  },
  setup(e) {
    const t = e, n = /* @__PURE__ */ ce(!1), s = /* @__PURE__ */ ce(""), i = /* @__PURE__ */ ce(""), r = { idle: "Die Lernbasis wird aus Live-Messungen aufgebaut.", loading: "HA-Historie wird eingelesen", complete: "HA-Historie eingelesen", unavailable: "HA-Recorder ist nicht verfügbar. Die Integration lernt aus Live-Messungen.", error: "HA-Historie konnte nicht vollständig eingelesen werden. Live-Messungen werden weiter ausgewertet." }, l = ft(() => r[t.entry.history_import?.state ?? "idle"]), o = ft(() => t.entry.next_start ? new Date(t.entry.next_start).toLocaleString("de-DE") : null);
    async function a() {
      if (!(n.value || t.entry.history_import?.state === "loading")) {
        n.value = !0, s.value = "", i.value = "";
        try {
          if (!t.importHistory) throw new Error("unavailable");
          await t.importHistory(t.entry.entry_id), i.value = "Historienimport angefordert.";
        } catch {
          s.value = "Historienimport konnte nicht gestartet werden. Recorder, Verbindung und Administratorrechte prüfen.";
        } finally {
          n.value = !1;
        }
      }
    }
    return (d, f) => (O(), R("section", go, [
      f[0] || (f[0] = g("h3", null, "Historie und Lernplanung", -1)),
      g("p", mo, [
        X(V(l.value), 1),
        e.entry.history_import && ["loading", "complete"].includes(e.entry.history_import.state) ? (O(), R(Z, { key: 0 }, [
          X(" · " + V(e.entry.history_import.days) + "/28 Tage geprüft · " + V(e.entry.history_import.events) + " zusätzliche Lernereignisse", 1)
        ], 64)) : J("", !0)
      ]),
      e.entry.history_import?.assumed_pump_off ? (O(), R("p", yo, "Bei fehlenden historischen Pumpenaufzeichnungen wurde „Pumpe aus“ angenommen. Die daraus gelernten Muster bitte anhand der Heatmap prüfen.")) : J("", !0),
      g("p", null, [
        g("strong", null, V(o.value ? "Nächster Muster-Vorschlag: " + o.value : "Noch kein freigegebener Musterstart mit ausreichender Messbasis."), 1)
      ]),
      f[1] || (f[1] = g("p", { class: "hint" }, "Zum Vorwärmen braucht ein Zeitabschnitt mindestens drei ausreichend beobachtete Tage und Entnahmen an mindestens 60 % dieser Tage. Es gelten Freigabezeiten, Laufzeit und Tageslimit sowie mindestens 20 Minuten Abstand zwischen Starts. Schaltbefehle sind nur bei „Steuerung aktiv“ freigegeben.", -1)),
      g("button", {
        type: "button",
        disabled: n.value || e.entry.history_import?.state === "loading",
        onClick: a
      }, V(n.value || e.entry.history_import?.state === "loading" ? "Historienimport läuft …" : "HA-Historie erneut einlesen"), 9, bo),
      i.value ? (O(), R("p", _o, V(i.value), 1)) : J("", !0),
      s.value ? (O(), R("p", vo, V(s.value), 1)) : J("", !0)
    ]));
  }
}), So = {
  class: "control-settings",
  "aria-label": "Zirkulation konfigurieren"
}, xo = ["disabled"], Co = { class: "mode-field" }, Ao = ["disabled"], To = ["data-day"], Mo = {
  key: 0,
  class: "blocked-day"
}, Eo = { class: "time-windows" }, $o = ["onUpdate:modelValue", "aria-label"], ko = ["onUpdate:modelValue", "aria-label"], Oo = ["aria-label", "onClick"], Fo = ["disabled", "onClick"], Po = { class: "visually-hidden" }, Io = ["disabled"], Ro = {
  class: "schedule-day",
  "data-day": "vacation"
}, Ho = {
  key: 0,
  class: "blocked-day"
}, Vo = { class: "time-windows" }, Do = ["onUpdate:modelValue", "aria-label"], Lo = ["onUpdate:modelValue", "aria-label"], No = ["aria-label", "onClick"], Uo = ["disabled"], Bo = {
  key: 0,
  class: "error"
}, Ko = {
  key: 1,
  class: "error",
  role: "alert"
}, jo = {
  key: 2,
  class: "error",
  role: "alert"
}, Wo = {
  key: 3,
  role: "status"
}, zo = { class: "settings-actions" }, Zo = ["disabled"], qo = ["disabled"], Go = { key: 0 }, Jo = /* @__PURE__ */ Vt({
  __name: "ControlSettings",
  props: {
    entry: {},
    saveSettings: {}
  },
  setup(e) {
    const t = e, n = (D) => JSON.parse(JSON.stringify(D)), s = /* @__PURE__ */ ce(n(t.entry.settings)), i = /* @__PURE__ */ ce(t.entry.settings_revision), r = /* @__PURE__ */ ce(!1), l = /* @__PURE__ */ ce(!1), o = /* @__PURE__ */ ce(""), a = /* @__PURE__ */ ce(""), d = ft(() => i.value !== t.entry.settings_revision), f = [["mon", "Montag"], ["tue", "Dienstag"], ["wed", "Mittwoch"], ["thu", "Donnerstag"], ["fri", "Freitag"], ["sat", "Samstag"], ["sun_holiday", "Sonn-/Feiertage"]];
    jr(() => t.entry.settings_revision, () => {
      !r.value && !l.value && h();
    });
    function h() {
      s.value = n(t.entry.settings), i.value = t.entry.settings_revision, r.value = !1, o.value = "", a.value = "";
    }
    function v() {
      r.value = !0, o.value = "", a.value = "";
    }
    function T(D) {
      D.push({ start: "06:00", end: "08:00" }), v();
    }
    function P(D, w) {
      D.splice(w, 1), v();
    }
    async function k() {
      if (!(l.value || d.value)) {
        l.value = !0, a.value = "", o.value = "";
        try {
          if (!t.saveSettings) throw new Error("unavailable");
          await t.saveSettings(t.entry.entry_id, n(s.value), i.value), r.value = !1, h(), o.value = "Konfiguration gespeichert.";
        } catch (D) {
          const w = D?.code;
          a.value = w === "invalid_settings" ? "Zeitfenster prüfen: gültige Uhrzeiten, von vor bis und keine Überschneidungen. Nachtfenster auf zwei Tage aufteilen." : w === "settings_conflict" ? "Die Konfiguration wurde inzwischen geändert. Gespeicherten Stand neu laden." : "Speichern oder Bestätigung fehlgeschlagen. Verbindung und Administratorrechte prüfen. Die Eingaben bleiben erhalten.";
        } finally {
          l.value = !1;
        }
      }
    }
    return (D, w) => (O(), R("section", So, [
      w[20] || (w[20] = g("h3", null, "Konfiguration · Freigabezeiten", -1)),
      w[21] || (w[21] = g("p", null, "Freigabezeiten erlauben bedarfsabhängige und gelernte vorausschauende Starts. Die Pumpe läuft darin nicht dauerhaft. Es gilt die Home-Assistant-Zeitzone.", -1)),
      g("form", {
        onSubmit: lo(k, ["prevent"]),
        onInput: v,
        onChange: v
      }, [
        g("fieldset", { disabled: l.value }, [
          w[5] || (w[5] = g("legend", null, "Betriebsart", -1)),
          g("label", Co, [
            w[4] || (w[4] = X("Betriebsart wählen ", -1)),
            lt(g("select", {
              "onUpdate:modelValue": w[0] || (w[0] = (F) => s.value.mode = F),
              "aria-label": "Betriebsart"
            }, [...w[3] || (w[3] = [
              g("option", { value: "monitoring" }, "Nur Monitoring", -1),
              g("option", { value: "active" }, "Steuerung aktiv", -1)
            ])], 512), [
              [no, s.value.mode]
            ])
          ]),
          w[6] || (w[6] = g("p", null, "Monitoring sammelt Messdaten ohne automatische Starts. Beim Wechsel ins Monitoring wird ein von dieser Integration gestarteter Lauf beendet. Aktive Steuerung benötigt frische Messwerte, eine bekannte Pumpe und ein freigegebenes Zeitfenster.", -1))
        ], 8, xo),
        g("fieldset", { disabled: l.value }, [
          w[10] || (w[10] = g("legend", null, "Wochenplan", -1)),
          w[11] || (w[11] = g("p", null, "Ohne Zeitfenster ist der Tag gesperrt. Sonn- und Feiertage verwenden dieselben Zeitfenster. Für gesetzliche Feiertage Land und Region unter „Geräte & Sensoren“ festlegen.", -1)),
          (O(), R(Z, null, De(f, ([F, L]) => g("div", {
            key: F,
            class: "schedule-day",
            "data-day": F
          }, [
            g("h4", null, V(L), 1),
            s.value.schedule[F].length ? J("", !0) : (O(), R("p", Mo, "Gesperrt · keine Freigabe")),
            g("ul", Eo, [
              (O(!0), R(Z, null, De(s.value.schedule[F], (M, Y) => (O(), R("li", { key: Y }, [
                g("label", null, [
                  w[7] || (w[7] = X("Von ", -1)),
                  lt(g("input", {
                    "onUpdate:modelValue": (pe) => M.start = pe,
                    type: "time",
                    required: "",
                    "aria-label": `${L} Abschnitt ${Y + 1} von`
                  }, null, 8, $o), [
                    [Wt, M.start]
                  ])
                ]),
                g("label", null, [
                  w[8] || (w[8] = X("Bis ", -1)),
                  lt(g("input", {
                    "onUpdate:modelValue": (pe) => M.end = pe,
                    type: "text",
                    inputmode: "numeric",
                    pattern: "([01][0-9]|2[0-3]):[0-5][0-9]|24:00",
                    placeholder: "HH:MM",
                    required: "",
                    "aria-label": `${L} Abschnitt ${Y + 1} bis`
                  }, null, 8, ko), [
                    [Wt, M.end]
                  ])
                ]),
                g("button", {
                  type: "button",
                  "aria-label": `${L} Abschnitt ${Y + 1} entfernen`,
                  onClick: (pe) => P(s.value.schedule[F], Y)
                }, "Entfernen", 8, Oo)
              ]))), 128))
            ]),
            g("button", {
              type: "button",
              disabled: s.value.schedule[F].length >= 12,
              onClick: (M) => T(s.value.schedule[F])
            }, [
              w[9] || (w[9] = X("Zeitraum hinzufügen", -1)),
              g("span", Po, " · " + V(L), 1)
            ], 8, Fo)
          ], 8, To)), 64))
        ], 8, Ao),
        g("fieldset", { disabled: l.value }, [
          w[17] || (w[17] = g("legend", null, "Urlaubsprofil", -1)),
          g("label", null, [
            lt(g("input", {
              "onUpdate:modelValue": w[1] || (w[1] = (F) => s.value.vacation_active = F),
              type: "checkbox",
              "aria-label": "Urlaubsprofil aktivieren"
            }, null, 512), [
              [to, s.value.vacation_active]
            ]),
            w[12] || (w[12] = X(" Urlaubsprofil aktivieren", -1))
          ]),
          w[18] || (w[18] = g("p", null, "Ersetzt während der manuellen Aktivierung den gesamten Wochen- und Feiertagsplan. Die folgenden Zeitfenster gelten dann an jedem Tag. Ohne Abschnitte bleibt die Zirkulation im Urlaub gesperrt. Nach dem Urlaub hier wieder deaktivieren.", -1)),
          g("div", Ro, [
            w[16] || (w[16] = g("h4", null, "Alle Urlaubstage", -1)),
            s.value.vacation_windows.length ? J("", !0) : (O(), R("p", Ho, "Gesperrt · keine Freigabe")),
            g("ul", Vo, [
              (O(!0), R(Z, null, De(s.value.vacation_windows, (F, L) => (O(), R("li", { key: L }, [
                g("label", null, [
                  w[13] || (w[13] = X("Von ", -1)),
                  lt(g("input", {
                    "onUpdate:modelValue": (M) => F.start = M,
                    type: "time",
                    required: "",
                    "aria-label": `Urlaub Abschnitt ${L + 1} von`
                  }, null, 8, Do), [
                    [Wt, F.start]
                  ])
                ]),
                g("label", null, [
                  w[14] || (w[14] = X("Bis ", -1)),
                  lt(g("input", {
                    "onUpdate:modelValue": (M) => F.end = M,
                    type: "text",
                    inputmode: "numeric",
                    pattern: "([01][0-9]|2[0-3]):[0-5][0-9]|24:00",
                    placeholder: "HH:MM",
                    required: "",
                    "aria-label": `Urlaub Abschnitt ${L + 1} bis`
                  }, null, 8, Lo), [
                    [Wt, F.end]
                  ])
                ]),
                g("button", {
                  type: "button",
                  "aria-label": `Urlaub Abschnitt ${L + 1} entfernen`,
                  onClick: (M) => P(s.value.vacation_windows, L)
                }, "Entfernen", 8, No)
              ]))), 128))
            ]),
            g("button", {
              type: "button",
              disabled: s.value.vacation_windows.length >= 12,
              onClick: w[2] || (w[2] = (F) => T(s.value.vacation_windows))
            }, [...w[15] || (w[15] = [
              X("Zeitraum hinzufügen", -1),
              g("span", { class: "visually-hidden" }, " · Urlaub", -1)
            ])], 8, Uo)
          ])
        ], 8, Io),
        e.entry.reason === "pump_unreachable" ? (O(), R("p", Bo, "Pumpenfehler: Gerät und Erreichbarkeit prüfen. Erneutes Speichern quittiert den Fehler und gibt die gewählte Betriebsart wieder frei.")) : J("", !0),
        w[19] || (w[19] = g("p", { class: "hint" }, "Maximal 12 Abschnitte pro Tag; Ende bis 24:00. Die gesamte Pumpenlaufzeit muss in einen Abschnitt passen. Änderungen wirken erst nach dem Speichern.", -1)),
        d.value ? (O(), R("p", Ko, "Die Konfiguration wurde inzwischen geändert. Deine Eingaben wurden erhalten. Vor weiteren Änderungen den gespeicherten Stand neu laden.")) : J("", !0),
        a.value ? (O(), R("p", jo, V(a.value), 1)) : J("", !0),
        o.value ? (O(), R("p", Wo, V(o.value), 1)) : J("", !0),
        g("div", zo, [
          g("button", {
            type: "submit",
            disabled: l.value || d.value || !r.value && e.entry.reason !== "pump_unreachable"
          }, V(l.value ? "Wird gespeichert …" : "Konfiguration speichern"), 9, Zo),
          g("button", {
            type: "button",
            disabled: l.value,
            onClick: h
          }, "Gespeicherten Stand neu laden", 8, qo),
          r.value ? (O(), R("span", Go, "Ungespeicherte Änderungen")) : J("", !0)
        ])
      ], 32)
    ]));
  }
}), Yo = {
  class: "heatmap",
  "aria-label": "Zapfmuster nach Wochentag"
}, Xo = { class: "heatmap-header" }, Qo = {
  key: 0,
  class: "planning-note"
}, ea = {
  key: 1,
  class: "empty-heatmap"
}, ta = { class: "heatmap-scroll" }, na = { key: 0 }, sa = {
  key: 1,
  class: "visually-hidden"
}, ia = { scope: "row" }, ra = ["data-row", "data-slot", "tabindex", "onFocus", "onKeydown", "title", "aria-label", "onClick"], la = { class: "legend" }, oa = {
  class: "cell-detail",
  "aria-live": "polite"
}, aa = { class: "subtle" }, ua = {
  key: 2,
  class: "calendar-hint"
}, ca = /* @__PURE__ */ Vt({
  __name: "UsageHeatmap",
  props: {
    data: {}
  },
  setup(e) {
    const t = e, n = /* @__PURE__ */ ce({ row: 0, slot: 0 }), s = /* @__PURE__ */ ce(null), i = ft(() => {
      if (!s.value) return "Eine Zelle auswählen, um Beobachtungstage und Zapfvorgänge zu sehen.";
      const f = t.data.rows.find((h) => h.key === s.value.row);
      return f ? a(f.key, s.value.slot, f.cells[s.value.slot]) : "Eine Zelle auswählen, um Beobachtungstage und Zapfvorgänge zu sehen.";
    }), r = { mon: "Montag", tue: "Dienstag", wed: "Mittwoch", thu: "Donnerstag", fri: "Freitag", sat: "Samstag", sun_holiday: "Sonn-/Feiertage" }, l = (f) => `${String(Math.floor(f / 2)).padStart(2, "0")}:${f % 2 ? "30" : "00"}`, o = new Intl.NumberFormat("de-DE", { style: "percent", maximumFractionDigits: 0 });
    function a(f, h, v) {
      const T = `${r[f]} · ${l(h)}–${l(h + 1)}`, P = v.ratio === null ? `${T}: Keine ausreichend beobachteten Tage. ${v.partial_days} Tage mit Teilmessungen.` : `${T}: ${v.event_days} von ${v.observed_days} beobachteten Tagen mit Zapfvorgang (${o.format(v.ratio)}).${v.sufficient ? "" : " Vorläufig: noch zu wenige Beobachtungstage."}`, k = (v.allowed_windows ?? []).map((w) => `Freigabe ${w.start}–${w.end}`).join("; "), D = (v.planned_runs ?? []).map((w) => `Geplantes Vorwärmen ${w.date} ${w.start}–${w.end}`).join("; ");
      return [P, k, D].filter(Boolean).join(" ");
    }
    function d(f, h, v) {
      let T = h, P = v;
      if (f.key === "ArrowRight") P = Math.min(47, v + 1);
      else if (f.key === "ArrowLeft") P = Math.max(0, v - 1);
      else if (f.key === "ArrowDown") T = Math.min(t.data.rows.length - 1, h + 1);
      else if (f.key === "ArrowUp") T = Math.max(0, h - 1);
      else if (f.key === "Home")
        P = 0, f.ctrlKey && (T = 0);
      else if (f.key === "End")
        P = 47, f.ctrlKey && (T = t.data.rows.length - 1);
      else return;
      f.preventDefault(), n.value = { row: T, slot: P };
      const k = f.currentTarget.closest("table");
      Jn(() => k?.querySelector(`button[data-row="${T}"][data-slot="${P}"]`)?.focus());
    }
    return (f, h) => (O(), R("section", Yo, [
      g("div", Xo, [
        h[0] || (h[0] = g("h3", null, "Wann wird Warmwasser gebraucht?", -1)),
        g("span", null, "Letzte " + V(e.data.retention_days) + " Tage", 1)
      ]),
      h[6] || (h[6] = g("p", null, "Die Farbe zeigt den Anteil beobachteter Tage mit erkanntem Zapfvorgang je halber Stunde.", -1)),
      e.data.planning ? (O(), R("p", Qo, [
        X(V(e.data.planning.mode === "monitoring" ? "Planungsvorschau im Monitoring · automatische Schaltbefehle sind ausgeschaltet." : "Planung der nächsten " + e.data.planning.horizon_days + " Tage · Ausführung bei gültigen Live-Werten und freigegebener Steuerung."), 1),
        e.data.planning.vacation_active ? (O(), R(Z, { key: 0 }, [
          X(" Das Urlaubsprofil bestimmt die dargestellten Freigaben.")
        ], 64)) : J("", !0)
      ])) : J("", !0),
      e.data.observed_dates ? J("", !0) : (O(), R("p", ea, "Noch keine ausreichenden Beobachtungen vorhanden. Vorhandene HA-Historie wird zum Lernstart eingelesen. Vorhandene Lücken werden nicht als „kein Verbrauch“ gewertet.")),
      g("div", ta, [
        g("table", null, [
          h[2] || (h[2] = g("caption", { class: "visually-hidden" }, "Zapfvorgänge nach Wochentag und halber Stunde", -1)),
          g("thead", null, [
            g("tr", null, [
              h[1] || (h[1] = g("th", { scope: "col" }, "Tag", -1)),
              (O(), R(Z, null, De(48, (v) => g("th", {
                key: v,
                scope: "col"
              }, [
                (v - 1) % 4 === 0 ? (O(), R("span", na, V(l(v - 1)), 1)) : (O(), R("span", sa, V(l(v - 1)), 1))
              ])), 64))
            ])
          ]),
          g("tbody", null, [
            (O(!0), R(Z, null, De(e.data.rows, (v, T) => (O(), R("tr", {
              key: v.key
            }, [
              g("th", ia, V(r[v.key]), 1),
              (O(!0), R(Z, null, De(v.cells, (P, k) => (O(), R("td", { key: k }, [
                g("button", {
                  type: "button",
                  class: Rt(["heat-cell", [P.level === null ? "no-data" : `level-${P.level}`, { provisional: P.ratio !== null && !P.sufficient }]]),
                  "data-row": T,
                  "data-slot": k,
                  tabindex: n.value.row === T && n.value.slot === k ? 0 : -1,
                  onFocus: (D) => n.value = { row: T, slot: k },
                  onKeydown: (D) => d(D, T, k),
                  title: a(v.key, k, P),
                  "aria-label": a(v.key, k, P),
                  onClick: (D) => s.value = { row: v.key, slot: k }
                }, [
                  (O(!0), R(Z, null, De(P.allowed_windows ?? [], (D, w) => (O(), R("span", {
                    key: `allowed-${w}`,
                    class: "allowed-window",
                    "aria-hidden": "true",
                    style: Mt({ left: D.offset + "%", width: D.width + "%" })
                  }, null, 4))), 128)),
                  (O(!0), R(Z, null, De(P.planned_runs ?? [], (D, w) => (O(), R("span", {
                    key: `planned-${w}`,
                    class: "planned-run",
                    "aria-hidden": "true",
                    style: Mt({ left: D.offset + "%", width: D.width + "%" })
                  }, null, 4))), 128))
                ], 42, ra)
              ]))), 128))
            ]))), 128))
          ])
        ])
      ]),
      g("div", la, [
        h[5] || (h[5] = vl('<span><i class="no-data"></i>Keine Messbasis</span><span><i class="level-0"></i>0 %</span><span><i class="level-2"></i>50 %</span><span><i class="level-4"></i>100 %</span><span><i class="level-2 provisional"></i>Vorläufig</span>', 5)),
        e.data.planning ? (O(), R(Z, { key: 0 }, [
          h[3] || (h[3] = g("span", null, [
            g("i", { class: "legend-allowed" }),
            X("Freigabezeit")
          ], -1)),
          h[4] || (h[4] = g("span", null, [
            g("i", { class: "legend-planned" }),
            X("Geplantes Vorwärmen")
          ], -1))
        ], 64)) : J("", !0)
      ]),
      g("p", oa, V(i.value), 1),
      g("p", aa, "Ein Tag zählt pro Zelle ab " + V(e.data.minimum_coverage_minutes) + " Minuten gültiger Messungen bei ausgeschalteter Pumpe. Ab " + V(e.data.minimum_observed_days) + " Tagen gilt die Messbasis als ausreichend. Sonntage und konfigurierte Feiertage werden gemeinsam gezählt; jeder Kalendertag zählt einmal.", 1),
      e.data.calendar_enabled ? J("", !0) : (O(), R("p", ua, "Feiertage sind noch nicht konfiguriert. Land und Bundesland/Region unter „Konfigurieren → Feiertagskalender“ auswählen."))
    ]));
  }
}), fa = { class: "system-card" }, da = { class: "system-heading" }, ha = { class: "metrics temperatures" }, pa = { class: "metrics learning" }, ga = { class: "monitoring-note" }, ma = { class: "calendar-summary" }, ya = {
  key: 0,
  class: "vacation-status"
}, ba = /* @__PURE__ */ Vt({
  __name: "WarmwasserDashboard",
  props: {
    entry: {},
    configurationOpen: { type: Boolean },
    saveSettings: {},
    importHistory: {}
  },
  setup(e) {
    const t = e, n = { learned_schedule: "Vorausschauendes Vorwärmen", cooldown: "Wartezeit zwischen Starts", outside_schedule: "Außerhalb der Freigabezeiten", waiting_for_demand: "Steuerung aktiv · wartet auf Bedarf", calendar_unavailable: "Feiertagskalender nicht verfügbar", control_failed: "Steuerung gestört", monitoring: "Monitoring", started: "Pumpe gestartet", demand_event: "Pumpe gestartet", pump_entity_missing: "Pumpenschalter fehlt", pump_unreachable: "Pumpenfehler · Steuerung pausiert", fresh_flow_value_missing: "Frische Temperaturwerte fehlen", pump_state_unknown: "Pumpenzustand unbekannt", daily_limit_reached: "Startlimit erreicht", no_draw_event: "Kein Zapfvorgang", pump_already_running: "Pumpe läuft" }, s = ft(() => n[t.entry.reason] || "Status unbekannt"), i = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }), r = (o) => o?.value == null ? "—" : `${i.format(o.value)} ${o.unit ?? ""}`, l = ft(() => ({ on: "Läuft", off: "Aus", unknown: "Unbekannt" })[t.entry.pump.state] || "Unbekannt");
    return (o, a) => (O(), R("article", fa, [
      g("header", da, [
        g("div", null, [
          a[0] || (a[0] = g("p", { class: "eyebrow" }, "WARMWASSER ZU HAUSE", -1)),
          g("h2", null, V(e.entry.title), 1)
        ]),
        g("span", {
          class: Rt(["status", `status--${e.entry.status_level}`])
        }, V(s.value), 3)
      ]),
      g("div", ha, [
        g("section", null, [
          a[1] || (a[1] = g("span", null, "Vorlauf", -1)),
          g("strong", null, V(r(e.entry.flow)), 1),
          g("small", null, [
            X(V(e.entry.flow?.name || "Nicht konfiguriert"), 1),
            e.entry.flow?.stale ? (O(), R(Z, { key: 0 }, [
              X(" · veraltet")
            ], 64)) : J("", !0)
          ])
        ]),
        g("section", null, [
          a[2] || (a[2] = g("span", null, "Warmwasserpuffer", -1)),
          g("strong", null, V(r(e.entry.buffer)), 1),
          g("small", null, [
            X(V(e.entry.buffer?.name || "Nicht konfiguriert"), 1),
            e.entry.buffer?.stale ? (O(), R(Z, { key: 0 }, [
              X(" · veraltet")
            ], 64)) : J("", !0)
          ])
        ]),
        g("section", null, [
          a[3] || (a[3] = g("span", null, "Zirkulationspumpe", -1)),
          g("strong", null, V(l.value), 1),
          g("small", null, V(e.entry.pump.entity_id), 1)
        ])
      ]),
      g("div", pa, [
        g("section", null, [
          a[5] || (a[5] = g("span", null, "Erkennungsschwelle", -1)),
          g("strong", null, [
            X(V(e.entry.threshold.toFixed(3).replace(".", ",")) + " ", 1),
            a[4] || (a[4] = g("small", null, "°C/min", -1))
          ]),
          g("small", null, V(e.entry.learning_ready ? "Lernbasis ausreichend" : "Messdaten werden gesammelt"), 1)
        ]),
        g("section", null, [
          a[6] || (a[6] = g("span", null, "Erkannte Ereignisse · Lernbasis", -1)),
          g("strong", null, V(e.entry.sample_size), 1),
          a[7] || (a[7] = g("small", null, "Zur Anpassung der Erkennungsschwelle", -1))
        ]),
        g("section", null, [
          a[8] || (a[8] = g("span", null, "Startkontingent", -1)),
          g("strong", null, [
            X(V(e.entry.remaining_starts) + " ", 1),
            g("small", null, "/ " + V(e.entry.max_starts), 1)
          ]),
          g("small", null, "Laufzeit je Start: " + V(e.entry.runtime_seconds) + " Sekunden", 1)
        ])
      ]),
      g("p", ga, V(e.entry.enabled ? "Steuerfreigabe ist gesetzt." : "Monitoring: Die Messwertbeobachtung schaltet die Pumpe nicht.") + " Bedarfsautomatik: " + V(e.entry.demand_automation ? "freigegeben" : "ausgeschaltet") + ".", 1),
      g("p", ma, "Feiertagskalender: " + V(e.entry.country ? [e.entry.country, e.entry.subdivision].filter(Boolean).join(" · ") : "Nicht konfiguriert"), 1),
      e.entry.settings.vacation_active ? (O(), R("p", ya, "Urlaubsprofil aktiv · ersetzt den Wochen- und Feiertagsplan")) : J("", !0),
      e.configurationOpen ? (O(), Qt(Jo, {
        key: 1,
        entry: e.entry,
        "save-settings": e.saveSettings
      }, null, 8, ["entry", "save-settings"])) : J("", !0),
      _e(wo, {
        entry: e.entry,
        "import-history": e.importHistory
      }, null, 8, ["entry", "import-history"]),
      e.entry.heatmap ? (O(), Qt(ca, {
        key: 2,
        data: e.entry.heatmap
      }, null, 8, ["data"])) : J("", !0),
      a[9] || (a[9] = g("p", { class: "hint" }, "Automatische Starts müssen ausdrücklich freigegeben werden. Fehlende oder veraltete Messwerte sind keine gültige Steuergrundlage.", -1))
    ]));
  }
}), _a = { class: "page" }, va = { class: "toolbar" }, wa = { class: "brand-heading" }, Sa = ["src"], xa = ["disabled"], Ca = ["aria-expanded"], Aa = {
  key: 0,
  class: "error",
  role: "alert"
}, Ta = {
  key: 1,
  role: "status"
}, Ma = {
  key: 0,
  class: "empty"
}, Ea = {
  key: 1,
  class: "updated"
}, $a = /* @__PURE__ */ Vt({
  __name: "PanelApp",
  props: {
    state: {},
    saveSettings: {},
    importHistory: {}
  },
  emits: ["refresh", "menu"],
  setup(e) {
    const t = /* @__PURE__ */ ce(!1);
    return (n, s) => (O(), R("main", _a, [
      g("header", va, [
        g("button", {
          class: "menu-button",
          type: "button",
          "aria-label": "Navigation öffnen",
          onClick: s[0] || (s[0] = (i) => n.$emit("menu"))
        }, "☰"),
        g("div", wa, [
          g("img", {
            class: "brand-logo",
            src: e.state.darkMode ? In(po) : In(ho),
            alt: "",
            "aria-hidden": "true",
            width: "52",
            height: "52"
          }, null, 8, Sa),
          s[4] || (s[4] = g("div", null, [
            g("h1", null, "Warmwasser-Zirkulation"),
            g("p", null, "Verbrauchsmuster verstehen. Betrieb im Blick behalten.")
          ], -1))
        ]),
        g("button", {
          type: "button",
          disabled: e.state.loading,
          onClick: s[1] || (s[1] = (i) => n.$emit("refresh"))
        }, V(e.state.loading ? "Wird geladen …" : "Aktualisieren"), 9, xa),
        g("button", {
          type: "button",
          "aria-expanded": t.value,
          onClick: s[2] || (s[2] = (i) => t.value = !t.value)
        }, V(t.value ? "Konfiguration schließen" : "Konfiguration"), 9, Ca),
        s[5] || (s[5] = g("a", {
          href: "/config/integrations/integration/warmwasser_zirkulation",
          title: "Sensoren und Feiertagsregion über das Zahnrad am gewünschten Eintrag ändern"
        }, "Geräte & Sensoren", -1))
      ]),
      e.state.error ? (O(), R("p", Aa, [
        X(V(e.state.error) + " ", 1),
        g("button", {
          type: "button",
          onClick: s[3] || (s[3] = (i) => n.$emit("refresh"))
        }, "Erneut versuchen")
      ])) : e.state.loading && !e.state.entries.length ? (O(), R("p", Ta, "Die Betriebsdaten werden aus Home Assistant geladen …")) : (O(), R(Z, { key: 2 }, [
        e.state.entries.length ? J("", !0) : (O(), R("p", Ma, "Keine geladene Warmwasser-Zirkulation gefunden. Die Integration unter „Geräte & Dienste“ einrichten.")),
        (O(!0), R(Z, null, De(e.state.entries, (i) => (O(), Qt(ba, {
          key: i.entry_id,
          entry: i,
          "configuration-open": t.value,
          "save-settings": e.saveSettings,
          "import-history": e.importHistory
        }, null, 8, ["entry", "configuration-open", "save-settings", "import-history"]))), 128)),
        e.state.updatedAt ? (O(), R("p", Ea, "Letzte Aktualisierung: " + V(new Date(e.state.updatedAt).toLocaleTimeString("de-DE")) + " · Aktualisierung alle 15 Sekunden", 1)) : J("", !0)
      ], 64))
    ]));
  }
});
class ka extends HTMLElement {
  constructor() {
    super(...arguments), this.currentHass = null, this.app = null, this.state = null, this.timer = null, this.configuring = !1, this.statusSequence = 0, this.pending = !1, this.generation = 0;
  }
  set hass(t) {
    const n = this.currentHass === null;
    this.currentHass = t, this.state && (this.state.darkMode = !!t.themes?.darkMode), n && this.state && this.state.updatedAt === null && this.refresh();
  }
  connectedCallback() {
    if (this.app) return;
    const t = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    t.replaceChildren();
    const n = document.createElement("link");
    n.rel = "stylesheet", n.href = "/warmwasser-zirkulation-static/panel.css";
    const s = document.createElement("div");
    t.append(n, s), this.state = /* @__PURE__ */ Zn({ darkMode: !!this.currentHass?.themes?.darkMode, entries: [], loading: !0, error: null, updatedAt: null }), this.app = uo($a, { state: this.state, importHistory: (i) => this.importHistory(i), saveSettings: (i, r, l) => this.configure(i, r, l), onRefresh: () => void this.refresh(), onMenu: () => this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: !0, composed: !0 })) }), this.app.mount(s), this.timer = window.setInterval(() => {
      document.visibilityState !== "hidden" && this.refresh();
    }, 15e3), this.refresh();
  }
  disconnectedCallback() {
    this.generation++, this.timer !== null && window.clearInterval(this.timer), this.timer = null, this.app?.unmount(), this.app = null, this.state = null, this.pending = !1;
  }
  async configure(t, n, s) {
    return this.command({ type: "warmwasser_zirkulation/configure", entry_id: t, settings: n, revision: s });
  }
  async importHistory(t) {
    return this.command({ type: "warmwasser_zirkulation/import_history", entry_id: t });
  }
  async command(t) {
    const n = this.currentHass;
    if (!n || !this.isConnected) throw new Error("unavailable");
    if (this.configuring) throw new Error("busy");
    this.configuring = !0, this.statusSequence++;
    const s = this.generation;
    try {
      await n.callWS(t);
      const i = await n.callWS({ type: "warmwasser_zirkulation/status" });
      if (s !== this.generation || !this.state || !Array.isArray(i.entries)) throw new Error("unavailable");
      this.state.entries = i.entries, this.state.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), this.state.error = null;
    } finally {
      this.configuring = !1;
    }
  }
  async refresh() {
    if (!this.currentHass || !this.state || this.pending || this.configuring || !this.isConnected) return;
    const t = this.generation, n = ++this.statusSequence;
    this.pending = !0, this.state.loading = !0;
    try {
      const s = await this.currentHass.callWS({ type: "warmwasser_zirkulation/status" });
      if (t !== this.generation || n !== this.statusSequence || !this.state) return;
      if (!s || !Array.isArray(s.entries)) throw new Error("invalid_response");
      this.state.entries = s.entries, this.state.error = null, this.state.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    } catch {
      t === this.generation && n === this.statusSequence && this.state && (this.state.error = "Betriebsdaten konnten nicht geladen werden. Verbindung und Administratorrechte prüfen.");
    } finally {
      t === this.generation && this.state && (this.state.loading = !1, this.pending = !1);
    }
  }
}
customElements.get("warmwasser-panel") || customElements.define("warmwasser-panel", ka);
export {
  ka as WarmwasserPanel
};
