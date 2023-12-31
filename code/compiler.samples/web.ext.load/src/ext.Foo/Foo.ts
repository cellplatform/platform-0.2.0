// import { Pkg } from '../common';

export const Foo = {
  // Pkg,
  count: 0,
  run() {
    console.log('Foo', Foo);
  },
} as const;

Foo.run();
