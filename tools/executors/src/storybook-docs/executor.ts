import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import type { ExecutorContext } from '@nx/devkit';
import { resolveProjectPaths } from '../shared/workspace-paths';

type ComponentDoc = {
  componentName: string;
  defineName: string;
  hasImplementation: boolean;
  slug: string;
  source: string;
  tagName: string;
};

type ExampleBlock = {
  code: string;
  title: string;
};

const showUnimplementedTag = 'Show unimplemented components';

export default async function storybookDocs(
  _options: Record<string, never>,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const paths = resolveProjectPaths(context);
  const specsRoot = join(context.root, 'ai', 'components');
  const outDir = join(paths.projectAbsRoot, 'src', 'generated', 'spec-docs');

  if (!existsSync(specsRoot)) {
    throw new Error(`Missing component specs directory: ${relative(context.root, specsRoot)}`);
  }

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const docs = await loadComponentDocs(context.root, specsRoot);
  const implementedDocs = docs.filter((doc) => doc.hasImplementation);
  const unimplementedDocs = docs.filter((doc) => !doc.hasImplementation);
  await writeFile(join(outDir, 'README.md'), generatedReadme(), 'utf8');

  for (const doc of implementedDocs) {
    await writeFile(join(outDir, `${doc.slug}.stories.ts`), buildStoryFile(doc), 'utf8');
  }

  for (const doc of unimplementedDocs) {
    await writeFile(
      join(outDir, `${doc.slug}.stories.ts`),
      buildUnimplementedComponentStoryFile(doc),
      'utf8',
    );
  }

  console.log(
    `Generated ${docs.length} Storybook spec doc file(s) in ${relative(context.root, outDir)}.`,
  );
  return { success: true };
}

async function loadComponentDocs(
  workspaceRoot: string,
  specsRoot: string,
): Promise<ComponentDoc[]> {
  const docs: ComponentDoc[] = [];
  const files = (await readdir(specsRoot)).filter((file) => file.endsWith('.md')).sort();

  for (const file of files) {
    const slug = basename(file, '.md');
    const elementPath = join(workspaceRoot, 'libs', 'elements', 'src', slug, `tyui-${slug}.ts`);

    const source = await readFile(join(specsRoot, file), 'utf8');
    const tagName =
      readListValue(source, 'Tag name') ?? readListValue(source, 'Tag') ?? `tyui-${slug}`;
    const componentName = readListValue(source, 'Component name') ?? titleCase(slug);

    docs.push({
      componentName,
      defineName: `defineTyui${pascalCase(slug)}`,
      hasImplementation: existsSync(elementPath),
      slug,
      source,
      tagName,
    });
  }

  return docs;
}

function buildUnimplementedComponentStoryFile(doc: ComponentDoc): string {
  const intro = joinMarkdownSections(doc.source, ['Identity', 'Intent', 'Selection Guidance']);
  const api = joinMarkdownSections(doc.source, ['API']);
  const slots = findSubsections(doc.source, ['Slots', 'CSS Parts', 'Events', 'Event Semantics']);
  const implementation = buildImplementationMarkdown(doc.source);
  const markdown = `# ${doc.componentName}

${intro}

${api}

${slots}

${implementation}`.trim();

  return `import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

const meta: Meta = {
  title: 'Unimplemented components/${doc.componentName}',
  tags: ['spec-docs', ${JSON.stringify(showUnimplementedTag)}],
  parameters: {
    options: { showPanel: false },
  },
};

export default meta;

type Story = StoryObj;

const styles = html\`
  <style>
    .ty-spec-doc {
      box-sizing: border-box;
      max-width: 920px;
      padding: 32px;
      color: CanvasText;
      font: 14px/1.55 system-ui, sans-serif;
    }

    .ty-spec-doc h1,
    .ty-spec-doc h2,
    .ty-spec-doc h3 {
      line-height: 1.2;
    }

    .ty-spec-doc h1 {
      margin: 0 0 20px;
      font-size: 28px;
    }

    .ty-spec-doc h2 {
      margin: 28px 0 12px;
      font-size: 20px;
    }

    .ty-spec-doc h3 {
      margin: 22px 0 10px;
      font-size: 16px;
    }

    .ty-spec-doc table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 22px;
      font-size: 13px;
    }

    .ty-spec-doc th,
    .ty-spec-doc td {
      border: 1px solid color-mix(in srgb, CanvasText 18%, Canvas);
      padding: 8px 10px;
      text-align: start;
      vertical-align: top;
    }

    .ty-spec-doc th {
      background: color-mix(in srgb, CanvasText 6%, Canvas);
      font-weight: 650;
    }

    .ty-spec-doc code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.92em;
    }

    .ty-spec-doc pre {
      overflow: auto;
      padding: 14px;
      border: 1px solid color-mix(in srgb, CanvasText 18%, Canvas);
      border-radius: 6px;
      background: color-mix(in srgb, CanvasText 5%, Canvas);
    }
  </style>
\`;

export const Spec: Story = {
  render: () => html\`<article class="ty-spec-doc">
    \${styles}
    \${unsafeHTML(${JSON.stringify(markdownToHtml(markdown))})}
  </article>\`,
};
`;
}

