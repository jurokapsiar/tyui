function g(r = {}) {
  let s = {
    pressed: r.initialPressed ?? !1,
    disabled: r.disabled ?? !1
  };
  const t = /* @__PURE__ */ new Set(), n = () => {
    for (const e of t)
      e(s);
  }, d = (e, a, l) => {
    if (!(e.pressed !== s.pressed || e.disabled !== s.disabled))
      return {
        changed: !1,
        source: a,
        state: s
      };
    const i = e.pressed !== s.pressed;
    return s = e, n(), l && i && r.onChange?.(s.pressed, a), {
      changed: !0,
      source: a,
      state: s
    };
  };
  return {
    getState() {
      return s;
    },
    setDisabled(e) {
      return d(
        {
          ...s,
          disabled: e
        },
        "programmatic",
        !1
      );
    },
    setPressed(e) {
      return d(
        {
          ...s,
          pressed: e
        },
        "programmatic",
        !1
      );
    },
    press(e = "programmatic") {
      return s.disabled ? {
        changed: !1,
        source: e,
        state: s
      } : d(
        {
          ...s,
          pressed: !s.pressed
        },
        e,
        !0
      );
    },
    subscribe(e) {
      return t.add(e), e(s), () => {
        t.delete(e);
      };
    }
  };
}
export {
  g as createToggleController
};
