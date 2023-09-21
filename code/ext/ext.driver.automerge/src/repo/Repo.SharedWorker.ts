/// <reference lib="webworker" />

import { Import } from './Import';
import { Peer } from './Peer';

declare const self: SharedWorkerGlobalScope;
export {};

/**
 * Reference:
 * - https://github.com/automerge/automerge-repo
 * - https://github.com/automerge/automerge-repo/blob/main/examples/automerge-repo-demo-counter/src/shared-worker.ts
 *
 * Debug console:
 *
 *   In Chrome-derived browsers the URL is
 *      chrome://inspect/#workers
 *
 *   In Firefox it's
 *      about:debugging#workers
 *
 *   In Safari it's
 *      Develop > Show Web Inspector > Storage > IndexedDB > automerge-repo-demo-counter.
 *
 */
self.addEventListener('connect', (e: MessageEvent) => {
  configureRepoNetworkPort(e.ports[0]);
});

/**
 * 🐷
 *  Because automerge is a WASM module and loads asynchronously,
 *  a bug in Chrome causes the 'connect' event to fire before the
 *  module is loaded. This promise lets us block until the module loads
 *  even if the event arrives first.
 *
 *  Ideally Chrome would fix this upstream but this isn't a terrible hack.
 */
const repoPromise = (async () => {
  const { Repo } = await Import.Repo();
  const { IndexedDBStorageAdapter } = await Import.IndexedDB();
  const { BrowserWebSocketClientAdapter } = await Import.WebSocket();
  return new Repo({
    peerId: Peer.id.generate('SharedWorker'),
    storage: new IndexedDBStorageAdapter(),
    network: [new BrowserWebSocketClientAdapter('ws://localhost:3030')],
    sharePolicy: async (peerId) => Peer.id.is('StorageServer', peerId),
  });
})();

async function configureRepoNetworkPort(port: MessagePort) {
  const repo = await repoPromise;
  const { MessageChannelNetworkAdapter } = await Import.MessageChannel();

  /**
   * Be careful to not accidentally create a strong reference to port
   * that will prevent dead ports from being garbage collected.
   */
  repo.networkSubsystem.addNetworkAdapter(
    new MessageChannelNetworkAdapter(port, { useWeakRef: true }),
  );
}
