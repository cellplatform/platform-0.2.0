import { Config } from '../../../config.mjs';

export const tsconfig = Config.ts((e) => {
  e.env('web', 'web:react');
});

export default Config.vite(import.meta.url, (e) => {
  e.target('web');
  e.plugin('web:react');

  // e.externalDependency(e.ctx.deps.map((d) => d.name));

  // return;

  e.chunk('ext.lib.react', 'react');
  e.chunk('ext.lib.react.dom', 'react-dom');

  e.chunk('sys.util', 'sys.util');
  e.chunk('sys.text', 'sys.text');
  e.chunk('sys.css', 'sys.ui.react.css');
  e.chunk('sys.dev', ['sys.ui.react.dev', 'sys.test.spec']);

  e.chunk('ext.lib.crdt.repo', '@automerge/automerge-repo');
  e.chunk('ext.lib.crdt.repo.idb', '@automerge/automerge-repo-storage-indexeddb');
  e.chunk('ext.lib.crdt.repo.msg', '@automerge/automerge-repo-network-messagechannel');
  e.chunk('ext.lib.crdt.repo.ws', '@automerge/automerge-repo-network-websocket');

  // e.chunk('@automerge/automerge-repo-storage-indexeddb', 'ext.lib.automerge-idb');
  // e.chunk('@automerge/automerge-repo-network-messagechannel', 'ext.lib.automerge-mc');
  // e.chunk('@automerge/automerge-repo-network-websocket', 'ext.lib.automerge-ns');
  // e.chunk('ext.driver.automerge', 'ext.driver.automerge');
});
