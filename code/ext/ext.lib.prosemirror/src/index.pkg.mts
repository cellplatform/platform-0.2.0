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
  name: 'ext.lib.prosemirror',
  version: '0.0.0',
  dependencies: {
    'prosemirror-state': '1.4.3',
    'prosemirror-view': '1.32.3',
    'prosemirror-model': '1.19.3',
    'prosemirror-schema-basic': '1.2.2',
    'prosemirror-schema-list': '1.3.0',
    'prosemirror-example-setup': '1.2.2',
    'react': '18.2.0',
    'react-dom': '18.2.0',
    'sys.util': '0.0.0',
    'sys.ui.react.common': '0.0.0',
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
