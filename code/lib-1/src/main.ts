import { Foo } from './foo';

export const Name = 'lib-1';
export const Bar = { ...Foo, count: 123 };
export { Foo };

console.log('👋 libs-1 / main.ts');

export const Imports = {
  bar: import('./child/bar'),
  two: import('./two'),
};

export * from './types';

import * as t from './types';
export { t };
