---
name: components
description: Load the TYUI component guidance set for choosing and using shipped custom elements and layout primitives.
license: Apache-2.0
requires:
  - '@toyu-ui/elements#button'
  - '@toyu-ui/elements#input'
  - '@toyu-ui/elements#checkbox'
  - '@toyu-ui/elements#radio'
  - '@toyu-ui/elements#radio-group'
  - '@toyu-ui/elements#flex'
  - '@toyu-ui/elements#cluster'
  - '@toyu-ui/elements#grid'
  - '@toyu-ui/elements#center'
  - '@toyu-ui/elements#container'
  - '@toyu-ui/elements#frame'
  - '@toyu-ui/elements#sidebar'
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: skills/components/SKILL.md
  manifest: ../../custom-elements.json
---

# TYUI components

## Intent

Use `@toyu-ui/elements#components` when an agent or developer needs the complete shipped TYUI component guidance set before choosing controls or layout primitives.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`. This aggregate skill only gathers intent and selection guidance; individual component skills remain the source for component-specific advice.

## Correct Usage

```sh
yarn dlx @tanstack/intent@latest load @toyu-ui/elements#components
```

## Selection Guidance

- Load this skill at the start of a TYUI UI task when the component choice is not known yet.
- Use the required component skills for exact intent, selection guidance, anti-patterns, and usage examples.
- Use `@toyu-ui/solid#setup` as the companion setup skill for Solid apps.
- Use `custom-elements.json` for exact attributes, events, slots, CSS parts, and CSS custom properties.

## Anti-Patterns

- Do not duplicate component selection rules in app docs when this aggregate skill can load the versioned component guidance.
- Do not treat this skill as an API reference; use the manifest for exact API facts.
- Do not load every component at runtime just because every component skill was loaded for agent guidance.
