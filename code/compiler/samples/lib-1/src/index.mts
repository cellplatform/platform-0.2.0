import { Foo } from './foo';

export const Name = 'lib-1';
export const Bar = { ...Foo, count: 123 };
export { Foo };

console.log('👋 libs-1 / main.ts');

export const Imports = {
  bar: import('./child/bar.mjs'),
  two: import('./two'),
};

export * from './types';

import * as t from './types';
export { t };

/**
 * Workers
 * https://vitejs.dev/guide/features.html#web-workers
 */

// import('./workers/Web.Worker.mjs');

// const url = new URL('./workers/Web.Worker.ts?worker&inline&module', import.meta.url);
// const worker1 = new Worker(url);

// console.log('worker1', worker1);

// import MyWorker from './workers/Web.Worker.mjs?worker';
// console.log('imported worker', new MyWorker());

// const f = import('./workers/Web.Worker.mjs?worker');
// const url = new URL('./workers/Web.Worker.js?worker&inline&module', import.meta.url);
