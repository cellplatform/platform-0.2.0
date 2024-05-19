/**
 * 💦 THIS IS AN AUTOGENERATED FILE. DO NOT EDIT DIRECTLY 💦
 *
 *    This file is generated on each build.
 *    It reflects basic meta-data about the module and it's dependencies
 *    Use it via a standard `import` statement
 *
 *    - DO NOT manually edit.
 *    - DO commit to source-control.
 */

export const Pkg: ModuleDef = {
  name: 'sys.ui.react.monaco',
  version: '0.0.0',
  dependencies: {
    '@automerge/automerge': '2.2.2',
    '@automerge/automerge-repo': '1.1.12',
    '@monaco-editor/react': '4.6.0',
    'diff': '5.2.0',
    'ext.lib.automerge': '0.0.0',
    'monaco-editor': '0.48.0',
    'react': '18.3.1',
    'react-dom': '18.3.1',
    'sys.text': '0.0.0',
    'sys.ui.react.common': '0.0.0',
    'sys.ui.react.util': '0.0.0',
    'sys.util': '0.0.0',
  },
  toString() {
    return `${Pkg.name}@${Pkg.version}`;
  },
};

export type ModuleDef = {
  name: string;
  version: string;
  dependencies: { [key: string]: string };
  toString(): string;
};