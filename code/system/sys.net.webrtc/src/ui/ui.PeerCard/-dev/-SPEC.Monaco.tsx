import { MonacoCrdt, MonacoEditor } from 'sys.ui.react.monaco';
import { Crdt, css, t } from './common';

import type { DocShared } from './Schema.mjs';

type T = t.JsonMap & { code: t.AutomergeText };

export function SpecMonacoSync(doc: t.CrdtDocRef<DocShared>) {
  return (
    <div {...css({ height: 200, display: 'grid' })}>
      <MonacoEditor
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
          const syncer = MonacoCrdt.syncer(editor, doc, (d) => (d.tmp as T).code);
          console.log('syncer', syncer);
        }}
      />
    </div>
  );
}
