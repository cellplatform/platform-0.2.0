import { Config } from '../../../Config';

export default Config.vite(import.meta.url, (e) => {
  e.lib({
    entry: {
      index: '/src/index.mts',
      Foo: '/src/logic/Foo.mts',
      Bar: '/src/logic/Bar.mts',
    },
  });
  // e.target('web');
  e.target('web', 'node');
  // e.target('node', 'web');
  e.externalDependency(e.ctx.deps.map((d) => d.name));
});
