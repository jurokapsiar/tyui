---
name: components
description: Load the Solid setup guidance and the complete TYUI component guidance set for Solid apps.
license: Apache-2.0
requires:
  - '@toyu-ui/solid#setup'
  - '@toyu-ui/elements#components'
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/components/SKILL.md
---

# TYUI Solid components

## Intent

Use `@toyu-ui/solid#components` when a Solid app needs the full TYUI component selection and usage guidance.

## Correct Usage

```sh
yarn dlx @tanstack/intent@latest load @toyu-ui/solid#components
```

## Selection Guidance

- Start Solid app guidance from this skill when component choice is not known.
- Use `@toyu-ui/solid#setup` for Solid registration and JSX rules.
- Use required `@toyu-ui/elements#*` skills for component-specific intent and anti-patterns.
- Use `@toyu-ui/solid` exports and `@toyu-ui/solid/define/*` paths in app code.

## Anti-Patterns

- Do not ask Solid apps to install `@toyu-ui/define` or `@toyu-ui/elements` directly for normal use.
- Do not duplicate component guidance in Solid skills.
