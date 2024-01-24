import { Config } from '../../../Config';

export const tsconfig = Config.ts((e) => e.env('web'));

export default Config.vite(import.meta.url, (e) => {
  e.lib({
    entry: {
      index: '/src/index.mts',
      Foo: '/src/Foo.mts',
    },
  });
  e.target('node');
  e.externalDependency(e.ctx.deps.map((d) => d.name));
});
