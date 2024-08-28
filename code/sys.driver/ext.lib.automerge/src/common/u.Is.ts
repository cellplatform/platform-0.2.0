import { DocHandle, isValidAutomergeUrl } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
import { Symbols, Typenames } from './constants';
import { PatchState } from './libs';

import type * as t from './t';

type O = Record<string, unknown>;
type SymbolType = (typeof Symbols)[keyof typeof Symbols];

export const Is = {
  automergeUrl(input: any): input is t.AutomergeUrl {
    return typeof input === 'string' ? isValidAutomergeUrl(input) : false;
  },

  doc<T extends O>(input: any): input is t.Doc<T> {
    return isObjectType(input, Symbols.Doc);
  },

  lens<T extends O>(input: any): input is t.Lens<T> {
    return isObjectType(input, Symbols.Lens);
  },

  store(input: any): input is t.Store {
    return isObjectType(input, Symbols.Store);
  },

  storeIndex(input: any): input is t.StoreIndex {
    return isObjectType(input, Symbols.StoreIndex);
  },

  webStore(input: any): input is t.WebStore {
    return isObjectType(input, Symbols.WebStore);
  },

  repo(input: any): input is t.AutomergeRepo {
    if (!isObject(input)) return false;
    const { networkSubsystem, storageSubsystem } = input;
    if (!Is.networkSubsystem(networkSubsystem)) return false;
    if (storageSubsystem && !Is.storageSubsystem(storageSubsystem)) return false;
    return true;
  },

  repoIndex(input: any): input is t.StoreIndexDoc {
    if (!isObject(input)) return false;
    const subject = input as t.StoreIndexDoc;
    return Array.isArray(subject.docs);
  },

  repoListState(input: any): input is t.RepoListState {
    if (!isObject(input)) return false;
    return PatchState.Is.type(input, Typenames.RepoList.List);
  },

  repoListModel(input: any): input is t.RepoListModel {
    if (!isObject(input)) return false;
    const { list, store, index } = input as t.RepoListModel;
    return Is.repoListState(list?.state) && Is.webStore(store) && Is.storeIndex(index);
  },

  networkSubsystem(input: any): input is t.AutomergeRepo['networkSubsystem'] {
    if (!isObject(input)) return false;
    return (
      typeof input.peerId === 'string' &&
      typeof input.isReady === 'function' &&
      typeof input.whenReady === 'function' &&
      typeof input.send === 'function'
    );
  },

  storageSubsystem(input: any): input is Required<t.AutomergeRepo['storageSubsystem']> {
    if (!isObject(input)) return false;
    return (
      typeof input.loadDoc === 'function' &&
      typeof input.saveDoc === 'function' &&
      typeof input.remove === 'function'
    );
  },

  broadcastChannel(input: any): input is BroadcastChannelNetworkAdapter {
    return input instanceof BroadcastChannelNetworkAdapter;
  },

  namespace<N extends string = string>(input: any): input is t.NamespaceManager<N> {
    return isObjectType(input, Symbols.Namespace);
  },

  handle<T extends O>(input: any): input is typeof DocHandle<T> {
    return input instanceof DocHandle;
  },
} as const;

/**
 * Helpers
 */
export function isObject(input: any): input is Object {
  return input !== null && typeof input === 'object';
}

const isObjectType = (input: any, type: SymbolType) => {
  if (!isObject(input)) return false;
  return input[Symbols.kind] === type;
};
