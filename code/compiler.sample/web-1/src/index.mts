export {};

export const Root = {
  async loadFoo() {
    return (await import('./Foo.mjs')).Foo;
  },
};

export default Root;
