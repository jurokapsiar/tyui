//#region src/controllers/toggle-controller.ts
function e(e = {}) {
  let t = {
      pressed: e.initialPressed ?? !1,
      disabled: e.disabled ?? !1,
    },
    n = /* @__PURE__ */ new Set(),
    r = () => {
      for (let e of n) e(t);
    },
    i = (n, i, a) => {
      if (!(n.pressed !== t.pressed || n.disabled !== t.disabled))
        return {
          changed: !1,
          source: i,
          state: t,
        };
      let o = n.pressed !== t.pressed;
      return (
        (t = n),
        r(),
        a && o && e.onChange?.(t.pressed, i),
        {
          changed: !0,
          source: i,
          state: t,
        }
      );
    };
  return {
    getState() {
      return t;
    },
    setDisabled(e) {
      return i(
        {
          ...t,
          disabled: e,
        },
        'programmatic',
        !1,
      );
    },
    setPressed(e) {
      return i(
        {
          ...t,
          pressed: e,
        },
        'programmatic',
        !1,
      );
    },
    press(e = 'programmatic') {
      return t.disabled
        ? {
            changed: !1,
            source: e,
            state: t,
          }
        : i(
            {
              ...t,
              pressed: !t.pressed,
            },
            e,
            !0,
          );
    },
    subscribe(e) {
      return (
        n.add(e),
        e(t),
        () => {
          n.delete(e);
        }
      );
    },
  };
}
//#endregion
export { e as createToggleController };
