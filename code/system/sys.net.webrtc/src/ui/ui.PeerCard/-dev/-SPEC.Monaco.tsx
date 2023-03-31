import { MonacoCrdt, MonacoEditor } from 'sys.ui.react.monaco';
import { Crdt, css, t } from './common';

import type { DocShared } from './Schema.mjs';

type T = t.JsonMap & { code: t.AutomergeText; peers: t.EditorPeersState };

export function SpecMonacoSync(self: t.Peer, doc: t.CrdtDocRef<DocShared>) {
  return (
    <div {...css({ height: 200, display: 'grid' })}>
      <MonacoEditor
        focusOnLoad={true}
        onReady={({ editor }) => {
          /**
           * Ensure the code field exists.
           */
          if (!doc.current.tmp.code) {
            doc.change((d) => ((d.tmp as T).code = Crdt.text()));
          }
          if (!doc.current.tmp.peers) {
            doc.change((d) => ((d.tmp as T).peers = {}));
          }

          /**
           * Start the syncer.
           */
          const syncer = MonacoCrdt.syncer({
            editor,
            data: { doc, getText: (d) => (d.tmp as T).code },
            peers: { local: self.id, doc, getPeers: (d) => (d.tmp as T).peers },
          });
          console.log('syncer', syncer);
        }}
      />
    </div>
  );
}
