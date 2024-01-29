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
  name: 'ext.lib.privy',
  version: '0.0.0',
  dependencies: {
    '@privy-io/react-auth': '1.54.3',
    'react': '18.2.0',
    'react-dom': '18.2.0',
    'sys.util': '0.0.0',
    'sys.ui.react.common': '0.0.0',
    'viem': '2.5.0',
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
