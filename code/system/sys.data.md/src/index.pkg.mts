/**
 * [GENERATED FILE]
 *    This file is generated on each build.
 *    Use it (via an import) to determine basic facts about the bundled module.
 *
 *    - Do not manually edit.
 *    - Do commit it to source-control.
 */

export const Pkg: ModuleDef = {
  name: 'sys.data.md',
  version: '0.0.0',
  dependencies: {
    'sys.types': '0.0.0',
    'sys.util': '0.0.0',
    'sys.util.css': '0.0.0',
    'sanitize-html': '2.7.1',
    'rehype-format': '4.0.1',
    'rehype-stringify': '9.0.3',
    'remark-parse': '10.0.1',
    'remark-rehype': '10.1.0',
    'unified': '10.1.2',
    'react': '18.2.0',
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
