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
  name: 'sys.text',
  version: '0.0.0',
  dependencies: {
    'approx-string-match': '2.0.0',
    'diff': '5.1.0',
    'rehype-sanitize': '6.0.0',
    'rehype-stringify': '10.0.0',
    'rehype-format': '5.0.0',
    'remark-frontmatter': '5.0.0',
    'remark-gfm': '4.0.0',
    'remark-rehype': '11.0.0',
    'remark-parse': '11.0.0',
    'remark-stringify': '11.0.0',
    'retext-english': '5.0.0',
    'retext-stringify': '4.0.0',
    'sys.util': '0.0.0',
    'unified': '11.0.4',
    'unist-util-select': '5.1.0',
    'yaml': '2.3.4',
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
