export const Import = {
  Repo: () => import('@automerge/automerge-repo'),
  IndexedDB: () => import('@automerge/automerge-repo-storage-indexeddb'),
  MessageChannel: () => import('@automerge/automerge-repo-network-messagechannel'),
  WebSocket: () => import('@automerge/automerge-repo-network-websocket'),
} as const;
