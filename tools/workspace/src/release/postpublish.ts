import { mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  parseOptions,
  runOrExit,
  runStep,
  writeText,
  releaseRoot,
  type CheckResult,
} from './shared';

const options = parseOptions();
const checks: CheckResult[] = [];

for (const pkg of options.packages) {
  const packageName = `@toyu-ui/${pkg}`;
  checks.push(
    await runStep(`npm view ${packageName}`, 'npm', [
      'view',
      packageName,
      'version',
      'dist-tags',
      'exports',
      'dependencies',
      'peerDependencies',
    ]),
  );
}

const smokeRoot = resolve('/tmp', 'tyui-npm-smoke');
await rm(smokeRoot, { recursive: true, force: true });
await mkdir(resolve(smokeRoot, 'src'), { recursive: true });

await writeFile(
  resolve(smokeRoot, 'package.json'),
  `${JSON.stringify(
    {
      name: 'tyui-npm-smoke',
      version: '0.0.0',
      private: true,
      type: 'module',
      scripts: { build: 'vite build' },
      dependencies: {
        '@toyu-ui/solid': options.tag === 'latest' ? `^${options.version}` : options.tag,
        'solid-js': '^1.9.13',
        typescript: '^6.0.3',
        vite: '^7.1.11',
        'vite-plugin-solid': '^2.11.12',
        'happy-dom': '^20.10.6',
      },
    },
    null,
    2,
  )}\n`,
);

await writeFile(
  resolve(smokeRoot, 'index.html'),
  `<div id="root"></div><script type="module" src="/src/main.tsx"></script>\n`,
);
await writeFile(
  resolve(smokeRoot, 'src/main.tsx'),
  `import '@toyu-ui/solid/jsx';
import { render } from 'solid-js/web';
import { Button } from '@toyu-ui/solid';
import { defineTyuiButton } from '@toyu-ui/solid/define/button';
import manifest from '@toyu-ui/solid/custom-elements.json';

defineTyuiButton();
console.log(Button, manifest);
render(() => <Button appearance="primary">Save</Button>, document.getElementById('root')!);
`,
);
await writeFile(
  resolve(smokeRoot, 'smoke.tsx'),
  `import '@toyu-ui/solid/jsx';
import { Button } from '@toyu-ui/solid';
import { defineTyuiButton } from '@toyu-ui/solid/define/button';
import manifest from '@toyu-ui/solid/custom-elements.json';

defineTyuiButton();
console.log(Button, manifest);
`,
);
await writeFile(
  resolve(smokeRoot, 'vite.config.ts'),
  `import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({ plugins: [solid()] });
`,
);

checks.push(await runStep('npm smoke install', 'npm', ['install'], { cwd: smokeRoot }));
checks.push(await runStep('npm smoke vite build', 'npx', ['vite', 'build'], { cwd: smokeRoot }));
checks.push(
  await runStep(
    'npm smoke import @toyu-ui/solid',
    'node',
    [
      '--conditions=browser',
      '-e',
      "const {Window}=await import('happy-dom');const w=new Window();Object.assign(globalThis,{window:w,document:w.document,HTMLElement:w.HTMLElement,CSSStyleSheet:w.CSSStyleSheet,customElements:w.customElements});const m=await import('@toyu-ui/solid');console.log(Object.keys(m))",
    ],
    { cwd: smokeRoot },
  ),
);
checks.push(
  await runStep(
    'npm smoke import define button',
    'node',
    [
      '--conditions=browser',
      '-e',
      "const {Window}=await import('happy-dom');const w=new Window();Object.assign(globalThis,{window:w,document:w.document,HTMLElement:w.HTMLElement,CSSStyleSheet:w.CSSStyleSheet,customElements:w.customElements});const m=await import('@toyu-ui/solid/define/button');console.log(Object.keys(m))",
    ],
    { cwd: smokeRoot },
  ),
);
checks.push(
  await runStep(
    'npm smoke declarations',
    'npx',
    [
      'tsc',
      '--noEmit',
      '--moduleResolution',
      'bundler',
      '--module',
      'ES2022',
      '--target',
      'ES2022',
      '--jsx',
      'preserve',
      '--jsxImportSource',
      'solid-js',
      '--resolveJsonModule',
      'smoke.tsx',
    ],
    { cwd: smokeRoot },
  ),
);

await writeText(
  resolve(releaseRoot, 'postpublish-report.md'),
  `# TYUI post-publish report\n\nVersion: ${options.version}\nTag: ${options.tag}\n`,
);
await runOrExit(checks, 'postpublish');
