//#region src/contract-tests/custom-element.ts
function e(e, t) {
  customElements.get(e) || customElements.define(e, t);
}
async function t() {
  await Promise.resolve();
}
//#endregion
//#region src/a11y/roles.ts
function n(e, t) {
  return t.flatMap((t) => {
    let n = e.querySelector(t.selector);
    if (!n) return [`Missing element for selector "${t.selector}".`];
    let r = n.getAttribute('role');
    return r === t.role
      ? []
      : [`Expected "${t.selector}" to have role "${t.role}" but found "${r}".`];
  });
}
//#endregion
export { e as defineElementOnce, n as getRequiredRoleFailures, t as nextMicrotask };
