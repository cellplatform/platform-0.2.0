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
  PeerjsNetworkAdapter,
  NetworkMessage,
  NetworkMessageAlert,
} from 'automerge-repo-network-peerjs';

/**
 * @lib
 */
export type {
  DocChanged,
  DocEphemeralIn,
  DocEphemeralOut,
  DocMeta,
  DocMetaType,
  DocRef,
  DocRefHandle,
  DocUri,
  DocWithMeta,
  Lens,
  NamespaceManager,
  NamespaceMap,
  Store,
  StoreIndexDoc,
  StoreIndexState,
  StoreNetworkKind,
  WebStore,
  WebStoreIndex,
} from 'ext.lib.automerge/src/types';
