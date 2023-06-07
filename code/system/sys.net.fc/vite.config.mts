import { Config } from '../../../config.mjs';

export const tsconfig = Config.ts((e) => {
  e.env('web', 'web:react');
});

export default Config.vite(import.meta.url, (e) => {
  e.lib({
    entry: {
      index: 'src/index.mts',
      specs: 'src/test.ui/entry.Specs.mts',
    },
  });
  e.target('web');
  e.plugin('web:react');
  e.externalDependency(e.ctx.deps.map((d) => d.name));

  // e.chunk('ext.fc', ['@farcaster/hub-web', '@farcaster/core']);
  // e.chunk('ext.fc', ['@farcaster/core']);
  // e.chunk('ext.crypto', ['@noble/ed25519']);
  e.chunk('ext.rx', ['rxjs', 'symbol-observable']);
});
