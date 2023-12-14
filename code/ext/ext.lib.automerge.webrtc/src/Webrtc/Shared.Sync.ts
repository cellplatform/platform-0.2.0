import { type t } from './common';
import { Mutate } from './Shared.Mutate';

export const Sync = {
  Mutate,

  /**
   * Sync outdated changes from the entire [Index] to the shared [Shared] document.
   */
  indexToShared(
    index: t.StoreIndexState,
    shared: t.DocRefHandle<t.CrdtShared>,
    options: { debugLabel?: string } = {},
  ) {
    const { debugLabel } = options;
    const items = index.doc.current.docs.filter((item) => !item.meta?.ephemeral);

    shared.change((d) => {
      items.forEach((item) => {
        const res = Sync.Mutate.shared(d, item, { debugLabel });
        if (!res.error) {
          const indexVersion = item.shared?.version?.value ?? 0;
          if (res.version > indexVersion) {
            const { uri, shared, version } = res;
            index.toggleShared(uri, { shared, version });
          }
        }
      });
    });
  },

  /**
   * Sync outdated changes from the [Shared] document to the [Index].
   */
  async sharedToIndex(
    shared: t.DocRefHandle<t.CrdtShared>,
    index: t.StoreIndexState,
    options: { debugLabel?: string } = {},
  ) {
    const { debugLabel } = options;

    const meta = (uri: string, sharedItem: t.CrdtSharedDoc) => {
      const indexItem = index.doc.current.docs.find((item) => item.uri === uri)?.shared;
      const version = {
        index: indexItem?.version.value ?? -1,
        shared: sharedItem.version ?? -1,
      };
      const current = {
        index: indexItem?.current,
        shared: sharedItem.current,
      };
      const exists = {
        index: !!indexItem,
        shared: !!sharedItem.current,
      };
      return { uri, exists, version, current } as const;
    };

    const updates = Object.entries(shared.current.docs)
      .map(([key, value]) => meta(key, value))
      .filter((e) => e.version.shared > e.version.index);

    const wait = updates.map(async (e) => {
      const { uri } = e;
      const exists = e.exists.index;
      const version = e.version.shared;
      const shared = e.current.shared;
      if (!exists && shared) await index.add({ uri, shared });
      if (exists) index.toggleShared(uri, { shared, version });
    });

    await Promise.all(wait);
    return updates;
  },
} as const;
