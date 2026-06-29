<p align="center">
  <h1><span color="blue">T</span><span color="cyan">Y</span>UI</h1>
</p>

<p align="center">
  <strong>framework-neutral component library</strong>
</p>

<p align="center">
  <a href="https://github.com/jurokapsiar/tyui"><img src="https://img.shields.io/badge/version-0.0.0-blue?style=flat-square" alt="Version" /></a>
  <a href="https://yarnpkg.com/"><img src="https://img.shields.io/badge/Yarn-4.5.0-2C8EBB?style=flat-square&logo=yarn&logoColor=white" alt="Yarn" /></a>
  <a href="https://nx.dev/"><img src="https://img.shields.io/badge/Nx-22.6.5-143055?style=flat-square&logo=nx&logoColor=white" alt="Nx" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-6.0.3-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-7.1.11-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://storybook.js.org/"><img src="https://img.shields.io/badge/Storybook-10.3.5-FF4785?style=flat-square&logo=storybook&logoColor=white" alt="Storybook" /></a>
  <a href="https://lit.dev/"><img src="https://img.shields.io/badge/Lit-3.3.2-324FFF?style=flat-square&logo=lit&logoColor=white" alt="Lit" /></a>
  <a href="https://www.solidjs.com/"><img src="https://img.shields.io/badge/Solid-1.9.13-2C4F7C?style=flat-square&logo=solid&logoColor=white" alt="Solid" /></a>
  <a href="https://vitest.dev/"><img src="https://img.shields.io/badge/Vitest-4.1.5-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest" /></a>
  <a href="https://playwright.dev/"><img src="https://img.shields.io/badge/Playwright-1.59.1-2EAD33?style=flat-square&logo=playwright&logoColor=white" alt="Playwright" /></a>
</p>

<p align="center">
  <a href="#availability">Availability</a> &middot;
  <a href="#architecture">Architecture</a> &middot;
  <a href="#commands">Commands</a> &middot;
  <a href="#specs-and-decisions">Specs And Decisions</a>
</p>

---

**TYUI** is a framework-neutral component library. It is an experiment, not intended to be used by anybody really.

Codex interviewed me, asked bunch of interesting questions about design systems, component libraries, accessibility. Used [APG patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) and [Fluent UI React v9](https://react.fluentui.dev/) as a reference for behaviors, API and other aspects. Then implemented the specs.

The library is intended to be AI firendly - agents should have access to all underlying information, component intnets, usage patterns and best practices.

Desing is proposed to be a separate layer. It should be possible to generate the design layer based on the standardized [design.md](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md).

**Warning:** This is 100% AI generated and not polished. Visuals and user experience will be rough. As part of the experiment I might also want to find out if agents can fine tune the behaviors and visuals of the components so that they can be considered well crafted. But for now they are not.

## Availability

Storybook is deployed as [Github page](https://jurokapsiar.github.io/tyui/).
Packages are not yet available - they might be if I decide to use the library in my personal projects.

## Architecture

- `libs/core`: plain TypeScript behavior, state machines, and accessibility logic.
- `libs/elements`: native Custom Element implementations.
- `libs/define`: opt-in custom-element registration functions.
- `libs/solid`: Solid JSX typing and optional thin wrappers.
- `libs/testing`: shared testing helpers.
- `apps/solid-example`: Solid + Vite consumer example.
- `apps/vanilla-example`: vanilla + Vite consumer example.

The component implementation should remain in `core` and `elements`. Framework packages should only improve typing and ergonomics.

## Commands

```sh
yarn install
yarn build
yarn test
yarn typecheck
yarn playwright:image
yarn dev:solid
yarn dev:vanilla
yarn storybook
```

## Specs And Decisions

- `spec/requirements.md`
- `spec/architecture.md`
- `spec/testing.md`
- `spec/component-contract-template.md`
- `adr/0001-native-custom-elements.md`
- `adr/0002-solid-integration-surface.md`
- `ai/components/*.md`
