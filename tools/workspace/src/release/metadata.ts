import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  check,
  exists,
  parseOptions,
  readJson,
  runOrExit,
  runStep,
  workspaceRoot,
  type CheckResult,
} from './shared';

interface PackageJson {
  exports?: Record<string, unknown>;
}

interface CustomElementsManifest {
  modules?: Array<{
    declarations?: Array<{
      tagName?: string;
      customElement?: boolean;
      attributes?: unknown[];
      events?: unknown[];
      cssParts?: unknown[];
      cssProperties?: unknown[];
    }>;
  }>;
}

const options = parseOptions();
const checks: CheckResult[] = [];

checks.push(
  await runStep('elements:cem', 'yarn', ['nx', 'run', 'elements:cem', '--skip-nx-cache']),
);
checks.push(
  await runStep('elements:skills:validate', 'yarn', [
    'nx',
    'run',
    'elements:skills:validate',
    '--skip-nx-cache',
  ]),
);
checks.push(
  await runStep('elements:ai-context', 'yarn', [
    'nx',
    'run',
    'elements:ai-context',
    '--skip-nx-cache',
  ]),
);
checks.push(
  await runStep('elements:storybook-docs', 'yarn', [
    'nx',
    'run',
    'elements:storybook-docs',
    '--skip-nx-cache',
  ]),
);
checks.push(
  await runStep('format generated metadata', 'yarn', [
    'oxfmt',
    'dist/ai',
    'libs/elements/custom-elements.json',
    'libs/elements/src/generated/spec-docs',
    'llms.txt',
  ]),
);

const manifestPath = resolve(workspaceRoot, 'libs/elements/custom-elements.json');
const storybookDocsRoot = resolve(workspaceRoot, 'libs/elements/src/generated/spec-docs');
const aiRoot = resolve(workspaceRoot, 'dist/ai');

checks.push(
  check(
    'custom-elements.json exists',
    await exists(manifestPath),
    'libs/elements/custom-elements.json',
  ),
);
checks.push(
  check('AI context exists', await exists(resolve(aiRoot, 'context.json')), 'dist/ai/context.json'),
);
checks.push(
  check(
    'AI components exists',
    await exists(resolve(aiRoot, 'components.md')),
    'dist/ai/components.md',
  ),
);
checks.push(
  check('root llms.txt exists', await exists(resolve(workspaceRoot, 'llms.txt')), 'llms.txt'),
);

try {
  const docs = await readdir(storybookDocsRoot);
  checks.push(
    check(
      'storybook generated docs exist',
      docs.some((file) => file.endsWith('.stories.ts')),
      'libs/elements/src/generated/spec-docs/*.stories.ts',
    ),
  );
} catch {
  checks.push(check('storybook generated docs exist', false, 'missing generated Storybook docs'));
}

try {
  const manifest = await readJson<CustomElementsManifest>(manifestPath);
  const packageJson = await readJson<PackageJson>(
    resolve(workspaceRoot, 'libs/elements/package.json'),
  );
  const runtimeExports = Object.keys(packageJson.exports ?? {})
    .filter((key) => key !== '.' && key !== './custom-elements.json')
    .map((key) => key.slice(2));
  const declaredTags = new Set<string>();

  for (const mod of manifest.modules ?? []) {
    for (const declaration of mod.declarations ?? []) {
      if (declaration.customElement && declaration.tagName?.startsWith('tyui-')) {
        declaredTags.add(declaration.tagName.replace(/^tyui-/, ''));
        const hasPublicSurface =
          (declaration.attributes?.length ?? 0) > 0 ||
          (declaration.events?.length ?? 0) > 0 ||
          (declaration.cssParts?.length ?? 0) > 0 ||
          (declaration.cssProperties?.length ?? 0) > 0;
        checks.push(
          check(
            `CEM surface for ${declaration.tagName}`,
            hasPublicSurface,
            `${declaration.tagName} describes attributes/events/parts/properties`,
          ),
        );
      }
    }
  }

  for (const exportName of runtimeExports) {
    checks.push(
      check(
        `CEM export parity: ${exportName}`,
        declaredTags.has(exportName),
        `@toyu-ui/elements/${exportName} has matching tyui-${exportName} declaration`,
      ),
    );
  }
} catch (err) {
  checks.push(
    check(
      'CEM parses and matches exports',
      false,
      err instanceof Error ? err.message : 'could not parse CEM or package exports',
    ),
  );
}

if (options.dryRun) {
  console.info('metadata dry run completed checks without changing publish state');
}

await runOrExit(checks, 'metadata');
