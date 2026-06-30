import { mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  check,
  exists,
  parseOptions,
  runOrExit,
  runStep,
  tarballName,
  tarballRoot,
  type CheckResult,
} from './shared';

const options = parseOptions();
const checks: CheckResult[] = [];
const smokeRoot = resolve('/tmp', 'tyui-release-smoke');
const solidTarball = resolve(tarballRoot, tarballName('solid', options.version));
const tarballFile = (name: 'core' | 'elements' | 'define' | 'solid') =>
  `file:${resolve(tarballRoot, tarballName(name, options.version))}`;

await rm(smokeRoot, { recursive: true, force: true });
await mkdir(resolve(smokeRoot, 'src'), { recursive: true });

await writeFile(
  resolve(smokeRoot, 'package.json'),
  `${JSON.stringify(
    {
      name: 'tyui-release-smoke',
      version: '0.0.0',
      private: true,
      type: 'module',
      scripts: {
        build: 'vite build',
      },
      dependencies: {
        '@toyu-ui/solid': tarballFile('solid'),
        'solid-js': '^1.9.13',
        typescript: '^6.0.3',
        vite: '^7.1.11',
        'vite-plugin-solid': '^2.11.12',
        'happy-dom': '^20.10.6',
      },
      devDependencies: {},
      overrides: {
        '@toyu-ui/core': tarballFile('core'),
        '@toyu-ui/elements': tarballFile('elements'),
        '@toyu-ui/define': tarballFile('define'),
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

defineTyuiButton();

render(() => <Button appearance="primary">Save</Button>, document.getElementById('root')!);
console.log(Button);
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

checks.push(check('solid tarball exists', await exists(solidTarball), solidTarball));
checks.push(await runStep('smoke npm install', 'npm', ['install'], { cwd: smokeRoot }));
checks.push(await runStep('smoke vite build', 'npx', ['vite', 'build'], { cwd: smokeRoot }));
checks.push(
  await runStep(
    'smoke import @toyu-ui/solid',
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
    'smoke import @toyu-ui/solid/define/button',
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
    'smoke tsc declarations',
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

await runOrExit(checks, 'smoke');
