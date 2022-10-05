export {};
import { Pkg } from './index.pkg.mjs';

export const Root = {
  async loadFoo() {
    return (await import('./Foo.mjs')).Foo;
  },
};

export default Root;

console.info(`Package: ${Pkg.name} | v${Pkg.version}`);
