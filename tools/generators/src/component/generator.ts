import type { Tree } from '@nx/devkit';
import { formatFiles, names } from '@nx/devkit';
import type { ComponentGeneratorSchema } from './schema';

export default async function componentGenerator(tree: Tree, schema: ComponentGeneratorSchema) {
  const component = names(schema.name);
  const docPath = `docs/components/${component.fileName}.md`;

  if (!tree.exists(docPath)) {
    tree.write(
      docPath,
      `# ${component.className}\n\nStatus: draft\n\n## Contract\n\nLink this document to the matching spec contract before implementation.\n`,
    );
  }

  await formatFiles(tree);
}
