/**
 * [GENERATED FILE]
 *    This file is generated on each build.
 *    Use it (via an import) to determine basic facts about the bundled module.
 *
 *    - Do not manually edit.
 *    - Do commit it to source-control.
 */

export const Pkg: ModuleDef = {
  name: 'sys.data.crdt',
  version: '0.0.0',
  dependencies: {
    'sys.fs': '0.0.0',
    'sys.types': '0.0.0',
    'sys.util': '0.0.0',
    'automerge': '1.0.1-preview.7',
  },
  toString() {
    return `💦 module: ${Pkg.name} (v${Pkg.version})`;
  },
};

export type ModuleDef = {
  name: string;
  version: string;
  dependencies: { [key: string]: string };
  toString(): string;
};
