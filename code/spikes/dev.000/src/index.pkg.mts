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
  name: 'dev.000',
  version: '0.6.65',
  dependencies: {
    '@automerge/automerge': '2.1.10',
    '@automerge/automerge-repo': '1.1.1',
    '@automerge/automerge-repo-network-messagechannel': '1.1.1',
    '@automerge/automerge-repo-react-hooks': '1.1.1',
    '@automerge/automerge-repo-storage-indexeddb': '1.1.1',
    'ext.lib.ai.faceapi': '0.0.0',
    'ext.lib.ai.openai': '0.0.0',
    'ext.lib.automerge': '0.0.0',
    'ext.lib.automerge.webrtc': '0.0.0',
    'ext.lib.codemirror': '0.0.0',
    'ext.lib.deno': '0.0.0',
    'ext.lib.monaco': '0.0.0',
    'ext.lib.peerjs': '0.0.0',
    'ext.lib.privy': '0.0.0',
    'ext.lib.protocol.hats': '0.0.0',
    'ext.lib.stripe': '0.0.0',
    'ext.lib.tldraw': '0.0.0',
    'ext.lib.vimeo': '0.0.0',
    'react': '18.2.0',
    'react-dom': '18.2.0',
    'sys.data.crdt': '0.0.0',
    'sys.data.indexeddb': '0.0.0',
    'sys.fs': '0.0.0',
    'sys.fs.indexeddb': '0.0.0',
    'sys.text': '0.0.0',
    'sys.ui.react.common': '0.0.0',
    'sys.ui.react.concept': '0.0.0',
    'sys.ui.react.dev': '0.0.0',
    'sys.ui.react.media': '0.0.0',
    'sys.ui.react.media.image': '0.0.0',
    'sys.ui.react.media.video': '0.0.0',
    'sys.ui.react.monaco': '0.0.0',
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
