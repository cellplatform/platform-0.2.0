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
  name: 'sys.ui.react.dev',
  version: '0.0.0',
  dependencies: {
    'react-inspector': '6.0.2',
    'sys.util': '0.0.0',
    'sys.data.text': '0.0.0',
    'sys.ui.react.util': '0.0.0',
    'sys.ui.react.css': '0.0.0',
    'sys.test.spec': '0.0.0',
    'react': '18.3.1',
    'react-dom': '18.3.1',
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
