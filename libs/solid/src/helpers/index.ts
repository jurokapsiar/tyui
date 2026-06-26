export type PropertyBinder<TElement, TValue> = (element: TElement, value: TValue) => void;

export function assignElementProperty<TElement, TKey extends keyof TElement>(
  element: TElement,
  key: TKey,
  value: TElement[TKey],
): void {
  element[key] = value;
}
