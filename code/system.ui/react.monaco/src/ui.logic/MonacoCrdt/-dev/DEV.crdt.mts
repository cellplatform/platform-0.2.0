import { Automerge, Crdt, rx, type t } from './-common';

export function initDocsWithPeerSyncers(peerNames: string[], options: { initial?: string } = {}) {
  const { initial } = options;

  /**
   * Initialize new CRDT documents.
   */
  const items: t.DevPeer[] = peerNames.map((name, i) => {
    const id = `shared-doc-id`;
    const doc = Crdt.Doc.ref<t.SampleDoc>(id, {
      count: 0,
      code: new Automerge.Text(initial),
      peers: {},
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
