import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import type { ExecutorContext } from '@nx/devkit';
import { resolveProjectPaths } from '../shared/workspace-paths';

export interface AiContextOptions {
  includeRootLlms?: boolean;
}

type CustomElementsManifest = {
  modules?: Array<{
    declarations?: Array<{
      tagName?: string;
      name?: string;
      summary?: string;
      attributes?: Array<{ name: string; type?: string | { text?: string }; description?: string }>;
      events?: Array<{ name: string; type?: string | { text?: string }; description?: string }>;
      slots?: Array<{ name: string; description?: string }>;
      cssParts?: Array<{ name: string; description?: string }>;
      cssProperties?: Array<{ name: string; description?: string }>;
      'x-design-system'?: unknown;
    }>;
  }>;
};

export default async function aiContext(
  options: AiContextOptions,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const paths = resolveProjectPaths(context);
  const outDir = join(context.root, 'dist', 'ai');
  await mkdir(outDir, { recursive: true });

  const manifestPath = join(paths.projectAbsRoot, 'custom-elements.json');
  if (!existsSync(manifestPath)) {
    throw new Error(
      `AI context requires ${relative(context.root, manifestPath)}. Run the cem target first.`,
    );
  }

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as CustomElementsManifest;
  const compactManifest = compactCustomElementsManifest(manifest);

  await writeJson(join(outDir, 'custom-elements.compact.json'), compactManifest);
  await writeFile(
    join(outDir, 'components.md'),
    await buildComponentsMarkdown(context.root),
    'utf8',
  );
  await writeJson(join(outDir, 'tokens.resolved.json'), await readDesignTokens(context.root));
  await writeJson(
    join(outDir, 'context.json'),
    await buildContextJson(context.root, compactManifest),
  );
  await writeFile(join(outDir, 'index.md'), buildIndexMarkdown(), 'utf8');
  await writeFile(join(outDir, 'llms.txt'), buildLlmsTxt(false), 'utf8');

  if (options.includeRootLlms ?? true) {
    await writeFile(join(context.root, 'llms.txt'), buildLlmsTxt(true), 'utf8');
  }

  return { success: true };
}

function compactCustomElementsManifest(manifest: CustomElementsManifest): unknown {
  const components = [];

  for (const module of manifest.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      if (!declaration.tagName) continue;
      components.push({
        tagName: declaration.tagName,
        className: declaration.name,
        summary: declaration.summary,
        attributes: declaration.attributes?.map((attribute) => ({
          name: attribute.name,
          type: typeText(attribute.type),
          description: attribute.description,
        })),
        events: declaration.events?.map((event) => ({
          name: event.name,
          type: typeText(event.type),
          description: event.description,
        })),
        slots: declaration.slots,
        cssParts: declaration.cssParts,
        cssProperties: declaration.cssProperties,
        design: declaration['x-design-system'],
      });
    }
  }

  return { schemaVersion: '1.0.0', components };
}

function typeText(type: string | { text?: string } | undefined): string | undefined {
  if (typeof type === 'string') return type;
  return type?.text;
}

async function buildComponentsMarkdown(workspaceRoot: string): Promise<string> {
  const sections: string[] = ['# TYUI Components', ''];
  const docsDir = join(workspaceRoot, 'ai', 'components');

  if (existsSync(docsDir)) {
    for (const file of (await readdir(docsDir)).filter((name) => name.endsWith('.md')).sort()) {
      sections.push(`## ${file.replace(/\.md$/, '')}`, '');
      sections.push(await readFile(join(docsDir, file), 'utf8'));
      sections.push('');
    }
  }

  const skillDirs = [
    join(workspaceRoot, 'libs', 'elements', 'skills'),
    join(workspaceRoot, 'libs', 'solid', 'skills'),
  ];

  for (const skillsDir of skillDirs) {
    if (!existsSync(skillsDir)) continue;
    for (const dirent of await readdir(skillsDir, { withFileTypes: true })) {
      if (!dirent.isDirectory() || dirent.name.startsWith('_')) continue;
      const skillPath = join(skillsDir, dirent.name, 'SKILL.md');
      if (!existsSync(skillPath)) continue;
      sections.push(`## Skill: ${basename(dirent.name)}`, '');
      sections.push(await readFile(skillPath, 'utf8'));
      sections.push('');
    }
  }

  return `${sections.join('\n').trim()}\n`;
}

async function readDesignTokens(workspaceRoot: string): Promise<Record<string, unknown>> {
  const alternativesDir = join(workspaceRoot, 'design', 'alternatives');
  const tokens: Record<string, unknown> = {};

  if (!existsSync(alternativesDir)) return tokens;

  for (const dirent of await readdir(alternativesDir, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    const tokenPath = join(alternativesDir, dirent.name, 'tokens.resolved.json');
    if (!existsSync(tokenPath)) continue;
    tokens[dirent.name] = JSON.parse(await readFile(tokenPath, 'utf8')) as unknown;
  }

  return tokens;
}

async function buildContextJson(
  workspaceRoot: string,
  compactManifest: unknown,
): Promise<Record<string, unknown>> {
  const alternativesDir = join(workspaceRoot, 'design', 'alternatives');
  const designs: Record<string, unknown> = {};

  if (existsSync(alternativesDir)) {
    for (const dirent of await readdir(alternativesDir, { withFileTypes: true })) {
      if (!dirent.isDirectory()) continue;
      const contextPath = join(alternativesDir, dirent.name, 'context.json');
      if (!existsSync(contextPath)) continue;
      designs[dirent.name] = JSON.parse(await readFile(contextPath, 'utf8')) as unknown;
    }
  }

  return {
    name: 'tyui',
    generatedBy: '@tyui/tools-executors:ai-context',
    artifacts: {
      llms: 'llms.txt',
      components: 'components.md',
      manifest: 'custom-elements.compact.json',
      tokens: 'tokens.resolved.json',
    },
    manifest: compactManifest,
    designs,
    intent: {
      skills: ['libs/elements/skills/*/SKILL.md', 'libs/solid/skills/*/SKILL.md'],
      consumerCommand: 'yarn dlx @tanstack/intent@latest install',
    },
  };
}

function buildIndexMarkdown(): string {
  return `# TYUI AI Context

This bundle is generated by \`nx run elements:ai-context\`.

- \`custom-elements.compact.json\`: compact component API facts.
- \`tokens.resolved.json\`: resolved design-token facts for shipped design alternatives.
- \`components.md\`: component contracts and Intent-compatible skills.
- \`context.json\`: machine-readable artifact map.
- \`llms.txt\`: discovery index for agents and crawlers.

Use the Custom Elements Manifest as the source of API truth. Use skills and component docs for intent, selection, anti-patterns, layout ownership, and examples.
`;
}

function buildLlmsTxt(rootRelative: boolean): string {
  const prefix = rootRelative ? 'dist/ai/' : '';

  return `# TYUI

TYUI is a framework-neutral Custom Elements component library with generated agent context.

## AI context

- ${prefix}index.md
- ${prefix}custom-elements.compact.json
- ${prefix}tokens.resolved.json
- ${prefix}components.md
- ${prefix}context.json

## Source docs

- spec/agentic-ui-design.md
- spec/architecture.md
- spec/requirements.md
- spec/testing.md
- ai/components/
- design/alternatives/

## Intent skills

- libs/elements/skills/
- libs/solid/skills/
`;
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}
