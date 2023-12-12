import { type t } from './common';
import { Mutate } from './Shared.Mutate';

export const Sync = {
  Mutate,

  /**
   * Sync outdated changes from the entire [Index] to the shared [SyncDoc].
   */
  indexToSyncdoc(
    index: t.StoreIndex,
    syncdoc: t.DocRefHandle<t.WebrtcSyncDoc>,
    options: { debugLabel?: string } = {},
  ) {
    const { debugLabel } = options;
    const items = index.doc.current.docs.filter((item) => !item.meta?.ephemeral);

    syncdoc.change((d) => {
      items.forEach((item) => {
        const res = Sync.Mutate.syncdoc(d, item, { debugLabel });
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
   * Sync outdated changes from the [SyncDoc] to the [Index]
   */
  async syncdocToIndex(
    syncdoc: t.DocRefHandle<t.WebrtcSyncDoc>,
    index: t.StoreIndex,
    options: { debugLabel?: string } = {},
  ) {
    const { debugLabel } = options;

    const meta = (uri: string, syncdocItem: t.WebrtcSyncDocSharedItem) => {
      const indexItem = index.doc.current.docs.find((item) => item.uri === uri)?.shared;
      const version = {
        index: indexItem?.version.value ?? -1,
        syndoc: syncdocItem.version ?? -1,
      };
      const shared = {
        index: indexItem?.current,
        syncdoc: syncdocItem.current,
      };
      const exists = {
        index: !!indexItem,
        syncdoc: !!syncdocItem.current,
      };
      return { uri, exists, version, shared } as const;
    };

    const updates = Object.entries(syncdoc.current.shared)
      .map(([key, value]) => meta(key, value))
      .filter((e) => e.version.syndoc > e.version.index);

    const wait = updates.map(async (e) => {
      const { uri } = e;
      const shared = e.shared.syncdoc;
      const version = e.version.syndoc;
      if (!e.exists.index) {
        await index.add({ uri, shared });
      } else {
        index.toggleShared(uri, { shared, version });
      }
    });

    await Promise.all(wait);
    return updates;
  },
} as const;
