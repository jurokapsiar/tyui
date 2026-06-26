# ADR 0001: Native Custom Elements As Primary Runtime

## Status

Accepted.

## Context

The library must be framework-agnostic, avoid JSX in component implementations, minimize runtime footprint, and remain natural to consume from Solid JSX.

## Decision

Use native Custom Elements as the primary component runtime. Implement component behavior with plain TypeScript and DOM APIs. Keep framework packages limited to typing, wrappers, and integration helpers.

## Consequences

- Components can be consumed from Solid, vanilla HTML, and other frameworks through the Web Component contract.
- The library does not require Solid, React, Lit, or a virtual DOM runtime for component implementation.
- Components must own their own update granularity, lifecycle cleanup, accessibility semantics, and DOM stability.
- Rich framework ergonomics must be layered on top without duplicating component behavior.
