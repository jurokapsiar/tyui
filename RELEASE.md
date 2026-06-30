# TYUI Release Flow

TYUI releases use Nx targets under the `workspace` project. A human and an agent
run the same deterministic flow.

Publishing is deliberately separate. The release targets generate, verify,
build, assemble, pack, and smoke-test artifacts. The checklist target prints
green checks and red failures. It prints a copy-paste `npm publish` command only
when every gate is green.

Use `--release-version` instead of `--version`; Nx consumes `--version` before
target arguments reach the release scripts.

## Normal Flow

```sh
yarn install --immutable
yarn nx run workspace:release:prepare --release-version=0.1.0 --tag=next --packages=core,elements,define,solid
yarn nx run workspace:release:checklist --release-version=0.1.0 --tag=next --packages=core,elements,define,solid
```

If the checklist is all green, copy the printed publish command and run it
manually.

After publishing:

```sh
yarn nx run workspace:release:postpublish --release-version=0.1.0 --tag=next --packages=core,elements,define,solid
```

Use `--tag=latest` for a stable release. Use `--tag=next` for prereleases.

## Published Packages

Default Solid-first release order:

1. `@toyu-ui/core`
2. `@toyu-ui/elements`
3. `@toyu-ui/define`
4. `@toyu-ui/solid`

`@toyu-ui/testing` is optional and not part of the default release package list.

The dependency graph remains:

```text
@toyu-ui/solid -> @toyu-ui/define -> @toyu-ui/elements -> @toyu-ui/core
             -> @toyu-ui/elements
```

Solid apps should install `@toyu-ui/solid` directly. Lower-level packages publish
so npm can resolve Solid's dependencies and so advanced consumers can opt into
custom-elements APIs.

## Nx Targets

| Target                          | Purpose                                                                                            |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| `workspace:release:metadata`    | Generate CEM, validate skills, generate AI context, generate Storybook spec docs.                  |
| `workspace:release:verify`      | Run install, format, lint, typecheck, tests, e2e, visual, Storybook build, and bundle-size checks. |
| `workspace:release:build`       | Fresh-build package JS and declarations in dependency order.                                       |
| `workspace:release:package`     | Assemble publish directories under `dist/libs/<pkg>`.                                              |
| `workspace:release:pack`        | Run `npm pack --dry-run --json`, assert file lists, create local tarballs.                         |
| `workspace:release:smoke`       | Install local tarballs in a clean Solid consumer and verify build/import/types.                    |
| `workspace:release:checklist`   | Print the release gate checklist and, only when green, the publish command.                        |
| `workspace:release:prepare`     | Run metadata -> verify -> build -> package -> pack -> smoke -> checklist.                          |
| `workspace:release:postpublish` | Verify npm metadata and a clean npm-installed Solid app.                                           |

All release targets accept:

```sh
--release-version=0.1.0
--tag=next
--packages=core,elements,define,solid
```

`--skip-heavy=true` exists for local debugging of `release:verify`, but do not
use it for a real publish candidate.

## Metadata Gate

Run:

```sh
yarn nx run workspace:release:metadata --release-version=0.1.0 --tag=next --packages=core,elements,define,solid
```

The target runs uncached generation commands:

```sh
yarn nx run elements:cem --skip-nx-cache
yarn nx run elements:skills:validate --skip-nx-cache
yarn nx run elements:ai-context --skip-nx-cache
yarn nx run elements:storybook-docs --skip-nx-cache
```

Expected outputs:

```text
libs/elements/custom-elements.json
libs/elements/src/generated/spec-docs/*.stories.ts
dist/ai/
llms.txt
dist/release/status/metadata.json
```

Release rule: the Custom Elements Manifest must describe every runtime
component exported by `@toyu-ui/elements`. If `@toyu-ui/elements/<component>` ships,
the CEM must include the matching `tyui-<component>` declaration with public
attributes, events, CSS parts, or CSS custom properties. If CEM and package
exports disagree, the metadata target fails.

## Verify Gate

Run:

```sh
yarn nx run workspace:release:verify --release-version=0.1.0 --tag=next --packages=core,elements,define,solid
```

The target runs:

