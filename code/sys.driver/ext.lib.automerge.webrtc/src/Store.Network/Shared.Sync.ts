import { type t } from './common';
import { Mutate } from './Shared.Mutate';

export const Sync = {
  Mutate,

  /**
   * Sync outdated changes from the entire [Index] to the shared [Shared] document.
   */
  indexToShared(
    index: t.StoreIndexState,
    shared: t.Doc<t.CrdtShared>,
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
    shared: t.Doc<t.CrdtShared>,
    index: t.StoreIndexState,
    options: { debugLabel?: string } = {},
  ) {
    const { debugLabel } = options;

    const getMeta = (uri: string, sharedItem: t.CrdtSharedDoc) => {
      const indexItem = index.doc.current.docs.find((item) => item.uri === uri);
      const exists = {
        index: !!indexItem,
        shared: !!sharedItem.shared,
      };
      const version = {
        index: indexItem?.shared?.version.value ?? -1,
        shared: sharedItem.version ?? -1,
      };
      const current = {
        index: indexItem?.shared?.current,
        shared: sharedItem.shared,
      };
      return { uri, exists, version, current } as const;
    };

    const meta = Object.entries(shared.current.sys.docs).map(([key, value]) => getMeta(key, value));
    const versionUpdates = meta.filter((e) => e.version.shared > e.version.index);

    await Promise.all(
      versionUpdates.map(async (e) => {
        const { uri } = e;
        const exists = e.exists.index;
        const version = e.version.shared;
        const shared = e.current.shared;
        if (!exists && shared) await index.add({ uri, shared });
        if (exists) index.toggleShared(uri, { shared, version });
      }),
    );

    return versionUpdates;
  },
} as const;
