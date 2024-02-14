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
  name: 'ext.lib.automerge',
  version: '0.0.0',
  dependencies: {
    '@automerge/automerge': '2.1.10',
    '@automerge/automerge-repo': '1.1.1',
    '@automerge/automerge-repo-network-broadcastchannel': '1.1.1',
    '@automerge/automerge-repo-react-hooks': '1.1.1',
    '@automerge/automerge-repo-storage-indexeddb': '1.1.1',
    '@onsetsoftware/automerge-patcher': '0.10.0',
    'react': '18.2.0',
    'react-dom': '18.2.0',
    'sys.data.indexeddb': '0.0.0',
    'sys.data.json': '0.0.0',
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
