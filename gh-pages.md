# GitHub Pages Storybook Deployment

TYUI deploys the Elements Storybook to GitHub Pages with `.github/workflows/deploy-storybook.yml`.

## 1. Enable Pages

1. Open the GitHub repository.
2. Go to **Settings**.
3. Open **Pages**.
4. Set **Build and deployment** source to **GitHub Actions**.
5. Save the setting.

GitHub creates the `github-pages` environment after the first deployment run.

## 2. Check Actions Permissions

1. Open **Settings**.
2. Open **Actions**.
3. Open **General**.
4. Under **Workflow permissions**, allow workflows to create deployments.
5. Keep the repository token read permission for contents. The workflow grants `pages: write` and `id-token: write` itself.

## 3. Run The Workflow

The workflow runs on pushes to `main` that touch Storybook, source, design, tooling, or dependency files.

You can also run it by hand:

1. Open **Actions**.
2. Select **Deploy Storybook**.
3. Select **Run workflow**.
4. Choose the branch.
5. Start the run.

## 4. Local Build Check

Run the same Storybook build before pushing:

```sh
node .yarn/releases/yarn-4.5.0.cjs nx run elements:storybook --mode=build
```

The build writes static files to:

```text
libs/elements/storybook-static
```

The workflow uploads that directory with `actions/upload-pages-artifact`.

## 5. Deployment Flow

The workflow performs these steps:

1. Checks out the repo.
2. Sets up Node 22.
3. Enables Corepack.
4. Installs dependencies with `yarn install --immutable`.
5. Builds Storybook with `yarn nx run elements:storybook --mode=build`.
6. Adds `.nojekyll` to the static output.
7. Uploads `libs/elements/storybook-static` as a Pages artifact.
8. Deploys it with `actions/deploy-pages`.

## 6. Published URL

GitHub prints the deployed URL in the workflow summary. The URL usually follows this shape:

```text
https://<owner>.github.io/<repo>/
```

Use the workflow output as the source of truth, since organization Pages settings can change the final URL.

## 7. Troubleshooting

- **Pages says no deployment source exists:** set Pages source to **GitHub Actions**.
- **Deploy job lacks permission:** check repository Actions settings and keep the workflow `pages: write` and `id-token: write` permissions.
- **Assets 404 after deploy:** rerun the workflow and confirm `.nojekyll` exists in the artifact.
- **Build fails on dependency install:** run `yarn install --immutable` locally and commit lockfile changes when dependencies changed.
- **Storybook builds locally but not in Actions:** check case-sensitive import paths. Ubuntu runners enforce path casing.
