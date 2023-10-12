import { isValidAutomergeUrl } from '@automerge/automerge-repo';
import type * as t from './types';

export const Is = {
  store(input: any): input is t.Store {
    if (!isObject(input) || !isObject(input.doc)) return false;
    if (!Is.repo(input.repo)) return false;
    return (
      typeof input.doc.findOrCreate === 'function' &&
      typeof input.doc.factory === 'function' &&
      typeof input.doc.exists === 'function'
    );
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

  automergeUrl(input: any): input is t.AutomergeUrl {
    return typeof input === 'string' ? isValidAutomergeUrl(input) : false;
  },
} as const;

/**
 * Helpers
 */
export function isObject(input: any): input is Object {
  return input !== null && typeof input === 'object';
}
