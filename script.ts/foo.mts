#!/usr/bin/env ts-node

export {};

console.log('tmp.foo');

// import { Filesystem } from './tmp.libs.mjs';
// console.log('Filesystem', Filesystem);
//
// const fs = Filesystem.Path.join('foo', 'bar');
// console.log('fs', fs);

import { Builder } from './common/index.mjs';

const dir = process.cwd();

console.log('Builder', Builder);
console.log('-------------------------------------------');
console.log('dir', dir);

// Builder.

import { Path, Filesystem } from '../code/system/sys.fs.node/src/index.mjs';
// import { rx } from '../code/system/sys.util/src/index.mjs';

console.log('Path', Path);
console.log('Filesystem', Filesystem);

console.log('-------------------------------------------');
