---
name: frame
description: Use tyui-frame to reserve aspect ratio for media, previews, charts, thumbnails, and embeds.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/frame/tyui-frame.ts
  manifest: ../../custom-elements.json
---

# tyui-frame

## Intent

Use `tyui-frame` to reserve a stable aspect ratio for one primary child while the parent owns width.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-frame ratio="16/9" fit="cover">
  <img src="/preview.jpg" alt="Project preview" />
</tyui-frame>
```

## Selection Guidance

- Use Frame for images, video, canvas, iframe embeds, charts, thumbnails, and preview surfaces.
- Use natural block flow for text-heavy cards.
- Use Grid for collections of framed peers.
- Apply `fit` and `position` only when the direct child is replaced media.

## Anti-Patterns

- Do not place full forms or complex scrollable interactive regions inside Frame.
- Do not use Frame to crop text cards.
- Do not expect `object-fit` to affect non-replaced elements.
