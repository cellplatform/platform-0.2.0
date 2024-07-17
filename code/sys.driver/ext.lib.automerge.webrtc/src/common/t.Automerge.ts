/**
 * @ext
 */
export type { next as A } from '@automerge/automerge';

export type {
  Message as AutomergeMessage,
  PeerId as AutomergePeerId,
  RepoMessage as AutomergeRepoMessage,
  StorageId as AutomergeStorageId,
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
  Doc,
  DocChanged,
  DocEphemeralIn,
  DocEphemeralOut,
  DocEvents,
  DocMeta,
  DocMetaType,
  DocUri,
  DocWithHandle,
  DocWithMeta,
  InfoDataDocUri,
  Lens,
  LensEvents,
  NamespaceManager,
  NamespaceMap,
  Store,
  StoreIndex,
  StoreIndexItem,
  StoreNetworkKind,
  WebStore,
  WebStoreIndex,
} from 'ext.lib.automerge/src/types';