function buildStoryFile(doc: ComponentDoc): string {
  const intro = joinMarkdownSections(doc.source, ['Identity', 'Intent', 'Selection Guidance']);
  const api = joinMarkdownSections(doc.source, ['API']);
  const slots = findSubsections(doc.source, ['Slots', 'CSS Parts', 'Events', 'Event Semantics']);
  const implementation = buildImplementationMarkdown(doc.source);
  const examples = extractExampleBlocks(sectionContent(doc.source, 'Examples'));
  const designs = extractDesignBlocks(sectionContent(doc.source, 'Examples'));
  const imports = buildDefineImports(doc);
  const registrations = buildDefineRegistrations(doc);

  return `import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
${imports}
import '../../../../../design/alternatives/atmospheric-glass/theme.css';
import '../../../../../design/alternatives/atmospheric-glass/component-variants.css';
import '../../../../../design/alternatives/fluent-web/theme.css';
import '../../../../../design/alternatives/fluent-web/component-variants.css';

${registrations}

const examples: Array<{ title: string; code: string }> = ${JSON.stringify(examples, null, 2)};
const designs: Array<{ title: string; code: string }> = ${JSON.stringify(designs, null, 2)};

const meta: Meta = {
  title: 'Components/${doc.componentName}',
  tags: ['spec-docs'],
  parameters: {
    options: { showPanel: false },
  },
};

export default meta;

type Story = StoryObj;

const styles = html\`
  <style>
    .ty-spec-doc {
      box-sizing: border-box;
      max-width: 920px;
      padding: 32px;
      color: CanvasText;
      font: 14px/1.55 system-ui, sans-serif;
    }

    .ty-spec-doc h1,
    .ty-spec-doc h2,
    .ty-spec-doc h3 {
      line-height: 1.2;
    }

    .ty-spec-doc h1 {
      margin: 0 0 20px;
      font-size: 28px;
    }

    .ty-spec-doc h2 {
      margin: 28px 0 12px;
      font-size: 20px;
    }

    .ty-spec-doc h3 {
      margin: 22px 0 10px;
      font-size: 16px;
    }

    .ty-spec-doc table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 22px;
      font-size: 13px;
    }

    .ty-spec-doc th,
    .ty-spec-doc td {
      border: 1px solid color-mix(in srgb, CanvasText 18%, Canvas);
      padding: 8px 10px;
      text-align: start;
      vertical-align: top;
    }

    .ty-spec-doc th {
      background: color-mix(in srgb, CanvasText 6%, Canvas);
      font-weight: 650;
    }

    .ty-spec-doc code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.92em;
    }

    .ty-spec-doc pre {
      overflow: auto;
      padding: 14px;
      border: 1px solid color-mix(in srgb, CanvasText 18%, Canvas);
      border-radius: 6px;
      background: color-mix(in srgb, CanvasText 5%, Canvas);
    }

    .ty-spec-example {
      display: grid;
      gap: 12px;
      margin: 0 0 28px;
    }

    .ty-spec-example-preview {
      padding: 18px;
      border: 1px solid color-mix(in srgb, CanvasText 16%, Canvas);
      border-radius: 6px;
    }
  </style>
\`;

function markdownPage(markdown: string) {
  return html\`<article class="ty-spec-doc">\${styles}\${unsafeHTML(markdown)}</article>\`;
}

function examplesPage() {
  return html\`<article class="ty-spec-doc">
    \${styles}
    <h1>${escapeHtml(doc.componentName)} Examples</h1>
    \${examples.length > 0
      ? examples.map(renderExample)
      : html\`<p>No Storybook examples are marked in the component spec yet.</p>\`}
  </article>\`;
}

function designsPage() {
  return html\`<article class="ty-spec-doc">
    \${styles}
    <h1>${escapeHtml(doc.componentName)} Designs</h1>
    \${designs.length > 0
      ? designs.map(renderExample)
      : html\`<p>No design examples are marked in the component spec yet.</p>\`}
  </article>\`;
}

function renderExample(example: { title: string; code: string }) {
  return html\`<section class="ty-spec-example">
    <h2>\${example.title}</h2>
    <div class="ty-spec-example-preview">\${unsafeHTML(example.code)}</div>
    <pre><code>\${example.code}</code></pre>
  </section>\`;
}

export const About: Story = {
  render: () => markdownPage(${JSON.stringify(markdownToHtml(`# ${doc.componentName}\n\n${intro}`))}),
};

