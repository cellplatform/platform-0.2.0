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
  name: 'ext.lib.ai.faceapi',
  version: '0.0.0',
  dependencies: {
    'react': '18.2.0',
    'react-dom': '18.2.0',
    'face-api.js': '0.22.2',
    'sys.util': '0.0.0',
    'sys.ui.react.common': '0.0.0',
    '@tensorflow/tfjs-core': '4.17.0',
    '@tensorflow/tfjs-backend-wasm': '4.17.0',
    '@tensorflow-models/face-landmarks-detection': '1.0.5',
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
