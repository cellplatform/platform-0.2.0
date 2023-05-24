import { Pkg } from './index.pkg.mjs';

import('./logic/Bar.mjs');

// import { Bar } from './logic/Bar.mjs';
// console.log('Bar', Bar);

export const Root = {
  async foo() {
    return (await import('./logic/Foo.mjs')).Foo;
  },
};

export default Root;

console.info(`Package: ${Pkg.name} | v${Pkg.version}`);