export const API: Story = {
  render: () => markdownPage(${JSON.stringify(markdownToHtml(`# ${doc.componentName} API\n\n${api}\n\n${slots}`))}),
};

export const Examples: Story = {
  tags: ['visual'],
  render: () => examplesPage(),
};

${
  designs.length > 0
    ? `export const Designs: Story = {
  name: 'Examples/Designs',
  tags: ['visual'],
  render: () => designsPage(),
};

`
    : ''
}
export const ImplementationSpec: Story = {
  name: 'Implementation Spec',
  render: () => markdownPage(${JSON.stringify(markdownToHtml(`# ${doc.componentName} Implementation Spec\n\n${implementation}`))}),
};
`;
}

function buildDefineImports(doc: ComponentDoc): string {
  void doc;
  return `// nx-ignore-next-line\nimport { defineTyuiElements } from '@toyu-ui/define/all';`;
}

function buildDefineRegistrations(doc: ComponentDoc): string {
  void doc;
  return 'defineTyuiElements();';
}

function buildImplementationMarkdown(source: string): string {
  const excluded = new Set(['Identity', 'Intent', 'Selection Guidance', 'API', 'Examples']);
  const sections = readSections(source).filter((section) => !excluded.has(section.title));
  return sections.map((section) => `## ${section.title}\n\n${section.body.trim()}`).join('\n\n');
}

function joinMarkdownSections(source: string, titles: string[]): string {
  return titles
    .map((title) => {
      const body = sectionContent(source, title);
      return body ? `## ${title}\n\n${body.trim()}` : '';
    })
    .filter(Boolean)
    .join('\n\n');
}

function findSubsections(source: string, titles: string[]): string {
  const blocks: string[] = [];
  for (const title of titles) {
    const block = subsectionContent(source, title);
    if (block) blocks.push(`## ${title}\n\n${block.trim()}`);
  }
  return blocks.join('\n\n');
}

