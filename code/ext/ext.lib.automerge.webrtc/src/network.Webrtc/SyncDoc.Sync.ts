import { type t } from './common';

export type Action = 'unshare';

export const Sync = {
  /**
   * Sync the entire set of docs within an [Index].
   */
  indexIntoDoc(
    index: t.StoreIndex,
    syncdoc: t.DocRefHandle<t.WebrtcSyncDoc>,
    options: { debugLabel?: string } = {},
  ) {
    const { debugLabel } = options;
    const items = index.doc.current.docs.filter((item) => !item.meta?.ephemeral);

    syncdoc.change((d) => {
      items.forEach((item) => {
        const res = Sync.Mutate.syncdocItem(d, item, { debugLabel });
        if (!res.error) {
          const indexVersion = item.shared?.version.value ?? 0;
          if (res.version > indexVersion) {
            const { uri, shared, version } = res;
            index.toggleShared(uri, { shared, version });
          }
        }
      });
    });
  },

  /**
   * Update an item from the local [Index] into the ephemeral [SyncDoc] clone.
   */
  Mutate: {
    syncdocItem(
      draft: t.WebrtcSyncDoc,
      indexItem: t.StoreIndexDocItem,
      options: { debugLabel?: string; action?: Action } = {},
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
  },
} as const;
