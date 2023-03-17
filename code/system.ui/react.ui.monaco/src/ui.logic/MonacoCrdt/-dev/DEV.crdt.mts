import { Automerge, Crdt, rx, t } from './common';

export function initSyncingCrdtDocs(peerNames: string[]) {
  /**
   * Initialize new CRDT documents.
   */
  const items: t.DevPeer[] = peerNames.map((name) => {
    const doc = Crdt.Doc.ref<t.SampleDoc>({
      count: 0,
      code: new Automerge.Text(),
    });
    return { name, doc };
  });

  /**
   * Setup sync protocol between all peers.
   */
  items.forEach((item) => {
    const docA = item.doc;
    const others = items.filter((d) => d.doc !== docA);
    others.forEach((item) => {
      const docB = item.doc;
      const busA = rx.bus();
      const busB = rx.bus();
      const conn = rx.bus.connect([busA, busB]);

      const syncA = Crdt.Doc.sync(busA, docA);
      const syncB = Crdt.Doc.sync(busB, docB);

      const dispose = () => {
        conn.dispose();
        syncA.dispose();
        syncB.dispose();
      };

      docA.dispose$.subscribe(dispose);
      docB.dispose$.subscribe(dispose);
    });
  });

  return items;
}
