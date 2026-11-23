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
const Z = {}, Xe = [], Qe = () => {
}, Us = () => !1, en = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), tn = (e) => e.startsWith("onUpdate:"), ue = Object.assign, Ks = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Ji = Object.prototype.hasOwnProperty, U = (e, t) => Ji.call(e, t), I = Array.isArray, Be = (e) => dt(e) === "[object Map]", Le = (e) => dt(e) === "[object Set]", fs = (e) => dt(e) === "[object Date]", B = (e) => typeof e == "function", X = (e) => typeof e == "string", Me = (e) => typeof e == "symbol", q = (e) => e !== null && typeof e == "object", js = (e) => (q(e) || B(e)) && B(e.then) && B(e.catch), Bs = Object.prototype.toString, dt = (e) => Bs.call(e), Yi = (e) => dt(e).slice(8, -1), Ws = (e) => dt(e) === "[object Object]", Nn = (e) => X(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, yt = /* @__PURE__ */ Ln(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Xi = 1e4, nn = (e) => {
  let t = /* @__PURE__ */ Object.create(null), n = 0;
  return ((s) => {
    const i = t[s];
    return i !== void 0 ? i : (++n > Xi && (t = /* @__PURE__ */ Object.create(null), n = 1), t[s] = e(s));
  });
}, Qi = /-\w/g, me = /* @__PURE__ */ nn((e) => e.replace(Qi, (t) => t.slice(1).toUpperCase())), er = /\B([A-Z])/g, st = /* @__PURE__ */ nn(
  (e) => e.replace(er, "-$1").toLowerCase()
), zs = /* @__PURE__ */ nn((e) => e.charAt(0).toUpperCase() + e.slice(1)), gn = /* @__PURE__ */ nn((e) => e ? `on${zs(e)}` : ""), Ae = (e, t) => !Object.is(e, t), jt = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, Zs = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, Ft = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let ds;
const sn = () => ds || (ds = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Hn(e) {
  if (I(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = X(s) ? ir(s) : Hn(s);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (X(e) || q(e))
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
function It(e) {
  let t = "";
  if (X(e))
    t = e;
  else if (I(e))
    for (let n = 0; n < e.length; n++) {
      const s = It(e[n]);
      s && (t += s + " ");
    }
  else if (q(e))
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
  let s = Be(e), i = Be(t);
  if (s || i || (s = Le(e), i = Le(t), s || i))
    return s && i ? hs(e, t, n) : !1;
  const r = Object.keys(e).length, l = Object.keys(t).length;
  if (r !== l)
    return !1;
  for (const o in e) {
    const a = U(e, o), d = U(t, o);
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
  return s || i ? s && i ? e.getTime() === t.getTime() : !1 : (s = Me(e), i = Me(t), s || i ? e === t : (s = I(e), i = I(t), s || i ? s && i ? ps(e, t, n, or) : !1 : (s = q(e), i = q(t), s || i ? !s || !i ? !1 : ps(e, t, n, ar) : String(e) === String(t))));
}
function Un(e, t) {
  return e.findIndex((n) => Ne(n, t));
}
function gs(e) {
  return Object.getPrototypeOf(e) === null && e[Symbol.toPrimitive] == null && typeof e.toString != "function" && typeof e.valueOf != "function" ? dt(e) : String(e);
}
const Gs = (e) => !!(e && e.__v_isRef === !0), V = (e) => X(e) ? e : e == null ? "" : I(e) || q(e) && (e.toString === Bs || !B(e.toString)) ? Gs(e) ? V(e.value) : JSON.stringify(e, Js, 2) : String(e), Js = (e, t) => Gs(t) ? Js(e, t.value) : Be(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, i], r) => (n[mn(s, r) + " =>"] = i, n),
    {}
  )
} : Le(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => mn(n))
} : Me(t) ? mn(t) : q(t) && !I(t) && !Ws(t) ? String(t) : t, mn = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    Me(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.46
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let ee;
class ur {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && ee && (ee.active ? (this.parent = ee, this.index = (ee.scopes || (ee.scopes = [])).push(
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
      const n = ee;
      try {
        return ee = this, t();
      } finally {
        ee = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = ee, ee = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (ee === this)
        ee = this.prevScope;
      else {
        let t = ee;
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
  return ee;
}
let z;
const bn = /* @__PURE__ */ new WeakSet();
class Ys {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, ee && (ee.active ? ee.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, bn.has(this) && (bn.delete(this), this.trigger()));
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
        Bn(t);
      this.deps = this.depsTail = void 0, ms(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? bn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    En(this) && this.run();
  }
  get dirty() {
    return En(this);
  }
}
let Xs = 0, _t, vt;
function Qs(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = vt, vt = e;
    return;
  }
  e.next = _t, _t = e;
}
function Kn() {
  Xs++;
}
function jn() {
  if (--Xs > 0)
    return;
  if (vt) {
    let t = vt;
    for (vt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; _t; ) {
    let t = _t;
    for (_t = void 0; t; ) {
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
    s.version === -1 ? (s === n && (n = i), Bn(s), fr(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function En(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (ni(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function ni(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Tt) || (e.globalVersion = Tt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !En(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = z, s = be;
  z = e, be = !0;
  try {
    ei(e);
    const i = e.fn(e._value);
    (t.version === 0 || Ae(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    z = n, be = s, ti(e), e.flags &= -3;
  }
}
function Bn(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (s && (s.nextSub = i, e.prevSub = void 0), i && (i.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      Bn(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function fr(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let be = !0;
const si = [];
function ze() {
  si.push(be), be = !1;
}
function Ze() {
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
let Tt = 0;
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
    this.version++, Tt++, this.notify(t);
  }
  notify(t) {
    Kn();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      jn();
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
const Mn = /* @__PURE__ */ new WeakMap(), et = /* @__PURE__ */ Symbol(
  ""
), $n = /* @__PURE__ */ Symbol(
  ""
), Et = /* @__PURE__ */ Symbol(
  ""
);
function se(e, t, n) {
  if (be && z) {
    let s = Mn.get(e);
    s || Mn.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new Wn()), i.map = s, i.key = n), i.track();
  }
}
function De(e, t, n, s, i, r) {
  const l = Mn.get(e);
  if (!l) {
    Tt++;
    return;
  }
  const o = (a) => {
    a && a.trigger();
  };
  if (Kn(), t === "clear")
    l.forEach(o);
  else {
    const a = I(e), d = a && Nn(n);
    if (a && n === "length") {
      const f = Number(s);
      l.forEach((p, v) => {
        (v === "length" || v === Et || !Me(v) && v >= f) && o(p);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && o(l.get(n)), d && o(l.get(Et)), t) {
        case "add":
          a ? d && o(l.get("length")) : (o(l.get(et)), Be(e) && o(l.get($n)));
          break;
        case "delete":
          a || (o(l.get(et)), Be(e) && o(l.get($n)));
          break;
        case "set":
          Be(e) && o(l.get(et));
          break;
      }
  }
  jn();
}
function rt(e) {
  const t = /* @__PURE__ */ H(e);
  return t === e || (se(t, "iterate", Et), /* @__PURE__ */ fe(e)) ? t : /* @__PURE__ */ $e(e) ? /* @__PURE__ */ We(e) ? t.map((n) => qe(de(n))) : t.map(qe) : t.map(de);
}
function rn(e) {
  return se(e = /* @__PURE__ */ H(e), "iterate", Et), e;
}
function Se(e, t) {
  return /* @__PURE__ */ $e(e) ? qe(/* @__PURE__ */ We(e) ? de(t) : t) : de(t);
}
const hr = {
  __proto__: null,
  [Symbol.iterator]() {
    return yn(this, Symbol.iterator, (e) => Se(this, e));
  },
  concat(...e) {
    return rt(this).concat(
      ...e.map((t) => I(t) ? rt(t) : t)
    );
  },
  entries() {
    return yn(this, "entries", (e) => (e[1] = Se(this, e[1]), e));
  },
  every(e, t) {
    return Fe(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Fe(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => Se(this, s)),
      arguments
    );
  },
  find(e, t) {
    return Fe(
      this,
      "find",
      e,
      t,
      (n) => Se(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return Fe(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Fe(
      this,
      "findLast",
      e,
      t,
      (n) => Se(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return Fe(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Fe(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return _n(this, "includes", e);
  },
  indexOf(...e) {
    return _n(this, "indexOf", e);
  },
  join(e) {
    return rt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return _n(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Fe(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return gt(this, "pop");
  },
  push(...e) {
    return gt(this, "push", e);
  },
  reduce(e, ...t) {
    return ys(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return ys(this, "reduceRight", e, t);
  },
  shift() {
    return gt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Fe(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return gt(this, "splice", e);
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
    return gt(this, "unshift", e);
  },
  values() {
    return yn(this, "values", (e) => Se(this, e));
  }
};
function yn(e, t, n) {
  const s = rn(e), i = s[t], r = i.call(s);
  if (s !== e && !/* @__PURE__ */ fe(e)) {
    if (r[Symbol.toStringTag] === "Array Iterator") {
      const l = Object.create(Object.getPrototypeOf(r));
      return l.next = () => bs(r.next(), n), i !== ri[t] && Object.defineProperties(l, {
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
    r._next = r.next, r.next = () => bs(r._next(), n);
  }
  return r;
}
function bs(e, t) {
  return e.done || (e.value = t(e.value)), e;
}
const ri = Array.prototype;
function Fe(e, t, n, s, i, r) {
  const l = rn(e), o = l !== e && !/* @__PURE__ */ fe(e), a = l[t];
  if (a !== ri[t]) {
    const p = a.apply(e, r);
    return o ? de(p) : p;
  }
  let d = n;
  l !== e && (o ? d = function(p, v) {
    return n.call(this, Se(e, p), v, e);
  } : n.length > 2 && (d = function(p, v) {
    return n.call(this, p, v, e);
  }));
  const f = a.call(l, d, s);
  return o && i ? i(f) : f;
}
function ys(e, t, n, s) {
  const i = rn(e), r = i !== e && !/* @__PURE__ */ fe(e);
  let l = n, o = !1;
  i !== e && (r ? (o = s.length === 0, l = function(d, f, p) {
    return o && (o = !1, d = Se(e, d)), n.call(this, d, Se(e, f), p, e);
  }) : n.length > 3 && (l = function(d, f, p) {
    return n.call(this, d, f, p, e);
  }));
  const a = i[t](l, ...s);
  return o ? Se(e, a) : a;
}
function _n(e, t, n) {
  const s = /* @__PURE__ */ H(e);
  se(s, "iterate", Et);
  const i = s[t](...n);
  return (i === -1 || i === !1) && /* @__PURE__ */ Gn(n[0]) ? (n[0] = /* @__PURE__ */ H(n[0]), s[t](...n)) : i;
}
function gt(e, t, n = []) {
  ze(), Kn();
  const s = (/* @__PURE__ */ H(e))[t].apply(e, n);
  return jn(), Ze(), s;
}
const pr = /* @__PURE__ */ Ln("__proto__,__v_isRef,__isVue"), li = /* @__PURE__ */ new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Me)
);
function gr(e) {
  Me(e) || (e = String(e));
  const t = /* @__PURE__ */ H(this);
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
    const l = I(t);
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
    if ((Me(n) ? li.has(n) : pr(n)) || (i || se(t, "get", n), r))
      return o;
    if (/* @__PURE__ */ le(o)) {
      const a = l && Nn(n) ? o : o.value;
      return i && q(a) ? /* @__PURE__ */ On(a) : a;
    }
    return q(o) ? i ? /* @__PURE__ */ On(o) : /* @__PURE__ */ Zn(o) : o;
  }
}
class ai extends oi {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    const l = I(t) && Nn(n);
    if (!this._isShallow) {
      const d = /* @__PURE__ */ $e(r);
      if (!/* @__PURE__ */ fe(s) && !/* @__PURE__ */ $e(s) && (r = /* @__PURE__ */ H(r), s = /* @__PURE__ */ H(s)), !l && /* @__PURE__ */ le(r) && !/* @__PURE__ */ le(s))
        return d || (r.value = s), !0;
    }
    const o = l ? Number(n) < t.length : U(t, n), a = Reflect.set(
      t,
      n,
      s,
      /* @__PURE__ */ le(t) ? t : i
    );
    return t === /* @__PURE__ */ H(i) && a && (o ? Ae(s, r) && De(t, "set", n, s) : De(t, "add", n, s)), a;
  }
  deleteProperty(t, n) {
    const s = U(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && De(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!Me(n) || !li.has(n)) && se(t, "has", n), s;
  }
  ownKeys(t) {
    return se(
      t,
      "iterate",
      I(t) ? "length" : et
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
const br = /* @__PURE__ */ new ai(), yr = /* @__PURE__ */ new mr(), _r = /* @__PURE__ */ new ai(!0);
const kn = (e) => e, Vt = (e) => Reflect.getPrototypeOf(e);
function vr(e, t, n) {
  return function(...s) {
    const i = this.__v_raw, r = /* @__PURE__ */ H(i), l = Be(r), o = e === "entries" || e === Symbol.iterator && l, a = e === "keys" && l, d = i[e](...s), f = n ? kn : t ? qe : de;
    return !t && se(
      r,
      "iterate",
      a ? $n : et
    ), ue(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: p, done: v } = d.next();
          return v ? { value: p, done: v } : {
            value: o ? [f(p[0]), f(p[1])] : f(p),
            done: v
          };
        }
      }
    );
  };
}
function Lt(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function wr(e, t) {
  const n = {
    get(i) {
      const r = this.__v_raw, l = /* @__PURE__ */ H(r), o = /* @__PURE__ */ H(i);
      e || (Ae(i, o) && se(l, "get", i), se(l, "get", o));
      const { has: a } = Vt(l), d = t ? kn : e ? qe : de;
      if (a.call(l, i))
        return d(r.get(i));
      if (a.call(l, o))
        return d(r.get(o));
      r !== l && r.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && se(/* @__PURE__ */ H(i), "iterate", et), i.size;
    },
    has(i) {
      const r = this.__v_raw, l = /* @__PURE__ */ H(r), o = /* @__PURE__ */ H(i);
      return e || (Ae(i, o) && se(l, "has", i), se(l, "has", o)), i === o ? r.has(i) : r.has(i) || r.has(o);
    },
    forEach(i, r) {
      const l = this, o = l.__v_raw, a = /* @__PURE__ */ H(o), d = t ? kn : e ? qe : de;
      return !e && se(a, "iterate", et), o.forEach((f, p) => i.call(r, d(f), d(p), l));
    }
  };
  return ue(
    n,
    e ? {
      add: Lt("add"),
      set: Lt("set"),
      delete: Lt("delete"),
      clear: Lt("clear")
    } : {
      add(i) {
        const r = /* @__PURE__ */ H(this), l = Vt(r), o = /* @__PURE__ */ H(i), a = !t && !/* @__PURE__ */ fe(i) && !/* @__PURE__ */ $e(i) ? o : i;
        return l.has.call(r, a) || Ae(i, a) && l.has.call(r, i) || Ae(o, a) && l.has.call(r, o) || (r.add(a), De(r, "add", a, a)), this;
      },
      set(i, r) {
        !t && !/* @__PURE__ */ fe(r) && !/* @__PURE__ */ $e(r) && (r = /* @__PURE__ */ H(r));
        const l = /* @__PURE__ */ H(this), { has: o, get: a } = Vt(l);
        let d = o.call(l, i);
        d || (i = /* @__PURE__ */ H(i), d = o.call(l, i));
        const f = a.call(l, i);
        return l.set(i, r), d ? Ae(r, f) && De(l, "set", i, r) : De(l, "add", i, r), this;
      },
      delete(i) {
        const r = /* @__PURE__ */ H(this), { has: l, get: o } = Vt(r);
        let a = l.call(r, i);
        a || (i = /* @__PURE__ */ H(i), a = l.call(r, i)), o && o.call(r, i);
        const d = r.delete(i);
        return a && De(r, "delete", i, void 0), d;
      },
      clear() {
        const i = /* @__PURE__ */ H(this), r = i.size !== 0, l = i.clear();
        return r && De(
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
    U(n, i) && i in s ? n : s,
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
  return /* @__PURE__ */ $e(e) ? e : qn(
    e,
    !1,
    br,
    Sr,
    ui
  );
}
// @__NO_SIDE_EFFECTS__
function Er(e) {
  return qn(
    e,
    !1,
    _r,
    xr,
    ci
  );
}
// @__NO_SIDE_EFFECTS__
function On(e) {
  return qn(
    e,
    !0,
    yr,
    Cr,
    fi
  );
}
function qn(e, t, n, s, i) {
  if (!q(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
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
function We(e) {
  return /* @__PURE__ */ $e(e) ? /* @__PURE__ */ We(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function $e(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function fe(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Gn(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function H(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ H(t) : e;
}
function Mr(e) {
  return !U(e, "__v_skip") && Object.isExtensible(e) && Zs(e, "__v_skip", !0), e;
}
const de = (e) => q(e) ? /* @__PURE__ */ Zn(e) : e, qe = (e) => q(e) ? /* @__PURE__ */ On(e) : e;
// @__NO_SIDE_EFFECTS__
function le(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function Pe(e) {
  return $r(e, !1);
}
function $r(e, t) {
  return /* @__PURE__ */ le(e) ? e : new kr(e, t);
}
class kr {
  constructor(t, n) {
    this.dep = new Wn(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ H(t), this._value = n ? t : de(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || /* @__PURE__ */ fe(t) || /* @__PURE__ */ $e(t);
    t = s ? t : /* @__PURE__ */ H(t), Ae(t, n) && (this._rawValue = t, this._value = s ? t : de(t), this.dep.trigger());
  }
}
function Fn(e) {
  return /* @__PURE__ */ le(e) ? e.value : e;
}
const Or = {
  get: (e, t, n) => t === "__v_raw" ? e : Fn(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const i = e[t];
    return /* @__PURE__ */ le(i) && !/* @__PURE__ */ le(n) ? (i.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function di(e) {
  return /* @__PURE__ */ We(e) ? e : new Proxy(e, Or);
}
class Fr {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new Wn(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Tt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
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
function Ir(e, t, n = !1) {
  let s, i;
  return B(e) ? s = e : (s = e.get, i = e.set), new Fr(s, i, n);
}
const Nt = {}, zt = /* @__PURE__ */ new WeakMap();
let Ye;
function Pr(e, t = !1, n = Ye) {
  if (n) {
    let s = zt.get(n);
    s || zt.set(n, s = []), s.push(e);
  }
}
function Rr(e, t, n = Z) {
  const { immediate: s, deep: i, once: r, scheduler: l, augmentJob: o, call: a } = n, d = (E) => i ? E : /* @__PURE__ */ fe(E) || i === !1 || i === 0 ? Ve(E, 1) : Ve(E);
  let f, p, v, T, P = !1, F = !1;
  if (/* @__PURE__ */ le(e) ? (p = () => e.value, P = /* @__PURE__ */ fe(e)) : /* @__PURE__ */ We(e) ? (p = () => d(e), P = !0) : I(e) ? (F = !0, P = e.some((E) => /* @__PURE__ */ We(E) || /* @__PURE__ */ fe(E)), p = () => e.map((E) => {
    if (/* @__PURE__ */ le(E))
      return E.value;
    if (/* @__PURE__ */ We(E))
      return d(E);
    if (B(E))
      return a ? a(E, 2) : E();
  })) : B(e) ? t ? p = a ? () => a(e, 2) : e : p = () => {
    if (v) {
      ze();
      try {
        v();
      } finally {
        Ze();
      }
    }
    const E = Ye;
    Ye = f;
    try {
      return a ? a(e, 3, [T]) : e(T);
    } finally {
      Ye = E;
    }
  } : p = Qe, t && i) {
    const E = p, G = i === !0 ? 1 / 0 : i;
    p = () => Ve(E(), G);
  }
  const K = cr(), A = () => {
    f.stop(), K && K.active && Ks(K.effects, f);
  };
  if (r && t) {
    const E = t;
    t = (...G) => {
      try {
        return E(...G);
      } finally {
        A();
      }
    };
  }
  let k = F ? new Array(e.length).fill(Nt) : Nt;
  const D = (E) => {
    if (!(!(f.flags & 1) || !f.dirty && !E))
      if (t) {
        const G = f.run();
        if (E || i || P || (F ? G.some((he, Ue) => Ae(he, k[Ue])) : Ae(G, k))) {
          const he = Ye;
          ze();
          try {
            v && v(), Ye = f;
            const Ue = [
              G,
              // pass undefined as the old value when it's changed for the first time
              k === Nt ? void 0 : F && k[0] === Nt ? [] : k,
              T
            ];
            k = G, a ? a(t, 3, Ue) : (
              // @ts-expect-error
              t(...Ue)
            );
          } finally {
            Ye = he, Ze();
          }
        }
      } else
        f.run();
  };
  return o && o(D), f = new Ys(p), f.scheduler = l ? () => l(D, !1) : D, T = (E) => Pr(E, !1, f), v = f.onStop = () => {
    const E = zt.get(f);
    if (E) {
      if (a)
        a(E, 4);
      else
        for (const G of E) G();
      zt.delete(f);
    }
  }, t ? s ? D(!0) : k = f.run() : l ? l(D.bind(null, !0), !0) : f.run(), A.pause = f.pause.bind(f), A.resume = f.resume.bind(f), A.stop = A, A;
}
function Ve(e, t = 1 / 0, n) {
  if (t <= 0 || !q(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ le(e))
    Ve(e.value, t, n);
  else if (I(e))
    for (let s = 0; s < e.length; s++)
      Ve(e[s], t, n);
  else if (Le(e) || Be(e))
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
function Pt(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (i) {
    ln(i, t, n);
  }
}
function He(e, t, n, s) {
  if (B(e)) {
    const i = Pt(e, t, n, s);
    return i && js(i) && i.catch((r) => {
      ln(r, t, n, void 0, !0);
    }), i;
  }
  if (I(e)) {
    const i = [];
    for (let r = 0; r < e.length; r++)
      i.push(He(e[r], t, n, s));
    return i;
  }
}
function ln(e, t, n, s = !0, i = !1) {
  const r = t ? t.vnode : null, { errorHandler: l, throwUnhandledErrorInProduction: o } = t && t.appContext.config || Z;
  if (t) {
    let a = t.parent;
    const d = t.proxy, f = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; a; ) {
      const p = a.ec;
      if (p && !a.isUnmounted && // Async failures may outlive stopped scopes whose unmount effects
      // are deferred or discarded by Suspense.
      (!i || a.scope.active)) {
        for (let v = 0; v < p.length; v++)
          if (p[v](e, d, f) === !1)
            return;
      }
      a = a.parent;
    }
    if (l) {
      ze(), Pt(l, null, 10, [
        e,
        d,
        f
      ]), Ze();
      return;
    }
  }
  Dr(e, n, r, s, o);
}
function Dr(e, t, n, s = !0, i = !1) {
  if (i)
    throw e;
  console.error(e);
}
const re = [];
let ge = -1;
const xe = [];
let Ke = null, ot = 0;
const hi = /* @__PURE__ */ Promise.resolve();
let Zt = null;
function Jn(e) {
  const t = Zt || hi;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Vr(e) {
  let t = ge + 1, n = re.length;
  for (; t < n; ) {
    const s = t + n >>> 1, i = re[s], r = Mt(i);
    r < e || r === e && i.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function Yn(e) {
  if (!(e.flags & 1)) {
    const t = Mt(e), n = re[re.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Mt(n) ? re.push(e) : re.splice(Vr(t), 0, e), e.flags |= 1, pi();
  }
}
function pi() {
  Zt || (Zt = hi.then(bi));
}
function Lr(e) {
  if (!I(e))
    Ke && e.id === -1 ? Ke.splice(ot + 1, 0, e) : e.flags & 1 || (xe.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      xe.push(e[t]);
  pi();
}
function gi(e, t, n, s = ge + 1) {
  for (; s < re.length; s++) {
    const i = re[s];
    if (i && i.flags & 2) {
      if (e && i.id !== e.uid || t !== void 0 && !(i.id >= t))
        continue;
      re.splice(s, 1), s = e ? s - 1 : ge, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function mi(e, t, n = 0) {
  if (xe.length) {
    let s = xe, i = 0;
    if (t) {
      s = [];
      for (let l = 0; l < xe.length; l++) {
        const o = xe[l];
        (o.i !== void 0 ? !o.i || o.i.uid < n : t.has(o)) ? xe[i++] = o : s.push(o);
      }
    }
    const r = [...new Set(s)].sort((l, o) => Mt(l) - Mt(o));
    if (xe.length = i, Ke) {
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
let vn = !1;
function Nr(e, t) {
  if (vn) {
    e();
    return;
  }
  const n = t === void 0 ? void 0 : new Set(xe);
  e(), vn = !0;
  try {
    gi(void 0, t), mi(void 0, n, t);
  } finally {
    vn = !1;
  }
}
const Mt = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function bi(e) {
  try {
    for (ge = 0; ge < re.length; ge++) {
      const t = re[ge];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Pt(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; ge < re.length; ge++) {
      const t = re[ge];
      t && (t.flags &= -2);
    }
    ge = -1, re.length = 0, mi(), Zt = null, (re.length || xe.length) && bi();
  }
}
let ce = null, yi = null;
function qt(e) {
  const t = ce;
  return ce = e, yi = e && e.type.__scopeId || null, t;
}
function Hr(e, t = ce, n) {
  if (!t || e._n)
    return e;
  const s = (...i) => {
    s._d && As(-1);
    const r = qt(t), l = nt.length;
    let o;
    try {
      o = e(...i);
    } finally {
      for (let a = nt.length; a > l; a--) Pi();
      qt(r), s._d && As(1);
    }
    return o;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function lt(e, t) {
  if (ce === null)
    return e;
  const n = fn(ce), s = e.dirs || (e.dirs = []);
  for (let i = 0; i < t.length; i++) {
    let [r, l, o, a = Z] = t[i];
    r && (B(r) && (r = {
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
function Ge(e, t, n, s) {
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
    d && (ze(), He(d, n, 8, [
      e.el,
      a,
      i,
      t
    ]), Ze());
  }
}
function Ur(e, t, n = !1) {
  const s = Al();
  if (s || at) {
    let i = at ? at._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (i && e in i)
      return i[e];
    if (arguments.length > 1)
      return n && B(t) ? t.call(s && s.proxy) : t;
  }
}
const Kr = /* @__PURE__ */ Symbol.for("v-scx"), jr = () => Ur(Kr);
function Br(e, t, n) {
  return Wr(e, t, n);
}
function Wr(e, t, n = Z) {
  const { immediate: s, deep: i, flush: r, once: l } = n, o = ue({}, n), a = t && s || !t && r !== "post";
  let d;
  if (Qt) {
    if (r === "sync") {
      const T = jr();
      d = T.__watcherHandles || (T.__watcherHandles = []);
    } else if (!a) {
      const T = () => {
      };
      return T.stop = Qe, T.resume = Qe, T.pause = Qe, T;
    }
  }
  const f = ct;
  o.call = (T, P, F) => He(T, f, P, F);
  let p = !1;
  r === "post" ? o.scheduler = (T) => {
    T.i = f, ie(T, f && f.suspense);
  } : r !== "sync" && (p = !0, o.scheduler = (T, P) => {
    P ? T() : Yn(T);
  }), o.augmentJob = (T) => {
    t && (T.flags |= 4), p && (T.flags |= 2, f && (T.id = f.uid, T.i = f));
  };
  const v = Rr(e, t, o);
  return Qt && (d ? d.push(v) : a && v()), v;
}
const zr = /* @__PURE__ */ Symbol("_vte"), on = (e) => e.__isTeleport, wn = /* @__PURE__ */ Symbol("_leaveCb");
function Zr(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== ye) {
        t = n;
        break;
      }
  }
  return t;
}
function _i(e) {
  if (!vi(e))
    return on(e.type) && e.children ? Zr(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && B(n.default))
      return n.default();
  }
}
function wt(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    wt(
      on(n.type) && _i(n) || n,
      t
    );
  } else if (e.shapeFlag & 128) {
    const n = e.suspense;
    if (n) {
      const s = n.isHydrating ? n.pendingBranch : n.activeBranch;
      s && wt(s, t.clone(s));
    } else
      e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
  } else if (e.transition = t, e.type === J && I(e.children)) {
    const n = Si(e.children, !1);
    n && wt(n, t);
  }
}
function In(e) {
  if (e.component)
    return In(e.component.subTree);
  if (e.type === J) {
    const t = I(e.children) && Si(e.children, !1);
    return t ? In(t) : void 0;
  }
  if (e.type !== ye)
    return e;
}
// @__NO_SIDE_EFFECTS__
function an(e, t) {
  return B(e) ? (
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
const Gt = /* @__PURE__ */ new WeakMap();
function St(e, t, n, s, i = !1) {
  if (I(e)) {
    e.forEach(
      (F, K) => St(
        F,
        t && (I(t) ? t[K] : t),
        n,
        s,
        i
      )
    );
    return;
  }
  if (xt(s) && !i) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && St(e, t, n, s.component.subTree);
    return;
  }
  const r = s.shapeFlag & 4 ? fn(s.component) : s.el, l = i ? null : r, { i: o, r: a } = e, d = t && t.r, f = o.refs === Z ? o.refs = {} : o.refs, p = o.setupState, v = /* @__PURE__ */ H(p), T = p === Z ? Us : (F) => _s(f, F) ? !1 : U(v, F), P = (F, K) => !(K && _s(f, K));
  if (d != null && d !== a) {
    if (vs(t), X(d))
      f[d] = null, T(d) && (p[d] = null);
    else if (/* @__PURE__ */ le(d)) {
      const F = t;
      P(d, F.k) && (d.value = null), F.k && (f[F.k] = null);
    }
  }
  if (B(a))
    Pt(a, o, 12, [l, f]);
  else {
    const F = X(a), K = /* @__PURE__ */ le(a);
    if (F || K) {
      const A = () => {
        if (e.f) {
          const k = F ? T(a) ? p[a] : f[a] : P() || !e.k ? a.value : f[e.k];
          if (i)
            I(k) && Ks(k, r);
          else if (I(k))
            k.includes(r) || k.push(r);
          else if (F)
            f[a] = [r], T(a) && (p[a] = f[a]);
          else {
            const D = [r];
            P(a, e.k) && (a.value = D), e.k && (f[e.k] = D);
          }
        } else F ? (f[a] = l, T(a) && (p[a] = l)) : K && (P(a, e.k) && (a.value = l), e.k && (f[e.k] = l));
      };
      if (l) {
        const k = () => {
          A(), Gt.delete(e);
        };
        k.id = -1, Gt.set(e, k), ie(k, n);
      } else
        vs(e), A();
    }
  }
}
function vs(e) {
  const t = Gt.get(e);
  t && (t.flags |= 8, Gt.delete(e));
}
sn().requestIdleCallback;
sn().cancelIdleCallback;
const xt = (e) => !!e.type.__asyncLoader, vi = (e) => e.type.__isKeepAlive, Gr = /* @__PURE__ */ Symbol.for("v-ndc");
function tt(e, t, n, s) {
  let i;
  const r = n, l = I(e);
  if (l || X(e)) {
    const o = l && /* @__PURE__ */ We(e);
    let a = !1, d = !1;
    o && (a = !/* @__PURE__ */ fe(e), d = /* @__PURE__ */ $e(e), e = rn(e)), i = new Array(e.length);
    for (let f = 0, p = e.length; f < p; f++)
      i[f] = t(
        a ? d ? qe(de(e[f])) : de(e[f]) : e[f],
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
  else if (q(e))
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
const Pn = (e) => e ? Ni(e) ? fn(e) : Pn(e.parent) : null, Ct = (
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
    $parent: (e) => Pn(e.parent),
    $root: (e) => Pn(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => e.type,
    $forceUpdate: (e) => e.f || (e.f = () => {
      Yn(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Jn.bind(e.proxy)),
    $watch: (e) => Qe
  })
), Sn = (e, t) => e !== Z && !e.__isScriptSetup && U(e, t), Jr = {
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
        if (Sn(s, t))
          return l[t] = 1, s[t];
        if (U(r, t))
          return l[t] = 3, r[t];
        if (n !== Z && U(n, t))
          return l[t] = 4, n[t];
        l[t] = 0;
      }
    }
    const d = Ct[t];
    let f, p;
    if (d)
      return t === "$attrs" && se(e.attrs, "get", ""), d(e);
    if (
      // css module (injected by vue-loader)
      (f = o.__cssModules) && (f = f[t])
    )
      return f;
    if (n !== Z && U(n, t))
      return l[t] = 4, n[t];
    if (
      // global properties
      p = a.config.globalProperties, U(p, t)
    )
      return p[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: i, ctx: r } = e;
    return Sn(i, t) ? (i[t] = n, !0) : U(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (r[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: i, props: r, type: l }
  }, o) {
    let a;
    return !!(n[o] || Sn(t, o) || U(r, o) || U(s, o) || U(Ct, o) || U(i.config.globalProperties, o) || (a = l.__cssModules) && a[o]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : U(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
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
    B(s) || (s = ue({}, s)), i != null && !q(i) && (i = null);
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
      use(f, ...p) {
        return l.has(f) || (f && B(f.install) ? (l.add(f), f.install(d, ...p)) : B(f) && (l.add(f), f(d, ...p))), d;
      },
      mixin(f) {
        return d;
      },
      component(f, p) {
        return p ? (r.components[f] = p, d) : r.components[f];
      },
      directive(f, p) {
        return p ? (r.directives[f] = p, d) : r.directives[f];
      },
      mount(f, p, v) {
        if (!a) {
          const T = d._ceVNode || Ee(s, i);
          return T.appContext = r, v === !0 ? v = "svg" : v === !1 && (v = void 0), e(T, f, v), a = !0, d._container = f, f.__vue_app__ = d, fn(T.component);
        }
      },
      onUnmount(f) {
        o.push(f);
      },
      unmount() {
        a && (He(
          o,
          d._instance,
          16
        ), e(null, d._container), delete d._container.__vue_app__);
      },
      provide(f, p) {
        return r.provides[f] = p, d;
      },
      runWithContext(f) {
        const p = at;
        at = d;
        try {
          return f();
        } finally {
          at = p;
        }
      }
    };
    return d;
  };
}
let at = null;
const Qr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${me(t)}Modifiers`] || e[`${st(t)}Modifiers`];
function el(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || Z;
  let i = n;
  const r = t.startsWith("update:"), l = r && Qr(s, t.slice(7));
  l && (l.trim && (i = n.map((f) => X(f) ? f.trim() : f)), l.number && (i = i.map(Ft)));
  let o, a = s[o = gn(t)] || // also try camelCase event handler (#2249)
  s[o = gn(me(t))];
  !a && r && (a = s[o = gn(st(t))]), a && He(
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
    e.emitted[o] = !0, He(
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
  return r ? (I(r) ? r.forEach((o) => l[o] = null) : ue(l, r), q(e) && s.set(e, l), l) : (q(e) && s.set(e, null), null);
}
function un(e, t) {
  return !e || !en(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), U(e, t[0].toLowerCase() + t.slice(1)) || U(e, st(t)) || U(e, t));
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
    props: p,
    data: v,
    setupState: T,
    ctx: P,
    inheritAttrs: F
  } = e, K = qt(e);
  let A, k;
  try {
    if (n.shapeFlag & 4) {
      const E = i || s, G = E;
      A = Ce(
        d.call(
          G,
          E,
          f,
          p,
          T,
          v,
          P
        )
      ), k = o;
    } else {
      const E = t;
      A = Ce(
        E.length > 1 ? E(
          p,
          { attrs: o, slots: l, emit: a }
        ) : E(
          p,
          null
        )
      ), k = t.props ? o : nl(o);
    }
  } catch (E) {
    nt.length = 0, ln(E, e, 1), A = Ee(ye);
  }
  let D = A;
  if (k && F !== !1) {
    const E = Object.keys(k), { shapeFlag: G } = D;
    E.length && G & 7 && (r && E.some(tn) && (k = sl(
      k,
      r
    )), D = ut(D, k, !1, !0));
  }
  if (n.dirs && (D = ut(D, null, !1, !0), D.dirs = D.dirs ? D.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const E = on(D.type) && _i(D) || D;
    wt(E, n.transition);
  }
  return A = D, qt(K), A;
}
function Si(e, t = !0) {
  let n;
  for (let s = 0; s < e.length; s++) {
    const i = e[s];
    if (es(i)) {
      if (i.type !== ye || i.children === "v-if") {
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
    (n === "class" || n === "style" || en(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, sl = (e, t) => {
  const n = {};
  for (const s in e)
    (!tn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
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
      for (let p = 0; p < f.length; p++) {
        const v = f[p];
        if (xi(l, s, v) && !un(d, v))
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
    if (!U(e, r) || xi(t, e, r) && !un(n, r))
      return !0;
  }
  return !1;
}
function xi(e, t, n) {
  const s = e[n], i = t[n];
  return n === "style" && q(s) && q(i) ? !Ne(s, i) : s !== i;
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
  e.propsDefaults = /* @__PURE__ */ Object.create(null), Ei(e, t, i, r);
  for (const l in e.propsOptions[0])
    l in i || (i[l] = void 0);
  n ? e.props = s ? i : /* @__PURE__ */ Er(i) : e.type.props ? e.props = i : e.props = r, e.attrs = r;
}
function ol(e, t, n, s) {
  const {
    props: i,
    attrs: r,
    vnode: { patchFlag: l }
  } = e, o = /* @__PURE__ */ H(i), [a] = e.propsOptions;
  let d = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || l > 0) && !(l & 16)
  ) {
    if (l & 8) {
      const f = e.vnode.dynamicProps;
      for (let p = 0; p < f.length; p++) {
        let v = f[p];
        if (un(e.emitsOptions, v))
          continue;
        const T = t[v];
        if (a)
          if (U(r, v))
            T !== r[v] && (r[v] = T, d = !0);
          else {
            const P = me(v);
            i[P] = Rn(
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
    Ei(e, t, i, r) && (d = !0);
    let f;
    for (const p in o)
      (!t || // for camelCase
      !U(t, p) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((f = st(p)) === p || !U(t, f))) && (a ? n && // for camelCase
      (n[p] !== void 0 || // for kebab-case
      n[f] !== void 0) && (i[p] = Rn(
        a,
        o,
        p,
        void 0,
        e,
        !0
      )) : delete i[p]);
    if (r !== o)
      for (const p in r)
        (!t || !U(t, p)) && (delete r[p], d = !0);
  }
  d && De(e.attrs, "set", "");
}
function Ei(e, t, n, s) {
  const [i, r] = e.propsOptions;
  let l = !1, o;
  if (t)
    for (let a in t) {
      if (yt(a))
        continue;
      const d = t[a];
      let f;
      i && U(i, f = me(a)) ? !r || !r.includes(f) ? n[f] = d : (o || (o = {}))[f] = d : un(e.emitsOptions, a) || (!(a in s) || d !== s[a]) && (s[a] = d, l = !0);
    }
  if (r) {
    const a = /* @__PURE__ */ H(n), d = o || Z;
    for (let f = 0; f < r.length; f++) {
      const p = r[f];
      n[p] = Rn(
        i,
        a,
        p,
        d[p],
        e,
        !U(d, p)
      );
    }
  }
  return l;
}
function Rn(e, t, n, s, i, r) {
  const l = e[n];
  if (l != null) {
    const o = U(l, "default");
    if (o && s === void 0) {
      const a = l.default;
      if (l.type !== Function && !l.skipFactory && B(a)) {
        const { propsDefaults: d } = i;
        if (n in d)
          s = d[n];
        else {
          const f = Li(i);
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
    return q(e) && s.set(e, Xe), Xe;
  if (I(r))
    for (let d = 0; d < r.length; d++) {
      const f = me(r[d]);
      xs(f) && (l[f] = Z);
    }
  else if (r)
    for (const d in r) {
      const f = me(d);
      if (xs(f)) {
        const p = r[d], v = l[f] = I(p) || B(p) ? { type: p } : ue({}, p), T = v.type;
        let P = !1, F = !0;
        if (I(T))
          for (let K = 0; K < T.length; ++K) {
            const A = T[K], k = B(A) && A.name;
            if (k === "Boolean") {
              P = !0;
              break;
            } else k === "String" && (F = !1);
          }
        else
          P = B(T) && T.name === "Boolean";
        v[
          0
          /* shouldCast */
        ] = P, v[
          1
          /* shouldCastTrue */
        ] = F, (P || U(v, "default")) && o.push(f);
      }
    }
  const a = [l, o];
  return q(e) && s.set(e, a), a;
}
function xs(e) {
  return e[0] !== "$" && !yt(e);
}
const Xn = (e) => e === "_" || e === "_ctx" || e === "$stable", Qn = (e) => I(e) ? e.map(Ce) : [Ce(e)], ul = (e, t, n) => {
  if (t._n)
    return t;
  const s = Hr((...i) => Qn(t(...i)), n);
  return s._c = !1, s;
}, Mi = (e, t, n) => {
  const s = e._ctx;
  for (const i in e) {
    if (Xn(i)) continue;
    const r = e[i];
    if (B(r))
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
    i ? (ki(s, t, n), n && Zs(s, "_", i, !0)) : Mi(t, s);
  } else t && $i(e, t);
}, fl = (e, t, n) => {
  const { vnode: s, slots: i } = e;
  let r = !0, l = Z;
  if (s.shapeFlag & 32) {
    const o = t._;
    o ? n && o === 1 ? r = !1 : ki(i, t, n) : (r = !t.$stable, Mi(t, i)), l = t;
  } else t && ($i(e, t), l = { default: 1 });
  if (r)
    for (const o in i)
      !Xn(o) && l[o] == null && delete i[o];
}, ie = bl;
function dl(e) {
  return hl(e);
}
function hl(e, t) {
  const n = sn();
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
    parentNode: p,
    nextSibling: v,
    setScopeId: T = Qe,
    insertStaticContent: P
  } = e, F = (u, c, h, _ = null, g = null, y = null, x = void 0, S = null, w = !!c.dynamicChildren) => {
    if (u === c)
      return;
    u && !mt(u, c) && (_ = Dt(u), ke(u, g, y, !0), u = null), c.patchFlag === -2 && (w = !1, c.dynamicChildren = null), c.dynamicChildren && u && u.dynamicChildren && u.dynamicChildren.hasOnce && (c.dynamicChildren === Xe && (c.dynamicChildren = []), c.dynamicChildren.hasOnce = !0);
    const { type: b, ref: M, shapeFlag: C } = c;
    switch (b) {
      case cn:
        K(u, c, h, _);
        break;
      case ye:
        A(u, c, h, _);
        break;
      case Bt:
        u == null && k(c, h, _, x);
        break;
      case J:
        Wi(
          u,
          c,
          h,
          _,
          g,
          y,
          x,
          S,
          w
        );
        break;
      default:
        C & 1 ? G(
          u,
          c,
          h,
          _,
          g,
          y,
          x,
          S,
          w
        ) : C & 6 ? zi(
          u,
          c,
          h,
          _,
          g,
          y,
          x,
          S,
          w
        ) : (C & 64 || C & 128) && b.process(
          u,
          c,
          h,
          _,
          g,
          y,
          x,
          S,
          w,
          pt
        );
    }
    M != null && g ? St(M, u && u.ref, y, c || u, !c) : M == null && u && u.ref != null && St(u.ref, null, y, u, !0);
  }, K = (u, c, h, _) => {
    if (u == null)
      s(
        c.el = o(c.children),
        h,
        _
      );
    else {
      const g = c.el = u.el;
      c.children !== u.children && d(g, c.children);
    }
  }, A = (u, c, h, _) => {
    u == null ? s(
      c.el = a(c.children || ""),
      h,
      _
    ) : c.el = u.el;
  }, k = (u, c, h, _) => {
    [u.el, u.anchor] = P(
      u.children,
      c,
      h,
      _,
      u.el,
      u.anchor
    );
  }, D = ({ el: u, anchor: c }, h, _) => {
    let g;
    for (; u && u !== c; )
      g = v(u), s(u, h, _), u = g;
    s(c, h, _);
  }, E = ({ el: u, anchor: c }) => {
    let h;
    for (; u && u !== c; )
      h = v(u), i(u), u = h;
    i(c);
  }, G = (u, c, h, _, g, y, x, S, w) => {
    if (c.type === "svg" ? x = "svg" : c.type === "math" && (x = "mathml"), u == null)
      he(
        c,
        h,
        _,
        g,
        y,
        x,
        S,
        w
      );
    else {
      const b = u.el && u.el._isVueCE ? u.el : null;
      try {
        b && b._beginPatch(), Bi(
          u,
          c,
          g,
          y,
          x,
          S,
          w
        );
      } finally {
        b && b._endPatch();
      }
    }
  }, he = (u, c, h, _, g, y, x, S) => {
    let w, b;
    const { props: M, shapeFlag: C, transition: $, dirs: O } = u;
    if (w = u.el = l(
      u.type,
      y,
      M && M.is,
      M
    ), C & 8 ? f(w, u.children) : C & 16 && it(
      u.children,
      w,
      null,
      _,
      g,
      xn(u, y),
      x,
      S
    ), O && Ge(u, null, _, "created"), Ue(w, u, u.scopeId, x, _), M) {
      for (const W in M)
        W !== "value" && !yt(W) && r(w, W, null, M[W], y, _);
      "value" in M && r(w, "value", null, M.value, y), (b = M.onVnodeBeforeMount) && we(b, _, u);
    }
    O && Ge(u, null, _, "beforeMount");
    const N = pl(g, $);
    N ? $.beforeEnter(w) : $ && !$.persisted && (w[ml] = !0), s(w, c, h), ((b = M && M.onVnodeMounted) || N || O) && ie(() => {
      try {
        b && we(b, _, u), N && $.enter(w), O && Ge(u, null, _, "mounted");
      } finally {
      }
    }, g);
  }, Ue = (u, c, h, _, g) => {
    if (h && T(u, h), _)
      for (let y = 0; y < _.length; y++)
        T(u, _[y]);
    if (g) {
      let y = g.subTree;
      if (c === y || Ii(y.type) && (y.ssContent === c || y.ssFallback === c)) {
        const x = g.vnode;
        Ue(
          u,
          x,
          x.scopeId,
          x.slotScopeIds,
          g.parent
        );
      }
    }
  }, it = (u, c, h, _, g, y, x, S, w = 0) => {
    for (let b = w; b < u.length; b++) {
      const M = u[b] = S ? Re(u[b]) : Ce(u[b]);
      F(
        null,
        M,
        c,
        h,
        _,
        g,
        y,
        x,
        S
      );
    }
  }, Bi = (u, c, h, _, g, y, x) => {
    const S = c.el = u.el;
    let { patchFlag: w, dynamicChildren: b, dirs: M } = c;
    w |= u.patchFlag & 16;
    const C = u.props || Z, $ = c.props || Z;
    let O;
    if (h && Je(h, !1), (O = $.onVnodeBeforeUpdate) && we(O, h, c, u), M && Ge(c, u, h, "beforeUpdate"), h && Je(h, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    b && (!u.dynamicChildren || u.dynamicChildren.length !== b.length) && (w = 0, x = !1, b = null), (C.innerHTML && $.innerHTML == null || C.textContent && $.textContent == null) && f(S, ""), b ? dn(
      u.dynamicChildren,
      b,
      S,
      h,
      _,
      xn(c, g),
      y
    ) : x || pn(
      u,
      c,
      S,
      null,
      h,
      _,
      xn(c, g),
      y,
      !1
    ), w > 0) {
      if (w & 16)
        ts(S, C, $, h, g);
      else if (w & 2 && C.class !== $.class && r(S, "class", null, $.class, g), w & 4 && r(S, "style", C.style, $.style, g), w & 8) {
        const N = c.dynamicProps;
        for (let W = 0; W < N.length; W++) {
          const j = N[W], Y = C[j], Q = $[j];
          (Q !== Y || j === "value") && r(S, j, Y, Q, g, h);
        }
      }
      w & 1 && u.children !== c.children && f(S, c.children);
    } else !x && b == null && ts(S, C, $, h, g);
    ((O = $.onVnodeUpdated) || M) && ie(() => {
      O && we(O, h, c, u), M && Ge(c, u, h, "updated");
    }, _);
  }, dn = (u, c, h, _, g, y, x) => {
    for (let S = 0; S < c.length; S++) {
      const w = u[S], b = c[S], M = w.el || At(w), C = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        M && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (w.type === J || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !mt(w, b) || // - In the case of a component, it could contain anything.
        w.shapeFlag & 198) ? p(M) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          h
        )
      );
      F(
        w,
        b,
        C,
        null,
        _,
        g,
        y,
        x,
        !0
      );
    }
  }, ts = (u, c, h, _, g) => {
    if (c !== h) {
      if (c !== Z)
        for (const y in c)
          !yt(y) && !(y in h) && r(
            u,
            y,
            c[y],
            null,
            g,
            _
          );
      for (const y in h) {
        if (yt(y)) continue;
        const x = h[y], S = c[y];
        x !== S && y !== "value" && r(u, y, S, x, g, _);
      }
      "value" in h && r(u, "value", c.value, h.value, g);
    }
  }, Wi = (u, c, h, _, g, y, x, S, w) => {
    const b = c.el = u ? u.el : o(""), M = c.anchor = u ? u.anchor : o("");
    let { patchFlag: C, dynamicChildren: $, slotScopeIds: O } = c;
    O && (S = S ? S.concat(O) : O), u == null ? (s(b, h, _), s(M, h, _), it(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      c.children || [],
      h,
      M,
      g,
      y,
      x,
      S,
      w
    )) : C > 0 && C & 64 && $ && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    u.dynamicChildren && u.dynamicChildren.length === $.length ? (dn(
      u.dynamicChildren,
      $,
      h,
      g,
      y,
      x,
      S
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (c.key != null || g && c === g.subTree) && Oi(
      u,
      c,
      !0
      /* shallow */
    )) : pn(
      u,
      c,
      h,
      M,
      g,
      y,
      x,
      S,
      w
    );
  }, zi = (u, c, h, _, g, y, x, S, w) => {
    c.slotScopeIds = S, u == null ? c.shapeFlag & 512 ? g.ctx.activate(
      c,
      h,
      _,
      x,
      w
    ) : ns(
      c,
      h,
      _,
      g,
      y,
      x,
      w
    ) : Zi(u, c, w);
  }, ns = (u, c, h, _, g, y, x) => {
    const S = u.component = Cl(
      u,
      _,
      g
    );
    if (vi(u) && (S.ctx.renderer = pt), Tl(S, !1, x), S.asyncDep) {
      if (g && g.registerDep(
        S,
        ss,
        x,
        y
      ), !u.el) {
        const w = S.subTree = Ee(ye);
        A(null, w, c, h), u.placeholder = w.el;
      }
    } else
      ss(
        S,
        u,
        c,
        h,
        g,
        y,
        x
      );
  }, Zi = (u, c, h) => {
    const _ = c.component = u.component;
    if (il(u, c, h))
      if (_.asyncDep && !_.asyncResolved) {
        c.el = u.el, c.placeholder = u.placeholder, hn(_, c, h);
        return;
      } else
        _.next = c, _.update();
    else
      c.el = u.el, c.placeholder = u.placeholder, _.vnode = c;
  }, ss = (u, c, h, _, g, y, x) => {
    const S = () => {
      if (u.isMounted) {
        let { next: C, bu: $, u: O, parent: N, vnode: W } = u;
        {
          const _e = Fi(u);
          if (_e) {
            C && (C.el = W.el, hn(u, C, x)), _e.asyncDep.then(() => {
              const Oe = () => {
                u.job.flags & 8 || (g && g.pendingBranch ? ie(Oe, g) : b());
              };
              Oe.flags = 48, ie(Oe, g);
            });
            return;
          }
        }
        let j = C, Y;
        Je(u, !1), C ? (C.el = W.el, hn(u, C, x)) : C = W, $ && jt($), (Y = C.props && C.props.onVnodeBeforeUpdate) && we(Y, N, C, W), Je(u, !0);
        const Q = ws(u), pe = u.subTree;
        u.subTree = Q, F(
          pe,
          Q,
          // parent may have changed if it's in a teleport. a root that is a
          // pending async component only has its placeholder comment
          p(
            pe.el || At(pe)
          ),
          // anchor may have changed if it's in a fragment
          Dt(pe),
          u,
          g,
          y
        ), C.el = Q.el, j === null && rl(u, Q.el), O && ie(O, g), (Y = C.props && C.props.onVnodeUpdated) && ie(
          () => we(Y, N, C, W),
          g
        );
      } else {
        let C;
        const { el: $, props: O } = c, { bm: N, m: W, parent: j, root: Y, type: Q } = u, pe = xt(c);
        Je(u, !1), N && jt(N), !pe && (C = O && O.onVnodeBeforeMount) && we(C, j, c), Je(u, !0);
        {
          Y.ce && Y.ce._hasShadowRoot() && Y.ce._injectChildStyle(
            Q,
            u.parent ? u.parent.type : void 0
          );
          const _e = u.subTree = ws(u);
          F(
            null,
            _e,
            h,
            _,
            u,
            g,
            y
          ), c.el = _e.el;
        }
        if (W && ie(W, g), !pe && (C = O && O.onVnodeMounted)) {
          const _e = c;
          ie(
            () => we(C, j, _e),
            g
          );
        }
        (c.shapeFlag & 256 || j && xt(j.vnode) && j.vnode.shapeFlag & 256) && u.a && ie(u.a, g), u.isMounted = !0, c = h = _ = null;
      }
    };
    u.scope.on();
    const w = u.effect = new Ys(S);
    u.scope.off();
    const b = u.update = w.run.bind(w), M = u.job = w.runIfDirty.bind(w);
    M.i = u, M.id = u.uid, w.scheduler = () => Yn(M), Je(u, !0), b();
  }, hn = (u, c, h) => {
    c.component = u;
    const _ = u.vnode.props;
    u.vnode = c, u.next = null, ol(u, c.props, _, h), fl(u, c.children, h), ze(), gi(u), Ze();
  }, pn = (u, c, h, _, g, y, x, S, w = !1) => {
    const b = u && u.children, M = u ? u.shapeFlag : 0, C = c.children, { patchFlag: $, shapeFlag: O } = c;
    if ($ > 0) {
      if ($ & 128) {
        is(
          b,
          C,
          h,
          _,
          g,
          y,
          x,
          S,
          w
        );
        return;
      } else if ($ & 256) {
        qi(
          b,
          C,
          h,
          _,
          g,
          y,
          x,
          S,
          w
        );
        return;
      }
    }
    O & 8 ? (M & 16 && ht(b, g, y), C !== b && f(h, C)) : M & 16 ? O & 16 ? is(
      b,
      C,
      h,
      _,
      g,
      y,
      x,
      S,
      w
    ) : ht(b, g, y, !0) : (M & 8 && f(h, ""), O & 16 && it(
      C,
      h,
      _,
      g,
      y,
      x,
      S,
      w
    ));
  }, qi = (u, c, h, _, g, y, x, S, w) => {
    u = u || Xe, c = c || Xe;
    const b = u.length, M = c.length, C = Math.min(b, M);
    let $;
    for ($ = 0; $ < C; $++) {
      const O = c[$] = w ? Re(c[$]) : Ce(c[$]);
      F(
        u[$],
        O,
        h,
        null,
        g,
        y,
        x,
        S,
        w
      );
    }
    b > M ? ht(
      u,
      g,
      y,
      !0,
      !1,
      C
    ) : it(
      c,
      h,
      _,
      g,
      y,
      x,
      S,
      w,
      C
    );
  }, is = (u, c, h, _, g, y, x, S, w) => {
    let b = 0;
    const M = c.length;
    let C = u.length - 1, $ = M - 1;
    for (; b <= C && b <= $; ) {
      const O = u[b], N = c[b] = w ? Re(c[b]) : Ce(c[b]);
      if (mt(O, N))
        F(
          O,
          N,
          h,
          null,
          g,
          y,
          x,
          S,
          w
        );
      else
        break;
      b++;
    }
    for (; b <= C && b <= $; ) {
      const O = u[C], N = c[$] = w ? Re(c[$]) : Ce(c[$]);
      if (mt(O, N))
        F(
          O,
          N,
          h,
          null,
          g,
          y,
          x,
          S,
          w
        );
      else
        break;
      C--, $--;
    }
    if (b > C) {
      if (b <= $) {
        const O = $ + 1, N = O < M ? c[O].el : _;
        for (; b <= $; )
          F(
            null,
            c[b] = w ? Re(c[b]) : Ce(c[b]),
            h,
            N,
            g,
            y,
            x,
            S,
            w
          ), b++;
      }
    } else if (b > $)
      for (; b <= C; )
        ke(u[b], g, y, !0), b++;
    else {
      const O = b, N = b, W = /* @__PURE__ */ new Map();
      for (b = N; b <= $; b++) {
        const oe = c[b] = w ? Re(c[b]) : Ce(c[b]);
        oe.key != null && W.set(oe.key, b);
      }
      let j, Y = 0;
      const Q = $ - N + 1;
      let pe = !1, _e = 0;
      const Oe = new Array(Q);
      for (b = 0; b < Q; b++) Oe[b] = 0;
      for (b = O; b <= C; b++) {
        const oe = u[b];
        if (Y >= Q) {
          ke(oe, g, y, !0);
          continue;
        }
        let ve;
        if (oe.key != null)
          ve = W.get(oe.key);
        else
          for (j = N; j <= $; j++)
            if (Oe[j - N] === 0 && mt(oe, c[j])) {
              ve = j;
              break;
            }
        ve === void 0 ? ke(oe, g, y, !0) : (Oe[ve - N] = b + 1, ve >= _e ? _e = ve : pe = !0, F(
          oe,
          c[ve],
          h,
          null,
          g,
          y,
          x,
          S,
          w
        ), Y++);
      }
      const as = pe ? gl(Oe) : Xe;
      for (j = as.length - 1, b = Q - 1; b >= 0; b--) {
        const oe = N + b, ve = c[oe], us = c[oe + 1], cs = oe + 1 < M ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          us.el || At(us)
        ) : _;
        Oe[b] === 0 ? F(
          null,
          ve,
          h,
          cs,
          g,
          y,
          x,
          S,
          w
        ) : pe && (j < 0 || b !== as[j] ? Rt(ve, h, cs, 2) : j--);
      }
    }
  }, Rt = (u, c, h, _, g = null) => {
    const { el: y, type: x, transition: S, children: w, shapeFlag: b } = u;
    if (b & 6) {
      Rt(u.component.subTree, c, h, _);
      return;
    }
    if (b & 128) {
      u.suspense.move(c, h, _);
      return;
    }
    if (b & 64) {
      x.move(u, c, h, pt);
      return;
    }
    if (x === J) {
      s(y, c, h);
      for (let C = 0; C < w.length; C++)
        Rt(w[C], c, h, _);
      s(u.anchor, c, h);
      return;
    }
    if (x === Bt) {
      D(u, c, h);
      return;
    }
    if (_ !== 2 && b & 1 && S)
      if (_ === 0)
        S.persisted && !y[wn] ? s(y, c, h) : (S.beforeEnter(y), s(y, c, h), ie(() => S.enter(y), g));
      else {
        const { leave: C, delayLeave: $, afterLeave: O } = S, N = () => {
          u.ctx.isUnmounted ? i(y) : s(y, c, h);
        }, W = () => {
          const j = y._isLeaving || !!y[wn];
          y._isLeaving && y[wn](
            !0
            /* cancelled */
          ), S.persisted && !j ? N() : C(y, () => {
            N(), O && O();
          });
        };
        $ ? $(y, N, W) : W();
      }
    else
      s(y, c, h);
  }, ke = (u, c, h, _ = !1, g = !1) => {
    const {
      type: y,
      props: x,
      ref: S,
      children: w,
      dynamicChildren: b,
      shapeFlag: M,
      patchFlag: C,
      dirs: $,
      cacheIndex: O,
      memo: N
    } = u;
    if ((C === -2 || b && b.hasOnce) && (g = !1), S != null && (ze(), St(S, null, h, u, !0), Ze()), O != null && (!u.ctx || u.ctx === c) && (c.renderCache[O] = void 0), M & 256 && c.ctx.deactivate(u))
      return;
    const W = M & 1 && $, j = !xt(u);
    let Y;
    if (j && (Y = x && x.onVnodeBeforeUnmount) && we(Y, c, u), M & 6)
      Gi(u.component, h, _);
    else {
      if (M & 128) {
        u.suspense.unmount(h, _);
        return;
      }
      W && Ge(u, null, c, "beforeUnmount"), M & 64 ? u.type.remove(
        u,
        c,
        h,
        pt,
        _
      ) : b && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !b.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (y !== J || C > 0 && C & 64) ? ht(
        b,
        c,
        h,
        !1,
        !0
      ) : (y === J && C & 384 || !g && M & 16) && ht(w, c, h), _ && rs(u);
    }
    const Q = N != null && O == null;
    (j && (Y = x && x.onVnodeUnmounted) || W || Q) && ie(() => {
      Y && we(Y, c, u), W && Ge(u, null, c, "unmounted"), Q && (u.el = null);
    }, h);
  }, rs = (u) => {
    const { type: c, el: h, anchor: _, transition: g } = u, y = c === J;
    if (y && !g) {
      ls(h, _);
      return;
    }
    if (c === Bt) {
      E(u), g && !g.persisted && g.afterLeave && g.afterLeave();
      return;
    }
    const x = y ? In(u) : u, S = () => {
      y ? p(h) && ls(h, _) : i(h), g && !g.persisted && g.afterLeave && g.afterLeave();
    };
    if (x && x.shapeFlag & 1 && g && !g.persisted) {
      const { leave: w, delayLeave: b } = g, M = x.el, C = () => w(M, S);
      b ? b(M, S, C) : C();
    } else
      S();
  }, ls = (u, c) => {
    let h;
    for (; u !== c; )
      h = v(u), i(u), u = h;
    i(c);
  }, Gi = (u, c, h) => {
    const { bum: _, scope: g, job: y, subTree: x, um: S, m: w, a: b } = u;
    Cs(w), Cs(b), _ && jt(_), g.stop(), y ? (y.flags |= 8, ke(x, u, c, h)) : x && (x.transition = u.vnode.transition, ke(x, u, c, h)), S && ie(S, c);
    const M = () => {
      u.isUnmounted = !0;
    };
    M.flags = 16, ie(M, c);
  }, ht = (u, c, h, _ = !1, g = !1, y = 0) => {
    for (let x = y; x < u.length; x++)
      ke(u[x], c, h, _, g);
  }, Dt = (u) => {
    if (u.shapeFlag & 6)
      return Dt(u.component.subTree);
    if (u.shapeFlag & 128)
      return u.suspense.next();
    const c = v(u.anchor || u.el), h = c && c[zr];
    return h ? v(h) : c;
  }, os = (u, c, h) => {
    const _ = u && c._vnode ? void 0 : u && u.component ? u.component.uid : xl();
    Nr(() => {
      u == null ? c._vnode && ke(c._vnode, null, null, !0) : F(
        c._vnode || null,
        u,
        c,
        null,
        null,
        null,
        h
      ), c._vnode = u;
    }, _);
  }, pt = {
    p: F,
    um: ke,
    m: Rt,
    r: rs,
    mt: ns,
    mc: it,
    pc: pn,
    pbc: dn,
    n: Dt,
    o: e
  };
  return {
    render: os,
    hydrate: void 0,
    createApp: Xr(os)
  };
}
function xn({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Je({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function pl(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Oi(e, t, n = !1) {
  const s = e.children, i = t.children;
  if (I(s) && I(i))
    for (let r = 0; r < s.length; r++) {
      const l = s[r];
      let o = i[r];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = i[r] = Re(i[r]), o.el = l.el), !n && o.patchFlag !== -2 && Oi(l, o)), o.type === cn && (o.patchFlag === -1 && (o = i[r] = Re(o)), o.el = l.el), o.type === ye && !o.el && (o.el = l.el);
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
function At(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  if (t)
    return At(t.subTree);
  const n = e.suspense;
  return n && n.activeBranch ? At(n.activeBranch) : null;
}
const Ii = (e) => e.__isSuspense, ml = /* @__PURE__ */ Symbol("_deferredEnter");
function bl(e, t) {
  t && t.pendingBranch ? I(e) ? t.effects.push(...e) : t.effects.push(e) : Lr(e);
}
const J = /* @__PURE__ */ Symbol.for("v-fgt"), cn = /* @__PURE__ */ Symbol.for("v-txt"), ye = /* @__PURE__ */ Symbol.for("v-cmt"), Bt = /* @__PURE__ */ Symbol.for("v-stc"), nt = [];
let ae = null;
function R(e = !1) {
  nt.push(ae = e ? null : []);
}
function Pi() {
  nt.pop(), ae = nt[nt.length - 1] || null;
}
let $t = 1;
function As(e, t = !1) {
  $t += e, e < 0 && ae && t && (ae.hasOnce = !0);
}
function Ri(e) {
  return e.dynamicChildren = $t > 0 ? ae || Xe : null, Pi(), $t > 0 && ae && ae.push(e), e;
}
function L(e, t, n, s, i, r) {
  return Ri(
    m(
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
function Jt(e, t, n, s, i) {
  return Ri(
    Ee(
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
function mt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Di = ({ key: e }) => e ?? null, Wt = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? X(e) || /* @__PURE__ */ le(e) || B(e) ? { i: ce, r: e, k: t, f: !!n } : e : null);
function m(e, t = null, n = null, s = 0, i = null, r = e === J ? 0 : 1, l = !1, o = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Di(t),
    ref: t && Wt(t),
    scopeId: yi,
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
    ctx: ce
  };
  return o ? (Yt(a, n), r & 128 && e.normalize(a)) : n && (a.shapeFlag |= X(n) ? 8 : 16), $t > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  ae && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && ae.push(a), a;
}
const Ee = yl;
function yl(e, t = null, n = null, s = 0, i = null, r = !1) {
  if ((!e || e === Gr) && (e = ye), es(e)) {
    const o = ut(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Yt(o, n), $t > 0 && !r && ae && (o.shapeFlag & 6 ? ae[ae.indexOf(e)] = o : ae.push(o)), o.patchFlag = -2, o;
  }
  if (kl(e) && (e = e.__vccOpts), t) {
    t = _l(t);
    let { class: o, style: a } = t;
    o && !X(o) && (t.class = It(o)), q(a) && (/* @__PURE__ */ Gn(a) && !I(a) && (a = ue({}, a)), t.style = Hn(a));
  }
  const l = X(e) ? 1 : Ii(e) ? 128 : on(e) ? 64 : q(e) ? 4 : B(e) ? 2 : 0;
  return m(
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
    key: d && Di(d),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? I(r) ? r.concat(Wt(t)) : [r, Wt(t)] : Wt(t)
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
    patchFlag: t && e.type !== J ? l === -1 ? 16 : l | 16 : l,
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
  return a && s && wt(
    f,
    a.clone(f)
  ), f;
}
function te(e = " ", t = 0) {
  return Ee(cn, null, e, t);
}
function vl(e, t) {
  const n = Ee(Bt, null, e);
  return n.staticCount = t, n;
}
function ne(e = "", t = !1) {
  return t ? (R(), Jt(ye, null, e)) : Ee(ye, null, e);
}
function Ce(e) {
  return e == null || typeof e == "boolean" ? Ee(ye) : I(e) ? Ee(
    J,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : es(e) ? Re(e) : Ee(cn, null, String(e));
}
function Re(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : ut(e);
}
function Yt(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (I(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), Yt(e, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = t._;
      !i && !Ti(t) ? t._ctx = ce : i === 3 && ce && (ce.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (B(t)) {
    if (s & 65) {
      Yt(e, { default: t });
      return;
    }
    t = { default: t, _ctx: ce }, n = 32;
  } else
    t = String(t), s & 64 ? (n = 16, t = [te(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function wl(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const i in s)
      if (i === "class")
        t.class !== s.class && (t.class = It([t.class, s.class]));
      else if (i === "style")
        t.style = Hn([t.style, s.style]);
      else if (en(i)) {
        const r = t[i], l = s[i];
        l && r !== l && !(I(r) && r.includes(l)) ? t[i] = r ? [].concat(r, l) : l : l == null && r == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !tn(i) && (t[i] = l);
      } else i !== "" && (t[i] = s[i]);
  }
  return t;
}
function we(e, t, n, s = null) {
  He(e, t, 7, [
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
    propsDefaults: Z,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: Z,
    data: Z,
    props: Z,
    attrs: Z,
    slots: Z,
    refs: Z,
    setupState: Z,
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
const Al = () => ct || ce;
let Xt, kt;
{
  const e = sn(), t = (n, s) => {
    let i;
    return (i = e[n]) || (i = e[n] = []), i.push(s), (r) => {
      i.length > 1 ? i.forEach((l) => l(r)) : i[0](r);
    };
  };
  Xt = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => ct = n
  ), kt = t(
    "__VUE_SSR_SETTERS__",
    (n) => Qt = n
  );
}
const Li = (e) => {
  const t = ct;
  return Xt(e), e.scope.on(), () => {
    e.scope.off(), Xt(t);
  };
}, Ts = () => {
  ct && ct.scope.off(), Xt(null);
};
function Ni(e) {
  return e.vnode.shapeFlag & 4;
}
let Qt = !1;
function Tl(e, t = !1, n = !1) {
  t && kt(t);
  const { props: s, children: i } = e.vnode, r = Ni(e);
  ll(e, s, r, t), cl(e, i, n || t);
  const l = r ? El(e, t) : void 0;
  return t && kt(!1), l;
}
function El(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Jr);
  const { setup: s } = n;
  if (s) {
    ze();
    const i = e.setupContext = s.length > 1 ? $l(e) : null, r = Li(e), l = Pt(
      s,
      e,
      0,
      [
        e.props,
        i
      ]
    ), o = js(l);
    if (Ze(), r(), (o || e.sp) && !xt(e) && qr(e), o) {
      if (l.then(Ts, Ts), t)
        return l.then((a) => {
          kt(!0);
          try {
            Es(e, a, t);
          } finally {
            kt(!1);
          }
        }).catch((a) => {
          ln(a, e, 0, void 0, !0), e.ssrRender = (d, f) => f("<!---->");
        });
      e.asyncDep = l;
    } else
      Es(e, l);
  } else
    Hi(e);
}
function Es(e, t, n) {
  B(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : q(t) && (e.setupState = di(t)), Hi(e);
}
function Hi(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || Qe);
}
const Ui = /* @__PURE__ */ Symbol(), Ml = {
  get(e, t) {
    return se(e, "get", ""), t === Ui ? e : e[t];
  }
};
function $l(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, Ml),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function fn(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(di(Mr(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Ct)
        return Ct[n](e);
    },
    has(t, n) {
      return n in t || n in Ct;
    }
  })) : e.proxy;
}
function kl(e) {
  return B(e) && "__vccOpts" in e;
}
const Dn = (e, t) => /* @__PURE__ */ Ir(e, t, Qt), Ol = "3.5.46";
/**
* @vue/runtime-dom v3.5.46
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Vn;
const Ms = typeof window < "u" && window.trustedTypes;
if (Ms)
  try {
    Vn = /* @__PURE__ */ Ms.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Ki = Vn ? (e) => Vn.createHTML(e) : (e) => e, Fl = "http://www.w3.org/2000/svg", Il = "http://www.w3.org/1998/Math/MathML", Ie = typeof document < "u" ? document : null, $s = Ie && /* @__PURE__ */ Ie.createElement("template"), Pl = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const i = t === "svg" ? Ie.createElementNS(Fl, e) : t === "mathml" ? Ie.createElementNS(Il, e) : n ? Ie.createElement(e, { is: n }) : Ie.createElement(e);
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
      $s.innerHTML = Ki(
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
function Dl(e, t, n) {
  const s = e[Rl];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const ks = /* @__PURE__ */ Symbol("_vod"), Vl = /* @__PURE__ */ Symbol("_vsh"), Ll = /* @__PURE__ */ Symbol(""), Nl = /(?:^|;)\s*display\s*:/;
function Hl(e, t, n) {
  const s = e.style, i = X(n);
  let r = !1;
  if (n && !i) {
    if (t)
      if (X(t))
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
      o != null ? Kl(
        e,
        l,
        !X(t) && t ? t[l] : void 0,
        o
      ) || bt(s, l, o) : bt(s, l, "");
    }
  } else if (i) {
    if (t !== n) {
      const l = s[Ll];
      l && (n += ";" + l), s.cssText = n, r = Nl.test(n);
    }
  } else t && e.removeAttribute("style");
  ks in e && ((!i || t !== n) && (e[ks] = r ? s.display : ""), e[Vl] && (s.display = "none"));
}
const Ht = /\s*!important$/;
function bt(e, t, n) {
  if (I(n))
    n.forEach((s) => bt(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    Ht.test(n) ? e.setProperty(t, n.replace(Ht, ""), "important") : e.setProperty(t, n);
  else {
    const s = Ul(e, t);
    Ht.test(n) ? e.setProperty(
      st(s),
      n.replace(Ht, ""),
      "important"
    ) : e[s] = n;
  }
}
const Os = ["Webkit", "Moz", "ms"], Cn = {};
function Ul(e, t) {
  const n = Cn[t];
  if (n)
    return n;
  let s = me(t);
  if (s !== "filter" && s in e)
    return Cn[t] = s;
  s = zs(s);
  for (let i = 0; i < Os.length; i++) {
    const r = Os[i] + s;
    if (r in e)
      return Cn[t] = r;
  }
  return t;
}
function Kl(e, t, n, s) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && X(s) && n === s;
}
const Fs = "http://www.w3.org/1999/xlink";
function Is(e, t, n, s, i, r = lr(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Fs, t.slice(6, t.length)) : e.setAttributeNS(Fs, t, n) : n == null || r && !qs(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    r ? "" : Me(n) ? String(n) : n
  );
}
function Ps(e, t, n, s, i) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Ki(n) : n);
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
function jl(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const Rs = /* @__PURE__ */ Symbol("_vei");
function Bl(e, t, n, s, i = null) {
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
    } else l && (jl(e, o, l, a), r[t] = void 0);
  }
}
const Wl = /(Once|Passive|Capture)$/, zl = /^on:?(?:Once|Passive|Capture)$/;
function Zl(e) {
  let t, n;
  for (; (n = e.match(Wl)) && !zl.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : st(e.slice(2)), t];
}
let An = 0;
const ql = /* @__PURE__ */ Promise.resolve(), Gl = () => An || (ql.then(() => An = 0), An = Date.now());
function Jl(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    const i = n.value;
    if (I(i)) {
      const r = s.stopImmediatePropagation;
      s.stopImmediatePropagation = () => {
        r.call(s), s._stopped = !0;
      };
      const l = i.slice(), o = [s];
      for (let a = 0; a < l.length && !s._stopped; a++) {
        const d = l[a];
        d && He(
          d,
          t,
          5,
          o
        );
      }
    } else
      He(
        i,
        t,
        5,
        [s]
      );
  };
  return n.value = e, n.attached = Gl(), n;
}
const Ds = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Yl = (e, t, n, s, i, r) => {
  const l = i === "svg";
  t === "class" ? Dl(e, s, l) : t === "style" ? Hl(e, n, s) : en(t) ? tn(t) || Bl(e, t, n, s, r) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Xl(e, t, s, l)) ? (Ps(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Is(e, t, s, l, r, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Ql(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !X(s))) ? Ps(e, me(t), s, r, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), Is(e, t, s, l));
};
function Xl(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && Ds(t) && B(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return Ds(t) && X(n) ? !1 : t in e;
}
function Ql(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const s = me(t);
  return Array.isArray(n) ? n.some((i) => me(i) === s) : Object.keys(n).some((i) => me(i) === s);
}
const ft = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return I(t) ? (n) => jt(t, n) : t;
};
function eo(e) {
  e.target.composing = !0;
}
function Vs(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const Te = /* @__PURE__ */ Symbol("_assign"), Ut = /* @__PURE__ */ Symbol("_initialValue");
function Tn(e, t, n) {
  return t && (e = e.trim()), n && (e = Ft(e)), e;
}
const Kt = {
  created(e, { modifiers: { lazy: t, trim: n, number: s } }, i) {
    e.parentNode && (e.type === "text" ? e[Ut] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Ut] = e.defaultValue.replace(/\r\n?/g, `
`))), e[Te] = ft(i);
    const r = s || i.props && i.props.type === "number";
    je(e, t ? "change" : "input", (l) => {
      l.target.composing || e[Te](Tn(e.value, n, r));
    }), (n || r) && je(e, "change", () => {
      e.value = Tn(e.value, n, r);
    }), t || (je(e, "compositionstart", eo), je(e, "compositionend", Vs), je(e, "change", Vs));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t, modifiers: { trim: n, number: s } }) {
    const i = t ?? "", r = e[Ut];
    delete e[Ut], r !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== r ? e[Te](Tn(e.value, n, s)) : e.value = i;
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: s, trim: i, number: r } }, l) {
    if (e[Te] = ft(l), e.composing) return;
    const o = (r || e.type === "number") && !/^0\d/.test(e.value) ? Ft(e.value) : e.value, a = t ?? "";
    if (o === a)
      return;
    const d = e.getRootNode();
    (d instanceof Document || d instanceof ShadowRoot) && d.activeElement === e && e.type !== "range" && (s && t === n || i && e.value.trim() === a) || (e.value = a);
  }
}, to = {
  // #4096 array checkboxes need to be deep traversed
  deep: !0,
  created(e, t, n) {
    e[Te] = ft(n), je(e, "change", () => {
      const s = e._modelValue, i = Ot(e), r = e.checked, l = e[Te];
      if (I(s)) {
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
        l(ji(e, r));
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: Ls,
  beforeUpdate(e, t, n) {
    e[Te] = ft(n), Ls(e, t, n);
  }
};
function Ls(e, { value: t, oldValue: n }, s) {
  e._modelValue = t;
  let i;
  if (I(t))
    i = Un(t, s.props.value) > -1;
  else if (Le(t))
    i = t.has(s.props.value);
  else {
    if (t === n) return;
    i = Ne(t, ji(e, !0));
  }
  e.checked !== i && (e.checked = i);
}
const no = {
  // <select multiple> value need to be deep traversed
  deep: !0,
  created(e, { value: t, modifiers: { number: n } }, s) {
    e._modelValue = t, je(e, "change", () => {
      const i = Array.prototype.filter.call(e.options, (a) => a.selected).map(
        (a) => n ? Ft(Ot(a)) : Ot(a)
      ), r = e.multiple, l = r ? Le(e._modelValue) ? new Set(i) : i : i[0], o = e._pendingValue = [
        r,
        r ? I(l) ? i.slice() : i : l
      ];
      try {
        e[Te](l);
      } finally {
        Jn(() => {
          e._pendingValue === o && (e._pendingValue = void 0);
        });
      }
    }), e[Te] = ft(s);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(e, { value: t, modifiers: { number: n } }) {
    Ns(e, t, n);
  },
  beforeUpdate(e, { value: t }, n) {
    e._modelValue = t, e[Te] = ft(n);
  },
  updated(e, { value: t, modifiers: { number: n } }) {
    const s = e._pendingValue;
    e._pendingValue = void 0, (!s || s[0] !== e.multiple || !so(t, s[1], s[0])) && Ns(e, t, n);
  }
};
function so(e, t, n) {
  if (!n || I(e)) return Ne(e, t);
  if (Le(e)) {
    if (e.size !== t.length) return !1;
    for (const s of t)
      if (!e.has(s)) return !1;
    return !0;
  }
  return !1;
}
function Ns(e, t, n = !1) {
  const s = e.multiple, i = I(t);
  if (!(s && !i && !Le(t))) {
    for (let r = 0, l = e.options.length; r < l; r++) {
      const o = e.options[r], a = Ot(o);
      if (s)
        if (i) {
          const d = typeof a;
          d === "string" || d === "number" ? o.selected = t.some((f) => String(f) === String(a)) : o.selected = Un(t, a) > -1;
        } else
          o.selected = t.has(a) || n && typeof a == "string" && t.has(Ft(a));
      else if (Ne(Ot(o), t)) {
        e.selectedIndex !== r && (e.selectedIndex = r);
        return;
      }
    }
    !s && e.selectedIndex !== -1 && (e.selectedIndex = -1);
  }
}
function Ot(e) {
  return "_value" in e ? e._value : e.value;
}
function ji(e, t) {
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
}, oo = /* @__PURE__ */ ue({ patchProp: Yl }, Pl);
let Hs;
function ao() {
  return Hs || (Hs = dl(oo));
}
const uo = ((...e) => {
  const t = ao().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const i = fo(s);
    if (!i) return;
    const r = t._component;
    !B(r) && !r.render && !r.template && (r.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
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
  return X(e) ? document.querySelector(e) : e;
}
const ho = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20256%20256'%20width='256'%20height='256'%20role='img'%20aria-labelledby='title'%3e%3ctitle%20id='title'%3eWarmwasser-Zirkulation:%20Wassertropfen%20mit%20Zirkulationspfeilen%3c/title%3e%3cg%20fill='none'%20stroke='%23087e87'%20stroke-width='18'%20stroke-linecap='round'%3e%3cpath%20d='M26%2096%20C43%2036%20100%2010%20152%2028%20C182%2037%20204%2059%20215%2082'/%3e%3cpath%20d='M230%20160%20C213%20220%20156%20246%20104%20228%20C74%20219%2052%20197%2041%20174'/%3e%3c/g%3e%3cg%20fill='%23087e87'%3e%3cpath%20d='M195%2076%20L231%20107%20L235%2062%20Z'/%3e%3cpath%20d='M61%20180%20L25%20149%20L21%20194%20Z'/%3e%3c/g%3e%3cpath%20fill='%23e97a32'%20d='M128%2060%20C120%2080%2085%20119%2085%20144%20C85%20168%20104%20187%20128%20187%20C152%20187%20171%20168%20171%20144%20C171%20119%20136%2080%20128%2060%20Z'/%3e%3cpath%20fill='none'%20stroke='%23ffffff'%20stroke-width='8'%20stroke-linecap='round'%20d='M103%20143%20C103%20155%20111%20166%20123%20168'/%3e%3c/svg%3e", po = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20256%20256'%20width='256'%20height='256'%20role='img'%20aria-labelledby='title'%3e%3ctitle%20id='title'%3eWarmwasser-Zirkulation:%20Wassertropfen%20mit%20Zirkulationspfeilen%3c/title%3e%3cg%20fill='none'%20stroke='%234ed1c6'%20stroke-width='18'%20stroke-linecap='round'%3e%3cpath%20d='M26%2096%20C43%2036%20100%2010%20152%2028%20C182%2037%20204%2059%20215%2082'/%3e%3cpath%20d='M230%20160%20C213%20220%20156%20246%20104%20228%20C74%20219%2052%20197%2041%20174'/%3e%3c/g%3e%3cg%20fill='%234ed1c6'%3e%3cpath%20d='M195%2076%20L231%20107%20L235%2062%20Z'/%3e%3cpath%20d='M61%20180%20L25%20149%20L21%20194%20Z'/%3e%3c/g%3e%3cpath%20fill='%23ffad67'%20d='M128%2060%20C120%2080%2085%20119%2085%20144%20C85%20168%20104%20187%20128%20187%20C152%20187%20171%20168%20171%20144%20C171%20119%20136%2080%20128%2060%20Z'/%3e%3cpath%20fill='none'%20stroke='%23ffffff'%20stroke-width='8'%20stroke-linecap='round'%20d='M103%20143%20C103%20155%20111%20166%20123%20168'/%3e%3c/svg%3e", go = {
  class: "control-settings",
  "aria-label": "Zirkulation konfigurieren"
}, mo = ["disabled"], bo = { class: "mode-field" }, yo = ["disabled"], _o = ["data-day"], vo = {
  key: 0,
  class: "blocked-day"
}, wo = { class: "time-windows" }, So = ["onUpdate:modelValue", "aria-label"], xo = ["onUpdate:modelValue", "aria-label"], Co = ["aria-label", "onClick"], Ao = ["disabled", "onClick"], To = { class: "visually-hidden" }, Eo = ["disabled"], Mo = {
  class: "schedule-day",
  "data-day": "vacation"
}, $o = {
  key: 0,
  class: "blocked-day"
}, ko = { class: "time-windows" }, Oo = ["onUpdate:modelValue", "aria-label"], Fo = ["onUpdate:modelValue", "aria-label"], Io = ["aria-label", "onClick"], Po = ["disabled"], Ro = {
  key: 0,
  class: "error"
}, Do = {
  key: 1,
  class: "error",
  role: "alert"
}, Vo = {
  key: 2,
  class: "error",
  role: "alert"
}, Lo = {
  key: 3,
  role: "status"
}, No = { class: "settings-actions" }, Ho = ["disabled"], Uo = ["disabled"], Ko = { key: 0 }, jo = /* @__PURE__ */ an({
  __name: "ControlSettings",
  props: {
    entry: {},
    saveSettings: {}
  },
  setup(e) {
    const t = e, n = (K) => JSON.parse(JSON.stringify(K)), s = /* @__PURE__ */ Pe(n(t.entry.settings)), i = /* @__PURE__ */ Pe(t.entry.settings_revision), r = /* @__PURE__ */ Pe(!1), l = /* @__PURE__ */ Pe(!1), o = /* @__PURE__ */ Pe(""), a = /* @__PURE__ */ Pe(""), d = Dn(() => i.value !== t.entry.settings_revision), f = [["mon", "Montag"], ["tue", "Dienstag"], ["wed", "Mittwoch"], ["thu", "Donnerstag"], ["fri", "Freitag"], ["sat", "Samstag"], ["sun", "Sonntag"], ["holiday", "Feiertage"]];
    Br(() => t.entry.settings_revision, () => {
      !r.value && !l.value && p();
    });
    function p() {
      s.value = n(t.entry.settings), i.value = t.entry.settings_revision, r.value = !1, o.value = "", a.value = "";
    }
    function v() {
      r.value = !0, o.value = "", a.value = "";
    }
    function T(K) {
      K.push({ start: "06:00", end: "08:00" }), v();
    }
    function P(K, A) {
      K.splice(A, 1), v();
    }
    async function F() {
      if (!(l.value || d.value)) {
        l.value = !0, a.value = "", o.value = "";
        try {
          if (!t.saveSettings) throw new Error("unavailable");
          await t.saveSettings(t.entry.entry_id, n(s.value), i.value), r.value = !1, p(), o.value = "Konfiguration gespeichert.";
        } catch (K) {
          const A = K?.code;
          a.value = A === "invalid_settings" ? "Zeitfenster prüfen: gültige Uhrzeiten, von vor bis und keine Überschneidungen. Nachtfenster auf zwei Tage aufteilen." : A === "settings_conflict" ? "Die Konfiguration wurde inzwischen geändert. Gespeicherten Stand neu laden." : "Speichern oder Bestätigung fehlgeschlagen. Verbindung und Administratorrechte prüfen. Die Eingaben bleiben erhalten.";
        } finally {
          l.value = !1;
        }
      }
    }
    return (K, A) => (R(), L("section", go, [
      A[20] || (A[20] = m("h3", null, "Konfiguration · Freigabezeiten", -1)),
      A[21] || (A[21] = m("p", null, "Freigabezeiten erlauben bedarfsabhängige Starts. Die Pumpe läuft darin nicht dauerhaft. Es gilt die Home-Assistant-Zeitzone.", -1)),
      m("form", {
        onSubmit: lo(F, ["prevent"]),
        onInput: v,
        onChange: v
      }, [
        m("fieldset", { disabled: l.value }, [
          A[5] || (A[5] = m("legend", null, "Betriebsart", -1)),
          m("label", bo, [
            A[4] || (A[4] = te("Betriebsart wählen ", -1)),
            lt(m("select", {
              "onUpdate:modelValue": A[0] || (A[0] = (k) => s.value.mode = k),
              "aria-label": "Betriebsart"
            }, [...A[3] || (A[3] = [
              m("option", { value: "monitoring" }, "Nur Monitoring", -1),
              m("option", { value: "active" }, "Steuerung aktiv", -1)
            ])], 512), [
              [no, s.value.mode]
            ])
          ]),
          A[6] || (A[6] = m("p", null, "Monitoring sammelt Messdaten ohne automatische Starts. Beim Wechsel ins Monitoring wird ein von dieser Integration gestarteter Lauf beendet. Aktive Steuerung benötigt frische Messwerte, eine bekannte Pumpe und ein freigegebenes Zeitfenster.", -1))
        ], 8, mo),
        m("fieldset", { disabled: l.value }, [
          A[10] || (A[10] = m("legend", null, "Wochenplan", -1)),
          A[11] || (A[11] = m("p", null, "Ohne Zeitfenster ist der Tag gesperrt. Feiertage ersetzen den jeweiligen Wochentag; dafür Land und Region unter „Geräte & Sensoren“ festlegen.", -1)),
          (R(), L(J, null, tt(f, ([k, D]) => m("div", {
            key: k,
            class: "schedule-day",
            "data-day": k
          }, [
            m("h4", null, V(D), 1),
            s.value.schedule[k].length ? ne("", !0) : (R(), L("p", vo, "Gesperrt · keine Freigabe")),
            m("ul", wo, [
              (R(!0), L(J, null, tt(s.value.schedule[k], (E, G) => (R(), L("li", { key: G }, [
                m("label", null, [
                  A[7] || (A[7] = te("Von ", -1)),
                  lt(m("input", {
                    "onUpdate:modelValue": (he) => E.start = he,
                    type: "time",
                    required: "",
                    "aria-label": `${D} Abschnitt ${G + 1} von`
                  }, null, 8, So), [
                    [Kt, E.start]
                  ])
                ]),
                m("label", null, [
                  A[8] || (A[8] = te("Bis ", -1)),
                  lt(m("input", {
                    "onUpdate:modelValue": (he) => E.end = he,
                    type: "text",
                    inputmode: "numeric",
                    pattern: "([01][0-9]|2[0-3]):[0-5][0-9]|24:00",
                    placeholder: "HH:MM",
                    required: "",
                    "aria-label": `${D} Abschnitt ${G + 1} bis`
                  }, null, 8, xo), [
                    [Kt, E.end]
                  ])
                ]),
                m("button", {
                  type: "button",
                  "aria-label": `${D} Abschnitt ${G + 1} entfernen`,
                  onClick: (he) => P(s.value.schedule[k], G)
                }, "Entfernen", 8, Co)
              ]))), 128))
            ]),
            m("button", {
              type: "button",
              disabled: s.value.schedule[k].length >= 12,
              onClick: (E) => T(s.value.schedule[k])
            }, [
              A[9] || (A[9] = te("Zeitraum hinzufügen", -1)),
              m("span", To, " · " + V(D), 1)
            ], 8, Ao)
          ], 8, _o)), 64))
        ], 8, yo),
        m("fieldset", { disabled: l.value }, [
          A[17] || (A[17] = m("legend", null, "Urlaubsprofil", -1)),
          m("label", null, [
            lt(m("input", {
              "onUpdate:modelValue": A[1] || (A[1] = (k) => s.value.vacation_active = k),
              type: "checkbox",
              "aria-label": "Urlaubsprofil aktivieren"
            }, null, 512), [
              [to, s.value.vacation_active]
            ]),
            A[12] || (A[12] = te(" Urlaubsprofil aktivieren", -1))
          ]),
          A[18] || (A[18] = m("p", null, "Ersetzt während der manuellen Aktivierung den gesamten Wochen- und Feiertagsplan. Die folgenden Zeitfenster gelten dann an jedem Tag. Ohne Abschnitte bleibt die Zirkulation im Urlaub gesperrt. Nach dem Urlaub hier wieder deaktivieren.", -1)),
          m("div", Mo, [
            A[16] || (A[16] = m("h4", null, "Alle Urlaubstage", -1)),
            s.value.vacation_windows.length ? ne("", !0) : (R(), L("p", $o, "Gesperrt · keine Freigabe")),
            m("ul", ko, [
              (R(!0), L(J, null, tt(s.value.vacation_windows, (k, D) => (R(), L("li", { key: D }, [
                m("label", null, [
                  A[13] || (A[13] = te("Von ", -1)),
                  lt(m("input", {
                    "onUpdate:modelValue": (E) => k.start = E,
                    type: "time",
                    required: "",
                    "aria-label": `Urlaub Abschnitt ${D + 1} von`
                  }, null, 8, Oo), [
                    [Kt, k.start]
                  ])
                ]),
                m("label", null, [
                  A[14] || (A[14] = te("Bis ", -1)),
                  lt(m("input", {
                    "onUpdate:modelValue": (E) => k.end = E,
                    type: "text",
                    inputmode: "numeric",
                    pattern: "([01][0-9]|2[0-3]):[0-5][0-9]|24:00",
                    placeholder: "HH:MM",
                    required: "",
                    "aria-label": `Urlaub Abschnitt ${D + 1} bis`
                  }, null, 8, Fo), [
                    [Kt, k.end]
                  ])
                ]),
                m("button", {
                  type: "button",
                  "aria-label": `Urlaub Abschnitt ${D + 1} entfernen`,
                  onClick: (E) => P(s.value.vacation_windows, D)
                }, "Entfernen", 8, Io)
              ]))), 128))
            ]),
            m("button", {
              type: "button",
              disabled: s.value.vacation_windows.length >= 12,
              onClick: A[2] || (A[2] = (k) => T(s.value.vacation_windows))
            }, [...A[15] || (A[15] = [
              te("Zeitraum hinzufügen", -1),
              m("span", { class: "visually-hidden" }, " · Urlaub", -1)
            ])], 8, Po)
          ])
        ], 8, Eo),
        e.entry.reason === "pump_unreachable" ? (R(), L("p", Ro, "Pumpenfehler: Gerät und Erreichbarkeit prüfen. Erneutes Speichern quittiert den Fehler und gibt die gewählte Betriebsart wieder frei.")) : ne("", !0),
        A[19] || (A[19] = m("p", { class: "hint" }, "Maximal 12 Abschnitte pro Tag; Ende bis 24:00. Die gesamte Pumpenlaufzeit muss in einen Abschnitt passen. Änderungen wirken erst nach dem Speichern.", -1)),
        d.value ? (R(), L("p", Do, "Die Konfiguration wurde inzwischen geändert. Deine Eingaben wurden erhalten. Vor weiteren Änderungen den gespeicherten Stand neu laden.")) : ne("", !0),
        a.value ? (R(), L("p", Vo, V(a.value), 1)) : ne("", !0),
        o.value ? (R(), L("p", Lo, V(o.value), 1)) : ne("", !0),
        m("div", No, [
          m("button", {
            type: "submit",
            disabled: l.value || d.value || !r.value && e.entry.reason !== "pump_unreachable"
          }, V(l.value ? "Wird gespeichert …" : "Konfiguration speichern"), 9, Ho),
          m("button", {
            type: "button",
            disabled: l.value,
            onClick: p
          }, "Gespeicherten Stand neu laden", 8, Uo),
          r.value ? (R(), L("span", Ko, "Ungespeicherte Änderungen")) : ne("", !0)
        ])
      ], 32)
    ]));
  }
}), Bo = {
  class: "heatmap",
  "aria-label": "Zapfmuster nach Wochentag"
}, Wo = { class: "heatmap-header" }, zo = {
  key: 0,
  class: "empty-heatmap"
}, Zo = { class: "heatmap-scroll" }, qo = { key: 0 }, Go = {
  key: 1,
  class: "visually-hidden"
}, Jo = { scope: "row" }, Yo = ["data-row", "data-slot", "tabindex", "onFocus", "onKeydown", "title", "aria-label", "onClick"], Xo = {
  class: "cell-detail",
  "aria-live": "polite"
}, Qo = { class: "subtle" }, ea = {
  key: 1,
  class: "calendar-hint"
}, ta = /* @__PURE__ */ an({
  __name: "UsageHeatmap",
  props: {
    data: {}
  },
  setup(e) {
    const t = e, n = /* @__PURE__ */ Pe({ row: 0, slot: 0 }), s = /* @__PURE__ */ Pe("Eine Zelle auswählen, um Beobachtungstage und Zapfvorgänge zu sehen."), i = { mon: "Montag", tue: "Dienstag", wed: "Mittwoch", thu: "Donnerstag", fri: "Freitag", sat: "Samstag", sun: "Sonntag", holiday: "Feiertag" }, r = (d) => `${String(Math.floor(d / 2)).padStart(2, "0")}:${d % 2 ? "30" : "00"}`, l = new Intl.NumberFormat("de-DE", { style: "percent", maximumFractionDigits: 0 });
    function o(d, f, p) {
      const v = `${i[d]} · ${r(f)}–${r(f + 1)}`;
      return d === "holiday" && !t.data.calendar_enabled ? `${v}: Feiertagskalender nicht konfiguriert.` : p.ratio === null ? `${v}: Keine ausreichend beobachteten Tage. ${p.partial_days} Tage mit Teilmessungen.` : `${v}: ${p.event_days} von ${p.observed_days} beobachteten Tagen mit Zapfvorgang (${l.format(p.ratio)}).${p.sufficient ? "" : " Vorläufig: noch zu wenige Beobachtungstage."}`;
    }
    function a(d, f, p) {
      let v = f, T = p;
      if (d.key === "ArrowRight") T = Math.min(47, p + 1);
      else if (d.key === "ArrowLeft") T = Math.max(0, p - 1);
      else if (d.key === "ArrowDown") v = Math.min(t.data.rows.length - 1, f + 1);
      else if (d.key === "ArrowUp") v = Math.max(0, f - 1);
      else if (d.key === "Home")
        T = 0, d.ctrlKey && (v = 0);
      else if (d.key === "End")
        T = 47, d.ctrlKey && (v = t.data.rows.length - 1);
      else return;
      d.preventDefault(), n.value = { row: v, slot: T };
      const P = d.currentTarget.closest("table");
      Jn(() => P?.querySelector(`button[data-row="${v}"][data-slot="${T}"]`)?.focus());
    }
    return (d, f) => (R(), L("section", Bo, [
      m("div", Wo, [
        f[0] || (f[0] = m("h3", null, "Wann wird Warmwasser gebraucht?", -1)),
        m("span", null, "Letzte " + V(e.data.retention_days) + " Tage", 1)
      ]),
      f[3] || (f[3] = m("p", null, "Die Farbe zeigt den Anteil beobachteter Tage mit erkanntem Zapfvorgang je halber Stunde.", -1)),
      e.data.observed_dates ? ne("", !0) : (R(), L("p", zo, "Die Datensammlung beginnt mit dieser Installation. Vorhandene Lücken werden nicht als „kein Verbrauch“ gewertet.")),
      m("div", Zo, [
        m("table", null, [
          f[2] || (f[2] = m("caption", { class: "visually-hidden" }, "Zapfvorgänge nach Wochentag und halber Stunde", -1)),
          m("thead", null, [
            m("tr", null, [
              f[1] || (f[1] = m("th", { scope: "col" }, "Tag", -1)),
              (R(), L(J, null, tt(48, (p) => m("th", {
                key: p,
                scope: "col"
              }, [
                (p - 1) % 4 === 0 ? (R(), L("span", qo, V(r(p - 1)), 1)) : (R(), L("span", Go, V(r(p - 1)), 1))
              ])), 64))
            ])
          ]),
          m("tbody", null, [
            (R(!0), L(J, null, tt(e.data.rows, (p, v) => (R(), L("tr", {
              key: p.key
            }, [
              m("th", Jo, V(i[p.key]), 1),
              (R(!0), L(J, null, tt(p.cells, (T, P) => (R(), L("td", { key: P }, [
                m("button", {
                  type: "button",
                  class: It(["heat-cell", [T.level === null ? "no-data" : `level-${T.level}`, { provisional: T.ratio !== null && !T.sufficient }]]),
                  "data-row": v,
                  "data-slot": P,
                  tabindex: n.value.row === v && n.value.slot === P ? 0 : -1,
                  onFocus: (F) => n.value = { row: v, slot: P },
                  onKeydown: (F) => a(F, v, P),
                  title: o(p.key, P, T),
                  "aria-label": o(p.key, P, T),
                  onClick: (F) => s.value = o(p.key, P, T)
                }, null, 42, Yo)
              ]))), 128))
            ]))), 128))
          ])
        ])
      ]),
      f[4] || (f[4] = vl('<div class="legend"><span><i class="no-data"></i>Keine Messbasis</span><span><i class="level-0"></i>0 %</span><span><i class="level-2"></i>50 %</span><span><i class="level-4"></i>100 %</span><span><i class="level-2 provisional"></i>Vorläufig</span></div>', 1)),
      m("p", Xo, V(s.value), 1),
      m("p", Qo, "Ein Tag zählt pro Zelle ab " + V(e.data.minimum_coverage_minutes) + " Minuten gültiger Messungen bei ausgeschalteter Pumpe. Ab " + V(e.data.minimum_observed_days) + " Tagen gilt die Messbasis als ausreichend. Feiertage werden separat gezählt.", 1),
      e.data.calendar_enabled ? ne("", !0) : (R(), L("p", ea, "Feiertage sind noch nicht konfiguriert. Land und Bundesland/Region unter „Konfigurieren → Feiertagskalender“ auswählen."))
    ]));
  }
}), na = { class: "system-card" }, sa = { class: "system-heading" }, ia = { class: "metrics temperatures" }, ra = { class: "metrics learning" }, la = { class: "monitoring-note" }, oa = { class: "calendar-summary" }, aa = {
  key: 0,
  class: "vacation-status"
}, ua = /* @__PURE__ */ an({
  __name: "WarmwasserDashboard",
  props: {
    entry: {},
    configurationOpen: { type: Boolean },
    saveSettings: {}
  },
  setup(e) {
    const t = e, n = { outside_schedule: "Außerhalb der Freigabezeiten", waiting_for_demand: "Steuerung aktiv · wartet auf Bedarf", calendar_unavailable: "Feiertagskalender nicht verfügbar", control_failed: "Steuerung gestört", monitoring: "Monitoring", started: "Pumpe gestartet", demand_event: "Pumpe gestartet", pump_entity_missing: "Pumpenschalter fehlt", pump_unreachable: "Pumpenfehler · Steuerung pausiert", fresh_flow_value_missing: "Frische Temperaturwerte fehlen", pump_state_unknown: "Pumpenzustand unbekannt", daily_limit_reached: "Startlimit erreicht", no_draw_event: "Kein Zapfvorgang", pump_already_running: "Pumpe läuft" }, s = Dn(() => n[t.entry.reason] || "Status unbekannt"), i = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }), r = (o) => o?.value == null ? "—" : `${i.format(o.value)} ${o.unit ?? ""}`, l = Dn(() => ({ on: "Läuft", off: "Aus", unknown: "Unbekannt" })[t.entry.pump.state] || "Unbekannt");
    return (o, a) => (R(), L("article", na, [
      m("header", sa, [
        m("div", null, [
          a[0] || (a[0] = m("p", { class: "eyebrow" }, "WARMWASSER ZU HAUSE", -1)),
          m("h2", null, V(e.entry.title), 1)
        ]),
        m("span", {
          class: It(["status", `status--${e.entry.status_level}`])
        }, V(s.value), 3)
      ]),
      m("div", ia, [
        m("section", null, [
          a[1] || (a[1] = m("span", null, "Vorlauf", -1)),
          m("strong", null, V(r(e.entry.flow)), 1),
          m("small", null, [
            te(V(e.entry.flow?.name || "Nicht konfiguriert"), 1),
            e.entry.flow?.stale ? (R(), L(J, { key: 0 }, [
              te(" · veraltet")
            ], 64)) : ne("", !0)
          ])
        ]),
        m("section", null, [
          a[2] || (a[2] = m("span", null, "Warmwasserpuffer", -1)),
          m("strong", null, V(r(e.entry.buffer)), 1),
          m("small", null, [
            te(V(e.entry.buffer?.name || "Nicht konfiguriert"), 1),
            e.entry.buffer?.stale ? (R(), L(J, { key: 0 }, [
              te(" · veraltet")
            ], 64)) : ne("", !0)
          ])
        ]),
        m("section", null, [
          a[3] || (a[3] = m("span", null, "Zirkulationspumpe", -1)),
          m("strong", null, V(l.value), 1),
          m("small", null, V(e.entry.pump.entity_id), 1)
        ])
      ]),
      m("div", ra, [
        m("section", null, [
          a[5] || (a[5] = m("span", null, "Erkennungsschwelle", -1)),
          m("strong", null, [
            te(V(e.entry.threshold.toFixed(3).replace(".", ",")) + " ", 1),
            a[4] || (a[4] = m("small", null, "°C/min", -1))
          ]),
          m("small", null, V(e.entry.learning_ready ? "Lernbasis ausreichend" : "Messdaten werden gesammelt"), 1)
        ]),
        m("section", null, [
          a[6] || (a[6] = m("span", null, "Erkannte Ereignisse · Lernbasis", -1)),
          m("strong", null, V(e.entry.sample_size), 1),
          a[7] || (a[7] = m("small", null, "Zur Anpassung der Erkennungsschwelle", -1))
        ]),
        m("section", null, [
          a[8] || (a[8] = m("span", null, "Startkontingent", -1)),
          m("strong", null, [
            te(V(e.entry.remaining_starts) + " ", 1),
            m("small", null, "/ " + V(e.entry.max_starts), 1)
          ]),
          m("small", null, "Laufzeit je Start: " + V(e.entry.runtime_seconds) + " Sekunden", 1)
        ])
      ]),
      m("p", la, V(e.entry.enabled ? "Steuerfreigabe ist gesetzt." : "Monitoring: Die Messwertbeobachtung schaltet die Pumpe nicht.") + " Bedarfsautomatik: " + V(e.entry.demand_automation ? "freigegeben" : "ausgeschaltet") + ".", 1),
      m("p", oa, "Feiertagskalender: " + V(e.entry.country ? [e.entry.country, e.entry.subdivision].filter(Boolean).join(" · ") : "Nicht konfiguriert"), 1),
      e.entry.settings.vacation_active ? (R(), L("p", aa, "Urlaubsprofil aktiv · ersetzt den Wochen- und Feiertagsplan")) : ne("", !0),
      e.configurationOpen ? (R(), Jt(jo, {
        key: 1,
        entry: e.entry,
        "save-settings": e.saveSettings
      }, null, 8, ["entry", "save-settings"])) : ne("", !0),
      e.entry.heatmap ? (R(), Jt(ta, {
        key: 2,
        data: e.entry.heatmap
      }, null, 8, ["data"])) : ne("", !0),
      a[9] || (a[9] = m("p", { class: "hint" }, "Automatische Starts müssen ausdrücklich freigegeben werden. Fehlende oder veraltete Messwerte sind keine gültige Steuergrundlage.", -1))
    ]));
  }
}), ca = { class: "page" }, fa = { class: "toolbar" }, da = { class: "brand-heading" }, ha = ["src"], pa = ["disabled"], ga = ["aria-expanded"], ma = {
  key: 0,
  class: "error",
  role: "alert"
}, ba = {
  key: 1,
  role: "status"
}, ya = {
  key: 0,
  class: "empty"
}, _a = {
  key: 1,
  class: "updated"
}, va = /* @__PURE__ */ an({
  __name: "PanelApp",
  props: {
    state: {},
    saveSettings: {}
  },
  emits: ["refresh", "menu"],
  setup(e) {
    const t = /* @__PURE__ */ Pe(!1);
    return (n, s) => (R(), L("main", ca, [
      m("header", fa, [
        m("button", {
          class: "menu-button",
          type: "button",
          "aria-label": "Navigation öffnen",
          onClick: s[0] || (s[0] = (i) => n.$emit("menu"))
        }, "☰"),
        m("div", da, [
          m("img", {
            class: "brand-logo",
            src: e.state.darkMode ? Fn(po) : Fn(ho),
            alt: "",
            "aria-hidden": "true",
            width: "52",
            height: "52"
          }, null, 8, ha),
          s[4] || (s[4] = m("div", null, [
            m("h1", null, "Warmwasser-Zirkulation"),
            m("p", null, "Verbrauchsmuster verstehen. Betrieb im Blick behalten.")
          ], -1))
        ]),
        m("button", {
          type: "button",
          disabled: e.state.loading,
          onClick: s[1] || (s[1] = (i) => n.$emit("refresh"))
        }, V(e.state.loading ? "Wird geladen …" : "Aktualisieren"), 9, pa),
        m("button", {
          type: "button",
          "aria-expanded": t.value,
          onClick: s[2] || (s[2] = (i) => t.value = !t.value)
        }, V(t.value ? "Konfiguration schließen" : "Konfiguration"), 9, ga),
        s[5] || (s[5] = m("a", {
          href: "/config/integrations/integration/warmwasser_zirkulation",
          title: "Sensoren und Feiertagsregion über das Zahnrad am gewünschten Eintrag ändern"
        }, "Geräte & Sensoren", -1))
      ]),
      e.state.error ? (R(), L("p", ma, [
        te(V(e.state.error) + " ", 1),
        m("button", {
          type: "button",
          onClick: s[3] || (s[3] = (i) => n.$emit("refresh"))
        }, "Erneut versuchen")
      ])) : e.state.loading && !e.state.entries.length ? (R(), L("p", ba, "Die Betriebsdaten werden aus Home Assistant geladen …")) : (R(), L(J, { key: 2 }, [
        e.state.entries.length ? ne("", !0) : (R(), L("p", ya, "Keine geladene Warmwasser-Zirkulation gefunden. Die Integration unter „Geräte & Dienste“ einrichten.")),
        (R(!0), L(J, null, tt(e.state.entries, (i) => (R(), Jt(ua, {
          key: i.entry_id,
          entry: i,
          "configuration-open": t.value,
          "save-settings": e.saveSettings
        }, null, 8, ["entry", "configuration-open", "save-settings"]))), 128)),
        e.state.updatedAt ? (R(), L("p", _a, "Letzte Aktualisierung: " + V(new Date(e.state.updatedAt).toLocaleTimeString("de-DE")) + " · Aktualisierung alle 15 Sekunden", 1)) : ne("", !0)
      ], 64))
    ]));
  }
});
class wa extends HTMLElement {
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
    t.append(n, s), this.state = /* @__PURE__ */ Zn({ darkMode: !!this.currentHass?.themes?.darkMode, entries: [], loading: !0, error: null, updatedAt: null }), this.app = uo(va, { state: this.state, saveSettings: (i, r, l) => this.configure(i, r, l), onRefresh: () => void this.refresh(), onMenu: () => this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: !0, composed: !0 })) }), this.app.mount(s), this.timer = window.setInterval(() => {
      document.visibilityState !== "hidden" && this.refresh();
    }, 15e3), this.refresh();
  }
  disconnectedCallback() {
    this.generation++, this.timer !== null && window.clearInterval(this.timer), this.timer = null, this.app?.unmount(), this.app = null, this.state = null, this.pending = !1;
  }
  async configure(t, n, s) {
    const i = this.currentHass;
    if (!i || !this.isConnected) throw new Error("unavailable");
    if (this.configuring) throw new Error("busy");
    this.configuring = !0, this.statusSequence++;
    const r = this.generation;
    try {
      await i.callWS({ type: "warmwasser_zirkulation/configure", entry_id: t, settings: n, revision: s });
      const l = await i.callWS({ type: "warmwasser_zirkulation/status" });
      if (r !== this.generation || !this.state || !Array.isArray(l.entries)) throw new Error("unavailable");
      this.state.entries = l.entries, this.state.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), this.state.error = null;
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
customElements.get("warmwasser-panel") || customElements.define("warmwasser-panel", wa);
export {
  wa as WarmwasserPanel
};
