/**
* @vue/shared v3.5.46
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function Zs(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const fe = {}, It = [], Vt = () => {
}, fr = () => !1, Qn = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Xn = (e) => e.startsWith("onUpdate:"), Ie = Object.assign, dr = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, kl = Object.prototype.hasOwnProperty, te = (e, t) => kl.call(e, t), z = Array.isArray, Et = (e) => Ut(e) === "[object Map]", ft = (e) => Ut(e) === "[object Set]", bi = (e) => Ut(e) === "[object Date]", Ol = (e) => Ut(e) === "[object RegExp]", ne = (e) => typeof e == "function", de = (e) => typeof e == "string", et = (e) => typeof e == "symbol", ue = (e) => e !== null && typeof e == "object", hr = (e) => (ue(e) || ne(e)) && ne(e.then) && ne(e.catch), pr = Object.prototype.toString, Ut = (e) => pr.call(e), Pl = (e) => Ut(e).slice(8, -1), gr = (e) => Ut(e) === "[object Object]", qs = (e) => de(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, gn = /* @__PURE__ */ Zs(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Nl = 1e4, es = (e) => {
  let t = /* @__PURE__ */ Object.create(null), n = 0;
  return ((s) => {
    const i = t[s];
    return i !== void 0 ? i : (++n > Nl && (t = /* @__PURE__ */ Object.create(null), n = 1), t[s] = e(s));
  });
}, Il = /-\w/g, Ce = /* @__PURE__ */ es((e) => e.replace(Il, (t) => t.slice(1).toUpperCase())), Dl = /\B([A-Z])/g, jt = /* @__PURE__ */ es(
  (e) => e.replace(Dl, "-$1").toLowerCase()
), ts = /* @__PURE__ */ es((e) => e.charAt(0).toUpperCase() + e.slice(1)), ps = /* @__PURE__ */ es((e) => e ? `on${ts(e)}` : ""), Qe = (e, t) => !Object.is(e, t), Yt = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, mr = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, On = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let vi;
const ns = () => vi || (vi = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Qt(e) {
  if (z(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = de(s) ? Fl(s) : Qt(s);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (de(e) || ue(e))
    return e;
}
const Vl = /;(?![^(]*\))/g, Ll = /:([^]+)/, $l = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Fl(e) {
  const t = {};
  return e.replace($l, (n) => n.startsWith("/*") ? "" : n).split(Vl).forEach((n) => {
    if (n) {
      const s = n.split(Ll);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function Ke(e) {
  let t = "";
  if (de(e))
    t = e;
  else if (z(e))
    for (let n = 0; n < e.length; n++) {
      const s = Ke(e[n]);
      s && (t += s + " ");
    }
  else if (ue(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Hl = "itemscope,allowfullscreen,disablepictureinpicture,disableremoteplayback,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly", Bl = /* @__PURE__ */ Zs(Hl);
function yr(e) {
  return !!e || e === "";
}
function Ul(e, t, n) {
  if (e.length !== t.length) return !1;
  let s = !0;
  for (let i = 0; s && i < e.length; i++)
    s = dt(e[i], t[i], n);
  return s;
}
function _i(e, t, n) {
  if (e.size !== t.size) return !1;
  const s = Array.from(t), i = new Uint8Array(s.length);
  for (const r of e) {
    let l = -1;
    for (let o = 0; o < s.length; o++)
      if (!i[o] && dt(r, s[o], n)) {
        l = o;
        break;
      }
    if (l < 0) return !1;
    i[l] = 1;
  }
  return !0;
}
function jl(e, t, n) {
  let s = Et(e), i = Et(t);
  if (s || i || (s = ft(e), i = ft(t), s || i))
    return s && i ? _i(e, t, n) : !1;
  const r = Object.keys(e).length, l = Object.keys(t).length;
  if (r !== l)
    return !1;
  for (const o in e) {
    const a = te(e, o), f = te(t, o);
    if (a && !f || !a && f || !dt(e[o], t[o], n))
      return !1;
  }
  return Ei(e) === Ei(t);
}
function wi(e, t, n, s) {
  n || (n = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [i, r] = n;
  if (i.has(e) || r.has(t))
    return i.get(e) === t && r.get(t) === e;
  i.set(e, t), r.set(t, e);
  const l = s(e, t, n);
  return i.delete(e), r.delete(t), l;
}
function dt(e, t, n) {
  if (e === t) return !0;
  let s = bi(e), i = bi(t);
  return s || i ? s && i ? e.getTime() === t.getTime() : !1 : (s = et(e), i = et(t), s || i ? e === t : (s = z(e), i = z(t), s || i ? s && i ? wi(e, t, n, Ul) : !1 : (s = ue(e), i = ue(t), s || i ? !s || !i ? !1 : wi(e, t, n, jl) : String(e) === String(t))));
}
function Js(e, t) {
  return e.findIndex((n) => dt(n, t));
}
function Ei(e) {
  return Object.getPrototypeOf(e) === null && e[Symbol.toPrimitive] == null && typeof e.toString != "function" && typeof e.valueOf != "function" ? Ut(e) : String(e);
}
const br = (e) => !!(e && e.__v_isRef === !0), H = (e) => de(e) ? e : e == null ? "" : z(e) || ue(e) && (e.toString === pr || !ne(e.toString)) ? br(e) ? H(e.value) : JSON.stringify(e, vr, 2) : String(e), vr = (e, t) => br(t) ? vr(e, t.value) : Et(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, i], r) => (n[gs(s, r) + " =>"] = i, n),
    {}
  )
} : ft(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => gs(n))
} : et(t) ? gs(t) : ue(t) && !z(t) && !gr(t) ? String(t) : t, gs = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    et(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.46
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let _e;
class Kl {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && _e && (_e.active ? (this.parent = _e, this.index = (_e.scopes || (_e.scopes = [])).push(
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
      const n = _e;
      try {
        return _e = this, t();
      } finally {
        _e = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = _e, _e = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (_e === this)
        _e = this.prevScope;
      else {
        let t = _e;
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
function Gl() {
  return _e;
}
let le;
const ms = /* @__PURE__ */ new WeakSet();
class _r {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, _e && (_e.active ? _e.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, ms.has(this) && (ms.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Er(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Si(this), Sr(this);
    const t = le, n = Ge;
    le = this, Ge = !0;
    try {
      return this.fn();
    } finally {
      Ar(this), le = t, Ge = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Xs(t);
      this.deps = this.depsTail = void 0, Si(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? ms.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Ps(this) && this.run();
  }
  get dirty() {
    return Ps(this);
  }
}
let wr = 0, mn, yn;
function Er(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = yn, yn = e;
    return;
  }
  e.next = mn, mn = e;
}
function Ys() {
  wr++;
}
function Qs() {
  if (--wr > 0)
    return;
  if (yn) {
    let t = yn;
    for (yn = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; mn; ) {
    let t = mn;
    for (mn = void 0; t; ) {
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
function Sr(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ar(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), Xs(s), Wl(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function Ps(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (xr(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function xr(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === En) || (e.globalVersion = En, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ps(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = le, s = Ge;
  le = e, Ge = !0;
  try {
    Sr(e);
    const i = e.fn(e._value);
    (t.version === 0 || Qe(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    le = n, Ge = s, Ar(e), e.flags &= -3;
  }
}
function Xs(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (s && (s.nextSub = i, e.prevSub = void 0), i && (i.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      Xs(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Wl(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let Ge = !0;
const Cr = [];
function ht() {
  Cr.push(Ge), Ge = !1;
}
function pt() {
  const e = Cr.pop();
  Ge = e === void 0 ? !0 : e;
}
function Si(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = le;
    le = void 0;
    try {
      t();
    } finally {
      le = n;
    }
  }
}
let En = 0;
class zl {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class ei {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!le || !Ge || le === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== le)
      n = this.activeLink = new zl(le, this), le.deps ? (n.prevDep = le.depsTail, le.depsTail.nextDep = n, le.depsTail = n) : le.deps = le.depsTail = n, Rr(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = le.depsTail, n.nextDep = void 0, le.depsTail.nextDep = n, le.depsTail = n, le.deps === n && (le.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, En++, this.notify(t);
  }
  notify(t) {
    Ys();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Qs();
    }
  }
}
function Rr(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Rr(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const Ns = /* @__PURE__ */ new WeakMap(), Lt = /* @__PURE__ */ Symbol(
  ""
), Is = /* @__PURE__ */ Symbol(
  ""
), Sn = /* @__PURE__ */ Symbol(
  ""
);
function we(e, t, n) {
  if (Ge && le) {
    let s = Ns.get(e);
    s || Ns.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new ei()), i.map = s, i.key = n), i.track();
  }
}
function ut(e, t, n, s, i, r) {
  const l = Ns.get(e);
  if (!l) {
    En++;
    return;
  }
  const o = (a) => {
    a && a.trigger();
  };
  if (Ys(), t === "clear")
    l.forEach(o);
  else {
    const a = z(e), f = a && qs(n);
    if (a && n === "length") {
      const c = Number(s);
      l.forEach((p, m) => {
        (m === "length" || m === Sn || !et(m) && m >= c) && o(p);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && o(l.get(n)), f && o(l.get(Sn)), t) {
        case "add":
          a ? f && o(l.get("length")) : (o(l.get(Lt)), Et(e) && o(l.get(Is)));
          break;
        case "delete":
          a || (o(l.get(Lt)), Et(e) && o(l.get(Is)));
          break;
        case "set":
          Et(e) && o(l.get(Lt));
          break;
      }
  }
  Qs();
}
function Wt(e) {
  const t = /* @__PURE__ */ ee(e);
  return t === e || (we(t, "iterate", Sn), /* @__PURE__ */ $e(e)) ? t : /* @__PURE__ */ tt(e) ? /* @__PURE__ */ St(e) ? t.map((n) => xt(Fe(n))) : t.map(xt) : t.map(Fe);
}
function ss(e) {
  return we(e = /* @__PURE__ */ ee(e), "iterate", Sn), e;
}
function qe(e, t) {
  return /* @__PURE__ */ tt(e) ? xt(/* @__PURE__ */ St(e) ? Fe(t) : t) : Fe(t);
}
const Zl = {
  __proto__: null,
  [Symbol.iterator]() {
    return ys(this, Symbol.iterator, (e) => qe(this, e));
  },
  concat(...e) {
    return Wt(this).concat(
      ...e.map((t) => z(t) ? Wt(t) : t)
    );
  },
  entries() {
    return ys(this, "entries", (e) => (e[1] = qe(this, e[1]), e));
  },
  every(e, t) {
    return rt(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return rt(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => qe(this, s)),
      arguments
    );
  },
  find(e, t) {
    return rt(
      this,
      "find",
      e,
      t,
      (n) => qe(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return rt(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return rt(
      this,
      "findLast",
      e,
      t,
      (n) => qe(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return rt(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return rt(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return bs(this, "includes", e);
  },
  indexOf(...e) {
    return bs(this, "indexOf", e);
  },
  join(e) {
    return Wt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return bs(this, "lastIndexOf", e);
  },
  map(e, t) {
    return rt(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return an(this, "pop");
  },
  push(...e) {
    return an(this, "push", e);
  },
  reduce(e, ...t) {
    return xi(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return xi(this, "reduceRight", e, t);
  },
  shift() {
    return an(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return rt(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return an(this, "splice", e);
  },
  toReversed() {
    return Wt(this).toReversed();
  },
  toSorted(e) {
    return Wt(this).toSorted(e);
  },
  toSpliced(...e) {
    return Wt(this).toSpliced(...e);
  },
  unshift(...e) {
    return an(this, "unshift", e);
  },
  values() {
    return ys(this, "values", (e) => qe(this, e));
  }
};
function ys(e, t, n) {
  const s = ss(e), i = s[t], r = i.call(s);
  if (s !== e && !/* @__PURE__ */ $e(e)) {
    if (r[Symbol.toStringTag] === "Array Iterator") {
      const l = Object.create(Object.getPrototypeOf(r));
      return l.next = () => Ai(r.next(), n), i !== Mr[t] && Object.defineProperties(l, {
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
    r._next = r.next, r.next = () => Ai(r._next(), n);
  }
  return r;
}
function Ai(e, t) {
  return e.done || (e.value = t(e.value)), e;
}
const Mr = Array.prototype;
function rt(e, t, n, s, i, r) {
  const l = ss(e), o = l !== e && !/* @__PURE__ */ $e(e), a = l[t];
  if (a !== Mr[t]) {
    const p = a.apply(e, r);
    return o ? Fe(p) : p;
  }
  let f = n;
  l !== e && (o ? f = function(p, m) {
    return n.call(this, qe(e, p), m, e);
  } : n.length > 2 && (f = function(p, m) {
    return n.call(this, p, m, e);
  }));
  const c = a.call(l, f, s);
  return o && i ? i(c) : c;
}
function xi(e, t, n, s) {
  const i = ss(e), r = i !== e && !/* @__PURE__ */ $e(e);
  let l = n, o = !1;
  i !== e && (r ? (o = s.length === 0, l = function(f, c, p) {
    return o && (o = !1, f = qe(e, f)), n.call(this, f, qe(e, c), p, e);
  }) : n.length > 3 && (l = function(f, c, p) {
    return n.call(this, f, c, p, e);
  }));
  const a = i[t](l, ...s);
  return o ? qe(e, a) : a;
}
function bs(e, t, n) {
  const s = /* @__PURE__ */ ee(e);
  we(s, "iterate", Sn);
  const i = s[t](...n);
  return (i === -1 || i === !1) && /* @__PURE__ */ si(n[0]) ? (n[0] = /* @__PURE__ */ ee(n[0]), s[t](...n)) : i;
}
function an(e, t, n = []) {
  ht(), Ys();
  const s = (/* @__PURE__ */ ee(e))[t].apply(e, n);
  return Qs(), pt(), s;
}
const ql = /* @__PURE__ */ Zs("__proto__,__v_isRef,__isVue"), Tr = /* @__PURE__ */ new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(et)
);
function Jl(e) {
  et(e) || (e = String(e));
  const t = /* @__PURE__ */ ee(this);
  return we(t, "has", e), t.hasOwnProperty(e);
}
class kr {
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
      return s === (i ? r ? lo : Ir : r ? Nr : Pr).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const l = z(t);
    if (!i) {
      let a;
      if (l && (a = Zl[n]))
        return a;
      if (n === "hasOwnProperty")
        return Jl;
    }
    const o = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ Re(t) ? t : s
    );
    if ((et(n) ? Tr.has(n) : ql(n)) || (i || we(t, "get", n), r))
      return o;
    if (/* @__PURE__ */ Re(o)) {
      const a = l && qs(n) ? o : o.value;
      return i && ue(a) ? /* @__PURE__ */ Vs(a) : a;
    }
    return ue(o) ? i ? /* @__PURE__ */ Vs(o) : /* @__PURE__ */ is(o) : o;
  }
}
class Or extends kr {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    const l = z(t) && qs(n);
    if (!this._isShallow) {
      const f = /* @__PURE__ */ tt(r);
      if (!/* @__PURE__ */ $e(s) && !/* @__PURE__ */ tt(s) && (r = /* @__PURE__ */ ee(r), s = /* @__PURE__ */ ee(s)), !l && /* @__PURE__ */ Re(r) && !/* @__PURE__ */ Re(s))
        return f || (r.value = s), !0;
    }
    const o = l ? Number(n) < t.length : te(t, n), a = Reflect.set(
      t,
      n,
      s,
      /* @__PURE__ */ Re(t) ? t : i
    );
    return t === /* @__PURE__ */ ee(i) && a && (o ? Qe(s, r) && ut(t, "set", n, s) : ut(t, "add", n, s)), a;
  }
  deleteProperty(t, n) {
    const s = te(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && ut(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!et(n) || !Tr.has(n)) && we(t, "has", n), s;
  }
  ownKeys(t) {
    return we(
      t,
      "iterate",
      z(t) ? "length" : Lt
    ), Reflect.ownKeys(t);
  }
}
class Yl extends kr {
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
const Ql = /* @__PURE__ */ new Or(), Xl = /* @__PURE__ */ new Yl(), eo = /* @__PURE__ */ new Or(!0);
const Ds = (e) => e, Nn = (e) => Reflect.getPrototypeOf(e);
function to(e, t, n) {
  return function(...s) {
    const i = this.__v_raw, r = /* @__PURE__ */ ee(i), l = Et(r), o = e === "entries" || e === Symbol.iterator && l, a = e === "keys" && l, f = i[e](...s), c = n ? Ds : t ? xt : Fe;
    return !t && we(
      r,
      "iterate",
      a ? Is : Lt
    ), Ie(
      // inheriting all iterator properties
      Object.create(f),
      {
        // iterator protocol
        next() {
          const { value: p, done: m } = f.next();
          return m ? { value: p, done: m } : {
            value: o ? [c(p[0]), c(p[1])] : c(p),
            done: m
          };
        }
      }
    );
  };
}
function In(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function no(e, t) {
  const n = {
    get(i) {
      const r = this.__v_raw, l = /* @__PURE__ */ ee(r), o = /* @__PURE__ */ ee(i);
      e || (Qe(i, o) && we(l, "get", i), we(l, "get", o));
      const { has: a } = Nn(l), f = t ? Ds : e ? xt : Fe;
      if (a.call(l, i))
        return f(r.get(i));
      if (a.call(l, o))
        return f(r.get(o));
      r !== l && r.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && we(/* @__PURE__ */ ee(i), "iterate", Lt), i.size;
    },
    has(i) {
      const r = this.__v_raw, l = /* @__PURE__ */ ee(r), o = /* @__PURE__ */ ee(i);
      return e || (Qe(i, o) && we(l, "has", i), we(l, "has", o)), i === o ? r.has(i) : r.has(i) || r.has(o);
    },
    forEach(i, r) {
      const l = this, o = l.__v_raw, a = /* @__PURE__ */ ee(o), f = t ? Ds : e ? xt : Fe;
      return !e && we(a, "iterate", Lt), o.forEach((c, p) => i.call(r, f(c), f(p), l));
    }
  };
  return Ie(
    n,
    e ? {
      add: In("add"),
      set: In("set"),
      delete: In("delete"),
      clear: In("clear")
    } : {
      add(i) {
        const r = /* @__PURE__ */ ee(this), l = Nn(r), o = /* @__PURE__ */ ee(i), a = !t && !/* @__PURE__ */ $e(i) && !/* @__PURE__ */ tt(i) ? o : i;
        return l.has.call(r, a) || Qe(i, a) && l.has.call(r, i) || Qe(o, a) && l.has.call(r, o) || (r.add(a), ut(r, "add", a, a)), this;
      },
      set(i, r) {
        !t && !/* @__PURE__ */ $e(r) && !/* @__PURE__ */ tt(r) && (r = /* @__PURE__ */ ee(r));
        const l = /* @__PURE__ */ ee(this), { has: o, get: a } = Nn(l);
        let f = o.call(l, i);
        f || (i = /* @__PURE__ */ ee(i), f = o.call(l, i));
        const c = a.call(l, i);
        return l.set(i, r), f ? Qe(r, c) && ut(l, "set", i, r) : ut(l, "add", i, r), this;
      },
      delete(i) {
        const r = /* @__PURE__ */ ee(this), { has: l, get: o } = Nn(r);
        let a = l.call(r, i);
        a || (i = /* @__PURE__ */ ee(i), a = l.call(r, i)), o && o.call(r, i);
        const f = r.delete(i);
        return a && ut(r, "delete", i, void 0), f;
      },
      clear() {
        const i = /* @__PURE__ */ ee(this), r = i.size !== 0, l = i.clear();
        return r && ut(
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
    n[i] = to(i, e, t);
  }), n;
}
function ti(e, t) {
  const n = no(e, t);
  return (s, i, r) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? s : Reflect.get(
    te(n, i) && i in s ? n : s,
    i,
    r
  );
}
const so = {
  get: /* @__PURE__ */ ti(!1, !1)
}, io = {
  get: /* @__PURE__ */ ti(!1, !0)
}, ro = {
  get: /* @__PURE__ */ ti(!0, !1)
};
const Pr = /* @__PURE__ */ new WeakMap(), Nr = /* @__PURE__ */ new WeakMap(), Ir = /* @__PURE__ */ new WeakMap(), lo = /* @__PURE__ */ new WeakMap();
function oo(e) {
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
function is(e) {
  return /* @__PURE__ */ tt(e) ? e : ni(
    e,
    !1,
    Ql,
    so,
    Pr
  );
}
// @__NO_SIDE_EFFECTS__
function Dr(e) {
  return ni(
    e,
    !1,
    eo,
    io,
    Nr
  );
}
// @__NO_SIDE_EFFECTS__
function Vs(e) {
  return ni(
    e,
    !0,
    Xl,
    ro,
    Ir
  );
}
function ni(e, t, n, s, i) {
  if (!ue(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const r = i.get(e);
  if (r)
    return r;
  const l = oo(Pl(e));
  if (l === 0)
    return e;
  const o = new Proxy(
    e,
    l === 2 ? s : n
  );
  return i.set(e, o), o;
}
// @__NO_SIDE_EFFECTS__
function St(e) {
  return /* @__PURE__ */ tt(e) ? /* @__PURE__ */ St(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function tt(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function $e(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function si(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function ee(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ ee(t) : e;
}
function ao(e) {
  return !te(e, "__v_skip") && Object.isExtensible(e) && mr(e, "__v_skip", !0), e;
}
const Fe = (e) => ue(e) ? /* @__PURE__ */ is(e) : e, xt = (e) => ue(e) ? /* @__PURE__ */ Vs(e) : e;
// @__NO_SIDE_EFFECTS__
function Re(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function ce(e) {
  return Vr(e, !1);
}
// @__NO_SIDE_EFFECTS__
function uo(e) {
  return Vr(e, !0);
}
function Vr(e, t) {
  return /* @__PURE__ */ Re(e) ? e : new co(e, t);
}
class co {
  constructor(t, n) {
    this.dep = new ei(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ ee(t), this._value = n ? t : Fe(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || /* @__PURE__ */ $e(t) || /* @__PURE__ */ tt(t);
    t = s ? t : /* @__PURE__ */ ee(t), Qe(t, n) && (this._rawValue = t, this._value = s ? t : Fe(t), this.dep.trigger());
  }
}
function Se(e) {
  return /* @__PURE__ */ Re(e) ? e.value : e;
}
const fo = {
  get: (e, t, n) => t === "__v_raw" ? e : Se(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const i = e[t];
    return /* @__PURE__ */ Re(i) && !/* @__PURE__ */ Re(n) ? (i.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function Lr(e) {
  return /* @__PURE__ */ St(e) ? e : new Proxy(e, fo);
}
class ho {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new ei(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = En - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    le !== this)
      return Er(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return xr(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function po(e, t, n = !1) {
  let s, i;
  return ne(e) ? s = e : (s = e.get, i = e.set), new ho(s, i, n);
}
const Dn = {}, Un = /* @__PURE__ */ new WeakMap();
let Pt;
function go(e, t = !1, n = Pt) {
  if (n) {
    let s = Un.get(n);
    s || Un.set(n, s = []), s.push(e);
  }
}
function mo(e, t, n = fe) {
  const { immediate: s, deep: i, once: r, scheduler: l, augmentJob: o, call: a } = n, f = (R) => i ? R : /* @__PURE__ */ $e(R) || i === !1 || i === 0 ? ct(R, 1) : ct(R);
  let c, p, m, h, E = !1, x = !1;
  if (/* @__PURE__ */ Re(e) ? (p = () => e.value, E = /* @__PURE__ */ $e(e)) : /* @__PURE__ */ St(e) ? (p = () => f(e), E = !0) : z(e) ? (x = !0, E = e.some((R) => /* @__PURE__ */ St(R) || /* @__PURE__ */ $e(R)), p = () => e.map((R) => {
    if (/* @__PURE__ */ Re(R))
      return R.value;
    if (/* @__PURE__ */ St(R))
      return f(R);
    if (ne(R))
      return a ? a(R, 2) : R();
  })) : ne(e) ? t ? p = a ? () => a(e, 2) : e : p = () => {
    if (m) {
      ht();
      try {
        m();
      } finally {
        pt();
      }
    }
    const R = Pt;
    Pt = c;
    try {
      return a ? a(e, 3, [h]) : e(h);
    } finally {
      Pt = R;
    }
  } : p = Vt, t && i) {
    const R = p, W = i === !0 ? 1 / 0 : i;
    p = () => ct(R(), W);
  }
  const k = Gl(), N = () => {
    c.stop(), k && k.active && dr(k.effects, c);
  };
  if (r && t) {
    const R = t;
    t = (...W) => {
      try {
        return R(...W);
      } finally {
        N();
      }
    };
  }
  let v = x ? new Array(e.length).fill(Dn) : Dn;
  const M = (R) => {
    if (!(!(c.flags & 1) || !c.dirty && !R))
      if (t) {
        const W = c.run();
        if (R || i || E || (x ? W.some((Z, b) => Qe(Z, v[b])) : Qe(W, v))) {
          const Z = Pt;
          ht();
          try {
            m && m(), Pt = c;
            const b = [
              W,
              // pass undefined as the old value when it's changed for the first time
              v === Dn ? void 0 : x && v[0] === Dn ? [] : v,
              h
            ];
            v = W, a ? a(t, 3, b) : (
              // @ts-expect-error
              t(...b)
            );
          } finally {
            Pt = Z, pt();
          }
        }
      } else
        c.run();
  };
  return o && o(M), c = new _r(p), c.scheduler = l ? () => l(M, !1) : M, h = (R) => go(R, !1, c), m = c.onStop = () => {
    const R = Un.get(c);
    if (R) {
      if (a)
        a(R, 4);
      else
        for (const W of R) W();
      Un.delete(c);
    }
  }, t ? s ? M(!0) : v = c.run() : l ? l(M.bind(null, !0), !0) : c.run(), N.pause = c.pause.bind(c), N.resume = c.resume.bind(c), N.stop = N, N;
}
function ct(e, t = 1 / 0, n) {
  if (t <= 0 || !ue(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ Re(e))
    ct(e.value, t, n);
  else if (z(e))
    for (let s = 0; s < e.length; s++)
      ct(e[s], t, n);
  else if (ft(e) || Et(e))
    e.forEach((s) => {
      ct(s, t, n);
    });
  else if (gr(e)) {
    for (const s in e)
      ct(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && ct(e[s], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.46
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function Pn(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (i) {
    rs(i, t, n);
  }
}
function nt(e, t, n, s) {
  if (ne(e)) {
    const i = Pn(e, t, n, s);
    return i && hr(i) && i.catch((r) => {
      rs(r, t, n, void 0, !0);
    }), i;
  }
  if (z(e)) {
    const i = [];
    for (let r = 0; r < e.length; r++)
      i.push(nt(e[r], t, n, s));
    return i;
  }
}
function rs(e, t, n, s = !0, i = !1) {
  const r = t ? t.vnode : null, { errorHandler: l, throwUnhandledErrorInProduction: o } = t && t.appContext.config || fe;
  if (t) {
    let a = t.parent;
    const f = t.proxy, c = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; a; ) {
      const p = a.ec;
      if (p && !a.isUnmounted && // Async failures may outlive stopped scopes whose unmount effects
      // are deferred or discarded by Suspense.
      (!i || a.scope.active)) {
        for (let m = 0; m < p.length; m++)
          if (p[m](e, f, c) === !1)
            return;
      }
      a = a.parent;
    }
    if (l) {
      ht(), Pn(l, null, 10, [
        e,
        f,
        c
      ]), pt();
      return;
    }
  }
  yo(e, n, r, s, o);
}
function yo(e, t, n, s = !0, i = !1) {
  if (i)
    throw e;
  console.error(e);
}
const xe = [];
let je = -1;
const Je = [];
let vt = null, Zt = 0;
const $r = /* @__PURE__ */ Promise.resolve();
let jn = null;
function ls(e) {
  const t = jn || $r;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function bo(e) {
  let t = je + 1, n = xe.length;
  for (; t < n; ) {
    const s = t + n >>> 1, i = xe[s], r = An(i);
    r < e || r === e && i.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function ii(e) {
  if (!(e.flags & 1)) {
    const t = An(e), n = xe[xe.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= An(n) ? xe.push(e) : xe.splice(bo(t), 0, e), e.flags |= 1, Fr();
  }
}
function Fr() {
  jn || (jn = $r.then(Ur));
}
function vo(e) {
  if (!z(e))
    vt && e.id === -1 ? vt.splice(Zt + 1, 0, e) : e.flags & 1 || (Je.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      Je.push(e[t]);
  Fr();
}
function Hr(e, t, n, s = je + 1) {
  for (; s < xe.length; s++) {
    const i = xe[s];
    if (i && i.flags & 2) {
      if (e && i.id !== e.uid || t !== void 0 && !(i.id >= t))
        continue;
      xe.splice(s, 1), s = e ? s - 1 : je, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function Br(e, t, n = 0) {
  if (Je.length) {
    let s = Je, i = 0;
    if (t) {
      s = [];
      for (let l = 0; l < Je.length; l++) {
        const o = Je[l];
        (o.i !== void 0 ? !o.i || o.i.uid < n : t.has(o)) ? Je[i++] = o : s.push(o);
      }
    }
    const r = [...new Set(s)].sort((l, o) => An(l) - An(o));
    if (Je.length = i, vt) {
      for (let l = 0; l < r.length; l++)
        vt.push(r[l]);
      return;
    }
    for (vt = r, Zt = 0; Zt < vt.length; Zt++) {
      const l = vt[Zt];
      l.flags & 4 && (l.flags &= -2), l.flags & 8 || l(), l.flags &= -2;
    }
    vt = null, Zt = 0;
  }
}
let vs = !1;
function _o(e, t) {
  if (vs) {
    e();
    return;
  }
  const n = t === void 0 ? void 0 : new Set(Je);
  e(), vs = !0;
  try {
    Hr(void 0, t), Br(void 0, n, t);
  } finally {
    vs = !1;
  }
}
const An = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Ur(e) {
  try {
    for (je = 0; je < xe.length; je++) {
      const t = xe[je];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Pn(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; je < xe.length; je++) {
      const t = xe[je];
      t && (t.flags &= -2);
    }
    je = -1, xe.length = 0, Br(), jn = null, (xe.length || Je.length) && Ur();
  }
}
let Pe = null, jr = null;
function Kn(e) {
  const t = Pe;
  return Pe = e, jr = e && e.type.__scopeId || null, t;
}
function xn(e, t = Pe, n) {
  if (!t || e._n)
    return e;
  const s = (...i) => {
    s._d && Zn(-1);
    const r = Kn(t), l = Ft.length;
    let o;
    try {
      o = e(...i);
    } finally {
      for (let a = Ft.length; a > l; a--) rl();
      Kn(r), s._d && Zn(1);
    }
    return o;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function Me(e, t) {
  if (Pe === null)
    return e;
  const n = fs(Pe), s = e.dirs || (e.dirs = []);
  for (let i = 0; i < t.length; i++) {
    let [r, l, o, a = fe] = t[i];
    r && (ne(r) && (r = {
      mounted: r,
      updated: r
    }), r.deep && ct(l), s.push({
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
function kt(e, t, n, s) {
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
    l ? a.oldValue = l[o].value : s === "mounted" && a.oldValue !== void 0 && (a = Ie({}, a, { oldValue: void 0 }));
    let f = a.dir[s];
    f && (ht(), nt(f, n, 8, [
      e.el,
      a,
      i,
      t
    ]), pt());
  }
}
function _s(e, t) {
  if (Te) {
    let n = Te.provides;
    const s = Te.parent && Te.parent.provides;
    s === n && (n = Te.provides = Object.create(s)), n[e] = t;
  }
}
function Ht(e, t, n = !1) {
  const s = ul();
  if (s || en) {
    let i = en ? en._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (i && e in i)
      return i[e];
    if (arguments.length > 1)
      return n && ne(t) ? t.call(s && s.proxy) : t;
  }
}
const wo = /* @__PURE__ */ Symbol.for("v-scx"), Eo = () => Ht(wo);
function os(e, t, n) {
  return So(e, t, n);
}
function So(e, t, n = fe) {
  const { immediate: s, deep: i, flush: r, once: l } = n, o = Ie({}, n), a = t && s || !t && r !== "post";
  let f;
  if (Mn) {
    if (r === "sync") {
      const h = Eo();
      f = h.__watcherHandles || (h.__watcherHandles = []);
    } else if (!a) {
      const h = () => {
      };
      return h.stop = Vt, h.resume = Vt, h.pause = Vt, h;
    }
  }
  const c = Te;
  o.call = (h, E, x) => nt(h, c, E, x);
  let p = !1;
  r === "post" ? o.scheduler = (h) => {
    h.i = c, ye(h, c && c.suspense);
  } : r !== "sync" && (p = !0, o.scheduler = (h, E) => {
    E ? h() : ii(h);
  }), o.augmentJob = (h) => {
    t && (h.flags |= 4), p && (h.flags |= 2, c && (h.id = c.uid, h.i = c));
  };
  const m = mo(e, t, o);
  return Mn && (f ? f.push(m) : a && m()), m;
}
const bt = /* @__PURE__ */ new WeakMap(), Kr = /* @__PURE__ */ Symbol("_vte"), as = (e) => e.__isTeleport, Nt = (e) => e && (e.disabled || e.disabled === ""), Ao = (e) => e && (e.defer || e.defer === ""), Ci = (e) => typeof SVGElement < "u" && e instanceof SVGElement, Ri = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, Ls = (e, t) => {
  const n = e && e.to;
  return de(n) ? t ? t(n) : null : n;
}, xo = {
  name: "Teleport",
  __isTeleport: !0,
  process(e, t, n, s, i, r, l, o, a, f) {
    const {
      mc: c,
      pc: p,
      pbc: m,
      o: { insert: h, querySelector: E, createText: x, createComment: k, parentNode: N }
    } = f, v = Nt(t.props);
    let { dynamicChildren: M } = t;
    const R = (b, L, q) => {
      b.shapeFlag & 16 && c(
        b.children,
        L,
        q,
        i,
        r,
        l,
        o,
        a
      );
    }, W = (b = t) => {
      const L = Nt(b.props), q = b.target = Ls(b.props, E), X = $s(q, b, x, h);
      q && (l !== "svg" && Ci(q) ? l = "svg" : l !== "mathml" && Ri(q) && (l = "mathml"), i && i.isCE && (i.ce._teleportTargets || (i.ce._teleportTargets = /* @__PURE__ */ new Set())).add(q), L || (R(b, q, X), fn(b, !1)));
    }, Z = (b) => {
      const L = () => {
        if (bt.get(b) === L) {
          if (bt.delete(b), Nt(b.props)) {
            const q = N(b.el) || n;
            R(b, q, b.anchor), fn(b, !0);
          }
          W(b);
        }
      };
      bt.set(b, L), ye(L, r);
    };
    if (e == null) {
      const b = t.el = x(""), L = t.anchor = x("");
      if (h(b, n, s), h(L, n, s), Ao(t.props) || r && r.pendingBranch) {
        Z(t);
        return;
      }
      v && (R(t, n, L), fn(t, !0)), W();
    } else {
      t.el = e.el;
      const b = t.anchor = e.anchor, L = bt.get(e);
      if (L) {
        L.flags |= 8, bt.delete(e), Z(t);
        return;
      }
      t.targetStart = e.targetStart;
      const q = t.target = e.target, X = t.targetAnchor = e.targetAnchor, he = Nt(e.props), De = he ? n : q, st = he ? b : X;
      if (l === "svg" || Ci(q) ? l = "svg" : (l === "mathml" || Ri(q)) && (l = "mathml"), M ? (m(
        e.dynamicChildren,
        M,
        De,
        i,
        r,
        l,
        o
      ), ci(e, t, !0)) : a || p(
        e,
        t,
        De,
        st,
        i,
        r,
        l,
        o,
        !1
      ), v)
        he ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Vn(
          t,
          n,
          b,
          f,
          1
        );
      else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
        const gt = Ls(t.props, E);
        gt && (t.target = gt, Vn(
          t,
          gt,
          null,
          f,
          0
        ));
      } else he && Vn(
        t,
        q,
        X,
        f,
        1
      );
      fn(t, v);
    }
  },
  remove(e, t, n, { um: s, o: { remove: i } }, r) {
    const {
      shapeFlag: l,
      children: o,
      anchor: a,
      targetStart: f,
      targetAnchor: c,
      target: p,
      props: m
    } = e, h = Nt(m), E = r || !h, x = bt.get(e);
    if (x && (x.flags |= 8, bt.delete(e)), p && (i(f), i(c)), r && i(a), !x && (h || p) && l & 16)
      for (let k = 0; k < o.length; k++) {
        const N = o[k];
        s(
          N,
          t,
          n,
          E,
          !!N.dynamicChildren
        );
      }
  },
  move: Vn,
  hydrate: Co
};
function Vn(e, t, n, { o: { insert: s }, m: i }, r = 2) {
  r === 0 && (e.targetStart && s(e.targetStart, t, n), s(e.targetAnchor, t, n), n = e.targetAnchor);
  const { el: l, anchor: o, shapeFlag: a, children: f, props: c } = e, p = r === 2;
  if (p && s(l, t, n), !bt.has(e) && (!p || Nt(c)) && a & 16)
    for (let m = 0; m < f.length; m++)
      i(
        f[m],
        t,
        n,
        2
      );
  p && s(o, t, n);
}
function Co(e, t, n, s, i, r, {
  o: { nextSibling: l, parentNode: o, querySelector: a, insert: f, createText: c }
}, p) {
  function m(k, N) {
    let v = N;
    for (; v; ) {
      if (v && v.nodeType === 8) {
        if (v.data === "teleport start anchor")
          t.targetStart = v;
        else if (v.data === "teleport anchor") {
          t.targetAnchor = v, k._lpa = t.targetAnchor && l(t.targetAnchor);
          break;
        }
      }
      v = l(v);
    }
  }
  function h(k, N) {
    N.anchor = p(
      l(k),
      N,
      o(k),
      n,
      s,
      i,
      r
    );
  }
  const E = t.target = Ls(
    t.props,
    a
  ), x = Nt(t.props);
  if (E) {
    const k = E._lpa || E.firstChild;
    t.shapeFlag & 16 && (x ? (m(E, k), h(e, t), t.targetAnchor || $s(
      E,
      t,
      c,
      f,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      o(e) === E ? e : null
    )) : (t.anchor = l(e), m(E, k), t.targetAnchor || $s(E, t, c, f), p(
      k && l(k),
      t,
      E,
      n,
      s,
      i,
      r
    ))), fn(t, x);
  } else x && t.shapeFlag & 16 && (h(e, t), t.targetStart = e, t.targetAnchor = l(e));
  return t.anchor && l(t.anchor);
}
const Ro = xo;
function fn(e, t) {
  const n = e.ctx;
  n && n.ut && (t ? n.ut(e.el, e.anchor) : n.ut(e.targetStart, e.targetAnchor));
}
function $s(e, t, n, s, i = null) {
  const r = t.targetStart = n(""), l = t.targetAnchor = n("");
  return r[Kr] = l, e && (s(r, e, i), s(l, e, i)), l;
}
const ws = /* @__PURE__ */ Symbol("_leaveCb");
function Mo(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== He) {
        t = n;
        break;
      }
  }
  return t;
}
function Gr(e) {
  if (!Wr(e))
    return as(e.type) && e.children ? Mo(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && ne(n.default))
      return n.default();
  }
}
function Xt(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    Xt(
      as(n.type) && Gr(n) || n,
      t
    );
  } else if (e.shapeFlag & 128) {
    const n = e.suspense;
    if (n) {
      const s = n.isHydrating ? n.pendingBranch : n.activeBranch;
      s && Xt(s, t.clone(s));
    } else
      e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
  } else if (e.transition = t, e.type === Y && z(e.children)) {
    const n = qr(e.children, !1);
    n && Xt(n, t);
  }
}
function Fs(e) {
  if (e.component)
    return Fs(e.component.subTree);
  if (e.type === Y) {
    const t = z(e.children) && qr(e.children, !1);
    return t ? Fs(t) : void 0;
  }
  if (e.type !== He)
    return e;
}
// @__NO_SIDE_EFFECTS__
function Be(e, t) {
  return ne(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Ie({ name: e.name }, t, { setup: e })
  ) : e;
}
function To(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Mi(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const Gn = /* @__PURE__ */ new WeakMap();
function bn(e, t, n, s, i = !1) {
  if (z(e)) {
    e.forEach(
      (x, k) => bn(
        x,
        t && (z(t) ? t[k] : t),
        n,
        s,
        i
      )
    );
    return;
  }
  if ($t(s) && !i) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && bn(e, t, n, s.component.subTree);
    return;
  }
  const r = s.shapeFlag & 4 ? fs(s.component) : s.el, l = i ? null : r, { i: o, r: a } = e, f = t && t.r, c = o.refs === fe ? o.refs = {} : o.refs, p = o.setupState, m = /* @__PURE__ */ ee(p), h = p === fe ? fr : (x) => Mi(c, x) ? !1 : te(m, x), E = (x, k) => !(k && Mi(c, k));
  if (f != null && f !== a) {
    if (Ti(t), de(f))
      c[f] = null, h(f) && (p[f] = null);
    else if (/* @__PURE__ */ Re(f)) {
      const x = t;
      E(f, x.k) && (f.value = null), x.k && (c[x.k] = null);
    }
  }
  if (ne(a))
    Pn(a, o, 12, [l, c]);
  else {
    const x = de(a), k = /* @__PURE__ */ Re(a);
    if (x || k) {
      const N = () => {
        if (e.f) {
          const v = x ? h(a) ? p[a] : c[a] : E() || !e.k ? a.value : c[e.k];
          if (i)
            z(v) && dr(v, r);
          else if (z(v))
            v.includes(r) || v.push(r);
          else if (x)
            c[a] = [r], h(a) && (p[a] = c[a]);
          else {
            const M = [r];
            E(a, e.k) && (a.value = M), e.k && (c[e.k] = M);
          }
        } else x ? (c[a] = l, h(a) && (p[a] = l)) : k && (E(a, e.k) && (a.value = l), e.k && (c[e.k] = l));
      };
      if (l) {
        const v = () => {
          N(), Gn.delete(e);
        };
        v.id = -1, Gn.set(e, v), ye(v, n);
      } else
        Ti(e), N();
    }
  }
}
function Ti(e) {
  const t = Gn.get(e);
  t && (t.flags |= 8, Gn.delete(e));
}
ns().requestIdleCallback;
ns().cancelIdleCallback;
const $t = (e) => !!e.type.__asyncLoader, Wr = (e) => e.type.__isKeepAlive, ko = {
  name: "KeepAlive",
  // Marker for special handling inside the renderer. We are not using a ===
  // check directly on KeepAlive in the renderer, because importing it directly
  // would prevent it from being tree-shaken.
  __isKeepAlive: !0,
  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },
  setup(e, { slots: t }) {
    const n = ul(), s = n.ctx;
    if (!s.renderer)
      return () => {
        const v = t.default && t.default();
        return v && v.length === 1 ? v[0] : v;
      };
    const i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
    let l = null;
    const o = n.suspense, {
      renderer: {
        p: a,
        m: f,
        um: c,
        o: { createElement: p }
      }
    } = s, m = p("div");
    s.activate = (v, M, R, W, Z) => {
      const b = v.component;
      f(v, M, R, 0, o), a(
        b.vnode,
        v,
        M,
        R,
        b,
        o,
        W,
        v.slotScopeIds,
        Z
      ), ye(() => {
        b.isDeactivated = !1, b.a && Yt(b.a);
        const L = v.props && v.props.onVnodeMounted;
        L && Le(L, b.parent, v);
      }, o);
    }, s.deactivate = (v) => {
      const M = i.get(
        v.key == null ? v.type : v.key
      );
      if (!M || M.component !== v.component)
        return !1;
      const R = v.component;
      return Wn(R.m), Wn(R.a), f(v, m, null, 1, o), ye(() => {
        R.da && Yt(R.da);
        const W = v.props && v.props.onVnodeUnmounted;
        W && Le(W, R.parent, v), R.isDeactivated = !0;
      }, o), !0;
    };
    function h(v) {
      Ln(v), c(v, n, o, !0);
    }
    function E(v) {
      i.forEach((M, R) => {
        const W = Us(
          $t(M) ? M.type.__asyncResolved || {} : M.type
        );
        W && !v(W) && x(R);
      });
    }
    function x(v) {
      const M = i.get(v);
      M && (!l || !qt(M, l)) ? h(M) : l && (Ln(l), M && Ln(M)), i.delete(v), r.delete(v);
    }
    os(
      () => [e.include, e.exclude],
      ([v, M]) => {
        v && E((R) => dn(v, R)), M && E((R) => !dn(M, R));
      },
      // prune post-render after `current` has been updated
      { flush: "post", deep: !0 }
    );
    let k = null;
    const N = () => {
      if (k != null)
        if (zn(n.subTree.type)) {
          const v = () => {
            const M = $n(n.subTree);
            M.component && i.set(k, M);
          };
          n.subTree.suspense.pendingBranch ? ye(v, n.subTree.suspense) : v();
        } else
          i.set(k, $n(n.subTree));
    };
    return li(N), No(N), oi(() => {
      i.forEach((v) => {
        const { subTree: M, suspense: R } = n, W = $n(M);
        if (v.type === W.type && v.key === W.key) {
          Ln(W);
          const Z = W.component.da;
          Z && ye(Z, R);
          return;
        }
        h(v);
      });
    }), () => {
      if (k = null, !t.default)
        return l = null;
      const v = t.default(), M = v[0];
      if (v.length > 1)
        return l = null, v;
      if (!tn(M) || !(M.shapeFlag & 4) && !(M.shapeFlag & 128))
        return l = null, M;
      let R = $n(M);
      if (R.type === He)
        return l = null, R;
      const W = R.type, Z = Us(
        $t(R) ? R.type.__asyncResolved || {} : W
      ), { include: b, exclude: L, max: q } = e;
      if (b && (!Z || !dn(b, Z)) || L && Z && dn(L, Z))
        return R.shapeFlag &= -257, l = R, M;
      const X = R.key == null ? W : R.key, he = i.get(X);
      return R.el && (R = Bt(R), M.shapeFlag & 128 && (M.ssContent = R)), k = X, he ? (R.el = he.el, R.component = he.component, R.transition && Xt(R, R.transition), R.shapeFlag |= 512, r.delete(X), r.add(X)) : (r.add(X), q && r.size > parseInt(q, 10) && x(r.values().next().value)), R.shapeFlag |= 256, l = R, zn(M.type) ? M : R;
    };
  }
}, Oo = ko;
function dn(e, t) {
  return z(e) ? e.some((n) => dn(n, t)) : de(e) ? e.split(",").includes(t) : Ol(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function Ln(e) {
  e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function $n(e) {
  return e.shapeFlag & 128 ? e.ssContent : e;
}
function Po(e, t, n = Te, s = !1) {
  if (n) {
    const i = n[e] || (n[e] = []), r = t.__weh || (t.__weh = (...l) => {
      ht();
      const o = fi(n), a = nt(t, n, e, l);
      return o(), pt(), a;
    });
    return s ? i.unshift(r) : i.push(r), r;
  }
}
const ri = (e) => (t, n = Te) => {
  (!Mn || e === "sp") && Po(e, (...s) => t(...s), n);
}, li = ri("m"), No = ri("u"), oi = ri(
  "bum"
), Io = "components", zr = /* @__PURE__ */ Symbol.for("v-ndc");
function Do(e) {
  return de(e) ? Vo(Io, e, !1) || e : e || zr;
}
function Vo(e, t, n = !0, s = !1) {
  const i = Pe || Te;
  if (i) {
    const r = i.type;
    {
      const o = Us(
        r,
        !1
      );
      if (o && (o === t || o === Ce(t) || o === ts(Ce(t))))
        return r;
    }
    const l = (
      // local registration
      // check instance[type] first which is resolved for options API
      ki(i[e] || r[e], t) || // global registration
      ki(i.appContext[e], t)
    );
    return !l && s ? r : l;
  }
}
function ki(e, t) {
  return e && (e[t] || e[Ce(t)] || e[ts(Ce(t))]);
}
function Ee(e, t, n, s) {
  let i;
  const r = n, l = z(e);
  if (l || de(e)) {
    const o = l && /* @__PURE__ */ St(e);
    let a = !1, f = !1;
    o && (a = !/* @__PURE__ */ $e(e), f = /* @__PURE__ */ tt(e), e = ss(e)), i = new Array(e.length);
    for (let c = 0, p = e.length; c < p; c++)
      i[c] = t(
        a ? f ? xt(Fe(e[c])) : Fe(e[c]) : e[c],
        c,
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
  else if (ue(e))
    if (e[Symbol.iterator])
      i = Array.from(
        e,
        (o, a) => t(o, a, void 0, r)
      );
    else {
      const o = Object.keys(e);
      i = new Array(o.length);
      for (let a = 0, f = o.length; a < f; a++) {
        const c = o[a];
        i[a] = t(e[c], c, a, r);
      }
    }
  else
    i = [];
  return i;
}
const Hs = (e) => e ? cl(e) ? fs(e) : Hs(e.parent) : null, vn = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Ie(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Hs(e.parent),
    $root: (e) => Hs(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => e.type,
    $forceUpdate: (e) => e.f || (e.f = () => {
      ii(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = ls.bind(e.proxy)),
    $watch: (e) => Vt
  })
), Es = (e, t) => e !== fe && !e.__isScriptSetup && te(e, t), Lo = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: i, props: r, accessCache: l, type: o, appContext: a } = e;
    if (t[0] !== "$") {
      const m = l[t];
      if (m !== void 0)
        switch (m) {
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
        if (Es(s, t))
          return l[t] = 1, s[t];
        if (te(r, t))
          return l[t] = 3, r[t];
        if (n !== fe && te(n, t))
          return l[t] = 4, n[t];
        l[t] = 0;
      }
    }
    const f = vn[t];
    let c, p;
    if (f)
      return t === "$attrs" && we(e.attrs, "get", ""), f(e);
    if (
      // css module (injected by vue-loader)
      (c = o.__cssModules) && (c = c[t])
    )
      return c;
    if (n !== fe && te(n, t))
      return l[t] = 4, n[t];
    if (
      // global properties
      p = a.config.globalProperties, te(p, t)
    )
      return p[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: i, ctx: r } = e;
    return Es(i, t) ? (i[t] = n, !0) : te(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (r[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: i, props: r, type: l }
  }, o) {
    let a;
    return !!(n[o] || Es(t, o) || te(r, o) || te(s, o) || te(vn, o) || te(i.config.globalProperties, o) || (a = l.__cssModules) && a[o]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : te(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Zr() {
  return {
    app: null,
    config: {
      isNativeTag: fr,
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
let $o = 0;
function Fo(e, t) {
  return function(s, i = null) {
    ne(s) || (s = Ie({}, s)), i != null && !ue(i) && (i = null);
    const r = Zr(), l = /* @__PURE__ */ new WeakSet(), o = [];
    let a = !1;
    const f = r.app = {
      _uid: $o++,
      _component: s,
      _props: i,
      _container: null,
      _context: r,
      _instance: null,
      version: ma,
      get config() {
        return r.config;
      },
      set config(c) {
      },
      use(c, ...p) {
        return l.has(c) || (c && ne(c.install) ? (l.add(c), c.install(f, ...p)) : ne(c) && (l.add(c), c(f, ...p))), f;
      },
      mixin(c) {
        return f;
      },
      component(c, p) {
        return p ? (r.components[c] = p, f) : r.components[c];
      },
      directive(c, p) {
        return p ? (r.directives[c] = p, f) : r.directives[c];
      },
      mount(c, p, m) {
        if (!a) {
          const h = f._ceVNode || K(s, i);
          return h.appContext = r, m === !0 ? m = "svg" : m === !1 && (m = void 0), e(h, c, m), a = !0, f._container = c, c.__vue_app__ = f, fs(h.component);
        }
      },
      onUnmount(c) {
        o.push(c);
      },
      unmount() {
        a && (nt(
          o,
          f._instance,
          16
        ), e(null, f._container), delete f._container.__vue_app__);
      },
      provide(c, p) {
        return r.provides[c] = p, f;
      },
      runWithContext(c) {
        const p = en;
        en = f;
        try {
          return c();
        } finally {
          en = p;
        }
      }
    };
    return f;
  };
}
let en = null;
const Ho = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Ce(t)}Modifiers`] || e[`${jt(t)}Modifiers`];
function Bo(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || fe;
  let i = n;
  const r = t.startsWith("update:"), l = r && Ho(s, t.slice(7));
  l && (l.trim && (i = n.map((c) => de(c) ? c.trim() : c)), l.number && (i = i.map(On)));
  let o, a = s[o = ps(t)] || // also try camelCase event handler (#2249)
  s[o = ps(Ce(t))];
  !a && r && (a = s[o = ps(jt(t))]), a && nt(
    a,
    e,
    6,
    i
  );
  const f = s[o + "Once"];
  if (f) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[o])
      return;
    e.emitted[o] = !0, nt(
      f,
      e,
      6,
      i
    );
  }
}
function Uo(e, t, n = !1) {
  const s = t.emitsCache, i = s.get(e);
  if (i !== void 0)
    return i;
  const r = e.emits;
  let l = {};
  return r ? (z(r) ? r.forEach((o) => l[o] = null) : Ie(l, r), ue(e) && s.set(e, l), l) : (ue(e) && s.set(e, null), null);
}
function us(e, t) {
  return !e || !Qn(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), te(e, t[0].toLowerCase() + t.slice(1)) || te(e, jt(t)) || te(e, t));
}
function Oi(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: i,
    propsOptions: [r],
    slots: l,
    attrs: o,
    emit: a,
    render: f,
    renderCache: c,
    props: p,
    data: m,
    setupState: h,
    ctx: E,
    inheritAttrs: x
  } = e, k = Kn(e);
  let N, v;
  try {
    if (n.shapeFlag & 4) {
      const R = i || s, W = R;
      N = Ye(
        f.call(
          W,
          R,
          c,
          p,
          h,
          m,
          E
        )
      ), v = o;
    } else {
      const R = t;
      N = Ye(
        R.length > 1 ? R(
          p,
          { attrs: o, slots: l, emit: a }
        ) : R(
          p,
          null
        )
      ), v = t.props ? o : jo(o);
    }
  } catch (R) {
    Ft.length = 0, rs(R, e, 1), N = K(He);
  }
  let M = N;
  if (v && x !== !1) {
    const R = Object.keys(v), { shapeFlag: W } = M;
    R.length && W & 7 && (r && R.some(Xn) && (v = Ko(
      v,
      r
    )), M = Bt(M, v, !1, !0));
  }
  if (n.dirs && (M = Bt(M, null, !1, !0), M.dirs = M.dirs ? M.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const R = as(M.type) && Gr(M) || M;
    Xt(R, n.transition);
  }
  return N = M, Kn(k), N;
}
function qr(e, t = !0) {
  let n;
  for (let s = 0; s < e.length; s++) {
    const i = e[s];
    if (tn(i)) {
      if (i.type !== He || i.children === "v-if") {
        if (n)
          return;
        n = i;
      }
    } else
      return;
  }
  return n;
}
const jo = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || Qn(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Ko = (e, t) => {
  const n = {};
  for (const s in e)
    (!Xn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function Go(e, t, n) {
  const { props: s, children: i, component: r } = e, { props: l, children: o, patchFlag: a } = t, f = r.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return s ? Pi(s, l, f) : !!l;
    if (a & 8) {
      const c = t.dynamicProps;
      for (let p = 0; p < c.length; p++) {
        const m = c[p];
        if (Jr(l, s, m) && !us(f, m))
          return !0;
      }
    }
  } else
    return (i || o) && (!o || !o.$stable) ? !0 : s === l ? !1 : s ? l ? Pi(s, l, f) : !0 : !!l;
  return !1;
}
function Pi(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let i = 0; i < s.length; i++) {
    const r = s[i];
    if (!te(e, r) || Jr(t, e, r) && !us(n, r))
      return !0;
  }
  return !1;
}
function Jr(e, t, n) {
  const s = e[n], i = t[n];
  return n === "style" && ue(s) && ue(i) ? !dt(s, i) : s !== i;
}
function Wo({ vnode: e, parent: t, suspense: n }, s) {
  for (; t; ) {
    const i = t.subTree;
    if (i.suspense && i.suspense.activeBranch === e && (i.suspense.vnode.el = i.el = s, e = i), i === e)
      (e = t.vnode).el = s, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = s);
}
const Yr = {}, Qr = () => Object.create(Yr), Xr = (e) => Object.getPrototypeOf(e) === Yr;
function zo(e, t, n, s = !1) {
  const i = {}, r = Qr();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), el(e, t, i, r);
  for (const l in e.propsOptions[0])
    l in i || (i[l] = void 0);
  n ? e.props = s ? i : /* @__PURE__ */ Dr(i) : e.type.props ? e.props = i : e.props = r, e.attrs = r;
}
function Zo(e, t, n, s) {
  const {
    props: i,
    attrs: r,
    vnode: { patchFlag: l }
  } = e, o = /* @__PURE__ */ ee(i), [a] = e.propsOptions;
  let f = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || l > 0) && !(l & 16)
  ) {
    if (l & 8) {
      const c = e.vnode.dynamicProps;
      for (let p = 0; p < c.length; p++) {
        let m = c[p];
        if (us(e.emitsOptions, m))
          continue;
        const h = t[m];
        if (a)
          if (te(r, m))
            h !== r[m] && (r[m] = h, f = !0);
          else {
            const E = Ce(m);
            i[E] = Bs(
              a,
              o,
              E,
              h,
              e,
              !1
            );
          }
        else
          h !== r[m] && (r[m] = h, f = !0);
      }
    }
  } else {
    el(e, t, i, r) && (f = !0);
    let c;
    for (const p in o)
      (!t || // for camelCase
      !te(t, p) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((c = jt(p)) === p || !te(t, c))) && (a ? n && // for camelCase
      (n[p] !== void 0 || // for kebab-case
      n[c] !== void 0) && (i[p] = Bs(
        a,
        o,
        p,
        void 0,
        e,
        !0
      )) : delete i[p]);
    if (r !== o)
      for (const p in r)
        (!t || !te(t, p)) && (delete r[p], f = !0);
  }
  f && ut(e.attrs, "set", "");
}
function el(e, t, n, s) {
  const [i, r] = e.propsOptions;
  let l = !1, o;
  if (t)
    for (let a in t) {
      if (gn(a))
        continue;
      const f = t[a];
      let c;
      i && te(i, c = Ce(a)) ? !r || !r.includes(c) ? n[c] = f : (o || (o = {}))[c] = f : us(e.emitsOptions, a) || (!(a in s) || f !== s[a]) && (s[a] = f, l = !0);
    }
  if (r) {
    const a = /* @__PURE__ */ ee(n), f = o || fe;
    for (let c = 0; c < r.length; c++) {
      const p = r[c];
      n[p] = Bs(
        i,
        a,
        p,
        f[p],
        e,
        !te(f, p)
      );
    }
  }
  return l;
}
function Bs(e, t, n, s, i, r) {
  const l = e[n];
  if (l != null) {
    const o = te(l, "default");
    if (o && s === void 0) {
      const a = l.default;
      if (l.type !== Function && !l.skipFactory && ne(a)) {
        const { propsDefaults: f } = i;
        if (n in f)
          s = f[n];
        else {
          const c = fi(i);
          s = f[n] = a.call(
            null,
            t
          ), c();
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
    ] && (s === "" || s === jt(n)) && (s = !0));
  }
  return s;
}
function qo(e, t, n = !1) {
  const s = t.propsCache, i = s.get(e);
  if (i)
    return i;
  const r = e.props, l = {}, o = [];
  if (!r)
    return ue(e) && s.set(e, It), It;
  if (z(r))
    for (let f = 0; f < r.length; f++) {
      const c = Ce(r[f]);
      Ni(c) && (l[c] = fe);
    }
  else if (r)
    for (const f in r) {
      const c = Ce(f);
      if (Ni(c)) {
        const p = r[f], m = l[c] = z(p) || ne(p) ? { type: p } : Ie({}, p), h = m.type;
        let E = !1, x = !0;
        if (z(h))
          for (let k = 0; k < h.length; ++k) {
            const N = h[k], v = ne(N) && N.name;
            if (v === "Boolean") {
              E = !0;
              break;
            } else v === "String" && (x = !1);
          }
        else
          E = ne(h) && h.name === "Boolean";
        m[
          0
          /* shouldCast */
        ] = E, m[
          1
          /* shouldCastTrue */
        ] = x, (E || te(m, "default")) && o.push(c);
      }
    }
  const a = [l, o];
  return ue(e) && s.set(e, a), a;
}
function Ni(e) {
  return e[0] !== "$" && !gn(e);
}
const ai = (e) => e === "_" || e === "_ctx" || e === "$stable", ui = (e) => z(e) ? e.map(Ye) : [Ye(e)], Jo = (e, t, n) => {
  if (t._n)
    return t;
  const s = xn((...i) => ui(t(...i)), n);
  return s._c = !1, s;
}, tl = (e, t, n) => {
  const s = e._ctx;
  for (const i in e) {
    if (ai(i)) continue;
    const r = e[i];
    if (ne(r))
      t[i] = Jo(i, r, s);
    else if (r != null) {
      const l = ui(r);
      t[i] = () => l;
    }
  }
}, nl = (e, t) => {
  const n = ui(t);
  e.slots.default = () => n;
}, sl = (e, t, n) => {
  for (const s in t)
    (n || !ai(s)) && (e[s] = t[s]);
}, Yo = (e, t, n) => {
  const s = e.slots = Qr();
  if (e.vnode.shapeFlag & 32) {
    const i = t._;
    i ? (sl(s, t, n), n && mr(s, "_", i, !0)) : tl(t, s);
  } else t && nl(e, t);
}, Qo = (e, t, n) => {
  const { vnode: s, slots: i } = e;
  let r = !0, l = fe;
  if (s.shapeFlag & 32) {
    const o = t._;
    o ? n && o === 1 ? r = !1 : sl(i, t, n) : (r = !t.$stable, tl(t, i)), l = t;
  } else t && (nl(e, t), l = { default: 1 });
  if (r)
    for (const o in i)
      !ai(o) && l[o] == null && delete i[o];
}, ye = ia;
function Xo(e) {
  return ea(e);
}
function ea(e, t) {
  const n = ns();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: i,
    patchProp: r,
    createElement: l,
    createText: o,
    createComment: a,
    setText: f,
    setElementText: c,
    parentNode: p,
    nextSibling: m,
    setScopeId: h = Vt,
    insertStaticContent: E
  } = e, x = (u, g, y, _ = null, w = null, A = null, T = void 0, P = null, O = !!g.dynamicChildren) => {
    if (u === g)
      return;
    u && !qt(u, g) && (_ = S(u), ke(u, w, A, !0), u = null), g.patchFlag === -2 && (O = !1, g.dynamicChildren = null), g.dynamicChildren && u && u.dynamicChildren && u.dynamicChildren.hasOnce && (g.dynamicChildren === It && (g.dynamicChildren = []), g.dynamicChildren.hasOnce = !0);
    const { type: C, ref: B, shapeFlag: V } = g;
    switch (C) {
      case cs:
        k(u, g, y, _);
        break;
      case He:
        N(u, g, y, _);
        break;
      case As:
        u == null && v(g, y, _, T);
        break;
      case Y:
        De(
          u,
          g,
          y,
          _,
          w,
          A,
          T,
          P,
          O
        );
        break;
      default:
        V & 1 ? W(
          u,
          g,
          y,
          _,
          w,
          A,
          T,
          P,
          O
        ) : V & 6 ? st(
          u,
          g,
          y,
          _,
          w,
          A,
          T,
          P,
          O
        ) : (V & 64 || V & 128) && C.process(
          u,
          g,
          y,
          _,
          w,
          A,
          T,
          P,
          O,
          D
        );
    }
    B != null && w ? bn(B, u && u.ref, A, g || u, !g) : B == null && u && u.ref != null && bn(u.ref, null, A, u, !0);
  }, k = (u, g, y, _) => {
    if (u == null)
      s(
        g.el = o(g.children),
        y,
        _
      );
    else {
      const w = g.el = u.el;
      g.children !== u.children && f(w, g.children);
    }
  }, N = (u, g, y, _) => {
    u == null ? s(
      g.el = a(g.children || ""),
      y,
      _
    ) : g.el = u.el;
  }, v = (u, g, y, _) => {
    [u.el, u.anchor] = E(
      u.children,
      g,
      y,
      _,
      u.el,
      u.anchor
    );
  }, M = ({ el: u, anchor: g }, y, _) => {
    let w;
    for (; u && u !== g; )
      w = m(u), s(u, y, _), u = w;
    s(g, y, _);
  }, R = ({ el: u, anchor: g }) => {
    let y;
    for (; u && u !== g; )
      y = m(u), i(u), u = y;
    i(g);
  }, W = (u, g, y, _, w, A, T, P, O) => {
    if (g.type === "svg" ? T = "svg" : g.type === "math" && (T = "mathml"), u == null)
      Z(
        g,
        y,
        _,
        w,
        A,
        T,
        P,
        O
      );
    else {
      const C = u.el && u.el._isVueCE ? u.el : null;
      try {
        C && C._beginPatch(), q(
          u,
          g,
          w,
          A,
          T,
          P,
          O
        );
      } finally {
        C && C._endPatch();
      }
    }
  }, Z = (u, g, y, _, w, A, T, P) => {
    let O, C;
    const { props: B, shapeFlag: V, transition: U, dirs: G } = u;
    if (O = u.el = l(
      u.type,
      A,
      B && B.is,
      B
    ), V & 8 ? c(O, u.children) : V & 16 && L(
      u.children,
      O,
      null,
      _,
      w,
      Ss(u, A),
      T,
      P
    ), G && kt(u, null, _, "created"), b(O, u, u.scopeId, T, _), B) {
      for (const re in B)
        re !== "value" && !gn(re) && r(O, re, null, B[re], A, _);
      "value" in B && r(O, "value", null, B.value, A), (C = B.onVnodeBeforeMount) && Le(C, _, u);
    }
    G && kt(u, null, _, "beforeMount");
    const Q = ta(w, U);
    Q ? U.beforeEnter(O) : U && !U.persisted && (O[sa] = !0), s(O, g, y), ((C = B && B.onVnodeMounted) || Q || G) && ye(() => {
      try {
        C && Le(C, _, u), Q && U.enter(O), G && kt(u, null, _, "mounted");
      } finally {
      }
    }, w);
  }, b = (u, g, y, _, w) => {
    if (y && h(u, y), _)
      for (let A = 0; A < _.length; A++)
        h(u, _[A]);
    if (w) {
      let A = w.subTree;
      if (g === A || zn(A.type) && (A.ssContent === g || A.ssFallback === g)) {
        const T = w.vnode;
        b(
          u,
          T,
          T.scopeId,
          T.slotScopeIds,
          w.parent
        );
      }
    }
  }, L = (u, g, y, _, w, A, T, P, O = 0) => {
    for (let C = O; C < u.length; C++) {
      const B = u[C] = P ? at(u[C]) : Ye(u[C]);
      x(
        null,
        B,
        g,
        y,
        _,
        w,
        A,
        T,
        P
      );
    }
  }, q = (u, g, y, _, w, A, T) => {
    const P = g.el = u.el;
    let { patchFlag: O, dynamicChildren: C, dirs: B } = g;
    O |= u.patchFlag & 16;
    const V = u.props || fe, U = g.props || fe;
    let G;
    if (y && Ot(y, !1), (G = U.onVnodeBeforeUpdate) && Le(G, y, g, u), B && kt(g, u, y, "beforeUpdate"), y && Ot(y, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    C && (!u.dynamicChildren || u.dynamicChildren.length !== C.length) && (O = 0, T = !1, C = null), (V.innerHTML && U.innerHTML == null || V.textContent && U.textContent == null) && c(P, ""), C ? X(
      u.dynamicChildren,
      C,
      P,
      y,
      _,
      Ss(g, w),
      A
    ) : T || Ct(
      u,
      g,
      P,
      null,
      y,
      _,
      Ss(g, w),
      A,
      !1
    ), O > 0) {
      if (O & 16)
        he(P, V, U, y, w);
      else if (O & 2 && V.class !== U.class && r(P, "class", null, U.class, w), O & 4 && r(P, "style", V.style, U.style, w), O & 8) {
        const Q = g.dynamicProps;
        for (let re = 0; re < Q.length; re++) {
          const se = Q[re], me = V[se], ve = U[se];
          (ve !== me || se === "value") && r(P, se, me, ve, w, y);
        }
      }
      O & 1 && u.children !== g.children && c(P, g.children);
    } else !T && C == null && he(P, V, U, y, w);
    ((G = U.onVnodeUpdated) || B) && ye(() => {
      G && Le(G, y, g, u), B && kt(g, u, y, "updated");
    }, _);
  }, X = (u, g, y, _, w, A, T) => {
    for (let P = 0; P < g.length; P++) {
      const O = u[P], C = g[P], B = O.el || _n(O), V = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        B && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (O.type === Y || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !qt(O, C) || // - In the case of a component, it could contain anything.
        O.shapeFlag & 198) ? p(B) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          y
        )
      );
      x(
        O,
        C,
        V,
        null,
        _,
        w,
        A,
        T,
        !0
      );
    }
  }, he = (u, g, y, _, w) => {
    if (g !== y) {
      if (g !== fe)
        for (const A in g)
          !gn(A) && !(A in y) && r(
            u,
            A,
            g[A],
            null,
            w,
            _
          );
      for (const A in y) {
        if (gn(A)) continue;
        const T = y[A], P = g[A];
        T !== P && A !== "value" && r(u, A, P, T, w, _);
      }
      "value" in y && r(u, "value", g.value, y.value, w);
    }
  }, De = (u, g, y, _, w, A, T, P, O) => {
    const C = g.el = u ? u.el : o(""), B = g.anchor = u ? u.anchor : o("");
    let { patchFlag: V, dynamicChildren: U, slotScopeIds: G } = g;
    G && (P = P ? P.concat(G) : G), u == null ? (s(C, y, _), s(B, y, _), L(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      g.children || [],
      y,
      B,
      w,
      A,
      T,
      P,
      O
    )) : V > 0 && V & 64 && U && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    u.dynamicChildren && u.dynamicChildren.length === U.length ? (X(
      u.dynamicChildren,
      U,
      y,
      w,
      A,
      T,
      P
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (g.key != null || w && g === w.subTree) && ci(
      u,
      g,
      !0
      /* shallow */
    )) : Ct(
      u,
      g,
      y,
      B,
      w,
      A,
      T,
      P,
      O
    );
  }, st = (u, g, y, _, w, A, T, P, O) => {
    g.slotScopeIds = P, u == null ? g.shapeFlag & 512 ? w.ctx.activate(
      g,
      y,
      _,
      T,
      O
    ) : gt(
      g,
      y,
      _,
      w,
      A,
      T,
      O
    ) : ln(u, g, O);
  }, gt = (u, g, y, _, w, A, T) => {
    const P = u.component = ca(
      u,
      _,
      w
    );
    if (Wr(u) && (P.ctx.renderer = D), fa(P, !1, T), P.asyncDep) {
      if (w && w.registerDep(
        P,
        on,
        T,
        A
      ), !u.el) {
        const O = P.subTree = K(He);
        N(null, O, g, y), u.placeholder = O.el;
      }
    } else
      on(
        P,
        u,
        g,
        y,
        w,
        A,
        T
      );
  }, ln = (u, g, y) => {
    const _ = g.component = u.component;
    if (Go(u, g, y))
      if (_.asyncDep && !_.asyncResolved) {
        g.el = u.el, g.placeholder = u.placeholder, mt(_, g, y);
        return;
      } else
        _.next = g, _.update();
    else
      g.el = u.el, g.placeholder = u.placeholder, _.vnode = g;
  }, on = (u, g, y, _, w, A, T) => {
    const P = () => {
      if (u.isMounted) {
        let { next: V, bu: U, u: G, parent: Q, vnode: re } = u;
        {
          const ze = il(u);
          if (ze) {
            V && (V.el = re.el, mt(u, V, T)), ze.asyncDep.then(() => {
              const it = () => {
                u.job.flags & 8 || (w && w.pendingBranch ? ye(it, w) : C());
              };
              it.flags = 48, ye(it, w);
            });
            return;
          }
        }
        let se = V, me;
        Ot(u, !1), V ? (V.el = re.el, mt(u, V, T)) : V = re, U && Yt(U), (me = V.props && V.props.onVnodeBeforeUpdate) && Le(me, Q, V, re), Ot(u, !0);
        const ve = Oi(u), Ue = u.subTree;
        u.subTree = ve, x(
          Ue,
          ve,
          // parent may have changed if it's in a teleport. a root that is a
          // pending async component only has its placeholder comment
          p(
            Ue.el || _n(Ue)
          ),
          // anchor may have changed if it's in a fragment
          S(Ue),
          u,
          w,
          A
        ), V.el = ve.el, se === null && Wo(u, ve.el), G && ye(G, w), (me = V.props && V.props.onVnodeUpdated) && ye(
          () => Le(me, Q, V, re),
          w
        );
      } else {
        let V;
        const { el: U, props: G } = g, { bm: Q, m: re, parent: se, root: me, type: ve } = u, Ue = $t(g);
        Ot(u, !1), Q && Yt(Q), !Ue && (V = G && G.onVnodeBeforeMount) && Le(V, se, g), Ot(u, !0);
        {
          me.ce && me.ce._hasShadowRoot() && me.ce._injectChildStyle(
            ve,
            u.parent ? u.parent.type : void 0
          );
          const ze = u.subTree = Oi(u);
          x(
            null,
            ze,
            y,
            _,
            u,
            w,
            A
          ), g.el = ze.el;
        }
        if (re && ye(re, w), !Ue && (V = G && G.onVnodeMounted)) {
          const ze = g;
          ye(
            () => Le(V, se, ze),
            w
          );
        }
        (g.shapeFlag & 256 || se && $t(se.vnode) && se.vnode.shapeFlag & 256) && u.a && ye(u.a, w), u.isMounted = !0, g = y = _ = null;
      }
    };
    u.scope.on();
    const O = u.effect = new _r(P);
    u.scope.off();
    const C = u.update = O.run.bind(O), B = u.job = O.runIfDirty.bind(O);
    B.i = u, B.id = u.uid, O.scheduler = () => ii(B), Ot(u, !0), C();
  }, mt = (u, g, y) => {
    g.component = u;
    const _ = u.vnode.props;
    u.vnode = g, u.next = null, Zo(u, g.props, _, y), Qo(u, g.children, y), ht(), Hr(u), pt();
  }, Ct = (u, g, y, _, w, A, T, P, O = !1) => {
    const C = u && u.children, B = u ? u.shapeFlag : 0, V = g.children, { patchFlag: U, shapeFlag: G } = g;
    if (U > 0) {
      if (U & 128) {
        Kt(
          C,
          V,
          y,
          _,
          w,
          A,
          T,
          P,
          O
        );
        return;
      } else if (U & 256) {
        hs(
          C,
          V,
          y,
          _,
          w,
          A,
          T,
          P,
          O
        );
        return;
      }
    }
    G & 8 ? (B & 16 && Ve(C, w, A), V !== C && c(y, V)) : B & 16 ? G & 16 ? Kt(
      C,
      V,
      y,
      _,
      w,
      A,
      T,
      P,
      O
    ) : Ve(C, w, A, !0) : (B & 8 && c(y, ""), G & 16 && L(
      V,
      y,
      _,
      w,
      A,
      T,
      P,
      O
    ));
  }, hs = (u, g, y, _, w, A, T, P, O) => {
    u = u || It, g = g || It;
    const C = u.length, B = g.length, V = Math.min(C, B);
    let U;
    for (U = 0; U < V; U++) {
      const G = g[U] = O ? at(g[U]) : Ye(g[U]);
      x(
        u[U],
        G,
        y,
        null,
        w,
        A,
        T,
        P,
        O
      );
    }
    C > B ? Ve(
      u,
      w,
      A,
      !0,
      !1,
      V
    ) : L(
      g,
      y,
      _,
      w,
      A,
      T,
      P,
      O,
      V
    );
  }, Kt = (u, g, y, _, w, A, T, P, O) => {
    let C = 0;
    const B = g.length;
    let V = u.length - 1, U = B - 1;
    for (; C <= V && C <= U; ) {
      const G = u[C], Q = g[C] = O ? at(g[C]) : Ye(g[C]);
      if (qt(G, Q))
        x(
          G,
          Q,
          y,
          null,
          w,
          A,
          T,
          P,
          O
        );
      else
        break;
      C++;
    }
    for (; C <= V && C <= U; ) {
      const G = u[V], Q = g[U] = O ? at(g[U]) : Ye(g[U]);
      if (qt(G, Q))
        x(
          G,
          Q,
          y,
          null,
          w,
          A,
          T,
          P,
          O
        );
      else
        break;
      V--, U--;
    }
    if (C > V) {
      if (C <= U) {
        const G = U + 1, Q = G < B ? g[G].el : _;
        for (; C <= U; )
          x(
            null,
            g[C] = O ? at(g[C]) : Ye(g[C]),
            y,
            Q,
            w,
            A,
            T,
            P,
            O
          ), C++;
      }
    } else if (C > U)
      for (; C <= V; )
        ke(u[C], w, A, !0), C++;
    else {
      const G = C, Q = C, re = /* @__PURE__ */ new Map();
      for (C = Q; C <= U; C++) {
        const Oe = g[C] = O ? at(g[C]) : Ye(g[C]);
        Oe.key != null && re.set(Oe.key, C);
      }
      let se, me = 0;
      const ve = U - Q + 1;
      let Ue = !1, ze = 0;
      const it = new Array(ve);
      for (C = 0; C < ve; C++) it[C] = 0;
      for (C = G; C <= V; C++) {
        const Oe = u[C];
        if (me >= ve) {
          ke(Oe, w, A, !0);
          continue;
        }
        let Ze;
        if (Oe.key != null)
          Ze = re.get(Oe.key);
        else
          for (se = Q; se <= U; se++)
            if (it[se - Q] === 0 && qt(Oe, g[se])) {
              Ze = se;
              break;
            }
        Ze === void 0 ? ke(Oe, w, A, !0) : (it[Ze - Q] = C + 1, Ze >= ze ? ze = Ze : Ue = !0, x(
          Oe,
          g[Ze],
          y,
          null,
          w,
          A,
          T,
          P,
          O
        ), me++);
      }
      const gi = Ue ? na(it) : It;
      for (se = gi.length - 1, C = ve - 1; C >= 0; C--) {
        const Oe = Q + C, Ze = g[Oe], mi = g[Oe + 1], yi = Oe + 1 < B ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          mi.el || _n(mi)
        ) : _;
        it[C] === 0 ? x(
          null,
          Ze,
          y,
          yi,
          w,
          A,
          T,
          P,
          O
        ) : Ue && (se < 0 || C !== gi[se] ? Rt(Ze, y, yi, 2) : se--);
      }
    }
  }, Rt = (u, g, y, _, w = null) => {
    const { el: A, type: T, transition: P, children: O, shapeFlag: C } = u;
    if (C & 6) {
      Rt(u.component.subTree, g, y, _);
      return;
    }
    if (C & 128) {
      u.suspense.move(g, y, _);
      return;
    }
    if (C & 64) {
      T.move(u, g, y, D);
      return;
    }
    if (T === Y) {
      s(A, g, y);
      for (let V = 0; V < O.length; V++)
        Rt(O[V], g, y, _);
      s(u.anchor, g, y);
      return;
    }
    if (T === As) {
      M(u, g, y);
      return;
    }
    if (_ !== 2 && C & 1 && P)
      if (_ === 0)
        P.persisted && !A[ws] ? s(A, g, y) : (P.beforeEnter(A), s(A, g, y), ye(() => P.enter(A), w));
      else {
        const { leave: V, delayLeave: U, afterLeave: G } = P, Q = () => {
          u.ctx.isUnmounted ? i(A) : s(A, g, y);
        }, re = () => {
          const se = A._isLeaving || !!A[ws];
          A._isLeaving && A[ws](
            !0
            /* cancelled */
          ), P.persisted && !se ? Q() : V(A, () => {
            Q(), G && G();
          });
        };
        U ? U(A, Q, re) : re();
      }
    else
      s(A, g, y);
  }, ke = (u, g, y, _ = !1, w = !1) => {
    const {
      type: A,
      props: T,
      ref: P,
      children: O,
      dynamicChildren: C,
      shapeFlag: B,
      patchFlag: V,
      dirs: U,
      cacheIndex: G,
      memo: Q
    } = u;
    if ((V === -2 || C && C.hasOnce) && (w = !1), P != null && (ht(), bn(P, null, y, u, !0), pt()), G != null && (!u.ctx || u.ctx === g) && (g.renderCache[G] = void 0), B & 256 && g.ctx.deactivate(u))
      return;
    const re = B & 1 && U, se = !$t(u);
    let me;
    if (se && (me = T && T.onVnodeBeforeUnmount) && Le(me, g, u), B & 6)
      Tt(u.component, y, _);
    else {
      if (B & 128) {
        u.suspense.unmount(y, _);
        return;
      }
      re && kt(u, null, g, "beforeUnmount"), B & 64 ? u.type.remove(
        u,
        g,
        y,
        D,
        _
      ) : C && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !C.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (A !== Y || V > 0 && V & 64) ? Ve(
        C,
        g,
        y,
        !1,
        !0
      ) : (A === Y && V & 384 || !w && B & 16) && Ve(O, g, y), _ && Gt(u);
    }
    const ve = Q != null && G == null;
    (se && (me = T && T.onVnodeUnmounted) || re || ve) && ye(() => {
      me && Le(me, g, u), re && kt(u, null, g, "unmounted"), ve && (u.el = null);
    }, y);
  }, Gt = (u) => {
    const { type: g, el: y, anchor: _, transition: w } = u, A = g === Y;
    if (A && !w) {
      Mt(y, _);
      return;
    }
    if (g === As) {
      R(u), w && !w.persisted && w.afterLeave && w.afterLeave();
      return;
    }
    const T = A ? Fs(u) : u, P = () => {
      A ? p(y) && Mt(y, _) : i(y), w && !w.persisted && w.afterLeave && w.afterLeave();
    };
    if (T && T.shapeFlag & 1 && w && !w.persisted) {
      const { leave: O, delayLeave: C } = w, B = T.el, V = () => O(B, P);
      C ? C(B, P, V) : V();
    } else
      P();
  }, Mt = (u, g) => {
    let y;
    for (; u !== g; )
      y = m(u), i(u), u = y;
    i(g);
  }, Tt = (u, g, y) => {
    const { bum: _, scope: w, job: A, subTree: T, um: P, m: O, a: C } = u;
    Wn(O), Wn(C), _ && Yt(_), w.stop(), A ? (A.flags |= 8, ke(T, u, g, y)) : T && (T.transition = u.vnode.transition, ke(T, u, g, y)), P && ye(P, g);
    const B = () => {
      u.isUnmounted = !0;
    };
    B.flags = 16, ye(B, g);
  }, Ve = (u, g, y, _ = !1, w = !1, A = 0) => {
    for (let T = A; T < u.length; T++)
      ke(u[T], g, y, _, w);
  }, S = (u) => {
    if (u.shapeFlag & 6)
      return S(u.component.subTree);
    if (u.shapeFlag & 128)
      return u.suspense.next();
    const g = m(u.anchor || u.el), y = g && g[Kr];
    return y ? m(y) : g;
  }, F = (u, g, y) => {
    const _ = u && g._vnode ? void 0 : u && u.component ? u.component.uid : ua();
    _o(() => {
      u == null ? g._vnode && ke(g._vnode, null, null, !0) : x(
        g._vnode || null,
        u,
        g,
        null,
        null,
        null,
        y
      ), g._vnode = u;
    }, _);
  }, D = {
    p: x,
    um: ke,
    m: Rt,
    r: Gt,
    mt: gt,
    mc: L,
    pc: Ct,
    pbc: X,
    n: S,
    o: e
  };
  return {
    render: F,
    hydrate: void 0,
    createApp: Fo(F)
  };
}
function Ss({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ot({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function ta(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function ci(e, t, n = !1) {
  const s = e.children, i = t.children;
  if (z(s) && z(i))
    for (let r = 0; r < s.length; r++) {
      const l = s[r];
      let o = i[r];
      o.shapeFlag & 1 && !o.dynamicChildren && ((o.patchFlag <= 0 || o.patchFlag === 32) && (o = i[r] = at(i[r]), o.el = l.el), !n && o.patchFlag !== -2 && ci(l, o)), o.type === cs && (o.patchFlag === -1 && (o = i[r] = at(o)), o.el = l.el), o.type === He && !o.el && (o.el = l.el);
    }
}
function na(e) {
  const t = e.slice(), n = [0];
  let s, i, r, l, o;
  const a = e.length;
  for (s = 0; s < a; s++) {
    const f = e[s];
    if (f !== 0) {
      if (i = n[n.length - 1], e[i] < f) {
        t[s] = i, n.push(s);
        continue;
      }
      for (r = 0, l = n.length - 1; r < l; )
        o = r + l >> 1, e[n[o]] < f ? r = o + 1 : l = o;
      f < e[n[r]] && (r > 0 && (t[s] = n[r - 1]), n[r] = s);
    }
  }
  for (r = n.length, l = n[r - 1]; r-- > 0; )
    n[r] = l, l = t[l];
  return n;
}
function il(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : il(t);
}
function Wn(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function _n(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  if (t)
    return _n(t.subTree);
  const n = e.suspense;
  return n && n.activeBranch ? _n(n.activeBranch) : null;
}
const zn = (e) => e.__isSuspense, sa = /* @__PURE__ */ Symbol("_deferredEnter");
function ia(e, t) {
  t && t.pendingBranch ? z(e) ? t.effects.push(...e) : t.effects.push(e) : vo(e);
}
const Y = /* @__PURE__ */ Symbol.for("v-fgt"), cs = /* @__PURE__ */ Symbol.for("v-txt"), He = /* @__PURE__ */ Symbol.for("v-cmt"), As = /* @__PURE__ */ Symbol.for("v-stc"), Ft = [];
let Ne = null;
function I(e = !1) {
  Ft.push(Ne = e ? null : []);
}
function rl() {
  Ft.pop(), Ne = Ft[Ft.length - 1] || null;
}
let Cn = 1;
function Zn(e, t = !1) {
  Cn += e, e < 0 && Ne && t && (Ne.hasOnce = !0);
}
function ll(e) {
  return e.dynamicChildren = Cn > 0 ? Ne || It : null, rl(), Cn > 0 && Ne && Ne.push(e), e;
}
function $(e, t, n, s, i, r) {
  return ll(
    d(
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
function At(e, t, n, s, i) {
  return ll(
    K(
      e,
      t,
      n,
      s,
      i,
      !0
    )
  );
}
function tn(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function qt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const ol = ({ key: e }) => e ?? null, Bn = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? de(e) || /* @__PURE__ */ Re(e) || ne(e) ? { i: Pe, r: e, k: t, f: !!n } : e : null);
function d(e, t = null, n = null, s = 0, i = null, r = e === Y ? 0 : 1, l = !1, o = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && ol(t),
    ref: t && Bn(t),
    scopeId: jr,
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
    ctx: Pe
  };
  return o ? (qn(a, n), r & 128 && e.normalize(a)) : n && (a.shapeFlag |= de(n) ? 8 : 16), Cn > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  Ne && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && Ne.push(a), a;
}
const K = ra;
function ra(e, t = null, n = null, s = 0, i = null, r = !1) {
  if ((!e || e === zr) && (e = He), tn(e)) {
    const o = Bt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && qn(o, n), Cn > 0 && !r && Ne && (o.shapeFlag & 6 ? Ne[Ne.indexOf(e)] = o : Ne.push(o)), o.patchFlag = -2, o;
  }
  if (ga(e) && (e = e.__vccOpts), t) {
    t = la(t);
    let { class: o, style: a } = t;
    o && !de(o) && (t.class = Ke(o)), ue(a) && (/* @__PURE__ */ si(a) && !z(a) && (a = Ie({}, a)), t.style = Qt(a));
  }
  const l = de(e) ? 1 : zn(e) ? 128 : as(e) ? 64 : ue(e) ? 4 : ne(e) ? 2 : 0;
  return d(
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
function la(e) {
  return e ? /* @__PURE__ */ si(e) ? Ie({}, e) : Xr(e) ? Ie({}, e[dl] || e) : e : null;
}
function Bt(e, t, n = !1, s = !1) {
  const { props: i, ref: r, patchFlag: l, children: o, transition: a } = e, f = t ? oa(i || {}, t) : i, c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: f,
    key: f && ol(f),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? z(r) ? r.concat(Bn(t)) : [r, Bn(t)] : Bn(t)
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
    patchFlag: t && e.type !== Y ? l === -1 ? 16 : l | 16 : l,
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
    ssContent: e.ssContent && Bt(e.ssContent),
    ssFallback: e.ssFallback && Bt(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
    cacheIndex: e.cacheIndex
  };
  return a && s && Xt(
    c,
    a.clone(c)
  ), c;
}
function J(e = " ", t = 0) {
  return K(cs, null, e, t);
}
function ae(e = "", t = !1) {
  return t ? (I(), At(He, null, e)) : K(He, null, e);
}
function Ye(e) {
  return e == null || typeof e == "boolean" ? K(He) : z(e) ? K(
    Y,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : tn(e) ? at(e) : K(cs, null, String(e));
}
function at(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Bt(e);
}
function qn(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (z(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), qn(e, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = t._;
      !i && !Xr(t) ? t._ctx = Pe : i === 3 && Pe && (Pe.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (ne(t)) {
    if (s & 65) {
      qn(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Pe }, n = 32;
  } else
    t = String(t), s & 64 ? (n = 16, t = [J(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function oa(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const i in s)
      if (i === "class")
        t.class !== s.class && (t.class = Ke([t.class, s.class]));
      else if (i === "style")
        t.style = Qt([t.style, s.style]);
      else if (Qn(i)) {
        const r = t[i], l = s[i];
        l && r !== l && !(z(r) && r.includes(l)) ? t[i] = r ? [].concat(r, l) : l : l == null && r == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !Xn(i) && (t[i] = l);
      } else i !== "" && (t[i] = s[i]);
  }
  return t;
}
function Le(e, t, n, s = null) {
  nt(e, t, 7, [
    n,
    s
  ]);
}
const aa = /* @__PURE__ */ Zr();
let al = 0;
function ua() {
  return al;
}
function ca(e, t, n) {
  const s = e.type, i = (t ? t.appContext : e.appContext) || aa, r = {
    uid: al++,
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
    scope: new Kl(
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
    propsOptions: qo(s, i),
    emitsOptions: Uo(s, i),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: fe,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: fe,
    data: fe,
    props: fe,
    attrs: fe,
    slots: fe,
    refs: fe,
    setupState: fe,
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
  return r.ctx = { _: r }, r.root = t ? t.root : r, r.emit = Bo.bind(null, r), e.ce && e.ce(r), r;
}
let Te = null;
const ul = () => Te || Pe;
let Jn, Rn;
{
  const e = ns(), t = (n, s) => {
    let i;
    return (i = e[n]) || (i = e[n] = []), i.push(s), (r) => {
      i.length > 1 ? i.forEach((l) => l(r)) : i[0](r);
    };
  };
  Jn = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => Te = n
  ), Rn = t(
    "__VUE_SSR_SETTERS__",
    (n) => Mn = n
  );
}
const fi = (e) => {
  const t = Te;
  return Jn(e), e.scope.on(), () => {
    e.scope.off(), Jn(t);
  };
}, Ii = () => {
  Te && Te.scope.off(), Jn(null);
};
function cl(e) {
  return e.vnode.shapeFlag & 4;
}
let Mn = !1;
function fa(e, t = !1, n = !1) {
  t && Rn(t);
  const { props: s, children: i } = e.vnode, r = cl(e);
  zo(e, s, r, t), Yo(e, i, n || t);
  const l = r ? da(e, t) : void 0;
  return t && Rn(!1), l;
}
function da(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Lo);
  const { setup: s } = n;
  if (s) {
    ht();
    const i = e.setupContext = s.length > 1 ? pa(e) : null, r = fi(e), l = Pn(
      s,
      e,
      0,
      [
        e.props,
        i
      ]
    ), o = hr(l);
    if (pt(), r(), (o || e.sp) && !$t(e) && To(e), o) {
      if (l.then(Ii, Ii), t)
        return l.then((a) => {
          Rn(!0);
          try {
            Di(e, a, t);
          } finally {
            Rn(!1);
          }
        }).catch((a) => {
          rs(a, e, 0, void 0, !0), e.ssrRender = (f, c) => c("<!---->");
        });
      e.asyncDep = l;
    } else
      Di(e, l);
  } else
    fl(e);
}
function Di(e, t, n) {
  ne(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : ue(t) && (e.setupState = Lr(t)), fl(e);
}
function fl(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || Vt);
}
const dl = /* @__PURE__ */ Symbol(), ha = {
  get(e, t) {
    return we(e, "get", ""), t === dl ? e : e[t];
  }
};
function pa(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, ha),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function fs(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Lr(ao(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in vn)
        return vn[n](e);
    },
    has(t, n) {
      return n in t || n in vn;
    }
  })) : e.proxy;
}
function Us(e, t = !0) {
  return ne(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function ga(e) {
  return ne(e) && "__vccOpts" in e;
}
const ge = (e, t) => /* @__PURE__ */ po(e, t, Mn);
function hl(e, t, n) {
  try {
    Zn(-1);
    const s = arguments.length;
    return s === 2 ? ue(t) && !z(t) ? tn(t) ? K(e, null, [t]) : K(e, t) : K(e, null, t) : (s > 3 ? n = Array.prototype.slice.call(arguments, 2) : s === 3 && tn(n) && (n = [n]), K(e, t, n));
  } finally {
    Zn(1);
  }
}
const ma = "3.5.46";
/**
* @vue/runtime-dom v3.5.46
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let js;
const Vi = typeof window < "u" && window.trustedTypes;
if (Vi)
  try {
    js = /* @__PURE__ */ Vi.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const pl = js ? (e) => js.createHTML(e) : (e) => e, ya = "http://www.w3.org/2000/svg", ba = "http://www.w3.org/1998/Math/MathML", ot = typeof document < "u" ? document : null, Li = ot && /* @__PURE__ */ ot.createElement("template"), va = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const i = t === "svg" ? ot.createElementNS(ya, e) : t === "mathml" ? ot.createElementNS(ba, e) : n ? ot.createElement(e, { is: n }) : ot.createElement(e);
    return e === "select" && s && s.multiple != null && i.setAttribute("multiple", s.multiple), i;
  },
  createText: (e) => ot.createTextNode(e),
  createComment: (e) => ot.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => ot.querySelector(e),
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
      Li.innerHTML = pl(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const o = Li.content;
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
}, _a = /* @__PURE__ */ Symbol("_vtc");
function wa(e, t, n) {
  const s = e[_a];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const Yn = /* @__PURE__ */ Symbol("_vod"), gl = /* @__PURE__ */ Symbol("_vsh"), hn = {
  // used for prop mismatch check during hydration
  name: "show",
  beforeMount(e, { value: t }, { transition: n }) {
    e[Yn] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : un(e, t);
  },
  mounted(e, { value: t }, { transition: n }) {
    n && t && n.enter(e);
  },
  updated(e, { value: t, oldValue: n }, { transition: s }) {
    !t != !n && (s ? t ? (s.beforeEnter(e), un(e, !0), s.enter(e)) : s.leave(e, () => {
      un(e, !1);
    }) : un(e, t));
  },
  beforeUnmount(e, { value: t }) {
    un(e, t);
  }
};
function un(e, t) {
  e.style.display = t ? e[Yn] : "none", e[gl] = !t;
}
const Ea = /* @__PURE__ */ Symbol(""), Sa = /(?:^|;)\s*display\s*:/;
function Aa(e, t, n) {
  const s = e.style, i = de(n);
  let r = !1;
  if (n && !i) {
    if (t)
      if (de(t))
        for (const l of t.split(";")) {
          const o = l.slice(0, l.indexOf(":")).trim();
          n[o] == null && pn(s, o, "");
        }
      else
        for (const l in t)
          n[l] == null && pn(s, l, "");
    for (const l in n) {
      l === "display" && (r = !0);
      const o = n[l];
      o != null ? Ca(
        e,
        l,
        !de(t) && t ? t[l] : void 0,
        o
      ) || pn(s, l, o) : pn(s, l, "");
    }
  } else if (i) {
    if (t !== n) {
      const l = s[Ea];
      l && (n += ";" + l), s.cssText = n, r = Sa.test(n);
    }
  } else t && e.removeAttribute("style");
  Yn in e && ((!i || t !== n) && (e[Yn] = r ? s.display : ""), e[gl] && (s.display = "none"));
}
const Fn = /\s*!important$/;
function pn(e, t, n) {
  if (z(n))
    n.forEach((s) => pn(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    Fn.test(n) ? e.setProperty(t, n.replace(Fn, ""), "important") : e.setProperty(t, n);
  else {
    const s = xa(e, t);
    Fn.test(n) ? e.setProperty(
      jt(s),
      n.replace(Fn, ""),
      "important"
    ) : e[s] = n;
  }
}
const $i = ["Webkit", "Moz", "ms"], xs = {};
function xa(e, t) {
  const n = xs[t];
  if (n)
    return n;
  let s = Ce(t);
  if (s !== "filter" && s in e)
    return xs[t] = s;
  s = ts(s);
  for (let i = 0; i < $i.length; i++) {
    const r = $i[i] + s;
    if (r in e)
      return xs[t] = r;
  }
  return t;
}
function Ca(e, t, n, s) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && de(s) && n === s;
}
const Fi = "http://www.w3.org/1999/xlink";
function Hi(e, t, n, s, i, r = Bl(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Fi, t.slice(6, t.length)) : e.setAttributeNS(Fi, t, n) : n == null || r && !yr(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    r ? "" : et(n) ? String(n) : n
  );
}
function Bi(e, t, n, s, i) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? pl(n) : n);
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
    o === "boolean" ? n = yr(n) : n == null && o === "string" ? (n = "", l = !0) : o === "number" && (n = 0, l = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  l && e.removeAttribute(i || t);
}
function wt(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function Ra(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const Ui = /* @__PURE__ */ Symbol("_vei");
function Ma(e, t, n, s, i = null) {
  const r = e[Ui] || (e[Ui] = {}), l = r[t];
  if (s && l)
    l.value = s;
  else {
    const [o, a] = Oa(t);
    if (s) {
      const f = r[t] = Ia(
        s,
        i
      );
      wt(e, o, f, a);
    } else l && (Ra(e, o, l, a), r[t] = void 0);
  }
}
const Ta = /(Once|Passive|Capture)$/, ka = /^on:?(?:Once|Passive|Capture)$/;
function Oa(e) {
  let t, n;
  for (; (n = e.match(Ta)) && !ka.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : jt(e.slice(2)), t];
}
let Cs = 0;
const Pa = /* @__PURE__ */ Promise.resolve(), Na = () => Cs || (Pa.then(() => Cs = 0), Cs = Date.now());
function Ia(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    const i = n.value;
    if (z(i)) {
      const r = s.stopImmediatePropagation;
      s.stopImmediatePropagation = () => {
        r.call(s), s._stopped = !0;
      };
      const l = i.slice(), o = [s];
      for (let a = 0; a < l.length && !s._stopped; a++) {
        const f = l[a];
        f && nt(
          f,
          t,
          5,
          o
        );
      }
    } else
      nt(
        i,
        t,
        5,
        [s]
      );
  };
  return n.value = e, n.attached = Na(), n;
}
const ji = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Da = (e, t, n, s, i, r) => {
  const l = i === "svg";
  t === "class" ? wa(e, s, l) : t === "style" ? Aa(e, n, s) : Qn(t) ? Xn(t) || Ma(e, t, n, s, r) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Va(e, t, s, l)) ? (Bi(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Hi(e, t, s, l, r, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (La(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !de(s))) ? Bi(e, Ce(t), s, r, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), Hi(e, t, s, l));
};
function Va(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && ji(t) && ne(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return ji(t) && de(n) ? !1 : t in e;
}
function La(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const s = Ce(t);
  return Array.isArray(n) ? n.some((i) => Ce(i) === s) : Object.keys(n).some((i) => Ce(i) === s);
}
const nn = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return z(t) ? (n) => Yt(t, n) : t;
};
function $a(e) {
  e.target.composing = !0;
}
function Ki(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const Xe = /* @__PURE__ */ Symbol("_assign"), Hn = /* @__PURE__ */ Symbol("_initialValue");
function Rs(e, t, n) {
  return t && (e = e.trim()), n && (e = On(e)), e;
}
const zt = {
  created(e, { modifiers: { lazy: t, trim: n, number: s } }, i) {
    e.parentNode && (e.type === "text" ? e[Hn] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Hn] = e.defaultValue.replace(/\r\n?/g, `
`))), e[Xe] = nn(i);
    const r = s || i.props && i.props.type === "number";
    wt(e, t ? "change" : "input", (l) => {
      l.target.composing || e[Xe](Rs(e.value, n, r));
    }), (n || r) && wt(e, "change", () => {
      e.value = Rs(e.value, n, r);
    }), t || (wt(e, "compositionstart", $a), wt(e, "compositionend", Ki), wt(e, "change", Ki));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t, modifiers: { trim: n, number: s } }) {
    const i = t ?? "", r = e[Hn];
    delete e[Hn], r !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== r ? e[Xe](Rs(e.value, n, s)) : e.value = i;
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: s, trim: i, number: r } }, l) {
    if (e[Xe] = nn(l), e.composing) return;
    const o = (r || e.type === "number") && !/^0\d/.test(e.value) ? On(e.value) : e.value, a = t ?? "";
    if (o === a)
      return;
    const f = e.getRootNode();
    (f instanceof Document || f instanceof ShadowRoot) && f.activeElement === e && e.type !== "range" && (s && t === n || i && e.value.trim() === a) || (e.value = a);
  }
}, Gi = {
  // #4096 array checkboxes need to be deep traversed
  deep: !0,
  created(e, t, n) {
    e[Xe] = nn(n), wt(e, "change", () => {
      const s = e._modelValue, i = Tn(e), r = e.checked, l = e[Xe];
      if (z(s)) {
        const o = Js(s, i), a = o !== -1;
        if (r && !a)
          l(s.concat(i));
        else if (!r && a) {
          const f = [...s];
          f.splice(o, 1), l(f);
        }
      } else if (ft(s)) {
        const o = new Set(s);
        r ? o.add(i) : o.delete(i), l(o);
      } else
        l(ml(e, r));
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: Wi,
  beforeUpdate(e, t, n) {
    e[Xe] = nn(n), Wi(e, t, n);
  }
};
function Wi(e, { value: t, oldValue: n }, s) {
  e._modelValue = t;
  let i;
  if (z(t))
    i = Js(t, s.props.value) > -1;
  else if (ft(t))
    i = t.has(s.props.value);
  else {
    if (t === n) return;
    i = dt(t, ml(e, !0));
  }
  e.checked !== i && (e.checked = i);
}
const Fa = {
  // <select multiple> value need to be deep traversed
  deep: !0,
  created(e, { value: t, modifiers: { number: n } }, s) {
    e._modelValue = t, wt(e, "change", () => {
      const i = Array.prototype.filter.call(e.options, (a) => a.selected).map(
        (a) => n ? On(Tn(a)) : Tn(a)
      ), r = e.multiple, l = r ? ft(e._modelValue) ? new Set(i) : i : i[0], o = e._pendingValue = [
        r,
        r ? z(l) ? i.slice() : i : l
      ];
      try {
        e[Xe](l);
      } finally {
        ls(() => {
          e._pendingValue === o && (e._pendingValue = void 0);
        });
      }
    }), e[Xe] = nn(s);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(e, { value: t, modifiers: { number: n } }) {
    zi(e, t, n);
  },
  beforeUpdate(e, { value: t }, n) {
    e._modelValue = t, e[Xe] = nn(n);
  },
  updated(e, { value: t, modifiers: { number: n } }) {
    const s = e._pendingValue;
    e._pendingValue = void 0, (!s || s[0] !== e.multiple || !Ha(t, s[1], s[0])) && zi(e, t, n);
  }
};
function Ha(e, t, n) {
  if (!n || z(e)) return dt(e, t);
  if (ft(e)) {
    if (e.size !== t.length) return !1;
    for (const s of t)
      if (!e.has(s)) return !1;
    return !0;
  }
  return !1;
}
function zi(e, t, n = !1) {
  const s = e.multiple, i = z(t);
  if (!(s && !i && !ft(t))) {
    for (let r = 0, l = e.options.length; r < l; r++) {
      const o = e.options[r], a = Tn(o);
      if (s)
        if (i) {
          const f = typeof a;
          f === "string" || f === "number" ? o.selected = t.some((c) => String(c) === String(a)) : o.selected = Js(t, a) > -1;
        } else
          o.selected = t.has(a) || n && typeof a == "string" && t.has(On(a));
      else if (dt(Tn(o), t)) {
        e.selectedIndex !== r && (e.selectedIndex = r);
        return;
      }
    }
    !s && e.selectedIndex !== -1 && (e.selectedIndex = -1);
  }
}
function Tn(e) {
  return "_value" in e ? e._value : e.value;
}
function ml(e, t) {
  const n = t ? "_trueValue" : "_falseValue";
  return n in e ? e[n] : t;
}
const Ba = ["ctrl", "shift", "alt", "meta"], Ua = {
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
  exact: (e, t) => Ba.some((n) => e[`${n}Key`] && !t.includes(n))
}, yl = (e, t) => {
  if (!e) return e;
  const n = e._withMods || (e._withMods = {}), s = t.join(".");
  return n[s] || (n[s] = ((i, ...r) => {
    for (let l = 0; l < t.length; l++) {
      const o = Ua[t[l]];
      if (o && o(i, t)) return;
    }
    return e(i, ...r);
  }));
}, ja = /* @__PURE__ */ Ie({ patchProp: Da }, va);
let Zi;
function Ka() {
  return Zi || (Zi = Xo(ja));
}
const Ga = ((...e) => {
  const t = Ka().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const i = za(s);
    if (!i) return;
    const r = t._component;
    !ne(r) && !r.render && !r.template && (r.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
    const l = n(i, !1, Wa(i));
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), l;
  }, t;
});
function Wa(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function za(e) {
  return de(e) ? document.querySelector(e) : e;
}
/*!
 * vue-router v4.6.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
const Jt = typeof document < "u";
function bl(e) {
  return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function Za(e) {
  return e.__esModule || e[Symbol.toStringTag] === "Module" || e.default && bl(e.default);
}
const oe = Object.assign;
function Ms(e, t) {
  const n = {};
  for (const s in t) {
    const i = t[s];
    n[s] = We(i) ? i.map(e) : e(i);
  }
  return n;
}
const wn = () => {
}, We = Array.isArray;
function qi(e, t) {
  const n = {};
  for (const s in e) n[s] = s in t ? t[s] : e[s];
  return n;
}
const vl = /#/g, qa = /&/g, Ja = /\//g, Ya = /=/g, Qa = /\?/g, _l = /\+/g, Xa = /%5B/g, eu = /%5D/g, wl = /%5E/g, tu = /%60/g, El = /%7B/g, nu = /%7C/g, Sl = /%7D/g, su = /%20/g;
function di(e) {
  return e == null ? "" : encodeURI("" + e).replace(nu, "|").replace(Xa, "[").replace(eu, "]");
}
function iu(e) {
  return di(e).replace(El, "{").replace(Sl, "}").replace(wl, "^");
}
function Ks(e) {
  return di(e).replace(_l, "%2B").replace(su, "+").replace(vl, "%23").replace(qa, "%26").replace(tu, "`").replace(El, "{").replace(Sl, "}").replace(wl, "^");
}
function ru(e) {
  return Ks(e).replace(Ya, "%3D");
}
function lu(e) {
  return di(e).replace(vl, "%23").replace(Qa, "%3F");
}
function ou(e) {
  return lu(e).replace(Ja, "%2F");
}
function kn(e) {
  if (e == null) return null;
  try {
    return decodeURIComponent("" + e);
  } catch {
  }
  return "" + e;
}
const au = /\/$/, uu = (e) => e.replace(au, "");
function Ts(e, t, n = "/") {
  let s, i = {}, r = "", l = "";
  const o = t.indexOf("#");
  let a = t.indexOf("?");
  return a = o >= 0 && a > o ? -1 : a, a >= 0 && (s = t.slice(0, a), r = t.slice(a, o > 0 ? o : t.length), i = e(r.slice(1))), o >= 0 && (s = s || t.slice(0, o), l = t.slice(o, t.length)), s = hu(s ?? t, n), {
    fullPath: s + r + l,
    path: s,
    query: i,
    hash: kn(l)
  };
}
function cu(e, t) {
  const n = t.query ? e(t.query) : "";
  return t.path + (n && "?") + n + (t.hash || "");
}
function fu(e, t, n) {
  const s = t.matched.length - 1, i = n.matched.length - 1;
  return s > -1 && s === i && sn(t.matched[s], n.matched[i]) && Al(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function sn(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t);
}
function Al(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length) return !1;
  for (var n in e) if (!du(e[n], t[n])) return !1;
  return !0;
}
function du(e, t) {
  return We(e) ? Ji(e, t) : We(t) ? Ji(t, e) : e?.valueOf() === t?.valueOf();
}
function Ji(e, t) {
  return We(t) ? e.length === t.length && e.every((n, s) => n === t[s]) : e.length === 1 && e[0] === t;
}
function hu(e, t) {
  if (e.startsWith("/")) return e;
  if (!e) return t;
  const n = t.split("/"), s = e.split("/"), i = s[s.length - 1];
  (i === ".." || i === ".") && s.push("");
  let r = n.length - 1, l, o;
  for (l = 0; l < s.length; l++)
    if (o = s[l], o !== ".")
      if (o === "..")
        r > 1 && r--;
      else break;
  return n.slice(0, r).join("/") + "/" + s.slice(l).join("/");
}
const yt = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
let Gs = /* @__PURE__ */ (function(e) {
  return e.pop = "pop", e.push = "push", e;
})({}), Yi = /* @__PURE__ */ (function(e) {
  return e.back = "back", e.forward = "forward", e.unknown = "", e;
})({});
const ks = "";
function pu(e) {
  if (!e) if (Jt) {
    const t = document.querySelector("base");
    e = t && t.getAttribute("href") || "/", e = e.replace(/^\w+:\/\/[^\/]+/, "");
  } else e = "/";
  return e[0] !== "/" && e[0] !== "#" && (e = "/" + e), uu(e);
}
const gu = /^[^#]+#/;
function mu(e, t) {
  return e.replace(gu, "#") + t;
}
function yu(e, t) {
  const n = document.documentElement.getBoundingClientRect(), s = e.getBoundingClientRect();
  return {
    behavior: t.behavior,
    left: s.left - n.left - (t.left || 0),
    top: s.top - n.top - (t.top || 0)
  };
}
const bu = () => ({
  left: window.scrollX,
  top: window.scrollY
});
function vu(e) {
  let t;
  if ("el" in e) {
    const n = e.el, s = typeof n == "string" && n.startsWith("#"), i = typeof n == "string" ? s ? document.getElementById(n.slice(1)) : document.querySelector(n) : n;
    if (!i)
      return;
    t = yu(i, e);
  } else t = e;
  "scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left != null ? t.left : window.scrollX, t.top != null ? t.top : window.scrollY);
}
function Qi(e, t) {
  return (history.state ? history.state.position - t : -1) + e;
}
const Ws = /* @__PURE__ */ new Map();
function _u(e, t) {
  Ws.set(e, t);
}
function wu(e) {
  const t = Ws.get(e);
  return Ws.delete(e), t;
}
function Eu(e) {
  return typeof e == "string" || e && typeof e == "object";
}
function xl(e) {
  return typeof e == "string" || typeof e == "symbol";
}
let pe = /* @__PURE__ */ (function(e) {
  return e[e.MATCHER_NOT_FOUND = 1] = "MATCHER_NOT_FOUND", e[e.NAVIGATION_GUARD_REDIRECT = 2] = "NAVIGATION_GUARD_REDIRECT", e[e.NAVIGATION_ABORTED = 4] = "NAVIGATION_ABORTED", e[e.NAVIGATION_CANCELLED = 8] = "NAVIGATION_CANCELLED", e[e.NAVIGATION_DUPLICATED = 16] = "NAVIGATION_DUPLICATED", e;
})({});
const Cl = Symbol("");
pe.MATCHER_NOT_FOUND + "", pe.NAVIGATION_GUARD_REDIRECT + "", pe.NAVIGATION_ABORTED + "", pe.NAVIGATION_CANCELLED + "", pe.NAVIGATION_DUPLICATED + "";
function rn(e, t) {
  return oe(/* @__PURE__ */ new Error(), {
    type: e,
    [Cl]: !0
  }, t);
}
function lt(e, t) {
  return e instanceof Error && Cl in e && (t == null || !!(e.type & t));
}
const Su = [
  "params",
  "query",
  "hash"
];
function Au(e) {
  if (typeof e == "string") return e;
  if (e.path != null) return e.path;
  const t = {};
  for (const n of Su) n in e && (t[n] = e[n]);
  return JSON.stringify(t, null, 2);
}
function xu(e) {
  const t = {};
  if (e === "" || e === "?") return t;
  const n = (e[0] === "?" ? e.slice(1) : e).split("&");
  for (let s = 0; s < n.length; ++s) {
    const i = n[s].replace(_l, " "), r = i.indexOf("="), l = kn(r < 0 ? i : i.slice(0, r)), o = r < 0 ? null : kn(i.slice(r + 1));
    if (l in t) {
      let a = t[l];
      We(a) || (a = t[l] = [a]), a.push(o);
    } else t[l] = o;
  }
  return t;
}
function Xi(e) {
  let t = "";
  for (let n in e) {
    const s = e[n];
    if (n = ru(n), s == null) {
      s !== void 0 && (t += (t.length ? "&" : "") + n);
      continue;
    }
    (We(s) ? s.map((i) => i && Ks(i)) : [s && Ks(s)]).forEach((i) => {
      i !== void 0 && (t += (t.length ? "&" : "") + n, i != null && (t += "=" + i));
    });
  }
  return t;
}
function Cu(e) {
  const t = {};
  for (const n in e) {
    const s = e[n];
    s !== void 0 && (t[n] = We(s) ? s.map((i) => i == null ? null : "" + i) : s == null ? s : "" + s);
  }
  return t;
}
const Ru = Symbol(""), er = Symbol(""), hi = Symbol(""), pi = Symbol(""), zs = Symbol("");
function cn() {
  let e = [];
  function t(s) {
    return e.push(s), () => {
      const i = e.indexOf(s);
      i > -1 && e.splice(i, 1);
    };
  }
  function n() {
    e = [];
  }
  return {
    add: t,
    list: () => e.slice(),
    reset: n
  };
}
function _t(e, t, n, s, i, r = (l) => l()) {
  const l = s && (s.enterCallbacks[i] = s.enterCallbacks[i] || []);
  return () => new Promise((o, a) => {
    const f = (m) => {
      m === !1 ? a(rn(pe.NAVIGATION_ABORTED, {
        from: n,
        to: t
      })) : m instanceof Error ? a(m) : Eu(m) ? a(rn(pe.NAVIGATION_GUARD_REDIRECT, {
        from: t,
        to: m
      })) : (l && s.enterCallbacks[i] === l && typeof m == "function" && l.push(m), o());
    }, c = r(() => e.call(s && s.instances[i], t, n, f));
    let p = Promise.resolve(c);
    e.length < 3 && (p = p.then(f)), p.catch((m) => a(m));
  });
}
function Os(e, t, n, s, i = (r) => r()) {
  const r = [];
  for (const l of e)
    for (const o in l.components) {
      let a = l.components[o];
      if (!(t !== "beforeRouteEnter" && !l.instances[o]))
        if (bl(a)) {
          const f = (a.__vccOpts || a)[t];
          f && r.push(_t(f, n, s, l, o, i));
        } else {
          let f = a();
          r.push(() => f.then((c) => {
            if (!c) throw new Error(`Couldn't resolve component "${o}" at "${l.path}"`);
            const p = Za(c) ? c.default : c;
            l.mods[o] = c, l.components[o] = p;
            const m = (p.__vccOpts || p)[t];
            return m && _t(m, n, s, l, o, i)();
          }));
        }
    }
  return r;
}
function Mu(e, t) {
  const n = [], s = [], i = [], r = Math.max(t.matched.length, e.matched.length);
  for (let l = 0; l < r; l++) {
    const o = t.matched[l];
    o && (e.matched.find((f) => sn(f, o)) ? s.push(o) : n.push(o));
    const a = e.matched[l];
    a && (t.matched.find((f) => sn(f, a)) || i.push(a));
  }
  return [
    n,
    s,
    i
  ];
}
/*!
 * vue-router v4.6.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
function Tu(e = "") {
  let t = [], n = [[ks, {}]], s = 0;
  e = pu(e);
  function i(o, a = {}) {
    s++, s !== n.length && n.splice(s), n.push([o, a]);
  }
  function r(o, a, { direction: f, delta: c }) {
    const p = {
      direction: f,
      delta: c,
      type: Gs.pop
    };
    for (const m of t) m(o, a, p);
  }
  const l = {
    location: ks,
    state: {},
    base: e,
    createHref: mu.bind(null, e),
    replace(o, a) {
      n.splice(s--, 1), i(o, a);
    },
    push(o, a) {
      i(o, a);
    },
    listen(o) {
      return t.push(o), () => {
        const a = t.indexOf(o);
        a > -1 && t.splice(a, 1);
      };
    },
    destroy() {
      t = [], n = [[ks, {}]], s = 0;
    },
    go(o, a = !0) {
      const f = this.location, c = o < 0 ? Yi.back : Yi.forward;
      s = Math.max(0, Math.min(s + o, n.length - 1)), a && r(this.location, f, {
        direction: c,
        delta: o
      });
    }
  };
  return Object.defineProperty(l, "location", {
    enumerable: !0,
    get: () => n[s][0]
  }), Object.defineProperty(l, "state", {
    enumerable: !0,
    get: () => n[s][1]
  }), l;
}
let Dt = /* @__PURE__ */ (function(e) {
  return e[e.Static = 0] = "Static", e[e.Param = 1] = "Param", e[e.Group = 2] = "Group", e;
})({});
var be = /* @__PURE__ */ (function(e) {
  return e[e.Static = 0] = "Static", e[e.Param = 1] = "Param", e[e.ParamRegExp = 2] = "ParamRegExp", e[e.ParamRegExpEnd = 3] = "ParamRegExpEnd", e[e.EscapeNext = 4] = "EscapeNext", e;
})(be || {});
const ku = {
  type: Dt.Static,
  value: ""
}, Ou = /[a-zA-Z0-9_]/;
function Pu(e) {
  if (!e) return [[]];
  if (e === "/") return [[ku]];
  if (!e.startsWith("/")) throw new Error(`Invalid path "${e}"`);
  function t(h) {
    throw new Error(`ERR (${n})/"${f}": ${h}`);
  }
  let n = be.Static, s = n;
  const i = [];
  let r;
  function l() {
    r && i.push(r), r = [];
  }
  let o = 0, a, f = "", c = "";
  function p() {
    f && (n === be.Static ? r.push({
      type: Dt.Static,
      value: f
    }) : n === be.Param || n === be.ParamRegExp || n === be.ParamRegExpEnd ? (r.length > 1 && (a === "*" || a === "+") && t(`A repeatable param (${f}) must be alone in its segment. eg: '/:ids+.`), r.push({
      type: Dt.Param,
      value: f,
      regexp: c,
      repeatable: a === "*" || a === "+",
      optional: a === "*" || a === "?"
    })) : t("Invalid state to consume buffer"), f = "");
  }
  function m() {
    f += a;
  }
  for (; o < e.length; ) {
    if (a = e[o++], a === "\\" && n !== be.ParamRegExp) {
      s = n, n = be.EscapeNext;
      continue;
    }
    switch (n) {
      case be.Static:
        a === "/" ? (f && p(), l()) : a === ":" ? (p(), n = be.Param) : m();
        break;
      case be.EscapeNext:
        m(), n = s;
        break;
      case be.Param:
        a === "(" ? n = be.ParamRegExp : Ou.test(a) ? m() : (p(), n = be.Static, a !== "*" && a !== "?" && a !== "+" && o--);
        break;
      case be.ParamRegExp:
        a === ")" ? c[c.length - 1] == "\\" ? c = c.slice(0, -1) + a : n = be.ParamRegExpEnd : c += a;
        break;
      case be.ParamRegExpEnd:
        p(), n = be.Static, a !== "*" && a !== "?" && a !== "+" && o--, c = "";
        break;
      default:
        t("Unknown state");
        break;
    }
  }
  return n === be.ParamRegExp && t(`Unfinished custom RegExp for param "${f}"`), p(), l(), i;
}
const tr = "[^/]+?", Nu = {
  sensitive: !1,
  strict: !1,
  start: !0,
  end: !0
};
var Ae = /* @__PURE__ */ (function(e) {
  return e[e._multiplier = 10] = "_multiplier", e[e.Root = 90] = "Root", e[e.Segment = 40] = "Segment", e[e.SubSegment = 30] = "SubSegment", e[e.Static = 40] = "Static", e[e.Dynamic = 20] = "Dynamic", e[e.BonusCustomRegExp = 10] = "BonusCustomRegExp", e[e.BonusWildcard = -50] = "BonusWildcard", e[e.BonusRepeatable = -20] = "BonusRepeatable", e[e.BonusOptional = -8] = "BonusOptional", e[e.BonusStrict = 0.7000000000000001] = "BonusStrict", e[e.BonusCaseSensitive = 0.25] = "BonusCaseSensitive", e;
})(Ae || {});
const Iu = /[.+*?^${}()[\]/\\]/g;
function Du(e, t) {
  const n = oe({}, Nu, t), s = [];
  let i = n.start ? "^" : "";
  const r = [];
  for (const f of e) {
    const c = f.length ? [] : [Ae.Root];
    n.strict && !f.length && (i += "/");
    for (let p = 0; p < f.length; p++) {
      const m = f[p];
      let h = Ae.Segment + (n.sensitive ? Ae.BonusCaseSensitive : 0);
      if (m.type === Dt.Static)
        p || (i += "/"), i += m.value.replace(Iu, "\\$&"), h += Ae.Static;
      else if (m.type === Dt.Param) {
        const { value: E, repeatable: x, optional: k, regexp: N } = m;
        r.push({
          name: E,
          repeatable: x,
          optional: k
        });
        const v = N || tr;
        if (v !== tr) {
          h += Ae.BonusCustomRegExp;
          try {
            `${v}`;
          } catch (R) {
            throw new Error(`Invalid custom RegExp for param "${E}" (${v}): ` + R.message);
          }
        }
        let M = x ? `((?:${v})(?:/(?:${v}))*)` : `(${v})`;
        p || (M = k && f.length < 2 ? `(?:/${M})` : "/" + M), k && (M += "?"), i += M, h += Ae.Dynamic, k && (h += Ae.BonusOptional), x && (h += Ae.BonusRepeatable), v === ".*" && (h += Ae.BonusWildcard);
      }
      c.push(h);
    }
    s.push(c);
  }
  if (n.strict && n.end) {
    const f = s.length - 1;
    s[f][s[f].length - 1] += Ae.BonusStrict;
  }
  n.strict || (i += "/?"), n.end ? i += "$" : n.strict && !i.endsWith("/") && (i += "(?:/|$)");
  const l = new RegExp(i, n.sensitive ? "" : "i");
  function o(f) {
    const c = f.match(l), p = {};
    if (!c) return null;
    for (let m = 1; m < c.length; m++) {
      const h = c[m] || "", E = r[m - 1];
      p[E.name] = h && E.repeatable ? h.split("/") : h;
    }
    return p;
  }
  function a(f) {
    let c = "", p = !1;
    for (const m of e) {
      (!p || !c.endsWith("/")) && (c += "/"), p = !1;
      for (const h of m) if (h.type === Dt.Static) c += h.value;
      else if (h.type === Dt.Param) {
        const { value: E, repeatable: x, optional: k } = h, N = E in f ? f[E] : "";
        if (We(N) && !x) throw new Error(`Provided param "${E}" is an array but it is not repeatable (* or + modifiers)`);
        const v = We(N) ? N.join("/") : N;
        if (!v) if (k)
          m.length < 2 && (c.endsWith("/") ? c = c.slice(0, -1) : p = !0);
        else throw new Error(`Missing required param "${E}"`);
        c += v;
      }
    }
    return c || "/";
  }
  return {
    re: l,
    score: s,
    keys: r,
    parse: o,
    stringify: a
  };
}
function Vu(e, t) {
  let n = 0;
  for (; n < e.length && n < t.length; ) {
    const s = t[n] - e[n];
    if (s) return s;
    n++;
  }
  return e.length < t.length ? e.length === 1 && e[0] === Ae.Static + Ae.Segment ? -1 : 1 : e.length > t.length ? t.length === 1 && t[0] === Ae.Static + Ae.Segment ? 1 : -1 : 0;
}
function Rl(e, t) {
  let n = 0;
  const s = e.score, i = t.score;
  for (; n < s.length && n < i.length; ) {
    const r = Vu(s[n], i[n]);
    if (r) return r;
    n++;
  }
  if (Math.abs(i.length - s.length) === 1) {
    if (nr(s)) return 1;
    if (nr(i)) return -1;
  }
  return i.length - s.length;
}
function nr(e) {
  const t = e[e.length - 1];
  return e.length > 0 && t[t.length - 1] < 0;
}
const Lu = {
  strict: !1,
  end: !0,
  sensitive: !1
};
function $u(e, t, n) {
  const s = Du(Pu(e.path), n), i = oe(s, {
    record: e,
    parent: t,
    children: [],
    alias: []
  });
  return t && !i.record.aliasOf == !t.record.aliasOf && t.children.push(i), i;
}
function Fu(e, t) {
  const n = [], s = /* @__PURE__ */ new Map();
  t = qi(Lu, t);
  function i(p) {
    return s.get(p);
  }
  function r(p, m, h) {
    const E = !h, x = ir(p);
    x.aliasOf = h && h.record;
    const k = qi(t, p), N = [x];
    if ("alias" in p) {
      const R = typeof p.alias == "string" ? [p.alias] : p.alias;
      for (const W of R) N.push(ir(oe({}, x, {
        components: h ? h.record.components : x.components,
        path: W,
        aliasOf: h ? h.record : x
      })));
    }
    let v, M;
    for (const R of N) {
      const { path: W } = R;
      if (m && W[0] !== "/") {
        const Z = m.record.path, b = Z[Z.length - 1] === "/" ? "" : "/";
        R.path = m.record.path + (W && b + W);
      }
      if (v = $u(R, m, k), h ? h.alias.push(v) : (M = M || v, M !== v && M.alias.push(v), E && p.name && !rr(v) && l(p.name)), Ml(v) && a(v), x.children) {
        const Z = x.children;
        for (let b = 0; b < Z.length; b++) r(Z[b], v, h && h.children[b]);
      }
      h = h || v;
    }
    return M ? () => {
      l(M);
    } : wn;
  }
  function l(p) {
    if (xl(p)) {
      const m = s.get(p);
      m && (s.delete(p), n.splice(n.indexOf(m), 1), m.children.forEach(l), m.alias.forEach(l));
    } else {
      const m = n.indexOf(p);
      m > -1 && (n.splice(m, 1), p.record.name && s.delete(p.record.name), p.children.forEach(l), p.alias.forEach(l));
    }
  }
  function o() {
    return n;
  }
  function a(p) {
    const m = Uu(p, n);
    n.splice(m, 0, p), p.record.name && !rr(p) && s.set(p.record.name, p);
  }
  function f(p, m) {
    let h, E = {}, x, k;
    if ("name" in p && p.name) {
      if (h = s.get(p.name), !h) throw rn(pe.MATCHER_NOT_FOUND, { location: p });
      k = h.record.name, E = oe(sr(m.params, h.keys.filter((M) => !M.optional).concat(h.parent ? h.parent.keys.filter((M) => M.optional) : []).map((M) => M.name)), p.params && sr(p.params, h.keys.map((M) => M.name))), x = h.stringify(E);
    } else if (p.path != null)
      x = p.path, h = n.find((M) => M.re.test(x)), h && (E = h.parse(x), k = h.record.name);
    else {
      if (h = m.name ? s.get(m.name) : n.find((M) => M.re.test(m.path)), !h) throw rn(pe.MATCHER_NOT_FOUND, {
        location: p,
        currentLocation: m
      });
      k = h.record.name, E = oe({}, m.params, p.params), x = h.stringify(E);
    }
    const N = [];
    let v = h;
    for (; v; )
      N.unshift(v.record), v = v.parent;
    return {
      name: k,
      path: x,
      params: E,
      matched: N,
      meta: Bu(N)
    };
  }
  e.forEach((p) => r(p));
  function c() {
    n.length = 0, s.clear();
  }
  return {
    addRoute: r,
    resolve: f,
    removeRoute: l,
    clearRoutes: c,
    getRoutes: o,
    getRecordMatcher: i
  };
}
function sr(e, t) {
  const n = {};
  for (const s of t) s in e && (n[s] = e[s]);
  return n;
}
function ir(e) {
  const t = {
    path: e.path,
    redirect: e.redirect,
    name: e.name,
    meta: e.meta || {},
    aliasOf: e.aliasOf,
    beforeEnter: e.beforeEnter,
    props: Hu(e),
    children: e.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in e ? e.components || null : e.component && { default: e.component }
  };
  return Object.defineProperty(t, "mods", { value: {} }), t;
}
function Hu(e) {
  const t = {}, n = e.props || !1;
  if ("component" in e) t.default = n;
  else for (const s in e.components) t[s] = typeof n == "object" ? n[s] : n;
  return t;
}
function rr(e) {
  for (; e; ) {
    if (e.record.aliasOf) return !0;
    e = e.parent;
  }
  return !1;
}
function Bu(e) {
  return e.reduce((t, n) => oe(t, n.meta), {});
}
function Uu(e, t) {
  let n = 0, s = t.length;
  for (; n !== s; ) {
    const r = n + s >> 1;
    Rl(e, t[r]) < 0 ? s = r : n = r + 1;
  }
  const i = ju(e);
  return i && (s = t.lastIndexOf(i, s - 1)), s;
}
function ju(e) {
  let t = e;
  for (; t = t.parent; ) if (Ml(t) && Rl(e, t) === 0) return t;
}
function Ml({ record: e }) {
  return !!(e.name || e.components && Object.keys(e.components).length || e.redirect);
}
function lr(e) {
  const t = Ht(hi), n = Ht(pi), s = ge(() => {
    const a = Se(e.to);
    return t.resolve(a);
  }), i = ge(() => {
    const { matched: a } = s.value, { length: f } = a, c = a[f - 1], p = n.matched;
    if (!c || !p.length) return -1;
    const m = p.findIndex(sn.bind(null, c));
    if (m > -1) return m;
    const h = or(a[f - 2]);
    return f > 1 && or(c) === h && p[p.length - 1].path !== h ? p.findIndex(sn.bind(null, a[f - 2])) : m;
  }), r = ge(() => i.value > -1 && zu(n.params, s.value.params)), l = ge(() => i.value > -1 && i.value === n.matched.length - 1 && Al(n.params, s.value.params));
  function o(a = {}) {
    if (Wu(a)) {
      const f = t[Se(e.replace) ? "replace" : "push"](Se(e.to)).catch(wn);
      return e.viewTransition && typeof document < "u" && "startViewTransition" in document && document.startViewTransition(() => f), f;
    }
    return Promise.resolve();
  }
  return {
    route: s,
    href: ge(() => s.value.href),
    isActive: r,
    isExactActive: l,
    navigate: o
  };
}
function Ku(e) {
  return e.length === 1 ? e[0] : e;
}
const Gu = /* @__PURE__ */ Be({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object],
      required: !0
    },
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    },
    viewTransition: Boolean
  },
  useLink: lr,
  setup(e, { slots: t }) {
    const n = /* @__PURE__ */ is(lr(e)), { options: s } = Ht(hi), i = ge(() => ({
      [ar(e.activeClass, s.linkActiveClass, "router-link-active")]: n.isActive,
      [ar(e.exactActiveClass, s.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive
    }));
    return () => {
      const r = t.default && Ku(t.default(n));
      return e.custom ? r : hl("a", {
        "aria-current": n.isExactActive ? e.ariaCurrentValue : null,
        href: n.href,
        onClick: n.navigate,
        class: i.value
      }, r);
    };
  }
}), ds = Gu;
function Wu(e) {
  if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && !(e.button !== void 0 && e.button !== 0)) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(t)) return;
    }
    return e.preventDefault && e.preventDefault(), !0;
  }
}
function zu(e, t) {
  for (const n in t) {
    const s = t[n], i = e[n];
    if (typeof s == "string") {
      if (s !== i) return !1;
    } else if (!We(i) || i.length !== s.length || s.some((r, l) => r.valueOf() !== i[l].valueOf())) return !1;
  }
  return !0;
}
function or(e) {
  return e ? e.aliasOf ? e.aliasOf.path : e.path : "";
}
const ar = (e, t, n) => e ?? t ?? n, Zu = /* @__PURE__ */ Be({
  name: "RouterView",
  inheritAttrs: !1,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t, slots: n }) {
    const s = Ht(zs), i = ge(() => e.route || s.value), r = Ht(er, 0), l = ge(() => {
      let f = Se(r);
      const { matched: c } = i.value;
      let p;
      for (; (p = c[f]) && !p.components; ) f++;
      return f;
    }), o = ge(() => i.value.matched[l.value]);
    _s(er, ge(() => l.value + 1)), _s(Ru, o), _s(zs, i);
    const a = /* @__PURE__ */ ce();
    return os(() => [
      a.value,
      o.value,
      e.name
    ], ([f, c, p], [m, h, E]) => {
      c && (c.instances[p] = f, h && h !== c && f && f === m && (c.leaveGuards.size || (c.leaveGuards = h.leaveGuards), c.updateGuards.size || (c.updateGuards = h.updateGuards))), f && c && (!h || !sn(c, h) || !m) && (c.enterCallbacks[p] || []).forEach((x) => x(f));
    }, { flush: "post" }), () => {
      const f = i.value, c = e.name, p = o.value, m = p && p.components[c];
      if (!m) return ur(n.default, {
        Component: m,
        route: f
      });
      const h = p.props[c], E = h ? h === !0 ? f.params : typeof h == "function" ? h(f) : h : null, k = hl(m, oe({}, E, t, {
        onVnodeUnmounted: (N) => {
          N.component.isUnmounted && (p.instances[c] = null);
        },
        ref: a
      }));
      return ur(n.default, {
        Component: k,
        route: f
      }) || k;
    };
  }
});
function ur(e, t) {
  if (!e) return null;
  const n = e(t);
  return n.length === 1 ? n[0] : n;
}
const Tl = Zu;
function qu(e) {
  const t = Fu(e.routes, e), n = e.parseQuery || xu, s = e.stringifyQuery || Xi, i = e.history, r = cn(), l = cn(), o = cn(), a = /* @__PURE__ */ uo(yt);
  let f = yt;
  Jt && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
  const c = Ms.bind(null, (S) => "" + S), p = Ms.bind(null, ou), m = Ms.bind(null, kn);
  function h(S, F) {
    let D, j;
    return xl(S) ? (D = t.getRecordMatcher(S), j = F) : j = S, t.addRoute(j, D);
  }
  function E(S) {
    const F = t.getRecordMatcher(S);
    F && t.removeRoute(F);
  }
  function x() {
    return t.getRoutes().map((S) => S.record);
  }
  function k(S) {
    return !!t.getRecordMatcher(S);
  }
  function N(S, F) {
    if (F = oe({}, F || a.value), typeof S == "string") {
      const _ = Ts(n, S, F.path), w = t.resolve({ path: _.path }, F), A = i.createHref(_.fullPath);
      return oe(_, w, {
        params: m(w.params),
        hash: kn(_.hash),
        redirectedFrom: void 0,
        href: A
      });
    }
    let D;
    if (S.path != null)
      D = oe({}, S, { path: Ts(n, S.path, F.path).path });
    else {
      const _ = oe({}, S.params);
      for (const w in _) _[w] == null && delete _[w];
      D = oe({}, S, { params: p(_) }), F.params = p(F.params);
    }
    const j = t.resolve(D, F), u = S.hash || "";
    j.params = c(m(j.params));
    const g = cu(s, oe({}, S, {
      hash: iu(u),
      path: j.path
    })), y = i.createHref(g);
    return oe({
      fullPath: g,
      hash: u,
      query: s === Xi ? Cu(S.query) : S.query || {}
    }, j, {
      redirectedFrom: void 0,
      href: y
    });
  }
  function v(S) {
    return typeof S == "string" ? Ts(n, S, a.value.path) : oe({}, S);
  }
  function M(S, F) {
    if (f !== S) return rn(pe.NAVIGATION_CANCELLED, {
      from: F,
      to: S
    });
  }
  function R(S) {
    return b(S);
  }
  function W(S) {
    return R(oe(v(S), { replace: !0 }));
  }
  function Z(S, F) {
    const D = S.matched[S.matched.length - 1];
    if (D && D.redirect) {
      const { redirect: j } = D;
      let u = typeof j == "function" ? j(S, F) : j;
      return typeof u == "string" && (u = u.includes("?") || u.includes("#") ? u = v(u) : { path: u }, u.params = {}), oe({
        query: S.query,
        hash: S.hash,
        params: u.path != null ? {} : S.params
      }, u);
    }
  }
  function b(S, F) {
    const D = f = N(S), j = a.value, u = S.state, g = S.force, y = S.replace === !0, _ = Z(D, j);
    if (_) return b(oe(v(_), {
      state: typeof _ == "object" ? oe({}, u, _.state) : u,
      force: g,
      replace: y
    }), F || D);
    const w = D;
    w.redirectedFrom = F;
    let A;
    return !g && fu(s, j, D) && (A = rn(pe.NAVIGATION_DUPLICATED, {
      to: w,
      from: j
    }), Rt(j, j, !0, !1)), (A ? Promise.resolve(A) : X(w, j)).catch((T) => lt(T) ? lt(T, pe.NAVIGATION_GUARD_REDIRECT) ? T : Kt(T) : Ct(T, w, j)).then((T) => {
      if (T) {
        if (lt(T, pe.NAVIGATION_GUARD_REDIRECT))
          return b(oe({ replace: y }, v(T.to), {
            state: typeof T.to == "object" ? oe({}, u, T.to.state) : u,
            force: g
          }), F || w);
      } else T = De(w, j, !0, y, u);
      return he(w, j, T), T;
    });
  }
  function L(S, F) {
    const D = M(S, F);
    return D ? Promise.reject(D) : Promise.resolve();
  }
  function q(S) {
    const F = Mt.values().next().value;
    return F && typeof F.runWithContext == "function" ? F.runWithContext(S) : S();
  }
  function X(S, F) {
    let D;
    const [j, u, g] = Mu(S, F);
    D = Os(j.reverse(), "beforeRouteLeave", S, F);
    for (const _ of j) _.leaveGuards.forEach((w) => {
      D.push(_t(w, S, F));
    });
    const y = L.bind(null, S, F);
    return D.push(y), Ve(D).then(() => {
      D = [];
      for (const _ of r.list()) D.push(_t(_, S, F));
      return D.push(y), Ve(D);
    }).then(() => {
      D = Os(u, "beforeRouteUpdate", S, F);
      for (const _ of u) _.updateGuards.forEach((w) => {
        D.push(_t(w, S, F));
      });
      return D.push(y), Ve(D);
    }).then(() => {
      D = [];
      for (const _ of g) if (_.beforeEnter) if (We(_.beforeEnter)) for (const w of _.beforeEnter) D.push(_t(w, S, F));
      else D.push(_t(_.beforeEnter, S, F));
      return D.push(y), Ve(D);
    }).then(() => (S.matched.forEach((_) => _.enterCallbacks = {}), D = Os(g, "beforeRouteEnter", S, F, q), D.push(y), Ve(D))).then(() => {
      D = [];
      for (const _ of l.list()) D.push(_t(_, S, F));
      return D.push(y), Ve(D);
    }).catch((_) => lt(_, pe.NAVIGATION_CANCELLED) ? _ : Promise.reject(_));
  }
  function he(S, F, D) {
    o.list().forEach((j) => q(() => j(S, F, D)));
  }
  function De(S, F, D, j, u) {
    const g = M(S, F);
    if (g) return g;
    const y = F === yt, _ = Jt ? history.state : {};
    D && (j || y ? i.replace(S.fullPath, oe({ scroll: y && _ && _.scroll }, u)) : i.push(S.fullPath, u)), a.value = S, Rt(S, F, D, y), Kt();
  }
  let st;
  function gt() {
    st || (st = i.listen((S, F, D) => {
      if (!Tt.listening) return;
      const j = N(S), u = Z(j, Tt.currentRoute.value);
      if (u) {
        b(oe(u, {
          replace: !0,
          force: !0
        }), j).catch(wn);
        return;
      }
      f = j;
      const g = a.value;
      Jt && _u(Qi(g.fullPath, D.delta), bu()), X(j, g).catch((y) => lt(y, pe.NAVIGATION_ABORTED | pe.NAVIGATION_CANCELLED) ? y : lt(y, pe.NAVIGATION_GUARD_REDIRECT) ? (b(oe(v(y.to), { force: !0 }), j).then((_) => {
        lt(_, pe.NAVIGATION_ABORTED | pe.NAVIGATION_DUPLICATED) && !D.delta && D.type === Gs.pop && i.go(-1, !1);
      }).catch(wn), Promise.reject()) : (D.delta && i.go(-D.delta, !1), Ct(y, j, g))).then((y) => {
        y = y || De(j, g, !1), y && (D.delta && !lt(y, pe.NAVIGATION_CANCELLED) ? i.go(-D.delta, !1) : D.type === Gs.pop && lt(y, pe.NAVIGATION_ABORTED | pe.NAVIGATION_DUPLICATED) && i.go(-1, !1)), he(j, g, y);
      }).catch(wn);
    }));
  }
  let ln = cn(), on = cn(), mt;
  function Ct(S, F, D) {
    Kt(S);
    const j = on.list();
    return j.length ? j.forEach((u) => u(S, F, D)) : console.error(S), Promise.reject(S);
  }
  function hs() {
    return mt && a.value !== yt ? Promise.resolve() : new Promise((S, F) => {
      ln.add([S, F]);
    });
  }
  function Kt(S) {
    return mt || (mt = !S, gt(), ln.list().forEach(([F, D]) => S ? D(S) : F()), ln.reset()), S;
  }
  function Rt(S, F, D, j) {
    const { scrollBehavior: u } = e;
    if (!Jt || !u) return Promise.resolve();
    const g = !D && wu(Qi(S.fullPath, 0)) || (j || !D) && history.state && history.state.scroll || null;
    return ls().then(() => u(S, F, g)).then((y) => y && vu(y)).catch((y) => Ct(y, S, F));
  }
  const ke = (S) => i.go(S);
  let Gt;
  const Mt = /* @__PURE__ */ new Set(), Tt = {
    currentRoute: a,
    listening: !0,
    addRoute: h,
    removeRoute: E,
    clearRoutes: t.clearRoutes,
    hasRoute: k,
    getRoutes: x,
    resolve: N,
    options: e,
    push: R,
    replace: W,
    go: ke,
    back: () => ke(-1),
    forward: () => ke(1),
    beforeEach: r.add,
    beforeResolve: l.add,
    afterEach: o.add,
    onError: on.add,
    isReady: hs,
    install(S) {
      S.component("RouterLink", ds), S.component("RouterView", Tl), S.config.globalProperties.$router = Tt, Object.defineProperty(S.config.globalProperties, "$route", {
        enumerable: !0,
        get: () => Se(a)
      }), Jt && !Gt && a.value === yt && (Gt = !0, R(i.location).catch((j) => {
      }));
      const F = {};
      for (const j in yt) Object.defineProperty(F, j, {
        get: () => a.value[j],
        enumerable: !0
      });
      S.provide(hi, Tt), S.provide(pi, /* @__PURE__ */ Dr(F)), S.provide(zs, a);
      const D = S.unmount;
      Mt.add(S), S.unmount = function() {
        Mt.delete(S), Mt.size < 1 && (f = yt, st && st(), st = null, a.value = yt, Gt = !1, mt = !1), D();
      };
    }
  };
  function Ve(S) {
    return S.reduce((F, D) => F.then(() => q(D)), Promise.resolve());
  }
  return Tt;
}
function Ju(e) {
  return Ht(pi);
}
const Yu = {
  class: "icon",
  viewBox: "0 0 24 24",
  "aria-hidden": "true"
}, Qu = ["d"], ie = /* @__PURE__ */ Be({
  __name: "UiIcon",
  props: {
    name: {}
  },
  setup(e) {
    const t = {
      home: "M3 11 12 4l9 7M5 10v10h14V10",
      settings: "M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z",
      menu: "M4 6h16M4 12h16M4 18h16",
      sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5",
      moon: "M20.5 13a8.5 8.5 0 1 1-9.5-9.5A7 7 0 0 0 20.5 13Z",
      arrow: "M5 12h14m-5-5 5 5-5 5",
      chevron: "m6 9 6 6 6-6",
      drop: "M12 3C9 8 5 11 5 15a7 7 0 0 0 14 0c0-4-4-7-7-12ZM8 15a4 4 0 0 0 4 4",
      thermo: "M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0ZM12 10v7",
      pump: "M8 3h8m-4 0v4m-4 14h8m-4 0v-4M17 12a5 5 0 1 0-10 0 5 5 0 0 0 10 0M3 9v6m18-6v6m-18-3h4m10 0h4m-9-3v6m-3-3h6",
      clock: "M20.5 12a8.5 8.5 0 1 0-17 0 8.5 8.5 0 0 0 17 0M12 7v5l3 2",
      calendar: "M5 5h14q2 0 2 2v12q0 2-2 2H5q-2 0-2-2V7q0-2 2-2ZM7 3v4m10-4v4M3 10h18m-13 4h2m4 0h2m-8 3h2",
      sliders: "M4 7h4m4 0h8M4 17h9m4 0h3M12 7a2 2 0 1 0-4 0 2 2 0 0 0 4 0M17 17a2 2 0 1 0-4 0 2 2 0 0 0 4 0",
      link: "m10 13 4-4m-5 8-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 6a4 4 0 0 0 6 0l4-4a4 4 0 0 0-6-6l-2 2",
      plus: "M12 5v14M5 12h14",
      trash: "M4 6h16M9 6V3h6v3M6 6l1 14h10l1-14M10 10v6m4-6v6",
      check: "m5 12 4 4L19 6",
      info: "M21 12a9 9 0 1 0-18 0 9 9 0 0 0 18 0M12 11v6m0-10v.1",
      eye: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7ZM15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0",
      play: "m8 4 12 8-12 8Z",
      warning: "m12 3 10 18H2L12 3ZM12 9v5m0 3v.1",
      refresh: "M20 7v5h-5M4 17v-5h5M5.5 7a8 8 0 0 1 13 0L20 12M4 12l1.5 5a8 8 0 0 0 13 0",
      close: "m6 6 12 12M6 18 18 6"
    };
    return (n, s) => (I(), $("svg", Yu, [
      d("path", {
        d: t[e.name] || t.info
      }, null, 8, Qu)
    ]));
  }
}), Xu = {
  class: "app-navigation",
  "aria-label": "Hauptnavigation"
}, ec = /* @__PURE__ */ Be({
  __name: "AppNavigation",
  setup(e) {
    const t = Ju(), n = [
      { to: "/", name: "dashboard", label: "Übersicht", icon: "home" },
      { to: "/settings", name: "settings", label: "Einstellungen", icon: "settings" }
    ];
    return (s, i) => (I(), $("nav", Xu, [
      (I(), $(Y, null, Ee(n, (r) => K(Se(ds), {
        key: r.name,
        to: r.to,
        class: Ke({ active: Se(t).name === r.name })
      }, {
        default: xn(() => [
          K(ie, {
            name: r.icon
          }, null, 8, ["name"]),
          d("span", null, H(r.label), 1)
        ]),
        _: 2
      }, 1032, ["to", "class"])), 64))
    ]));
  }
});
function tc(e) {
  const t = /* @__PURE__ */ ce(!1);
  let n;
  const s = () => {
    t.value = n?.matches ?? !1;
  };
  return li(() => {
    n = window.matchMedia?.(e), s(), n?.addEventListener("change", s);
  }), oi(() => n?.removeEventListener("change", s)), t;
}
const nc = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20256%20256'%20width='256'%20height='256'%20role='img'%20aria-labelledby='title'%3e%3ctitle%20id='title'%3eWarmwasser-Zirkulation:%20Wassertropfen%20mit%20Zirkulationspfeilen%3c/title%3e%3cg%20fill='none'%20stroke='%2355c7cb'%20stroke-width='18'%20stroke-linecap='round'%3e%3cpath%20d='M26%2096%20C43%2036%20100%2010%20152%2028%20C182%2037%20204%2059%20215%2082'/%3e%3cpath%20d='M230%20160%20C213%20220%20156%20246%20104%20228%20C74%20219%2052%20197%2041%20174'/%3e%3c/g%3e%3cg%20fill='%2355c7cb'%3e%3cpath%20d='M195%2076%20L231%20107%20L235%2062%20Z'/%3e%3cpath%20d='M61%20180%20L25%20149%20L21%20194%20Z'/%3e%3c/g%3e%3cpath%20fill='%23ffcb62'%20d='M128%2060%20C120%2080%2085%20119%2085%20144%20C85%20168%20104%20187%20128%20187%20C152%20187%20171%20168%20171%20144%20C171%20119%20136%2080%20128%2060%20Z'/%3e%3cpath%20fill='none'%20stroke='%2310151d'%20stroke-width='8'%20stroke-linecap='round'%20d='M103%20143%20C103%20155%20111%20166%20123%20168'/%3e%3c/svg%3e", sc = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20256%20256'%20width='256'%20height='256'%20role='img'%20aria-labelledby='title'%3e%3ctitle%20id='title'%3eWarmwasser-Zirkulation:%20Wassertropfen%20mit%20Zirkulationspfeilen%3c/title%3e%3cg%20fill='none'%20stroke='%2355c7cb'%20stroke-width='18'%20stroke-linecap='round'%3e%3cpath%20d='M26%2096%20C43%2036%20100%2010%20152%2028%20C182%2037%20204%2059%20215%2082'/%3e%3cpath%20d='M230%20160%20C213%20220%20156%20246%20104%20228%20C74%20219%2052%20197%2041%20174'/%3e%3c/g%3e%3cg%20fill='%2355c7cb'%3e%3cpath%20d='M195%2076%20L231%20107%20L235%2062%20Z'/%3e%3cpath%20d='M61%20180%20L25%20149%20L21%20194%20Z'/%3e%3c/g%3e%3cpath%20fill='%23ffcb62'%20d='M128%2060%20C120%2080%2085%20119%2085%20144%20C85%20168%20104%20187%20128%20187%20C152%20187%20171%20168%20171%20144%20C171%20119%20136%2080%20128%2060%20Z'/%3e%3cpath%20fill='none'%20stroke='%23eef4fc'%20stroke-width='8'%20stroke-linecap='round'%20d='M103%20143%20C103%20155%20111%20166%20123%20168'/%3e%3c/svg%3e", ic = ["data-theme"], rc = { class: "app-header" }, lc = { class: "header-inner" }, oc = ["src"], ac = { class: "header-actions" }, uc = ["disabled", "aria-label"], cc = ["aria-label"], fc = { class: "panel-viewport" }, dc = { class: "page-footer" }, hc = /* @__PURE__ */ Be({
  __name: "App",
  props: {
    state: {},
    saveSettings: {},
    importHistory: {}
  },
  emits: ["refresh"],
  setup(e) {
    const t = e, n = tc("(max-width: 640px)"), s = /* @__PURE__ */ ce(null), i = /* @__PURE__ */ ce(null), r = ge(() => i.value ?? !!t.state.darkMode);
    return (l, o) => (I(), $("div", {
      class: "app-shell",
      "data-theme": r.value ? "dark" : "light"
    }, [
      d("header", rc, [
        d("div", lc, [
          K(Se(ds), {
            class: "brand",
            to: "/",
            "aria-label": "Zirkulation – zur Übersicht"
          }, {
            default: xn(() => [
              d("img", {
                class: "brand-logo",
                src: r.value ? Se(sc) : Se(nc),
                alt: "",
                width: "38",
                height: "38"
              }, null, 8, oc),
              o[3] || (o[3] = d("span", { class: "brand-wordmark" }, [
                d("strong", null, "Warmwasser"),
                d("span", null, "Zirkulation")
              ], -1))
            ]),
            _: 1
          }),
          (I(), At(Ro, {
            to: s.value || "body",
            disabled: !Se(n) || !s.value
          }, [
            K(ec)
          ], 8, ["to", "disabled"])),
          d("div", ac, [
            d("button", {
              class: "icon-button refresh-button",
              disabled: e.state.loading,
              "aria-label": e.state.loading ? "Wird geladen …" : "Aktualisieren",
              title: "Aktualisieren",
              onClick: o[0] || (o[0] = (a) => l.$emit("refresh"))
            }, [
              K(ie, { name: "refresh" })
            ], 8, uc),
            d("button", {
              class: "icon-button theme-button",
              "aria-label": r.value ? "Helle Ansicht aktivieren" : "Dunkle Ansicht aktivieren",
              onClick: o[1] || (o[1] = (a) => i.value = !r.value)
            }, [
              K(ie, {
                name: r.value ? "sun" : "moon"
              }, null, 8, ["name"])
            ], 8, cc)
          ])
        ])
      ]),
      d("div", fc, [
        K(Se(Tl), null, {
          default: xn(({ Component: a }) => [
            (I(), At(Oo, null, [
              (I(), At(Do(a), {
                state: e.state,
                "save-settings": e.saveSettings,
                "import-history": e.importHistory,
                onRefresh: o[2] || (o[2] = (f) => l.$emit("refresh"))
              }, null, 40, ["state", "save-settings", "import-history"]))
            ], 1024))
          ]),
          _: 1
        }),
        d("footer", dc, [
          d("span", null, [
            o[4] || (o[4] = d("i", { class: "status-dot" }, null, -1)),
            e.state.error ? (I(), $(Y, { key: 0 }, [
              J("Verbindung unterbrochen")
            ], 64)) : e.state.updatedAt ? (I(), $(Y, { key: 1 }, [
              J("Aktualisiert " + H(new Date(e.state.updatedAt).toLocaleTimeString("de-DE")) + " · alle 15 Sekunden", 1)
            ], 64)) : (I(), $(Y, { key: 2 }, [
              J("Verbindung mit Home Assistant")
            ], 64))
          ]),
          o[5] || (o[5] = d("span", null, "Warmwasser-Zirkulation", -1))
        ])
      ]),
      d("div", {
        ref_key: "bottomNavigation",
        ref: s,
        class: "bottom-navigation"
      }, null, 512)
    ], 8, ic));
  }
}), cr = () => ({
  darkMode: !1,
  entries: [],
  loading: !0,
  error: null,
  updatedAt: null
});
function pc() {
  const e = /* @__PURE__ */ is(cr());
  return {
    state: e,
    reset() {
      Object.assign(e, cr());
    },
    setTheme(t) {
      e.darkMode = t;
    },
    receive(t) {
      if (!t || !Array.isArray(t.entries)) throw new Error("invalid_response");
      e.entries = t.entries, e.error = null, e.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
  };
}
function gc() {
  const e = pc();
  let t = null, n = !1, s = null, i = !1, r = !1, l = 0, o = 0;
  function a(h) {
    const E = t === null;
    t = h, e.setTheme(!!h.themes?.darkMode), E && n && e.state.updatedAt === null && m();
  }
  function f() {
    n || (n = !0, e.reset(), e.setTheme(!!t?.themes?.darkMode), s = window.setInterval(() => {
      document.visibilityState !== "hidden" && m();
    }, 15e3), m());
  }
  function c() {
    n = !1, l++, o++, s !== null && window.clearInterval(s), s = null, i = !1, r = !1;
  }
  async function p(h) {
    const E = t;
    if (!E || !n) throw new Error("unavailable");
    if (r) throw new Error("busy");
    r = !0, o++;
    const x = l;
    try {
      if (await E.callWS(h), !n || x !== l) throw new Error("unavailable");
      const k = await E.callWS({ type: "warmwasser_zirkulation/status" });
      if (!n || x !== l) throw new Error("unavailable");
      e.receive(k);
    } finally {
      x === l && (r = !1);
    }
  }
  async function m() {
    if (!t || !n || i || r) return;
    const h = l, E = ++o;
    i = !0, e.state.loading = !0;
    try {
      const x = await t.callWS({ type: "warmwasser_zirkulation/status" });
      if (!n || h !== l || E !== o) return;
      e.receive(x);
    } catch {
      n && h === l && E === o && (e.state.error = "Betriebsdaten konnten nicht geladen werden. Verbindung und Administratorrechte prüfen.");
    } finally {
      h === l && (i = !1, e.state.loading = !1);
    }
  }
  return {
    state: e.state,
    setHass: a,
    connect: f,
    disconnect: c,
    refresh: m,
    configure: (h, E, x) => p({
      type: "warmwasser_zirkulation/configure",
      entry_id: h,
      settings: E,
      revision: x
    }),
    importHistory: (h) => p({ type: "warmwasser_zirkulation/import_history", entry_id: h })
  };
}
function mc(e, t) {
  let n = null;
  const s = () => {
    n = null;
  };
  function i(o) {
    if (s(), o.touches.length !== 1) return;
    const a = o.touches[0], f = a.clientX - e.getBoundingClientRect().left;
    f < 0 || f > 28 || o.composedPath().some((c) => c instanceof HTMLElement && c.matches('button, a, input, select, textarea, [contenteditable="true"]')) || (n = { id: a.identifier, x: a.clientX, y: a.clientY, at: performance.now() });
  }
  function r(o) {
    if (!n) return;
    if (o.touches.length !== 1) {
      s();
      return;
    }
    const a = Array.from(o.touches).find((p) => p.identifier === n.id);
    if (!a) {
      s();
      return;
    }
    const f = a.clientX - n.x, c = a.clientY - n.y;
    (f < -12 || Math.abs(c) > 24 && Math.abs(c) > Math.abs(f)) && s();
  }
  function l(o) {
    const a = n;
    if (s(), !a || o.touches.length) return;
    const f = Array.from(o.changedTouches).find((h) => h.identifier === a.id);
    if (!f) return;
    const c = f.clientX - a.x, p = Math.abs(f.clientY - a.y), m = performance.now() - a.at;
    m >= 0 && m <= 700 && c >= 70 && p <= 48 && c >= p * 1.75 && t();
  }
  return e.addEventListener("touchstart", i, { passive: !0 }), e.addEventListener("touchmove", r, { passive: !0 }), e.addEventListener("touchend", l, { passive: !0 }), e.addEventListener("touchcancel", s, { passive: !0 }), () => {
    s(), e.removeEventListener("touchstart", i), e.removeEventListener("touchmove", r), e.removeEventListener("touchend", l), e.removeEventListener("touchcancel", s);
  };
}
const yc = {
  class: "heatmap heatmap-card surface",
  "aria-label": "Zapfmuster nach Wochentag"
}, bc = { class: "heatmap-header" }, vc = {
  key: 0,
  class: "planning-note"
}, _c = {
  key: 1,
  class: "empty-heatmap"
}, wc = { class: "heatmap-controls" }, Ec = { class: "overlay-toggles" }, Sc = { class: "heatmap-scroll" }, Ac = { key: 0 }, xc = {
  key: 1,
  class: "visually-hidden"
}, Cc = { scope: "row" }, Rc = ["data-row", "data-slot", "tabindex", "onFocus", "onKeydown", "title", "aria-label", "onClick"], Mc = { class: "legend" }, Tc = {
  class: "cell-detail",
  "aria-live": "polite"
}, kc = { class: "heatmap-help" }, Oc = { class: "subtle" }, Pc = {
  key: 2,
  class: "calendar-hint"
}, Nc = /* @__PURE__ */ Be({
  __name: "UsageHeatmap",
  props: {
    data: {}
  },
  setup(e) {
    const t = e, n = /* @__PURE__ */ ce(!0), s = /* @__PURE__ */ ce(!0), i = /* @__PURE__ */ ce({ row: 0, slot: 0 }), r = /* @__PURE__ */ ce(null), l = ge(() => {
      if (!r.value) return "Eine Zelle auswählen, um Beobachtungstage und Zapfvorgänge zu sehen.";
      const m = t.data.rows.find((h) => h.key === r.value.row);
      return m ? c(m.key, r.value.slot, m.cells[r.value.slot]) : "Eine Zelle auswählen, um Beobachtungstage und Zapfvorgänge zu sehen.";
    }), o = { mon: "Montag", tue: "Dienstag", wed: "Mittwoch", thu: "Donnerstag", fri: "Freitag", sat: "Samstag", sun_holiday: "Sonn-/Feiertage" }, a = (m) => `${String(Math.floor(m / 2)).padStart(2, "0")}:${m % 2 ? "30" : "00"}`, f = new Intl.NumberFormat("de-DE", { style: "percent", maximumFractionDigits: 0 });
    function c(m, h, E) {
      const x = `${o[m]} · ${a(h)}–${a(h + 1)}`, k = E.ratio === null ? `${x}: Keine ausreichend beobachteten Tage. ${E.partial_days} Tage mit Teilmessungen.` : `${x}: ${E.event_days} von ${E.observed_days} beobachteten Tagen mit Zapfvorgang (${f.format(E.ratio)}).${E.sufficient ? "" : " Vorläufig: noch zu wenige Beobachtungstage."}`, N = (E.allowed_windows ?? []).map((M) => `Freigabe ${M.start}–${M.end}`).join("; "), v = (E.planned_runs ?? []).map((M) => `Geplantes Vorwärmen ${M.date} ${M.start}–${M.end}`).join("; ");
      return [k, N, v].filter(Boolean).join(" ");
    }
    function p(m, h, E) {
      let x = h, k = E;
      if (m.key === "ArrowRight") k = Math.min(47, E + 1);
      else if (m.key === "ArrowLeft") k = Math.max(0, E - 1);
      else if (m.key === "ArrowDown") x = Math.min(t.data.rows.length - 1, h + 1);
      else if (m.key === "ArrowUp") x = Math.max(0, h - 1);
      else if (m.key === "Home")
        k = 0, m.ctrlKey && (x = 0);
      else if (m.key === "End")
        k = 47, m.ctrlKey && (x = t.data.rows.length - 1);
      else return;
      m.preventDefault(), i.value = { row: x, slot: k };
      const N = m.currentTarget.closest("table");
      ls(() => N?.querySelector(`button[data-row="${x}"][data-slot="${k}"]`)?.focus());
    }
    return (m, h) => (I(), $("section", yc, [
      d("div", bc, [
        h[2] || (h[2] = d("h3", null, "Dein Warmwasser-Rhythmus", -1)),
        d("span", null, "Letzte " + H(e.data.retention_days) + " Tage", 1)
      ]),
      h[14] || (h[14] = d("p", { class: "subtle" }, "Die Farbsättigung zeigt stufenlos den Anteil beobachteter Tage mit erkanntem Zapfvorgang je halber Stunde.", -1)),
      e.data.planning ? (I(), $("p", vc, [
        J(H(e.data.planning.mode === "monitoring" ? "Planungsvorschau im Monitoring · automatische Schaltbefehle sind ausgeschaltet." : "Planung der nächsten " + e.data.planning.horizon_days + " Tage · Ausführung bei gültigen Live-Werten und freigegebener Steuerung."), 1),
        e.data.planning.vacation_active ? (I(), $(Y, { key: 0 }, [
          J(" Das Urlaubsprofil bestimmt die dargestellten Freigaben.")
        ], 64)) : ae("", !0)
      ])) : ae("", !0),
      e.data.observed_dates ? ae("", !0) : (I(), $("p", _c, "Noch keine ausreichenden Beobachtungen vorhanden. Vorhandene HA-Historie wird zum Lernstart eingelesen. Vorhandene Lücken werden nicht als „kein Verbrauch“ gewertet.")),
      d("div", wc, [
        h[5] || (h[5] = d("span", { class: "view-label" }, "ENTNAHMEN PRO HALBER STUNDE", -1)),
        d("div", Ec, [
          d("label", null, [
            Me(d("input", {
              "onUpdate:modelValue": h[0] || (h[0] = (E) => n.value = E),
              type: "checkbox"
            }, null, 512), [
              [Gi, n.value]
            ]),
            h[3] || (h[3] = J("Freigaben", -1))
          ]),
          d("label", null, [
            Me(d("input", {
              "onUpdate:modelValue": h[1] || (h[1] = (E) => s.value = E),
              type: "checkbox"
            }, null, 512), [
              [Gi, s.value]
            ]),
            h[4] || (h[4] = J("Vorwärmen", -1))
          ])
        ])
      ]),
      d("div", Sc, [
        d("table", null, [
          h[7] || (h[7] = d("caption", { class: "visually-hidden" }, "Zapfvorgänge nach Wochentag und halber Stunde", -1)),
          d("thead", null, [
            d("tr", null, [
              h[6] || (h[6] = d("th", { scope: "col" }, "Tag", -1)),
              (I(), $(Y, null, Ee(48, (E) => d("th", {
                key: E,
                scope: "col"
              }, [
                (E - 1) % 6 === 0 ? (I(), $("span", Ac, H(a(E - 1)), 1)) : (I(), $("span", xc, H(a(E - 1)), 1))
              ])), 64))
            ])
          ]),
          d("tbody", null, [
            (I(!0), $(Y, null, Ee(e.data.rows, (E, x) => (I(), $("tr", {
              key: E.key
            }, [
              d("th", Cc, H(o[E.key]), 1),
              (I(!0), $(Y, null, Ee(E.cells, (k, N) => (I(), $("td", { key: N }, [
                d("button", {
                  type: "button",
                  class: Ke(["heat-cell", { "no-data": k.ratio === null, provisional: k.ratio !== null && !k.sufficient }]),
                  "data-row": x,
                  "data-slot": N,
                  tabindex: i.value.row === x && i.value.slot === N ? 0 : -1,
                  onFocus: (v) => i.value = { row: x, slot: N },
                  onKeydown: (v) => p(v, x, N),
                  style: Qt(k.ratio === null ? void 0 : { "--usage": k.ratio }),
                  title: c(E.key, N, k),
                  "aria-label": c(E.key, N, k),
                  onClick: (v) => r.value = { row: E.key, slot: N }
                }, [
                  (I(!0), $(Y, null, Ee(n.value ? k.allowed_windows ?? [] : [], (v, M) => (I(), $("span", {
                    key: `allowed-${M}`,
                    class: "allowed-window",
                    "aria-hidden": "true",
                    style: Qt({ left: v.offset + "%", width: v.width + "%" })
                  }, null, 4))), 128)),
                  (I(!0), $(Y, null, Ee(s.value ? k.planned_runs ?? [] : [], (v, M) => (I(), $("span", {
                    key: `planned-${M}`,
                    class: "planned-run",
                    "aria-hidden": "true",
                    style: Qt({ left: v.offset + "%", width: v.width + "%" })
                  }, null, 4))), 128))
                ], 46, Rc)
              ]))), 128))
            ]))), 128))
          ])
        ])
      ]),
      d("div", Mc, [
        h[10] || (h[10] = d("span", {
          class: "usage-scale",
          role: "img",
          "aria-label": "Entnahmequote: stufenlos von 0 bis 100 Prozent"
        }, [
          d("span", null, "0 %"),
          d("i", {
            class: "usage-gradient",
            "aria-hidden": "true"
          }),
          d("span", null, "100 %")
        ], -1)),
        h[11] || (h[11] = d("span", null, [
          d("i", {
            class: "no-data",
            "aria-hidden": "true"
          }),
          J("Keine Messbasis")
        ], -1)),
        h[12] || (h[12] = d("span", null, [
          d("i", {
            class: "legend-provisional provisional",
            "aria-hidden": "true"
          }),
          J("Vorläufig")
        ], -1)),
        e.data.planning ? (I(), $(Y, { key: 0 }, [
          h[8] || (h[8] = d("span", null, [
            d("i", {
              class: "legend-allowed",
              "aria-hidden": "true"
            }),
            J("Freigabezeit")
          ], -1)),
          h[9] || (h[9] = d("span", null, [
            d("i", {
              class: "legend-planned",
              "aria-hidden": "true"
            }),
            J("Geplantes Vorwärmen")
          ], -1))
        ], 64)) : ae("", !0)
      ]),
      d("p", Tc, H(l.value), 1),
      d("details", kc, [
        h[13] || (h[13] = d("summary", null, "Wie wird die Heatmap berechnet?", -1)),
        d("p", Oc, "Ein Tag zählt pro Zelle ab " + H(e.data.minimum_coverage_minutes) + " Minuten gültiger Messungen bei ausgeschalteter Pumpe. Ab " + H(e.data.minimum_observed_days) + " Tagen gilt die Messbasis als ausreichend. Sonntage und konfigurierte Feiertage werden gemeinsam gezählt; jeder Kalendertag zählt einmal.", 1)
      ]),
      e.data.calendar_enabled ? ae("", !0) : (I(), $("p", Pc, "Feiertage sind noch nicht konfiguriert. Land und Bundesland/Region unter „Konfigurieren → Feiertagskalender“ auswählen."))
    ]));
  }
}), Ic = {
  class: "history-status",
  "aria-label": "Historie und Lernplanung"
}, Dc = { role: "status" }, Vc = {
  key: 0,
  class: "calendar-hint"
}, Lc = ["disabled"], $c = {
  key: 1,
  role: "status"
}, Fc = {
  key: 2,
  role: "alert",
  class: "error"
}, Hc = /* @__PURE__ */ Be({
  __name: "HistoryStatus",
  props: {
    entry: {},
    importHistory: {}
  },
  setup(e) {
    const t = e, n = /* @__PURE__ */ ce(!1), s = /* @__PURE__ */ ce(""), i = /* @__PURE__ */ ce(""), r = { idle: "Die Lernbasis wird aus Live-Messungen aufgebaut.", loading: "HA-Historie wird eingelesen", complete: "HA-Historie eingelesen", unavailable: "HA-Recorder ist nicht verfügbar. Die Integration lernt aus Live-Messungen.", error: "HA-Historie konnte nicht vollständig eingelesen werden. Live-Messungen werden weiter ausgewertet." }, l = ge(() => r[t.entry.history_import?.state ?? "idle"]), o = ge(() => t.entry.next_start ? new Date(t.entry.next_start).toLocaleString("de-DE") : null);
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
    return (f, c) => (I(), $("section", Ic, [
      c[0] || (c[0] = d("h3", null, "Historie und Lernplanung", -1)),
      d("p", Dc, [
        J(H(l.value), 1),
        e.entry.history_import && ["loading", "complete"].includes(e.entry.history_import.state) ? (I(), $(Y, { key: 0 }, [
          J(" · " + H(e.entry.history_import.days) + "/28 Tage geprüft · " + H(e.entry.history_import.events) + " zusätzliche Lernereignisse", 1)
        ], 64)) : ae("", !0)
      ]),
      e.entry.history_import?.assumed_pump_off ? (I(), $("p", Vc, "Bei fehlenden historischen Pumpenaufzeichnungen wurde „Pumpe aus“ angenommen. Die daraus gelernten Muster bitte anhand der Heatmap prüfen.")) : ae("", !0),
      d("p", null, [
        d("strong", null, H(o.value ? "Nächster Muster-Vorschlag: " + o.value : "Noch kein freigegebener Musterstart mit ausreichender Messbasis."), 1)
      ]),
      c[1] || (c[1] = d("p", { class: "hint" }, "Zum Vorwärmen braucht ein Zeitabschnitt mindestens drei ausreichend beobachtete Tage und Entnahmen an mindestens 60 % dieser Tage. Es gelten Freigabezeiten, Laufzeit und Tageslimit sowie mindestens 20 Minuten Abstand zwischen Starts. Schaltbefehle sind nur bei „Steuerung aktiv“ freigegeben.", -1)),
      d("button", {
        type: "button",
        disabled: n.value || e.entry.history_import?.state === "loading",
        onClick: a
      }, H(n.value || e.entry.history_import?.state === "loading" ? "Historienimport läuft …" : "HA-Historie erneut einlesen"), 9, Lc),
      i.value ? (I(), $("p", $c, H(i.value), 1)) : ae("", !0),
      s.value ? (I(), $("p", Fc, H(s.value), 1)) : ae("", !0)
    ]));
  }
}), Bc = { class: "dialog-head" }, Uc = /* @__PURE__ */ Be({
  __name: "HistoryDialog",
  props: {
    entry: {},
    importHistory: {}
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t, s = /* @__PURE__ */ ce(), i = document.activeElement;
    return li(() => s.value?.showModal()), oi(() => {
      s.value?.close(), i?.focus();
    }), (r, l) => (I(), $("dialog", {
      ref_key: "dialog",
      ref: s,
      class: "history-dialog",
      "aria-label": "Historie und Lernplanung",
      onCancel: l[1] || (l[1] = yl((o) => n("close"), ["prevent"])),
      onClick: l[2] || (l[2] = (o) => {
        o.target === s.value && n("close");
      })
    }, [
      d("div", Bc, [
        l[3] || (l[3] = d("span", { class: "eyebrow" }, "DEINE LERNBASIS", -1)),
        d("button", {
          class: "icon-button",
          "aria-label": "Dialog schließen",
          onClick: l[0] || (l[0] = (o) => n("close"))
        }, [
          K(ie, { name: "close" })
        ])
      ]),
      K(Hc, {
        entry: e.entry,
        "import-history": e.importHistory
      }, null, 8, ["entry", "import-history"])
    ], 544));
  }
}), jc = { class: "system-card" }, Kc = { class: "system-label" }, Gc = { class: "status-illustration" }, Wc = { class: "status-copy" }, zc = { class: "status-label" }, Zc = { class: "status-action" }, qc = { class: "next-time" }, Jc = {
  key: 0,
  class: "info-note vacation-status"
}, Yc = { class: "metrics" }, Qc = { class: "metric surface" }, Xc = { class: "metric-label" }, ef = { key: 0 }, tf = { class: "metric-foot" }, nf = { class: "metric surface" }, sf = { class: "metric-label" }, rf = { key: 0 }, lf = { class: "metric-foot" }, of = { class: "metric surface" }, af = { class: "metric-label" }, uf = { class: "metric surface" }, cf = { class: "metric-label" }, ff = { class: "bottom-grid" }, df = { class: "surface plan-card" }, hf = { class: "card-head" }, pf = { class: "subtle" }, gf = {
  key: 0,
  class: "timeline"
}, mf = {
  key: 1,
  class: "empty-plan"
}, yf = { class: "surface learn-card" }, bf = { class: "card-head" }, vf = { class: "learn-row" }, _f = { class: "small-tag" }, wf = { class: "calendar-summary" }, Ef = /* @__PURE__ */ Be({
  __name: "WarmwasserDashboard",
  props: {
    entry: {},
    importHistory: {}
  },
  setup(e) {
    const t = e, n = /* @__PURE__ */ ce(!1), s = { learned_schedule: "Vorausschauendes Vorwärmen", cooldown: "Wartezeit zwischen Starts", outside_schedule: "Außerhalb der Freigabezeiten", waiting_for_demand: "Steuerung aktiv · wartet auf Bedarf", calendar_unavailable: "Feiertagskalender nicht verfügbar", control_failed: "Steuerung gestört", monitoring: "Monitoring", started: "Pumpe gestartet", demand_event: "Pumpe gestartet", pump_entity_missing: "Pumpenschalter fehlt", pump_unreachable: "Pumpenfehler · Steuerung pausiert", fresh_flow_value_missing: "Frische Temperaturwerte fehlen", pump_state_unknown: "Pumpenzustand unbekannt", daily_limit_reached: "Startlimit erreicht", no_draw_event: "Kein Zapfvorgang", pump_already_running: "Pumpe läuft" }, i = ge(() => s[t.entry.reason] || "Status unbekannt"), r = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }), l = (m) => m?.value == null || m.stale ? "—" : r.format(m.value), o = ge(() => ({ on: "Läuft", off: "Aus", unknown: "Unbekannt" })[t.entry.pump.state] || "Unbekannt"), a = ge(() => t.entry.next_start ? new Date(t.entry.next_start).toLocaleString("de-DE", { weekday: "short", hour: "2-digit", minute: "2-digit" }) : "Noch kein Vorschlag"), f = ge(() => t.entry.pump_until ? new Date(t.entry.pump_until).toLocaleString("de-DE", { weekday: "short", hour: "2-digit", minute: "2-digit" }) : null), c = ge(() => t.entry.heatmap?.planning?.starts?.slice(0, 3) ?? []), p = (m) => new Date(m).toLocaleString("de-DE", { weekday: "short", hour: "2-digit", minute: "2-digit" });
    return (m, h) => (I(), $("article", jc, [
      d("p", Kc, H(e.entry.title), 1),
      d("section", {
        class: Ke(["surface status-banner", { warning: e.entry.status_level === "warning", "error-state": e.entry.status_level === "error", monitor: !e.entry.enabled }])
      }, [
        d("div", Gc, [
          K(ie, {
            name: e.entry.status_level !== "normal" ? "warning" : e.entry.enabled ? "pump" : "eye"
          }, null, 8, ["name"])
        ]),
        d("div", Wc, [
          d("span", zc, [
            h[2] || (h[2] = d("i", { class: "status-dot" }, null, -1)),
            J(H(i.value), 1)
          ]),
          d("h3", null, "Zirkulationspumpe · " + H(o.value), 1),
          d("p", null, H(e.entry.enabled ? "Steuerfreigabe ist gesetzt." : "Monitoring: Die Messwertbeobachtung schaltet die Pumpe nicht.") + " Bedarfsautomatik: " + H(e.entry.demand_automation ? "freigegeben" : "ausgeschaltet") + ".", 1)
        ]),
        d("div", Zc, [
          d("small", null, H(f.value ? "Bestätigte Endzeit des laufenden Laufs" : e.entry.enabled ? "Nächster Muster-Vorschlag" : "Planungsvorschau · keine Ausführung"), 1),
          d("span", qc, H(f.value ?? a.value), 1)
        ])
      ], 2),
      e.entry.settings.vacation_active ? (I(), $("p", Jc, [
        K(ie, { name: "sun" }),
        h[3] || (h[3] = J("Urlaubsprofil aktiv · ersetzt den Wochen- und Feiertagsplan.", -1))
      ])) : ae("", !0),
      d("div", Yc, [
        d("section", Qc, [
          d("div", Xc, [
            h[4] || (h[4] = J("Vorlauf", -1)),
            K(ie, { name: "thermo" })
          ]),
          d("strong", null, [
            J(H(l(e.entry.flow)), 1),
            e.entry.flow?.value != null && !e.entry.flow.stale ? (I(), $("small", ef, H(e.entry.flow.unit), 1)) : ae("", !0)
          ]),
          d("span", tf, H(e.entry.flow?.stale ? "Messwert veraltet" : e.entry.flow?.name || "Nicht konfiguriert"), 1)
        ]),
        d("section", nf, [
          d("div", sf, [
            h[5] || (h[5] = J("Warmwasserpuffer", -1)),
            K(ie, { name: "drop" })
          ]),
          d("strong", null, [
            J(H(l(e.entry.buffer)), 1),
            e.entry.buffer?.value != null && !e.entry.buffer.stale ? (I(), $("small", rf, H(e.entry.buffer.unit), 1)) : ae("", !0)
          ]),
          d("span", lf, H(e.entry.buffer?.stale ? "Messwert veraltet" : e.entry.buffer?.name || "Nicht konfiguriert"), 1)
        ]),
        d("section", of, [
          d("div", af, [
            h[6] || (h[6] = J("Startkontingent", -1)),
            K(ie, { name: "pump" })
          ]),
          d("strong", null, [
            J(H(e.entry.remaining_starts), 1),
            d("small", null, "/ " + H(e.entry.max_starts), 1)
          ]),
          h[7] || (h[7] = d("span", { class: "metric-foot" }, "Starts noch verfügbar", -1))
        ]),
        d("section", uf, [
          d("div", cf, [
            h[8] || (h[8] = J("Laufzeit pro Start", -1)),
            K(ie, { name: "clock" })
          ]),
          d("strong", null, [
            J(H(Se(r).format(e.entry.runtime_seconds / 60)), 1),
            h[9] || (h[9] = d("small", null, "min", -1))
          ]),
          h[10] || (h[10] = d("span", { class: "metric-foot" }, "Innerhalb deiner Freigaben", -1))
        ])
      ]),
      e.entry.heatmap ? (I(), At(Nc, {
        key: 1,
        data: e.entry.heatmap
      }, null, 8, ["data"])) : ae("", !0),
      d("div", ff, [
        d("section", df, [
          d("div", hf, [
            d("h3", null, H(e.entry.enabled ? "Als Nächstes geplant" : "Deine Planungsvorschau"), 1),
            K(Se(ds), {
              class: "text-button",
              to: "/settings"
            }, {
              default: xn(() => [
                h[11] || (h[11] = J("Zeitplan bearbeiten ", -1)),
                K(ie, { name: "arrow" })
              ]),
              _: 1
            })
          ]),
          d("p", pf, H(e.entry.enabled ? "Ausführung bei gültigen Live-Werten und freigegebener Steuerung." : "Auch im Monitoring sichtbar · ohne automatische Starts."), 1),
          c.value.length ? (I(), $("div", gf, [
            (I(!0), $(Y, null, Ee(c.value, (E, x) => (I(), $("div", {
              key: E.at,
              class: Ke(["timeline-item", { next: x === 0 }])
            }, [
              h[12] || (h[12] = d("i", { class: "timeline-point" }, null, -1)),
              d("strong", null, H(p(E.at)), 1),
              h[13] || (h[13] = d("span", null, "Vorwärmen", -1))
            ], 2))), 128))
          ])) : (I(), $("p", mf, "Noch kein freigegebener Musterstart mit ausreichender Messbasis."))
        ]),
        d("section", yf, [
          d("div", bf, [
            h[15] || (h[15] = d("h3", null, "Ein System, das dazulernt.", -1)),
            d("button", {
              class: "text-button",
              onClick: h[0] || (h[0] = (E) => n.value = !0)
            }, [
              h[14] || (h[14] = J("Lernbasis ansehen ", -1)),
              K(ie, { name: "arrow" })
            ])
          ]),
          d("div", vf, [
            d("strong", null, [
              J(H(e.entry.heatmap?.observed_dates ?? 0) + " ", 1),
              h[16] || (h[16] = d("small", null, "Tage beobachtet", -1))
            ]),
            d("span", _f, H(e.entry.learning_ready ? "Lernbasis ausreichend" : "Messdaten werden gesammelt"), 1)
          ]),
          d("p", null, H(e.entry.sample_size) + " erkannte Ereignisse · Erkennungsschwelle " + H(Se(r).format(e.entry.threshold)) + " °C/min", 1),
          d("p", wf, "Feiertagskalender: " + H(e.entry.country ? [e.entry.country, e.entry.subdivision].filter(Boolean).join(" · ") : "Nicht konfiguriert"), 1)
        ])
      ]),
      n.value ? (I(), At(Uc, {
        key: 2,
        entry: e.entry,
        "import-history": e.importHistory,
        onClose: h[1] || (h[1] = (E) => n.value = !1)
      }, null, 8, ["entry", "import-history"])) : ae("", !0)
    ]));
  }
}), Sf = {
  class: "page",
  id: "overview"
}, Af = {
  key: 0,
  class: "error",
  role: "alert"
}, xf = {
  key: 1,
  class: "surface empty",
  role: "status"
}, Cf = {
  key: 0,
  class: "surface empty"
}, Rf = /* @__PURE__ */ Be({
  __name: "DashboardView",
  props: {
    state: {},
    importHistory: {}
  },
  emits: ["refresh"],
  setup(e) {
    return (t, n) => (I(), $("main", Sf, [
      n[1] || (n[1] = d("h1", { class: "visually-hidden" }, "Übersicht", -1)),
      n[2] || (n[2] = d("section", { class: "intro" }, [
        d("div", null, [
          d("span", { class: "eyebrow" }, "WARMWASSER ZU HAUSE"),
          d("h2", null, "Dein Warmwasser im Blick."),
          d("p", { class: "subtext" }, "Dein Alltag als Taktgeber. Dein System lernt mit.")
        ])
      ], -1)),
      e.state.error ? (I(), $("div", Af, [
        J(H(e.state.error) + " ", 1),
        d("button", {
          class: "secondary-button",
          onClick: n[0] || (n[0] = (s) => t.$emit("refresh"))
        }, "Erneut versuchen")
      ])) : e.state.loading && !e.state.entries.length ? (I(), $("p", xf, "Die Betriebsdaten werden aus Home Assistant geladen …")) : (I(), $(Y, { key: 2 }, [
        e.state.entries.length ? ae("", !0) : (I(), $("p", Cf, "Keine geladene Warmwasser-Zirkulation gefunden. Die Integration unter „Geräte & Dienste“ einrichten.")),
        (I(!0), $(Y, null, Ee(e.state.entries, (s) => (I(), At(Ef, {
          key: s.entry_id,
          entry: s,
          "import-history": e.importHistory
        }, null, 8, ["entry", "import-history"]))), 128))
      ], 64))
    ]));
  }
}), Mf = {
  class: "control-settings settings-layout",
  "aria-label": "Zirkulation konfigurieren"
}, Tf = {
  class: "settings-nav",
  "aria-label": "Einstellungsbereiche"
}, kf = ["aria-current", "onClick"], Of = ["disabled"], Pf = { class: "section-heading" }, Nf = { class: "schedule-actions" }, If = ["data-day"], Df = ["aria-expanded", "onClick"], Vf = { class: "day-name" }, Lf = { class: "day-chips" }, $f = {
  key: 0,
  class: "time-chip blocked-day"
}, Ff = {
  key: 0,
  class: "day-editor"
}, Hf = { class: "time-windows" }, Bf = ["onUpdate:modelValue", "aria-label"], Uf = ["onUpdate:modelValue", "aria-label"], jf = ["aria-label", "onClick"], Kf = ["disabled", "aria-label", "onClick"], Gf = ["disabled"], Wf = { class: "section-heading" }, zf = { class: "mode-grid" }, Zf = ["aria-pressed", "onClick"], qf = ["disabled"], Jf = { class: "section-heading" }, Yf = { class: "setting-row" }, Qf = ["aria-checked"], Xf = {
  class: "vacation-fields",
  "data-day": "vacation"
}, ed = { class: "time-windows" }, td = ["onUpdate:modelValue", "aria-label"], nd = ["onUpdate:modelValue", "aria-label"], sd = ["aria-label", "onClick"], id = ["disabled"], rd = {
  key: 0,
  class: "subtle"
}, ld = ["disabled"], od = { class: "section-heading" }, ad = { class: "field-grid" }, ud = { class: "field" }, cd = ["max"], fd = { class: "field" }, dd = ["max"], hd = { class: "surface settings-card" }, pd = { class: "section-heading" }, gd = { class: "device-list" }, md = {
  class: "secondary-button native-config-link",
  href: "/config/integrations/integration/warmwasser_zirkulation",
  title: "Das Zahnrad am gewünschten Eintrag öffnet die native Konfiguration"
}, yd = { class: "settings-info" }, bd = { class: "surface settings-card" }, vd = { class: "section-heading" }, _d = { class: "device-list" }, wd = {
  key: 0,
  class: "error"
}, Ed = {
  key: 1,
  class: "error",
  role: "alert"
}, Sd = {
  key: 2,
  class: "error",
  role: "alert"
}, Ad = {
  key: 3,
  class: "success-message",
  role: "status"
}, xd = { class: "save-bar" }, Cd = { class: "button-group" }, Rd = ["disabled"], Md = ["disabled"], Td = /* @__PURE__ */ Be({
  __name: "ControlSettings",
  props: {
    entry: {},
    saveSettings: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const t = e, n = (Z) => JSON.parse(JSON.stringify(Z)), s = /* @__PURE__ */ ce(n(t.entry.settings)), i = /* @__PURE__ */ ce(String(t.entry.runtime_seconds / 60)), r = /* @__PURE__ */ ce(t.entry.max_starts), l = /* @__PURE__ */ ce(t.entry.settings_revision), o = /* @__PURE__ */ ce(!1), a = /* @__PURE__ */ ce(!1), f = /* @__PURE__ */ ce(""), c = /* @__PURE__ */ ce(""), p = /* @__PURE__ */ ce("schedule"), m = /* @__PURE__ */ ce("mon"), h = ge(() => l.value !== t.entry.settings_revision), E = ge(() => (t.entry.runtime_max_seconds ?? 86400) / 60), x = [["mon", "Montag"], ["tue", "Dienstag"], ["wed", "Mittwoch"], ["thu", "Donnerstag"], ["fri", "Freitag"], ["sat", "Samstag"], ["sun_holiday", "Sonn-/Feiertage"]];
    os(() => t.entry.settings_revision, () => {
      !o.value && !a.value && k();
    });
    function k() {
      s.value = n(t.entry.settings), l.value = t.entry.settings_revision, i.value = String(t.entry.runtime_seconds / 60), r.value = t.entry.max_starts, o.value = !1, f.value = "", c.value = "";
    }
    function N() {
      o.value = !0, f.value = "", c.value = "";
    }
    function v(Z) {
      Z.length < 12 && (Z.push({ start: "06:00", end: "08:00" }), N());
    }
    function M(Z, b) {
      Z.splice(b, 1), N();
    }
    function R() {
      for (const Z of ["tue", "wed", "thu", "fri"]) s.value.schedule[Z] = s.value.schedule.mon.map((b) => ({ ...b }));
      N();
    }
    async function W() {
      if (a.value || h.value || t.disabled) return;
      const Z = Number(i.value), b = Number(r.value);
      if (!Number.isFinite(Z) || Z < 1 / 60 || Z > E.value || !Number.isInteger(b) || b < 1 || b > (t.entry.max_daily_starts ?? 100)) {
        p.value = "operation", c.value = "Laufzeit und Tageslimit prüfen. Die Laufzeit muss mindestens eine Sekunde betragen und innerhalb der angegebenen Grenzen liegen.";
        return;
      }
      a.value = !0, c.value = "", f.value = "";
      try {
        if (!t.saveSettings) throw new Error("unavailable");
        await t.saveSettings(t.entry.entry_id, { ...n(s.value), runtime_seconds: Math.round(Z * 60), max_starts: b }, l.value), o.value = !1, k(), f.value = "Konfiguration gespeichert.";
      } catch (L) {
        const q = L?.code;
        c.value = q === "invalid_settings" ? "Zeitfenster prüfen: gültige Uhrzeiten, von vor bis und keine Überschneidungen. Auch Laufzeit und Tageslimit müssen innerhalb ihrer Grenzen liegen." : q === "settings_conflict" ? "Die Konfiguration wurde inzwischen geändert. Gespeicherten Stand neu laden." : "Speichern oder Bestätigung fehlgeschlagen. Verbindung und Administratorrechte prüfen. Die Eingaben bleiben erhalten.";
      } finally {
        a.value = !1;
      }
    }
    return (Z, b) => (I(), $("section", Mf, [
      d("aside", Tf, [
        (I(), $(Y, null, Ee([{ key: "schedule", label: "Freigabezeiten", icon: "calendar" }, { key: "operation", label: "Betrieb & Urlaub", icon: "sliders" }, { key: "devices", label: "Sensoren & Region", icon: "link" }], (L) => d("button", {
          key: L.key,
          type: "button",
          class: Ke({ active: p.value === L.key }),
          "aria-current": p.value === L.key ? "page" : void 0,
          onClick: (q) => p.value = L.key
        }, [
          K(ie, {
            name: L.icon
          }, null, 8, ["name"]),
          J(H(L.label), 1)
        ], 10, kf)), 64)),
        b[4] || (b[4] = d("p", { class: "nav-description" }, "Freigaben erlauben gezielte Starts. Die Pumpe läuft innerhalb dieser Zeiten nicht dauerhaft.", -1))
      ]),
      d("form", {
        class: "settings-content",
        novalidate: "",
        onSubmit: yl(W, ["prevent"]),
        onInput: N,
        onChange: N
      }, [
        Me(d("fieldset", {
          class: "settings-card surface",
          disabled: a.value || e.disabled
        }, [
          b[12] || (b[12] = d("legend", { class: "visually-hidden" }, "Wochenplan", -1)),
          d("div", Pf, [
            K(ie, { name: "calendar" }),
            b[5] || (b[5] = d("h3", null, "Deine Freigabezeiten", -1))
          ]),
          b[13] || (b[13] = d("p", { class: "settings-description" }, "Lege fest, wann automatisch zirkuliert werden darf. Mehrere Zeiträume pro Tag sind möglich – etwa morgens und abends. Es gilt die Home-Assistant-Zeitzone.", -1)),
          d("div", Nf, [
            b[7] || (b[7] = d("span", null, "WOCHENPLAN", -1)),
            d("button", {
              type: "button",
              class: "text-button",
              onClick: R
            }, [
              b[6] || (b[6] = J("Montag auf Di–Fr übertragen ", -1)),
              K(ie, { name: "arrow" })
            ])
          ]),
          (I(), $(Y, null, Ee(x, ([L, q]) => d("section", {
            key: L,
            class: Ke(["schedule-day day", { open: m.value === L }]),
            "data-day": L
          }, [
            d("button", {
              class: "day-head",
              type: "button",
              "aria-expanded": m.value === L,
              onClick: (X) => m.value = m.value === L ? "" : L
            }, [
              d("span", Vf, H(q), 1),
              d("span", Lf, [
                (I(!0), $(Y, null, Ee(s.value.schedule[L], (X, he) => (I(), $("span", {
                  key: he,
                  class: "time-chip"
                }, H(X.start) + " – " + H(X.end), 1))), 128)),
                s.value.schedule[L].length ? ae("", !0) : (I(), $("span", $f, "Keine Freigabe"))
              ]),
              K(ie, { name: "chevron" })
            ], 8, Df),
            m.value === L ? (I(), $("div", Ff, [
              d("ul", Hf, [
                (I(!0), $(Y, null, Ee(s.value.schedule[L], (X, he) => (I(), $("li", {
                  key: he,
                  class: "time-line"
                }, [
                  d("label", null, [
                    b[8] || (b[8] = J("Von ", -1)),
                    Me(d("input", {
                      "onUpdate:modelValue": (De) => X.start = De,
                      type: "time",
                      required: "",
                      "aria-label": `${q} Abschnitt ${he + 1} von`
                    }, null, 8, Bf), [
                      [zt, X.start]
                    ])
                  ]),
                  b[10] || (b[10] = d("span", { class: "dash" }, "—", -1)),
                  d("label", null, [
                    b[9] || (b[9] = J("Bis ", -1)),
                    Me(d("input", {
                      "onUpdate:modelValue": (De) => X.end = De,
                      type: "text",
                      inputmode: "numeric",
                      pattern: "([01][0-9]|2[0-3]):[0-5][0-9]|24:00",
                      placeholder: "HH:MM",
                      required: "",
                      "aria-label": `${q} Abschnitt ${he + 1} bis`
                    }, null, 8, Uf), [
                      [zt, X.end]
                    ])
                  ]),
                  d("button", {
                    class: "icon-button",
                    type: "button",
                    "aria-label": `${q} Abschnitt ${he + 1} entfernen`,
                    onClick: (De) => M(s.value.schedule[L], he)
                  }, [
                    K(ie, { name: "trash" })
                  ], 8, jf)
                ]))), 128))
              ]),
              d("button", {
                class: "add-window",
                type: "button",
                disabled: s.value.schedule[L].length >= 12,
                "aria-label": `${q} Zeitraum hinzufügen`,
                onClick: (X) => v(s.value.schedule[L])
              }, [
                K(ie, { name: "plus" }),
                b[11] || (b[11] = J("Zeitraum hinzufügen", -1))
              ], 8, Kf)
            ])) : ae("", !0)
          ], 10, If)), 64)),
          b[14] || (b[14] = d("p", { class: "settings-info" }, "Sonn- und Feiertage verwenden dieselben Zeitfenster. Maximal zwölf Abschnitte pro Tag, Ende bis 24:00. Ein kompletter Lauf muss in einen Abschnitt passen.", -1))
        ], 8, Of), [
          [hn, p.value === "schedule"]
        ]),
        Me(d("div", null, [
          d("fieldset", {
            class: "surface settings-card",
            disabled: a.value || e.disabled
          }, [
            b[17] || (b[17] = d("legend", { class: "visually-hidden" }, "Betriebsart", -1)),
            d("div", Wf, [
              K(ie, { name: "sliders" }),
              b[15] || (b[15] = d("h3", null, "Betriebsart", -1))
            ]),
            b[18] || (b[18] = d("p", { class: "settings-description" }, "Du entscheidest, ob dein System beobachtet oder die Zirkulation übernimmt.", -1)),
            d("div", zf, [
              (I(), $(Y, null, Ee([{ key: "monitoring", label: "Nur Monitoring", icon: "eye", description: "Beobachten und lernen. Die Planung bleibt sichtbar, automatische Starts sind aus." }, { key: "active", label: "Automatische Steuerung", icon: "play", description: "Bei Bedarf und vor gelernten Entnahmezeiten vorwärmen – innerhalb deiner Freigaben." }], (L) => d("button", {
                key: L.key,
                type: "button",
                class: Ke(["mode-option", { selected: s.value.mode === L.key }]),
                "aria-pressed": s.value.mode === L.key,
                onClick: (q) => {
                  s.value.mode = L.key, N();
                }
              }, [
                b[16] || (b[16] = d("span", { class: "radio-circle" }, null, -1)),
                K(ie, {
                  name: L.icon
                }, null, 8, ["name"]),
                d("strong", null, H(L.label), 1),
                d("p", null, H(L.description), 1)
              ], 10, Zf)), 64))
            ]),
            b[19] || (b[19] = d("p", { class: "settings-info" }, "Beim Wechsel ins Monitoring wird ein von dieser Integration gestarteter Lauf beendet.", -1))
          ], 8, Gf),
          d("fieldset", {
            class: "surface settings-card",
            disabled: a.value || e.disabled
          }, [
            b[27] || (b[27] = d("legend", { class: "visually-hidden" }, "Urlaubsprofil", -1)),
            d("div", Jf, [
              K(ie, { name: "sun" }),
              b[20] || (b[20] = d("h3", null, "Urlaubsprofil", -1))
            ]),
            b[28] || (b[28] = d("p", { class: "settings-description" }, "Ein eigener Tagesrhythmus für die Zeit zu Hause – oder keine Freigabe, wenn du unterwegs bist.", -1)),
            d("div", Yf, [
              b[21] || (b[21] = d("div", null, [
                d("strong", null, "Urlaubsprofil verwenden"),
                d("p", null, "Ersetzt den gesamten Wochen- und Feiertagsplan, bis du es wieder ausschaltest.")
              ], -1)),
              d("button", {
                class: "switch",
                type: "button",
                role: "switch",
                "aria-checked": s.value.vacation_active,
                "aria-label": "Urlaubsprofil aktivieren",
                onClick: b[0] || (b[0] = (L) => {
                  s.value.vacation_active = !s.value.vacation_active, N();
                })
              }, null, 8, Qf)
            ]),
            Me(d("div", Xf, [
              b[26] || (b[26] = d("p", { class: "subtle" }, "Diese Freigaben gelten an jedem Urlaubstag.", -1)),
              d("ul", ed, [
                (I(!0), $(Y, null, Ee(s.value.vacation_windows, (L, q) => (I(), $("li", {
                  key: q,
                  class: "time-line"
                }, [
                  d("label", null, [
                    b[22] || (b[22] = J("Von ", -1)),
                    Me(d("input", {
                      "onUpdate:modelValue": (X) => L.start = X,
                      type: "time",
                      "aria-label": `Urlaub Abschnitt ${q + 1} von`
                    }, null, 8, td), [
                      [zt, L.start]
                    ])
                  ]),
                  b[24] || (b[24] = d("span", { class: "dash" }, "—", -1)),
                  d("label", null, [
                    b[23] || (b[23] = J("Bis ", -1)),
                    Me(d("input", {
                      "onUpdate:modelValue": (X) => L.end = X,
                      type: "text",
                      inputmode: "numeric",
                      placeholder: "HH:MM",
                      "aria-label": `Urlaub Abschnitt ${q + 1} bis`
                    }, null, 8, nd), [
                      [zt, L.end]
                    ])
                  ]),
                  d("button", {
                    class: "icon-button",
                    type: "button",
                    "aria-label": `Urlaub Abschnitt ${q + 1} entfernen`,
                    onClick: (X) => M(s.value.vacation_windows, q)
                  }, [
                    K(ie, { name: "trash" })
                  ], 8, sd)
                ]))), 128))
              ]),
              d("button", {
                class: "add-window",
                type: "button",
                disabled: s.value.vacation_windows.length >= 12,
                "aria-label": "Urlaub Zeitraum hinzufügen",
                onClick: b[1] || (b[1] = (L) => v(s.value.vacation_windows))
              }, [
                K(ie, { name: "plus" }),
                b[25] || (b[25] = J("Zeitraum hinzufügen", -1))
              ], 8, id),
              s.value.vacation_windows.length ? ae("", !0) : (I(), $("p", rd, "Keine Zeiträume: automatische Starts sind im Urlaub gesperrt."))
            ], 512), [
              [hn, s.value.vacation_active]
            ])
          ], 8, qf),
          d("fieldset", {
            class: "surface settings-card",
            disabled: a.value || e.disabled
          }, [
            b[32] || (b[32] = d("legend", { class: "visually-hidden" }, "Grenzen für die Automatik", -1)),
            d("div", od, [
              K(ie, { name: "clock" }),
              b[29] || (b[29] = d("h3", null, "Grenzen für die Automatik", -1))
            ]),
            b[33] || (b[33] = d("p", { class: "settings-description" }, "Wähle deine Pumpenlaufzeit frei in Minuten. Dezimalwerte sind möglich; gespeichert wird sekundengenau.", -1)),
            d("div", ad, [
              d("label", ud, [
                b[30] || (b[30] = d("span", null, "Laufzeit pro Start · Minuten", -1)),
                Me(d("input", {
                  "onUpdate:modelValue": b[2] || (b[2] = (L) => i.value = L),
                  type: "number",
                  min: 1 / 60,
                  max: E.value,
                  step: "any",
                  inputmode: "decimal",
                  "aria-label": "Pumpenlaufzeit in Minuten"
                }, null, 8, cd), [
                  [zt, i.value]
                ]),
                d("small", null, "1 Sekunde bis " + H(E.value.toLocaleString("de-DE")) + " Minuten", 1)
              ]),
              d("label", fd, [
                b[31] || (b[31] = d("span", null, "Maximale Starts pro Tag", -1)),
                Me(d("input", {
                  "onUpdate:modelValue": b[3] || (b[3] = (L) => r.value = L),
                  type: "number",
                  min: "1",
                  max: e.entry.max_daily_starts ?? 100,
                  step: "1",
                  "aria-label": "Maximale Starts pro Tag"
                }, null, 8, dd), [
                  [zt, r.value]
                ])
              ])
            ]),
            b[34] || (b[34] = d("p", { class: "settings-info" }, "Änderungen gelten für künftige Starts. Ein laufender Pumpenlauf behält seine bestätigte Endzeit.", -1))
          ], 8, ld)
        ], 512), [
          [hn, p.value === "operation"]
        ]),
        Me(d("div", null, [
          d("section", hd, [
            d("div", pd, [
              K(ie, { name: "link" }),
              b[35] || (b[35] = d("h3", null, "Deine Geräte", -1))
            ]),
            b[40] || (b[40] = d("p", { class: "settings-description" }, "Sensoren und Pumpenschalter werden mit Home Assistants durchsuchbarer Geräteauswahl eingerichtet.", -1)),
            d("dl", gd, [
              d("div", null, [
                b[36] || (b[36] = d("dt", null, "Vorlauftemperatur", -1)),
                d("dd", null, H(e.entry.flow?.name || "Nicht konfiguriert"), 1)
              ]),
              d("div", null, [
                b[37] || (b[37] = d("dt", null, "Warmwasserpuffer", -1)),
                d("dd", null, H(e.entry.buffer?.name || "Nicht konfiguriert"), 1)
              ]),
              d("div", null, [
                b[38] || (b[38] = d("dt", null, "Zirkulationspumpe", -1)),
                d("dd", null, H(e.entry.pump.entity_id), 1)
              ])
            ]),
            d("a", md, [
              b[39] || (b[39] = J("Geräte in Home Assistant auswählen ", -1)),
              K(ie, { name: "arrow" })
            ]),
            d("p", yd, "Über das Zahnrad am Eintrag „" + H(e.entry.title) + "“ die Konfiguration öffnen.", 1)
          ]),
          d("section", bd, [
            d("div", vd, [
              K(ie, { name: "calendar" }),
              b[41] || (b[41] = d("h3", null, "Feiertage & Region", -1))
            ]),
            b[43] || (b[43] = d("p", { class: "settings-description" }, "An gesetzlichen Feiertagen gilt derselbe Plan wie an Sonntagen.", -1)),
            d("dl", _d, [
              d("div", null, [
                b[42] || (b[42] = d("dt", null, "Land / Region", -1)),
                d("dd", null, H(e.entry.country ? [e.entry.country, e.entry.subdivision].filter(Boolean).join(" · ") : "Nicht konfiguriert"), 1)
              ])
            ]),
            b[44] || (b[44] = d("p", { class: "settings-info" }, "Land und Bundesland/Region sind in derselben HA-Konfiguration änderbar.", -1))
          ])
        ], 512), [
          [hn, p.value === "devices"]
        ]),
        e.entry.reason === "pump_unreachable" ? (I(), $("p", wd, "Pumpenfehler: Gerät und Erreichbarkeit prüfen. Erneutes Speichern quittiert den Fehler und gibt die gewählte Betriebsart wieder frei.")) : ae("", !0),
        h.value ? (I(), $("p", Ed, "Die Konfiguration wurde inzwischen geändert. Deine Eingaben wurden erhalten. Vor weiteren Änderungen den gespeicherten Stand neu laden.")) : ae("", !0),
        c.value ? (I(), $("p", Sd, H(c.value), 1)) : ae("", !0),
        f.value ? (I(), $("p", Ad, H(f.value), 1)) : ae("", !0),
        d("div", xd, [
          d("span", {
            class: Ke(["save-caption", { dirty: o.value }])
          }, [
            b[45] || (b[45] = d("i", { class: "status-dot" }, null, -1)),
            J(H(o.value ? "Ungespeicherte Änderungen" : "Alle Änderungen gespeichert"), 1)
          ], 2),
          d("div", Cd, [
            d("button", {
              class: "secondary-button",
              type: "button",
              disabled: a.value,
              onClick: k
            }, "Gespeicherten Stand neu laden", 8, Rd),
            d("button", {
              class: "primary-button",
              type: "submit",
              disabled: a.value || e.disabled || h.value || !o.value && e.entry.reason !== "pump_unreachable"
            }, [
              K(ie, { name: "check" }),
              J(H(a.value ? "Wird gespeichert …" : "Änderungen speichern"), 1)
            ], 8, Md)
          ])
        ]),
        b[46] || (b[46] = d("p", { class: "settings-info" }, "Automatische Starts benötigen frische Messwerte, eine bestätigte Pumpe und ausreichend Freigabezeit.", -1))
      ], 32)
    ]));
  }
}), kd = {
  class: "page",
  id: "settings"
}, Od = { class: "intro" }, Pd = {
  key: 0,
  class: "field"
}, Nd = ["value"], Id = {
  key: 0,
  class: "error",
  role: "alert"
}, Dd = {
  key: 1,
  class: "surface empty",
  role: "status"
}, Vd = /* @__PURE__ */ Be({
  __name: "SettingsView",
  props: {
    state: {},
    saveSettings: {}
  },
  emits: ["refresh"],
  setup(e) {
    const t = e, n = /* @__PURE__ */ ce(t.state.entries[0]?.entry_id ?? "");
    return os(() => t.state.entries.map((s) => s.entry_id), (s) => {
      s.includes(n.value) || (n.value = s[0] ?? "");
    }), (s, i) => (I(), $("main", kd, [
      i[4] || (i[4] = d("h1", { class: "visually-hidden" }, "Einstellungen", -1)),
      d("section", Od, [
        i[3] || (i[3] = d("div", null, [
          d("span", { class: "eyebrow" }, "DEIN SYSTEM. DEINE EINSTELLUNGEN."),
          d("h2", null, "So passt es zu deinem Alltag."),
          d("p", { class: "subtext" }, "Freigaben, Betriebsart und Geräte an einem Ort.")
        ], -1)),
        e.state.entries.length > 1 ? (I(), $("label", Pd, [
          i[2] || (i[2] = J("System", -1)),
          Me(d("select", {
            "onUpdate:modelValue": i[0] || (i[0] = (r) => n.value = r)
          }, [
            (I(!0), $(Y, null, Ee(e.state.entries, (r) => (I(), $("option", {
              key: r.entry_id,
              value: r.entry_id
            }, H(r.title), 9, Nd))), 128))
          ], 512), [
            [Fa, n.value]
          ])
        ])) : ae("", !0)
      ]),
      e.state.error ? (I(), $("div", Id, [
        J(H(e.state.error) + " Deine Eingaben bleiben erhalten. ", 1),
        d("button", {
          class: "secondary-button",
          onClick: i[1] || (i[1] = (r) => s.$emit("refresh"))
        }, "Erneut versuchen")
      ])) : ae("", !0),
      e.state.entries.length ? ae("", !0) : (I(), $("p", Dd, H(e.state.loading ? "Konfiguration wird geladen …" : "Kein geladenes System verfügbar."), 1)),
      (I(!0), $(Y, null, Ee(e.state.entries, (r) => Me((I(), At(Td, {
        key: r.entry_id,
        entry: r,
        "save-settings": e.saveSettings,
        disabled: !!e.state.error
      }, null, 8, ["entry", "save-settings", "disabled"])), [
        [hn, r.entry_id === n.value]
      ])), 128))
    ]));
  }
}), Ld = [
  { path: "/", name: "dashboard", component: Rf },
  { path: "/settings", name: "settings", component: Vd },
  { path: "/:pathMatch(.*)*", redirect: { name: "dashboard" } }
];
function $d() {
  return qu({ history: Tu(), routes: Ld });
}
class Fd extends HTMLElement {
  constructor() {
    super(...arguments), this.app = null, this.#e = gc(), this.#t = null;
  }
  #e;
  #t;
  set hass(t) {
    this.#e.setHass(t);
  }
  connectedCallback() {
    if (this.app) return;
    const t = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    t.replaceChildren();
    const n = document.createElement("link");
    n.rel = "stylesheet", n.href = "/warmwasser-zirkulation-static/panel.css";
    const s = document.createElement("div");
    s.className = "panel-root", t.append(n, s), this.#t = mc(s, () => {
      this.dispatchEvent(new CustomEvent("hass-toggle-menu", { detail: { open: !0 }, bubbles: !0, composed: !0 }));
    });
    const i = $d();
    i.afterEach(() => {
      const r = s.querySelector(".panel-viewport");
      r && (r.scrollTop = 0);
    }), this.app = Ga(hc, {
      state: this.#e.state,
      saveSettings: this.#e.configure,
      importHistory: this.#e.importHistory,
      onRefresh: () => void this.#e.refresh()
    }), this.app.use(i), this.app.mount(s), i.replace({ name: "dashboard" }), this.#e.connect();
  }
  disconnectedCallback() {
    this.#t?.(), this.#t = null, this.#e.disconnect(), this.app?.unmount(), this.app = null;
  }
  refresh() {
    return this.#e.refresh();
  }
  configure(t, n, s) {
    return this.#e.configure(t, n, s);
  }
  importHistory(t) {
    return this.#e.importHistory(t);
  }
}
customElements.get("warmwasser-panel") || customElements.define("warmwasser-panel", Fd);
export {
  Fd as WarmwasserPanel
};
