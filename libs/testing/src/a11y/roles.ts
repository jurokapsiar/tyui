export type RequiredRoleExpectation = {
  selector: string;
  role: string;
};

export function getRequiredRoleFailures(
  root: ParentNode,
  expectations: readonly RequiredRoleExpectation[],
): string[] {
  return expectations.flatMap((expectation) => {
    const element = root.querySelector(expectation.selector);

    if (!element) {
      return [`Missing element for selector "${expectation.selector}".`];
    }

    const role = element.getAttribute('role');

    if (role !== expectation.role) {
      return [
        `Expected "${expectation.selector}" to have role "${expectation.role}" but found "${role}".`,
      ];
    }

    return [];
  });
}
