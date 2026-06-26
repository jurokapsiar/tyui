export function defineElementOnce(
  tagName: string,
  elementConstructor: CustomElementConstructor,
): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, elementConstructor);
  }
}

export async function nextMicrotask(): Promise<void> {
  await Promise.resolve();
}
