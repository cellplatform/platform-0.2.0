import { type t } from './common';

/**
 * Common mutatation functions for data objects.
 */
export const Mutate = {
  /**
   * Update the [Shared] document from an [Index] item.
   */
  shared(
    draft: t.CrdtShared,
    index: t.StoreIndexItem,
    options: { debugLabel?: string; action?: t.CrdtSharedMutateAction } = {},
  ) {
    const { debugLabel, action } = options;
    const uri = index.uri;

    const getVersions = () => {
      return {
        index: index.shared?.version?.value ?? -1,
        shared: draft.sys.docs[uri]?.version ?? -1,
      } as const;
    };

    const done = (error?: string) => {
      const shared = draft.sys.docs[uri]?.shared ?? false;
      const versions = getVersions();
      const version = Math.max(versions.index, versions.shared);
      return { uri, shared, version, error } as const;
    };

    if (index.meta?.ephemeral) return done('Invalid index item (ephemeral)');

    const version = getVersions();
    if (version.index < 0 && version.shared < 0) {
      return done('Not ready to sync');
    }

    const changeShared = (fn: (shared: t.CrdtSharedDoc) => void) => {
      const shared = draft.sys.docs[uri] ?? { shared: false, version: 0 };
      fn(shared);
      if (!draft.sys.docs[uri]) draft.sys.docs[uri] = shared; // NB: ensure the shared object is attached to the CRDT.
    };

    if (version.index >= version.shared) {
      changeShared((shared) => {
        shared.version = index.shared?.version?.value ?? 0;
        shared.shared = index.shared?.current ?? false;
        if (action === 'unshare') {
          shared.shared = false;
          shared.version += 1;
        }
      });
    }

    return done();
  },
} as const;