```sh
yarn install --immutable
yarn format:check
yarn lint
yarn typecheck
yarn nx run-many -t typecheck
yarn nx run-many -t test
yarn nx run elements:e2e
yarn nx run elements:visual
yarn nx run elements:storybook --mode=build
yarn report-bundle-sizes
```

If visual snapshots changed intentionally, review those diffs before release.
Do not publish with unknown visual diffs.

The target writes:

```text
dist/release/status/verify.json
```

## Build Gate

Run:

```sh
yarn nx run workspace:release:build --release-version=0.1.0 --tag=next --packages=core,elements,define,solid
```

The target fresh-builds:

```sh
yarn nx run core:build --skip-nx-cache
yarn nx run elements:build --skip-nx-cache
yarn nx run define:build --skip-nx-cache
yarn nx run solid:build --skip-nx-cache
```

Expected outputs exist under both Nx output and package-local output:

```text
dist/libs/<pkg>/*.js
dist/libs/<pkg>/*.d.ts
libs/<pkg>/dist/*.js
libs/<pkg>/dist/*.d.ts
dist/release/status/build.json
```

The package source manifests point to `./dist/*.js` and `./dist/*.d.ts`. The
publish directories are different: `dist/libs/<pkg>` is the package root, so
`workspace:release:package` rewrites publish manifests to `./index.js`,
`./button.js`, `./index.d.ts`, and similar artifact-root paths.

## Package Gate

Run:

```sh
yarn nx run workspace:release:package --release-version=0.1.0 --tag=next --packages=core,elements,define,solid
```

For each package, the target writes or verifies:

```text
dist/libs/<pkg>/package.json
dist/libs/<pkg>/README.md
dist/libs/<pkg>/LICENSE
dist/libs/<pkg>/*.js
dist/libs/<pkg>/*.d.ts
```

Package-specific assets:

```text
dist/libs/elements/custom-elements.json
dist/libs/elements/skills/**
dist/libs/solid/custom-elements.json
dist/libs/solid/skills/**
```

The publish manifest rewrite:

1. sets the requested version;
2. sets `private: false`;
3. sets `publishConfig.access = "public"`;
4. removes source-package `files` restrictions so the clean artifact root packs;
5. rewrites `./dist/*` export and type paths to artifact-root `./*` paths;
6. rewrites any workspace dependency protocol to `^<release-version>`;
7. checks every export target exists in the publish directory;
8. checks Solid exposes app-facing `@toyu-ui/solid/define/*` paths.

The target writes:

```text
dist/release/status/package.json
```

## Pack Gate

Run:

```sh
yarn nx run workspace:release:pack --release-version=0.1.0 --tag=next --packages=core,elements,define,solid
```

For every package, the target runs:

```sh
npm pack --dry-run --json
npm pack --json
```

It verifies:

- packed file lists contain compiled JS;
- packed file lists contain declaration files;
- every package export resolves to an included file;
- package contents exclude source tests, Storybook static output, caches, and local artifacts;
- tarball names and package versions match the release version.

Expected tarballs:

```text
dist/release/tarballs/tyui-core-0.1.0.tgz
dist/release/tarballs/tyui-elements-0.1.0.tgz
dist/release/tarballs/tyui-define-0.1.0.tgz
dist/release/tarballs/tyui-solid-0.1.0.tgz
```

The target writes:

```text
dist/release/status/pack.json
dist/release/status/pack-output.json
dist/release/pack-report.md
```

## Smoke Gate

Run:

```sh
yarn nx run workspace:release:smoke --release-version=0.1.0 --tag=next --packages=core,elements,define,solid
```

The target creates `/tmp/tyui-release-smoke`.

The smoke app lists only `@toyu-ui/solid` as a direct TYUI dependency. Because this
is a pre-publish tarball smoke, npm `overrides` point Solid's transitive
`@toyu-ui/core`, `@toyu-ui/elements`, and `@toyu-ui/define` dependencies at the local
tarballs. That keeps the app-facing dependency rule intact while testing the
unpublished package set.

The smoke target verifies:

