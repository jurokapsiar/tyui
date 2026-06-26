# Accessibility

Accessibility is part of each component contract.

Every component should document:

- Role and semantic structure.
- Accessible name source.
- Keyboard interaction model.
- Focus management.
- ARIA states and properties.
- Disabled, readonly, selected, expanded, checked, pressed, invalid, and loading behavior where relevant.
- Screen reader expectations for meaningful state changes.

Automated tests should cover roles, names, states, and keyboard behavior. Complex widgets should also receive manual assistive-technology checks before release.
