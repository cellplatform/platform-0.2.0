import { type t } from './common';
import { Patches } from './Store.Ephemeral.patches';

/**
 * Manages syncing an store/index via an networked ephemeral doc.
 */
export const IndexSync = {
  /**
   * Manage keeping a local ephemeral network-doc in sync with an repo/index.
   */
  local(index: t.StoreIndex, doc: t.DocRefHandle<t.WebrtcEphemeral>, dispose$?: t.UntilObservable) {
    const events = index.events(dispose$);
    const Sync = {
      all() {
        index.doc.current.docs
          .filter((item) => item.shared?.current)
          .forEach((item) => Sync.item(item));
      },

      item(item: t.RepoIndexDoc, action: 'sync' | 'remove' = 'sync') {
        const { uri, name } = item;
        const isShared = !!item.shared?.current;
        doc.change((d) => {
          if (!isShared || action === 'remove') {
            delete d.shared[uri];
          } else {
            const item = d.shared[uri] || (d.shared[uri] = {});
            item.name = name;
          }
        });
      },
    } as const;

    events.added$.pipe().subscribe((e) => Sync.item(e.item));
    events.removed$.pipe().subscribe((e) => Sync.item(e.item, 'remove'));
    events.shared$.subscribe((e) => Sync.item(e.item));

    Sync.all(); // Initial sync.
  },

  /**
   * Manage a remote ephemeral network-doc.
   */
  remote(
    index: t.StoreIndex,
    doc: t.DocRefHandle<t.WebrtcEphemeral>,
    dispose$?: t.UntilObservable,
  ) {
    const events = doc.events(dispose$);

    events.changed$.pipe().subscribe(async (e) => {
      const action = Patches.shared(e);
  },
} as const;
