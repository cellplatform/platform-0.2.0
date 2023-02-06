/**
 * 💦 THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY 💦
 *
 *    This file is generated on each build.
 *    It reflects basic meta-data about the module and it's dependencies
 *    Use it via a standard `import` statement
 *
 *    - DO NOT manually edit.
 *    - DO commit to source-control.
 */

export const Pkg: ModuleDef = {
  name: 'sys.ui.react.common',
  version: '0.0.0',
  dependencies: {
    'sys.types': '0.0.0',
    'sys.util': '0.0.0',
    'sys.text': '0.0.0',
    'sys.ui.dom': '0.0.0',
    'sys.ui.react.util': '0.0.0',
    'sys.ui.react.css': '0.0.0',
    'react': '18.2.0',
    'react-dom': '18.2.0',
    'react-icons': '4.7.1',
    'react-spinners': '0.13.8',
    'react-inspector': '6.0.1',
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
