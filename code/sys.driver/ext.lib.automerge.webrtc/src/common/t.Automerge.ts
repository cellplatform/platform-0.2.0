/**
 * @ext
 */
export type { next as A } from '@automerge/automerge';

export type {
  Message as CrdtMessage,
  PeerId as CrdtPeerId,
  RepoMessage as CrdtRepoMessage,
  StorageId as CrdtStorageId,
  NetworkAdapter,
} from '@automerge/automerge-repo';

export type {
  NetworkMessage,
  NetworkMessageAlert,
  PeerjsNetworkAdapter,
} from 'automerge-repo-network-peerjs';

/**
 * @lib
 */
export type {
  InfoData as CrdtInfoData,
  InfoStatefulController as CrdtInfoStatefulController,
  Doc,
  DocChanged,
  DocEphemeralIn,
  DocEphemeralOut,
  DocEvents,
  DocMap,
  DocMeta,
  DocMetaType,
  DocWithHandle,
  DocWithMeta,
  InfoDoc,
  InfoDocAddress,
  Lens,
  LensEvents,
  NamespaceManager,
  NamespaceMap,
  RepoListBehavior,
  RepoListHandlers,
  RepoListModel,
  Store,
  StoreIndex,
  StoreIndexItem,
  StoreNetworkKind,
  WebStore,
  WebStoreIndex,
} from 'ext.lib.automerge/src/types';

export type { ConnectorBehavior, PeerStreamSelectionHandler } from 'ext.lib.peerjs/src/types';
