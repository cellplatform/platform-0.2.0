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
  name: 'sys.net.fc',
  version: '0.0.0',
  dependencies: {
    '@farcaster/core': '0.12.5',
    '@farcaster/hub-web': '0.6.2',
    '@improbable-eng/grpc-web': '0.15.0',
    '@improbable-eng/grpc-web-node-http-transport': '0.15.0',
    '@noble/ed25519': '2.0.0',
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
