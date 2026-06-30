import { getOwner as s, insert as u, effect as c, template as b } from "solid-js/web";
var f = /* @__PURE__ */ b("<tyui-button>", !0, !1, !1);
function h(t) {
  return (() => {
    var i = f();
    return i._$owner = s(), u(i, () => t.children), c((e) => {
      var a = t.appearance, n = t.disabled, o = t.disabledFocusable, v = t.iconPosition, d = t.shape, l = t.size, r = t.type;
      return a !== e.e && (i.appearance = e.e = a), n !== e.t && (i.disabled = e.t = n), o !== e.a && (i.disabledfocusable = e.a = o), v !== e.o && (i.iconposition = e.o = v), d !== e.i && (i.shape = e.i = d), l !== e.n && (i.size = e.n = l), r !== e.s && (i.type = e.s = r), e;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0
    }), i;
  })();
}
export {
  h as Button
};
