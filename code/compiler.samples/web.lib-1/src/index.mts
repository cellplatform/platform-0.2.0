export {};
import { Pkg } from './index.pkg.mjs';

import('./Bar.mjs');

export const Root = {
  async foo() {
    return (await import('./Foo.mjs')).Foo;
  },
};

export default Root;

console.info(`Package: ${Pkg.name} | v${Pkg.version}`);
