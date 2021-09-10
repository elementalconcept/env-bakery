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
      updateEnvironment(),
      updateMainTs(),
      removeFileReplacements(),
      finalize()
    ]);
  };
}

function boilerplate(options: any): Rule {
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

function updateEnvironment(): Rule {
  const envStart = 'export const environment = {';
  const envEnd = '};';
  const prodFlag = 'production: false';

  const envStartReplace = 'export const environment = () => ({';
  const envEndReplace = '});';
  const prodFlagReplace = `production: getEnv('PRODUCTION').boolean()`;

  return (tree: Tree) => {
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
      console.log(`"${path}" was updated!`);
    } else {
      console.log(`File "${path}" does not have familiar code structure, skipping...`);
    }

    return tree;
  };
}

function updateMainTs(): Rule {
  const envImport = `import { environment } from './environments/environment';`;
  const mainStart = `if (environment.production) {`;
  const mainEnd = `.catch(err => console.error(err));`;

  const envImportReplace = `import { bakeEnv } from '@elemental-concept/env-bakery';`;
  const mainStartReplace =
    `bakeEnv(() => import('./environments/environment')).then((environment: any) => {\n\n${mainStart}`;
  const mainEndReplace = `${mainEnd}\n\n});`;

  return (tree: Tree) => {
    const path = 'src/main.ts';
    const file = tree.read(path);
    const source = file?.toString();

    if (source === undefined) {
      console.log(`File "${path}" was not found, skipping...`);
      return tree;
    }

    if (source.indexOf(envImport) >= 0 && source.indexOf(mainStart) >= 0 && source.indexOf(mainEnd) >= 0) {
      const result = source
        .replace(envImport, envImportReplace)
        .replace(mainStart, mainStartReplace)
        .replace(mainEnd, mainEndReplace);

      tree.overwrite(path, result);
      console.log(`"${path}" was updated!`);
    } else {
      console.log(`File "${path}" does not have familiar code structure, skipping...`);
    }

    return tree;
  };
}

function removeFileReplacements(): Rule {
  const fileReplacements = 'fileReplacements';
  const envName = 'src/environments/environment.ts';

  return (tree: Tree) => {
    const path = 'angular.json';
    const file = tree.read(path);
    const source = file?.toString();

    if (source === undefined) {
      console.log(`File "${path}" was not found, skipping...`);
      return tree;
    }

    const json = JSON.parse(source);

    eachKey(
      json,
      fileReplacements,
      (object, key) => {
        const replacements = object[key];

        if (replacements instanceof Array) {
          object[key] = replacements.filter(item => item?.replace !== envName);
        }
      }
    );

    tree.overwrite(path, JSON.stringify(json, null, 2));
    console.log(`"${path}" was updated!`);

    return tree;
  };
}

function finalize(): Rule {
  return (tree: Tree) => {
    console.log(`\n\n==========\n`);
    console.log('@elemental-concept/env-bakery was installed!');
    console.log('Please check logs above to see if any project files were successfully modified');
    console.log('and check that all modifications were made correctly and your project is still working.');
    console.log('\nYou can now delete environment files, except for src/environments/environment.ts.');
    console.log(`\n==========\n\n`);

    return tree;
  };
}

function eachKey(object: any, key: string, callback: (source: any, key: string) => void): void {
  Object.keys(object)
    .forEach(k => {
      if (k === key) {
        callback(object, key);
        return;
      }

      if (object[k] instanceof Object && !(object[k] instanceof Array)) {
        eachKey(object[k], key, callback);
        return;
      }
    });
}
