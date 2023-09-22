export {};
declare const self: SharedWorkerGlobalScope;

/**
 * Based on:
 *   https://github.com/automerge/automerge-repo/blob/main/examples/automerge-repo-demo-counter/src/shared-worker.ts
 */

self.addEventListener('connect', (e: MessageEvent) => configureChannel(e.ports[0]));

const Import = {
  Peer: () => import('../repo/Peer'), // Peer: () => import('ext.driver.automerge'),
  Repo: () => import('@automerge/automerge-repo'),
  IndexedDB: () => import('@automerge/automerge-repo-storage-indexeddb'),
  MessageChannel: () => import('@automerge/automerge-repo-network-messagechannel'),
  WebSocket: () => import('@automerge/automerge-repo-network-websocket'),
} as const;

const wait = (async () => {
  const { Peer } = await Import.Peer();
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

async function configureChannel(port: MessagePort) {
  const repo = await wait;
  const { MessageChannelNetworkAdapter } = await Import.MessageChannel();
  const channel = new MessageChannelNetworkAdapter(port, { useWeakRef: true });
  repo.networkSubsystem.addNetworkAdapter(channel);
}
