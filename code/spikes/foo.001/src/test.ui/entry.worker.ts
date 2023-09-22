import { Peer } from 'ext.driver.automerge/Peer';
declare const self: SharedWorkerGlobalScope;

self.addEventListener('connect', (e: MessageEvent) => configureChannel(e.ports[0]));

const Import = {
  Repo: () => import('@automerge/automerge-repo'),
  IndexedDB: () => import('@automerge/automerge-repo-storage-indexeddb'),
  MessageChannel: () => import('@automerge/automerge-repo-network-messagechannel'),
  WebSocket: () => import('@automerge/automerge-repo-network-websocket'),
} as const;

const wait = (async () => {
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
  console.log('port', port);
  const repo = await wait;
  console.log('repo', repo);
  const { MessageChannelNetworkAdapter } = await Import.MessageChannel();
  const channel = new MessageChannelNetworkAdapter(port, { useWeakRef: true });
  repo.networkSubsystem.addNetworkAdapter(channel);
}
