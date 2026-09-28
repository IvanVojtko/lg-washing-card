/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis, I = O.ShadowRoot && (O.ShadyCSS === void 0 || O.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, z = Symbol(), F = /* @__PURE__ */ new WeakMap();
let ne = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== z) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (I && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = F.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && F.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const pe = (s) => new ne(typeof s == "string" ? s : s + "", void 0, z), ue = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((r, i, o) => r + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + s[o + 1], s[0]);
  return new ne(t, s, z);
}, fe = (s, e) => {
  if (I) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), i = O.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, s.appendChild(r);
  }
}, G = I ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return pe(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: me, defineProperty: _e, getOwnPropertyDescriptor: $e, getOwnPropertyNames: ge, getOwnPropertySymbols: ve, getPrototypeOf: ye } = Object, N = globalThis, Z = N.trustedTypes, be = Z ? Z.emptyScript : "", we = N.reactiveElementPolyfillSupport, x = (s, e) => s, R = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? be : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let t = s;
  switch (e) {
    case Boolean:
      t = s !== null;
      break;
    case Number:
      t = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(s);
      } catch {
        t = null;
      }
  }
  return t;
} }, L = (s, e) => !me(s, e), J = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: L };
Symbol.metadata ??= Symbol("metadata"), N.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let y = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = J) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(e, r, t);
      i !== void 0 && _e(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: i, set: o } = $e(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: i, set(n) {
      const l = i?.call(this);
      o?.call(this, n), this.requestUpdate(e, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? J;
  }
  static _$Ei() {
    if (this.hasOwnProperty(x("elementProperties"))) return;
    const e = ye(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(x("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(x("properties"))) {
      const t = this.properties, r = [...ge(t), ...ve(t)];
      for (const i of r) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, i] of t) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const i = this._$Eu(t, r);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const i of r) t.unshift(G(i));
    } else e !== void 0 && t.push(G(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return fe(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    const r = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, r);
    if (i !== void 0 && r.reflect === !0) {
      const o = (r.converter?.toAttribute !== void 0 ? r.converter : R).toAttribute(t, r.type);
      this._$Em = e, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, i = r._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const o = r.getPropertyOptions(i), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : R;
      this._$Em = i;
      const l = n.fromAttribute(t, o.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, i = !1, o) {
    if (e !== void 0) {
      const n = this.constructor;
      if (i === !1 && (o = this[e]), r ??= n.getPropertyOptions(e), !((r.hasChanged ?? L)(o, t) || r.useDefault && r.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: i, wrapped: o }, n) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [i, o] of this._$Ep) this[i] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [i, o] of r) {
        const { wrapped: n } = o, l = this[i];
        n !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, o, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[x("elementProperties")] = /* @__PURE__ */ new Map(), y[x("finalized")] = /* @__PURE__ */ new Map(), we?.({ ReactiveElement: y }), (N.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, K = (s) => s, U = j.trustedTypes, Y = U ? U.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, ae = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, le = "?" + _, Ae = `<${le}>`, v = document, E = () => v.createComment(""), C = (s) => s === null || typeof s != "object" && typeof s != "function", W = Array.isArray, xe = (s) => W(s) || typeof s?.[Symbol.iterator] == "function", D = `[ 	
\f\r]`, A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, X = /-->/g, Q = />/g, $ = RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ee = /'/g, te = /"/g, ce = /^(?:script|style|textarea|title)$/i, Se = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), p = Se(1), b = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), se = /* @__PURE__ */ new WeakMap(), g = v.createTreeWalker(v, 129);
function he(s, e) {
  if (!W(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Y !== void 0 ? Y.createHTML(e) : e;
}
const Ee = (s, e) => {
  const t = s.length - 1, r = [];
  let i, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = A;
  for (let l = 0; l < t; l++) {
    const a = s[l];
    let d, u, h = -1, f = 0;
    for (; f < a.length && (n.lastIndex = f, u = n.exec(a), u !== null); ) f = n.lastIndex, n === A ? u[1] === "!--" ? n = X : u[1] !== void 0 ? n = Q : u[2] !== void 0 ? (ce.test(u[2]) && (i = RegExp("</" + u[2], "g")), n = $) : u[3] !== void 0 && (n = $) : n === $ ? u[0] === ">" ? (n = i ?? A, h = -1) : u[1] === void 0 ? h = -2 : (h = n.lastIndex - u[2].length, d = u[1], n = u[3] === void 0 ? $ : u[3] === '"' ? te : ee) : n === te || n === ee ? n = $ : n === X || n === Q ? n = A : (n = $, i = void 0);
    const m = n === $ && s[l + 1].startsWith("/>") ? " " : "";
    o += n === A ? a + Ae : h >= 0 ? (r.push(d), a.slice(0, h) + ae + a.slice(h) + _ + m) : a + _ + (h === -2 ? l : m);
  }
  return [he(s, o + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class P {
  constructor({ strings: e, _$litType$: t }, r) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const l = e.length - 1, a = this.parts, [d, u] = Ee(e, t);
    if (this.el = P.createElement(d, r), g.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = g.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(ae)) {
          const f = u[n++], m = i.getAttribute(h).split(_), M = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: o, name: M[2], strings: m, ctor: M[1] === "." ? Pe : M[1] === "?" ? ke : M[1] === "@" ? Te : H }), i.removeAttribute(h);
        } else h.startsWith(_) && (a.push({ type: 6, index: o }), i.removeAttribute(h));
        if (ce.test(i.tagName)) {
          const h = i.textContent.split(_), f = h.length - 1;
          if (f > 0) {
            i.textContent = U ? U.emptyScript : "";
            for (let m = 0; m < f; m++) i.append(h[m], E()), g.nextNode(), a.push({ type: 2, index: ++o });
            i.append(h[f], E());
          }
        }
      } else if (i.nodeType === 8) if (i.data === le) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(_, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += _.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const r = v.createElement("template");
    return r.innerHTML = e, r;
  }
}
function w(s, e, t = s, r) {
  if (e === b) return e;
  let i = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const o = C(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== o && (i?._$AO?.(!1), o === void 0 ? i = void 0 : (i = new o(s), i._$AT(s, t, r)), r !== void 0 ? (t._$Co ??= [])[r] = i : t._$Cl = i), i !== void 0 && (e = w(s, i._$AS(s, e.values), i, r)), e;
}
class Ce {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: r } = this._$AD, i = (e?.creationScope ?? v).importNode(t, !0);
    g.currentNode = i;
    let o = g.nextNode(), n = 0, l = 0, a = r[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let d;
        a.type === 2 ? d = new T(o, o.nextSibling, this, e) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (d = new Me(o, this, e)), this._$AV.push(d), a = r[++l];
      }
      n !== a?.index && (o = g.nextNode(), n++);
    }
    return g.currentNode = v, i;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class T {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, r, i) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = w(this, e, t), C(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== b && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : xe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && C(this._$AH) ? this._$AA.nextSibling.data = e : this.T(v.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = P.createElement(he(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const o = new Ce(i, this), n = o.u(this.options);
      o.p(t), this.T(n), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = se.get(e.strings);
    return t === void 0 && se.set(e.strings, t = new P(e)), t;
  }
  k(e) {
    W(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, i = 0;
    for (const o of e) i === t.length ? t.push(r = new T(this.O(E()), this.O(E()), this, this.options)) : r = t[i], r._$AI(o), i++;
    i < t.length && (this._$AR(r && r._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = K(e).nextSibling;
      K(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class H {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, i, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = o, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = c;
  }
  _$AI(e, t = this, r, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = w(this, e, t, 0), n = !C(e) || e !== this._$AH && e !== b, n && (this._$AH = e);
    else {
      const l = e;
      let a, d;
      for (e = o[0], a = 0; a < o.length - 1; a++) d = w(this, l[r + a], t, a), d === b && (d = this._$AH[a]), n ||= !C(d) || d !== this._$AH[a], d === c ? e = c : e !== c && (e += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    n && !i && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Pe extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class ke extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class Te extends H {
  constructor(e, t, r, i, o) {
    super(e, t, r, i, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = w(this, e, t, 0) ?? c) === b) return;
    const r = this._$AH, i = e === c && r !== c || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, o = e !== c && (r === c || i);
    i && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Me {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    w(this, e);
  }
}
const Oe = j.litHtmlPolyfillSupport;
Oe?.(P, T), (j.litHtmlVersions ??= []).push("3.3.3");
const Re = (s, e, t) => {
  const r = t?.renderBefore ?? e;
  let i = r._$litPart$;
  if (i === void 0) {
    const o = t?.renderBefore ?? null;
    r._$litPart$ = i = new T(e.insertBefore(E(), o), o, void 0, t ?? {});
  }
  return i._$AI(s), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = globalThis;
class S extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Re(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return b;
  }
}
S._$litElement$ = !0, S.finalized = !0, B.litElementHydrateSupport?.({ LitElement: S });
const Ue = B.litElementPolyfillSupport;
Ue?.({ LitElement: S });
(B.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ne = (s) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(s, e);
  }) : customElements.define(s, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: L }, De = (s = He, e, t) => {
  const { kind: r, metadata: i } = t;
  let o = globalThis.litPropertyMetadata.get(i);
  if (o === void 0 && globalThis.litPropertyMetadata.set(i, o = /* @__PURE__ */ new Map()), r === "setter" && ((s = Object.create(s)).wrapped = !0), o.set(t.name, s), r === "accessor") {
    const { name: n } = t;
    return { set(l) {
      const a = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(n, a, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, s, l), l;
    } };
  }
  if (r === "setter") {
    const { name: n } = t;
    return function(l) {
      const a = this[n];
      e.call(this, l), this.requestUpdate(n, a, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function de(s) {
  return (e, t) => typeof t == "object" ? De(s, e, t) : ((r, i, o) => {
    const n = i.hasOwnProperty(o);
    return i.constructor.createProperty(o, r), n ? Object.getOwnPropertyDescriptor(i, o) : void 0;
  })(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ie(s) {
  return de({ ...s, state: !0, attribute: !1 });
}
const ze = {
  // state
  status: "sensor.status",
  course: "sensor.course",
  downloadedCourse: "sensor.downloaded_course",
  temperature: "sensor.temperature",
  spin: "sensor.spin",
  rinse: "sensor.rinse",
  initialTime: "sensor.initial_time",
  remainingTime: "sensor.remaining_time",
  reserveTime: "sensor.reserve_time",
  energy: "sensor.energy",
  cycleCount: "sensor.cycle_count",
  errorMessage: "sensor.error_message",
  error: "binary_sensor.error",
  doorLock: "binary_sensor.door_lock",
  childLock: "binary_sensor.child_lock",
  remoteStart: "binary_sensor.remote_start",
  aiDd: "binary_sensor.ai_dd",
  // the option flags as the appliance reports them
  steam: "binary_sensor.steam",
  preWash: "binary_sensor.pre_wash",
  turbowash: "binary_sensor.turbowash",
  creaseCare: "binary_sensor.crease_care",
  steamSoftener: "binary_sensor.steam_softener",
  medicRinse: "binary_sensor.medic_rinse",
  // controls
  setCourse: "select.set_course",
  setTemperature: "select.set_temperature",
  setSpin: "select.set_spin",
  setRinse: "select.set_rinse",
  setWashLevel: "select.set_wash_level",
  setDelayedEnd: "number.set_delayed_end",
  setSteam: "switch.set_steam",
  setPreWash: "switch.set_pre_wash",
  setTurbowash: "switch.set_turbowash",
  setCreaseCare: "switch.set_crease_care",
  setSteamSoftener: "switch.set_steam_softener",
  setMedicRinse: "switch.set_medic_rinse",
  runProgramme: "button.run_programme",
  pause: "button.pause",
  resume: "button.start",
  // The power switch is published with an empty name, so HA names it after the device alone:
  // `switch.<prefix>` rather than `switch.<prefix>_power`. The empty suffix says so.
  power: "switch."
}, re = [
  "Measuring",
  "Pre-wash",
  "Washing",
  "Rinsing",
  "Spinning",
  "Drying",
  "Cooling",
  "Steam softening",
  "Refreshing"
], Le = (s, e, t) => {
  if (t) return t;
  if (e)
    for (const r of Object.values(s.entities)) {
      if (r.device_id !== e) continue;
      const i = /^sensor\.(.+)_status$/.exec(r.entity_id);
      if (i) return i[1];
    }
}, ie = (s, e) => {
  const [t, r] = ze[e].split(".");
  return r ? `${t}.${s}_${r}` : `${t}.${s}`;
};
class je {
  constructor(e, t) {
    this.hass = e, this.prefix = t;
  }
  entity(e) {
    return this.hass.states[ie(this.prefix, e)];
  }
  id(e) {
    return ie(this.prefix, e);
  }
  /** Raw state, or undefined when the entity is missing or has no usable value. */
  state(e) {
    const t = this.entity(e)?.state;
    if (!(t === void 0 || t === "unknown" || t === "unavailable"))
      return t;
  }
  number(e) {
    const t = this.state(e);
    if (t === void 0) return;
    const r = Number(t);
    return Number.isFinite(r) ? r : void 0;
  }
  on(e) {
    return this.state(e) === "on";
  }
  options(e) {
    return this.entity(e)?.attributes.options ?? [];
  }
  /** True once the appliance has published anything at all. */
  get present() {
    return this.entity("status") !== void 0;
  }
}
const We = (s, e) => {
  s.dispatchEvent(
    new CustomEvent("hass-more-info", {
      detail: { entityId: e },
      bubbles: !0,
      composed: !0
    })
  );
};
var Be = Object.defineProperty, Ve = Object.getOwnPropertyDescriptor, V = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? Ve(e, t) : e, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (i = (r ? n(e, t, i) : n(i)) || i);
  return r && i && Be(e, t, i), i;
};
const q = "lg-washing-card", qe = "0.1.0", oe = [
  { reported: "steam", control: "setSteam", label: "Steam", icon: "M8 2a4 4 0 0 1 0 8 4 4 0 0 0 0 8" },
  { reported: "preWash", control: "setPreWash", label: "Pre-wash", icon: "" },
  { reported: "turbowash", control: "setTurbowash", label: "TurboWash", icon: "" },
  { reported: "creaseCare", control: "setCreaseCare", label: "Crease care", icon: "" },
  { reported: "steamSoftener", control: "setSteamSoftener", label: "Steam softener", icon: "" },
  { reported: "medicRinse", control: "setMedicRinse", label: "Medic rinse", icon: "" }
], Fe = [
  { key: "setCourse", label: "Course" },
  { key: "setTemperature", label: "Temperature" },
  { key: "setSpin", label: "Spin" },
  { key: "setRinse", label: "Rinse" },
  { key: "setWashLevel", label: "Wash level" }
], Ge = (s) => {
  if (s === void 0) return "—";
  const e = Math.floor(s / 60), t = s % 60;
  return e ? `${e}:${String(t).padStart(2, "0")}` : `${t} min`;
};
let k = class extends S {
  setConfig(s) {
    const e = s;
    if (!e.device_id && !e.prefix)
      throw new Error("Pick the washing machine, or set `prefix` to its entity slug");
    this._config = { show_controls: !0, ...e };
  }
  getCardSize() {
    return this._config?.show_controls === !1 ? 4 : 9;
  }
  static getStubConfig() {
    return { prefix: "lg_washer" };
  }
  get _appliance() {
    if (!this.hass || !this._config) return;
    const s = Le(this.hass, this._config.device_id, this._config.prefix);
    return s ? new je(this.hass, s) : void 0;
  }
  // --- actions -------------------------------------------------------------------------------
  _press(s, e) {
    this.hass?.callService("button", "press", {}, { entity_id: s.id(e) });
  }
  _toggle(s, e, t) {
    this.hass?.callService("switch", t ? "turn_on" : "turn_off", {}, { entity_id: s.id(e) });
  }
  _select(s, e, t) {
    this.hass?.callService("select", "select_option", { option: t }, { entity_id: s.id(e) });
  }
  _setNumber(s, e, t) {
    this.hass?.callService("number", "set_value", { value: t }, { entity_id: s.id(e) });
  }
  _moreInfo(s, e) {
    We(this, s.id(e));
  }
  // --- render --------------------------------------------------------------------------------
  render() {
    if (!this.hass || !this._config) return c;
    const s = this._appliance;
    return !s || !s.present ? p`<ha-card
                ><div class="missing">
                    Washing machine not found. Pick the device, or set <code>prefix</code> to its entity slug.
                </div></ha-card
            >` : p`
            <ha-card>
                ${this._renderHeader(s)} ${this._renderError(s)} ${this._renderHero(s)}
                ${this._renderChips(s)}
                ${this._config.show_controls === !1 ? c : this._renderControls(s)}
                ${this._renderFooter(s)}
            </ha-card>
        `;
  }
  _renderHeader(s) {
    const e = s.on("power");
    return p`
            <div class="header">
                <div class="title">${this._config?.name ?? "Washing machine"}</div>
                <button
                    class="power ${e ? "on" : ""}"
                    title=${e ? "Switch off" : "Switch on"}
                    @click=${() => this._toggle(s, "power", !e)}
                >
                    ⏻
                </button>
            </div>
        `;
  }
  _renderError(s) {
    return s.on("error") ? p`<div class="error" @click=${() => this._moreInfo(s, "errorMessage")}>
            ${s.state("errorMessage") ?? "Error"}
        </div>` : c;
  }
  _renderHero(s) {
    const e = s.state("downloadedCourse"), t = e && e !== "Not selected" ? e : s.state("course") ?? "No programme", r = s.state("status") ?? "Unknown", i = s.number("remainingTime"), o = s.number("initialTime"), n = re.includes(r), l = n && o && i !== void 0 ? (o - i) / o : 0;
    return p`
            <div class="hero">
                <div class="programme" @click=${() => this._moreInfo(s, "status")}>
                    <span class="name">${t}</span>
                    <span class="status ${n ? "running" : ""}">${r}</span>
                </div>
                <div class="remaining">${n || i ? Ge(i) : ""}</div>
            </div>
            ${n ? p`<div class="bar"><div class="fill" style="width:${Math.round(l * 100)}%"></div></div>` : c}
            <div class="meta">
                ${this._metaItem(s, "temperature", "°C")} ${this._metaItem(s, "spin", "rpm")}
                ${this._metaItem(s, "rinse")} ${this._energyItem(s)}
            </div>
        `;
  }
  _metaItem(s, e, t) {
    const r = s.state(e);
    return r === void 0 || r === "Not selected" ? c : p`<div class="meta-item" @click=${() => this._moreInfo(s, e)}>
            ${r}${t ? p`<span class="unit">${t}</span>` : c}
        </div>`;
  }
  _energyItem(s) {
    const e = s.number("energy");
    return e === void 0 || e === 0 ? c : p`<div class="meta-item" @click=${() => this._moreInfo(s, "energy")}>
            ${(e / 1e3).toFixed(2)}<span class="unit">kWh</span>
        </div>`;
  }
  _renderChips(s) {
    const e = oe.filter((t) => s.on(t.reported));
    return s.on("aiDd") && e.push({ reported: "aiDd", control: "aiDd", label: "AI DD", icon: "" }), e.length ? p`<div class="chips">
            ${e.map((t) => p`<span class="chip">${t.label}</span>`)}
        </div>` : c;
  }
  _renderControls(s) {
    const e = s.number("setDelayedEnd");
    return p`
            <div class="controls">
                ${Fe.map((t) => this._renderSelect(s, t.key, t.label))}
                <label class="field">
                    <span class="label">Delayed end</span>
                    <input
                        class="input"
                        type="number"
                        min="0"
                        max="19"
                        step="1"
                        .value=${e === void 0 ? "" : String(e)}
                        @change=${(t) => {
      const r = t.target;
      this._setNumber(s, "setDelayedEnd", Number(r.value));
    }}
                    />
                </label>
                <div class="toggles">
                    ${oe.map(
      (t) => p`
                            <button
                                class="toggle ${s.on(t.control) ? "on" : ""}"
                                @click=${() => this._toggle(s, t.control, !s.on(t.control))}
                            >
                                ${t.label}
                            </button>
                        `
    )}
                </div>
            </div>
        `;
  }
  _renderSelect(s, e, t) {
    const r = s.options(e);
    if (!r.length) return c;
    const i = s.state(e) ?? "";
    return p`
            <label class="field">
                <span class="label">${t}</span>
                <select
                    class="input"
                    @change=${(o) => this._select(s, e, o.target.value)}
                >
                    ${r.map(
      (o) => p`<option value=${o} ?selected=${o === i}>${o}</option>`
    )}
                </select>
            </label>
        `;
  }
  _renderFooter(s) {
    const e = s.state("doorLock") === "off", t = s.on("remoteStart"), r = re.includes(s.state("status") ?? "");
    return p`
            <div class="footer">
                <div class="flags">
                    <span class="flag ${e ? "active" : ""}" @click=${() => this._moreInfo(s, "doorLock")}>
                        ${e ? "Door locked" : "Door unlocked"}
                    </span>
                    ${t ? c : p`<span class="flag warn" title="Arm Remote Start on the appliance, or it ignores a start"
                              >Remote start off</span
                          >`}
                </div>
                <div class="actions">
                    ${r ? p`<button class="action" @click=${() => this._press(s, "pause")}>Pause</button>` : c}
                    <button
                        class="action primary"
                        ?disabled=${!t}
                        title=${t ? "Run the configured programme" : "Remote start is not armed on the appliance"}
                        @click=${() => this._press(s, "runProgramme")}
                    >
                        Run programme
                    </button>
                </div>
            </div>
        `;
  }
};
k.styles = ue`
        ha-card {
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .title {
            font-size: 1.1rem;
            font-weight: 500;
        }
        .power {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            color: var(--secondary-text-color);
            padding: 4px 8px;
            border-radius: 50%;
        }
        .power.on {
            color: var(--state-switch-active-color, var(--primary-color));
        }
        .error {
            background: var(--error-color, #db4437);
            color: var(--text-primary-color, #fff);
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
        }
        .hero {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 12px;
        }
        .programme {
            cursor: pointer;
            min-width: 0;
        }
        .name {
            display: block;
            font-size: 1.4rem;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .status {
            color: var(--secondary-text-color);
            font-size: 0.9rem;
        }
        .status.running {
            color: var(--primary-color);
        }
        .remaining {
            font-size: 1.6rem;
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
        }
        .bar {
            height: 4px;
            border-radius: 2px;
            background: var(--divider-color);
            overflow: hidden;
        }
        .fill {
            height: 100%;
            background: var(--primary-color);
            transition: width 1s linear;
        }
        .meta {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            color: var(--secondary-text-color);
            font-size: 0.95rem;
        }
        .meta-item {
            cursor: pointer;
        }
        .unit {
            font-size: 0.8em;
            margin-left: 2px;
            opacity: 0.8;
        }
        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        .chip {
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            border-radius: 12px;
            padding: 2px 10px;
            font-size: 0.8rem;
        }
        .controls {
            border-top: 1px solid var(--divider-color);
            padding-top: 12px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 10px;
        }
        .field {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
        }
        .label {
            font-size: 0.75rem;
            color: var(--secondary-text-color);
        }
        .input {
            width: 100%;
            box-sizing: border-box;
            padding: 8px;
            border-radius: 8px;
            border: 1px solid var(--divider-color);
            background: var(--card-background-color);
            color: var(--primary-text-color);
            font-size: 0.95rem;
        }
        .toggles {
            grid-column: 1 / -1;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        .toggle {
            border: 1px solid var(--divider-color);
            background: none;
            color: var(--secondary-text-color);
            border-radius: 16px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 0.85rem;
        }
        .toggle.on {
            background: var(--primary-color);
            border-color: var(--primary-color);
            color: var(--text-primary-color, #fff);
        }
        .footer {
            border-top: 1px solid var(--divider-color);
            padding-top: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
        }
        .flags {
            display: flex;
            gap: 10px;
            font-size: 0.85rem;
            color: var(--secondary-text-color);
        }
        .flag {
            cursor: pointer;
        }
        .flag.active {
            color: var(--primary-text-color);
        }
        .flag.warn {
            color: var(--warning-color, #ffa600);
            cursor: default;
        }
        .actions {
            display: flex;
            gap: 8px;
            margin-left: auto;
        }
        .action {
            border: 1px solid var(--divider-color);
            background: none;
            color: var(--primary-text-color);
            border-radius: 8px;
            padding: 8px 14px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        .action.primary {
            background: var(--primary-color);
            border-color: var(--primary-color);
            color: var(--text-primary-color, #fff);
        }
        .action[disabled] {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .missing {
            padding: 16px;
            color: var(--secondary-text-color);
        }
    `;
V([
  de({ attribute: !1 })
], k.prototype, "hass", 2);
V([
  Ie()
], k.prototype, "_config", 2);
k = V([
  Ne(q)
], k);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: q,
  name: "LG Washing Machine",
  description: "Status and full programme control for an LG washer driven locally by rethink",
  preview: !0
});
console.info(`%c ${q} %c ${qe} `, "background:#03a9f4;color:#fff", "background:#555;color:#fff");
export {
  k as LgWashingCard
};
