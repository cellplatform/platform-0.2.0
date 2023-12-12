import { type t } from './common';

/**
 * Common mutatation functions for data objects.
 */
export const Mutate = {
  /**
   * Update the shared [SyncDoc] from an [Index] item.
   */
  syncdoc(
    draft: t.WebrtcSyncDoc,
    indexItem: t.StoreIndexDocItem,
    options: { debugLabel?: string; action?: t.WebrtcSyncDocMutateAction } = {},
  ) {
    const { debugLabel, action } = options;
    const uri = indexItem.uri;

    const getVersions = () => {
      const index = indexItem.shared?.version.value ?? -1;
      const syncdoc = draft.shared[uri]?.version ?? -1;
      return { index, syncdoc } as const;
    };

    const done = (error?: string) => {
      const shared = draft.shared[uri]?.current ?? false;
      const versions = getVersions();
      const version = Math.max(versions.index, versions.syncdoc);
      return { uri, shared, version, error } as const;
    };

    if (indexItem.meta?.ephemeral) return done('Invalid index item (ephemeral)');

    const version = getVersions();
    if (version.index < 0 && version.syncdoc < 0) return done('Not ready to sync');

    if (version.index >= version.syncdoc) {
      const shared = draft.shared[uri] ?? { current: false, version: 0 };
      shared.version = indexItem.shared?.version.value ?? 0;
      shared.current = indexItem.shared?.current ?? false;
      if (action === 'unshare') {
        shared.current = false;
        shared.version += 1;
      }
      if (!draft.shared[uri]) draft.shared[uri] = shared; // NB: ensure the shared object is attached to the CRDT.
    }

    return done();
  },
} as const;
