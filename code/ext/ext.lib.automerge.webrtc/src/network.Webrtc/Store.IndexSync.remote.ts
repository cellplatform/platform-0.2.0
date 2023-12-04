import { Doc, type t, Crdt, A } from './common';
import { Patches } from './Store.SyncDoc.patches';

export const Remote = {
  /**
   * Manage a remote ephemeral network-doc.
   */
  init(index: t.StoreIndex, doc: t.DocRefHandle<t.WebrtcSyncDoc>, dispose$?: t.UntilObservable) {
    const events = doc.events(dispose$);

    events.changed$.pipe().subscribe(async (e) => {
      const action = Patches.shared(e);

      console.log('action', action);

      if (action.put) {
        const uri = action.put.uri;
        const name = action.put.item?.name;
        console.log('put exists', exists);
        if (!exists) {
          index.add(uri, name);
        } else {
          // index.doc.change((d) => {
          //   const item = d.docs.find((item) => item.uri === uri);
          //   if (item) {
          //     item.name = name;
          //     item.shared = { current: true, count: new A.Counter(0) };
       * TODO 🐷
       */
      if (action.del) {
        //
      }
    });
  },

  /**
   * Update an iten from the [SyncDoc] into the local [Index]
   */
  item(index: t.StoreIndex, uri: string) {
    //
  },
} as const;
