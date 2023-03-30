import { MonacoCrdt, MonacoEditor } from 'sys.ui.react.monaco';
import { Crdt, css, t } from './common';

import type { DocShared } from './Schema.mjs';

type Id = string;
type T = t.JsonMap & { code: t.AutomergeText };

export function SpecMonacoSync(peer: Id, doc: t.CrdtDocRef<DocShared>) {
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

          /**
           * Start the syncer.
           */
          const syncer = MonacoCrdt.syncer({
            peer,
            editor,
            data: { doc, getText: (d) => (d.tmp as T).code },
          });
          console.log('syncer', syncer);
        }}
      />
    </div>
  );
}
