import './jsx.js';
import {
  addEventListener as e,
  effect as t,
  getOwner as n,
  insert as r,
  template as i,
} from 'solid-js/web';
import { defineTyuiButton as a } from '@tyui/define/button';
//#region src/button.tsx
var o = /*#__PURE__*/ i('<tyui-button>', !0, !1, !1);
a();
function s(i) {
  return (() => {
    var a = o();
    return (
      e(a, 'activate', i.onActivate),
      (a._$owner = n()),
      r(a, () => i.children),
      t(
        (e) => {
          var t = i.disabled,
            n = i.pressed;
          return (t !== e.e && (a.disabled = e.e = t), n !== e.t && (a.pressed = e.t = n), e);
        },
        {
          e: void 0,
          t: void 0,
        },
      ),
      a
    );
  })();
}
//#endregion
export { s as Button };
