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
  name: 'ext.lib.peer.p2p',
  version: '0.0.0',
  dependencies: {
    '@libp2p/bootstrap': '10.0.6',
    '@libp2p/webrtc-star': '7.0.0',
    '@libp2p/websockets': '8.0.6',
    '@libp2p/mplex': '10.0.6',
    '@libp2p/webrtc': '4.0.9',
    '@chainsafe/libp2p-noise': '14.0.0',
    '@chainsafe/libp2p-yamux': '6.0.1',
    'libp2p': '1.0.9',
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