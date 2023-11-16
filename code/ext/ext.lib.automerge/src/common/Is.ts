import { isValidAutomergeUrl } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
import { Typenames } from './constants';
import { PatchState } from './libs';
import type * as t from './t';

export const Is = {
  automergeUrl(input: any): input is t.AutomergeUrl {
    return typeof input === 'string' ? isValidAutomergeUrl(input) : false;
  },

  store(input: any): input is t.Store {
    if (!isObject(input) || !isObject(input.doc)) return false;
    if (!Is.repo(input.repo)) return false;
    return (
      typeof input.doc.factory === 'function' &&
      typeof input.doc.exists === 'function' &&
      typeof input.doc.get === 'function' &&
      typeof input.doc.getOrCreate === 'function'
    );
  },

  storeIndex(input: any): input is t.StoreIndex {
    if (!isObject(input)) return false;
    const index = input as t.StoreIndex;
    return index.kind === 'store:index' && Is.store(index.store);
  },

  webStore(input: any): input is t.WebStore {
    return typeof input.Provider === 'function' && Is.store(input);
  },

  repo(input: any): input is t.Repo {
    if (!isObject(input)) return false;
    const { networkSubsystem, storageSubsystem } = input;
    if (!Is.networkSubsystem(networkSubsystem)) return false;
    if (storageSubsystem && !Is.storageSubsystem(storageSubsystem)) return false;
    return true;
  },

  repoIndex(input: any): input is t.RepoIndex {
    if (!isObject(input)) return false;
    const subject = input as t.RepoIndex;
    return Array.isArray(subject.docs);
  },

  repoListState(input: any): input is t.RepoListState {
    if (!isObject(input)) return false;
    return PatchState.Is.type(input, Typenames.RepoList.List);
  },

  repoListModel(input: any): input is t.RepoListModel {
    if (!isObject(input)) return false;
    const model = input as t.RepoListModel;
    return (
      typeof model.ctx === 'function' &&
      Is.repoListState(model.list?.state) &&
      Is.webStore(model.store) &&
      Is.storeIndex(model.index)
    );
  },

  networkSubsystem(input: any): input is t.Repo['networkSubsystem'] {
    if (!isObject(input)) return false;
    return (
      typeof input.peerId === 'string' &&
      typeof input.isReady === 'function' &&
      typeof input.whenReady === 'function' &&
      typeof input.send === 'function'
    );
  },

  storageSubsystem(input: any): input is Required<t.Repo['storageSubsystem']> {
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
} as const;

/**
 * Helpers
 */
export function isObject(input: any): input is Object {
  return input !== null && typeof input === 'object';
}