function readSections(source: string): Array<{ title: string; body: string }> {
  const matches = [...source.matchAll(/^##\s+(.+)$/gm)];
  const sections: Array<{ title: string; body: string }> = [];

  for (const [index, match] of matches.entries()) {
    const next = matches[index + 1];
    const title = match[1]?.trim();
    if (!title) continue;
    const start = (match.index ?? 0) + match[0].length;
    const end = next?.index ?? source.length;
    sections.push({ title, body: source.slice(start, end).trim() });
  }

  return sections;
}

function sectionContent(source: string, title: string): string {
  return readSections(source).find((section) => section.title === title)?.body ?? '';
}

function subsectionContent(source: string, title: string): string {
  const pattern = new RegExp(`^###[ \\t]+${escapeRegExp(title)}[ \\t]*$`, 'm');
  const match = source.match(pattern);
  if (!match || match.index === undefined) return '';

  const start = match.index + match[0].length;
  const rest = source.slice(start);
  const next = rest.search(/^#{2,3}\s+/m);
  const body = next === -1 ? rest : rest.slice(0, next);
  return body.trim();
}

function extractExampleBlocks(source: string): ExampleBlock[] {
  return extractBlocks(source, 'story');
}

function extractDesignBlocks(source: string): ExampleBlock[] {
  return extractBlocks(source, 'design');
}

function extractBlocks(source: string, marker: string): ExampleBlock[] {
  const examples: ExampleBlock[] = [];
  const pattern = /```([^\n`]*)\n([\s\S]*?)```/g;

  for (const match of source.matchAll(pattern)) {
    const info = match[1]?.trim() ?? '';
    const code = match[2]?.trim();
    if (!code) continue;
    if (!new RegExp(`(^|\\s)${escapeRegExp(marker)}($|\\s)`).test(info)) continue;
    examples.push({
      code,
      title: readFenceTitle(info) ?? `Example ${examples.length + 1}`,
    });
  }

  return examples;
}

function readFenceTitle(info: string): string | undefined {
  const match = info.match(/title="([^"]+)"/);
  return match?.[1];
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.trim().split(/\r?\n/);
  const html: string[] = [];
  let listOpen = false;
  let table: string[][] = [];
  let inCode = false;
  let codeLines: string[] = [];

  const closeList = () => {
    if (listOpen) {
      html.push('</ul>');
      listOpen = false;
    }
  };
  const flushTable = () => {
    if (table.length === 0) return;
    html.push(tableToHtml(table));
    table = [];
  };
  const closeBlocks = () => {
    closeList();
    flushTable();
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        codeLines = [];
        inCode = false;
      } else {
        closeBlocks();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (/^\|.+\|$/.test(line.trim())) {
      closeList();
      table.push(splitTableRow(line));
      continue;
    }

    if (table.length > 0) flushTable();

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = heading[1]?.length;
      const text = heading[2];
      if (!level || !text) continue;
      html.push(`<h${level}>${inlineMarkdown(text)}</h${level}>`);
      continue;
    }

    const bullet = line.match(/^- (.+)$/);
    if (bullet) {
      if (!listOpen) {
        html.push('<ul>');
        listOpen = true;
      }
      const text = bullet[1];
      if (!text) continue;
      html.push(`<li>${inlineMarkdown(text)}</li>`);
      continue;
    }

    if (line.trim() === '') {
      closeList();
      continue;
    }

    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  closeBlocks();
  if (inCode) html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
  return html.join('\n');
}

function tableToHtml(rows: string[][]): string {
  const usableRows = rows.filter((row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell.trim())));
  if (usableRows.length === 0) return '';
  const [head, ...body] = usableRows;
  if (!head) return '';
  const header = `<thead><tr>${head.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join('')}</tr></thead>`;
  const rowsHtml = body
    .map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`)
    .join('');
  return `<table>${header}<tbody>${rowsHtml}</tbody></table>`;
}

function splitTableRow(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let escaped = false;
  for (const char of line.trim().replace(/^\|/, '').replace(/\|$/, '')) {
    if (char === '|' && !escaped) {
      cells.push(current.trim().replace(/\\\|/g, '|'));
      current = '';
      continue;
    }
    current += char;
    escaped = char === '\\' && !escaped;
    if (char !== '\\') escaped = false;
  }
  cells.push(current.trim().replace(/\\\|/g, '|'));
  return cells;
}

function inlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function readListValue(source: string, label: string): string | undefined {
  const match = source.match(new RegExp(`^- ${escapeRegExp(label)}:\\s+(.+)$`, 'm'));
  return match?.[1]?.replace(/`/g, '').trim();
}

function titleCase(value: string): string {
  return value
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function pascalCase(value: string): string {
  return value
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function generatedReadme(): string {
  return `# Generated Storybook Spec Docs

This directory is generated by \`nx run elements:storybook-docs\`.
Do not edit these files directly. Update \`ai/components/*.md\` instead.
`;
}
