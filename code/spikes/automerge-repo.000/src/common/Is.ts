import { isValidAutomergeUrl, Repo } from '@automerge/automerge-repo';

import type * as t from './types';

export const Is = {
  repo(input: any): input is t.Repo {
    if (!isObject(input)) return false;
    const { networkSubsystem, storageSubsystem } = input;
    if (!Is.networkSubsystem(networkSubsystem)) return false;
    if (storageSubsystem && !Is.storageSubsystem(storageSubsystem)) return false;
    return true;
  },

  networkSubsystem(input: any): input is t.NetworkSubsystem {
    if (!isObject(input)) return false;
    return (
      typeof input.peerId === 'string' &&
      typeof input.isReady === 'function' &&
      typeof input.whenReady === 'function' &&
      typeof input.send === 'function'
    );
  },

  storageSubsystem(input: any): input is t.StorageSubsystem {
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
  return typeof input === 'object' && input !== null;
}
