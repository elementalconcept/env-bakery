import { strings } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain,
  empty,
  mergeWith,
  Rule,
  SchematicContext,
  Tree,
  url
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export function ngAdd(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    return chain([
      mergeWith(apply(empty(), [boilerplate(options)])),
      updateEnvironment()
    ]);
  };
}

export function boilerplate(options: any): Rule {
  return mergeWith(
    apply(
      url('./files'),
      [
        applyTemplates({
          ...options,
          utils: strings,
          dot: '.'
        })
      ]
    )
  );
}

export function updateEnvironment(): Rule {
  const envStart = 'export const environment = {';
  const envEnd = '};';
  const prodFlag = 'production: false';

  const envStartReplace = 'export const environment = () => ({';
  const envEndReplace = '});';
  const prodFlagReplace = 'production: getEnv(\'PRODUCTION\').boolean()';

  return (tree: Tree, context: SchematicContext) => {
    const path = 'src/environments/environment.ts';
    const file = tree.read(path);
    const source = file?.toString();

    if (source === undefined) {
      console.log(`File "${path}" was not found, skipping...`);
      return tree;
    }

    const envStartIndex = source.indexOf(envStart);
    const envEndIndex = source.indexOf(envEnd);
    const prodFlagIndex = source.indexOf(prodFlag);

    if (
      envStartIndex >= 0 && prodFlagIndex > envStartIndex && envEndIndex > envStartIndex && envEndIndex > prodFlagIndex
    ) {
      const result = `import { getEnv } from '@elemental-concept/env-bakery';\n\n`
        + source
          .replace(envStart, envStartReplace)
          .replace(envEnd, envEndReplace)
          .replace(prodFlag, prodFlagReplace);

      tree.overwrite(path, result);
    } else {
      console.log(`File "${path}" does not have familiar code structure, skipping...`);
    }

    return tree;
  };
}