```sh
npm install
npx vite build
node --conditions=browser -e "<import @toyu-ui/solid in happy-dom>"
node --conditions=browser -e "<import @toyu-ui/solid/define/button in happy-dom>"
npx tsc --noEmit --moduleResolution bundler --module ES2022 --target ES2022 --jsx preserve --jsxImportSource solid-js --resolveJsonModule smoke.tsx
```

The target writes:

```text
dist/release/status/smoke.json
```

## Checklist Gate

Run:

```sh
yarn nx run workspace:release:checklist --release-version=0.1.0 --tag=next --packages=core,elements,define,solid
```

The checklist reads all status files, runs `npm whoami`, and writes:

```text
dist/release/checklist.md
dist/release/checklist.json
dist/release/status/checklist.json
```

When any gate is red, it exits non-zero and prints:

```text
Publish command: not available until all checks pass.
```

When every gate is green, it prints one shell-safe publish command in dependency
order:

```sh
npm publish dist/libs/core --access public --tag next && npm publish dist/libs/elements --access public --tag next && npm publish dist/libs/define --access public --tag next && npm publish dist/libs/solid --access public --tag next
```

The checklist target never publishes.

## Manual Publish

Publishing stays manual.

Before publishing:

```sh
npm whoami
yarn nx run workspace:release:checklist --release-version=0.1.0 --tag=next --packages=core,elements,define,solid
```

If and only if the checklist is all green, copy the printed command and paste it
into the terminal.

For a stable release, use `--tag=latest`. For a prerelease, use `--tag=next` or
another npm dist-tag.

## Post-Publish Gate

Run after manual publish:

```sh
yarn nx run workspace:release:postpublish --release-version=0.1.0 --tag=next --packages=core,elements,define,solid
```

The target checks npm metadata:

```sh
npm view @toyu-ui/core version dist-tags exports dependencies peerDependencies
npm view @toyu-ui/elements version dist-tags exports dependencies peerDependencies
npm view @toyu-ui/define version dist-tags exports dependencies peerDependencies
npm view @toyu-ui/solid version dist-tags exports dependencies peerDependencies
```

It then creates `/tmp/tyui-npm-smoke`, installs from npm, and verifies:

- a clean Solid app installs with `@toyu-ui/solid`;
- transitive package dependencies resolve;
- Vite builds;
- `@toyu-ui/solid` imports in a browser-conditioned DOM runtime;
- `@toyu-ui/solid/define/button` imports in a browser-conditioned DOM runtime;
- TypeScript resolves Solid exported subpaths;
- `@toyu-ui/solid/custom-elements.json` is importable;
- TanStack Intent skills are present in package contents through npm package assets.

The target writes:

```text
dist/release/status/postpublish.json
dist/release/postpublish-report.md
```

## Agent Workflow

Agents should run the same gates as humans:

1. Run `yarn install --immutable`.
2. Run `workspace:release:prepare`.
3. If a gate fails, fix the blocker and rerun that gate.
4. Run `workspace:release:checklist`.
5. If every check is green, present the printed publish command.
6. Do not publish unless the user explicitly asks for the manual publish step.
7. After the user publishes, run `workspace:release:postpublish`.

## Release Artifacts

```text
dist/release/
  checklist.json
  checklist.md
  pack-report.md
  postpublish-report.md
  status/
    metadata.json
    verify.json
    build.json
    package.json
    pack.json
    pack-output.json
    smoke.json
    checklist.json
    postpublish.json
  tarballs/
    tyui-core-0.1.0.tgz
    tyui-elements-0.1.0.tgz
    tyui-define-0.1.0.tgz
    tyui-solid-0.1.0.tgz
```

`dist/libs/<pkg>` remains the directory passed to `npm publish`.

## Stop-Release Gates

Stop the release if any of these fail:

1. immutable install;
2. metadata generation;
3. CEM/API/export parity;
4. format, lint, typecheck, tests, e2e, visual, Storybook build, or bundle-size checks;
5. library build or declaration generation;
6. publish-directory package assembly;
7. package export resolution;
8. `npm pack --dry-run` contents;
9. local tarball smoke test;
10. Solid smoke test with only `@toyu-ui/solid` as a direct TYUI dependency;
11. npm authentication;
12. post-publish npm metadata or npm consumer smoke.

If a gate is red, the checklist must not print a publish command.
