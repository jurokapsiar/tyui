---
name: cluster
description: Solid-facing alias for tyui-cluster guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#cluster']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/cluster/SKILL.md
---

# TYUI Solid cluster

## Intent

Use `@toyu-ui/solid#cluster` to load Solid setup plus the authoritative `@toyu-ui/elements#cluster` guidance.

## Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiCluster } from '@toyu-ui/solid/define/cluster';

defineTyuiCluster();

<tyui-cluster gap="2" />;
```

## Selection Guidance

- Use raw `tyui-cluster` in TSX for wrapping action rows and tags.
- Register it through `@toyu-ui/solid/define/cluster`.

## Anti-Patterns

- Do not use Cluster for table or data-grid semantics.
