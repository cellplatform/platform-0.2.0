import { useEffect, useState } from 'react';
import { MonacoCrdt, MonacoEditor } from 'sys.ui.react.monaco';

import { COLORS, Crdt, css, rx, t, Color } from './common';

import type { DocShared } from './Schema.mjs';

type T = t.JsonMap & { code: t.AutomergeText; peers: t.EditorPeersState };
type EditorCtx = { monaco: t.Monaco; editor: t.MonacoCodeEditor };

export type SpecMonacoSyncProps = {
  self?: t.Peer;
  doc?: t.CrdtDocRef<DocShared>;
  style?: t.CssValue;
};

/**
 * A shared syncing code-editor.
 */
export const SpecMonacoSync: React.FC<SpecMonacoSyncProps> = (props) => {
  const { self, doc } = props;
  const [indexCtx, setIndexCtx] = useState<EditorCtx>();
  const [mainCtx, setMainCtx] = useState<EditorCtx>();

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (self && mainCtx && doc) {
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
      const { monaco, editor } = mainCtx;
      const syncer = MonacoCrdt.syncer({
        dispose$,
        monaco,
        editor,
        data: { doc, getText: (d) => (d.tmp as T).code },
        peers: { local: self.id, doc, getPeers: (d) => (d.tmp as T).peers },
      });

      console.log('syncer', syncer);

      doc.$.pipe(rx.takeUntil(dispose$)).subscribe((e) => {
        const tmp = e.doc.tmp as T;

        const remotePeers = Object.keys(tmp.peers)
          .filter((id) => id !== self.id)
          .map((id) => tmp.peers[id]);

        /**
         * TODO 🐷
         * - update
         */
        console.log('remotePeers', remotePeers);
      });
    }

    return dispose;
  }, [self, doc, mainCtx]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: COLORS.WHITE,
      height: 250,
      display: 'grid',
      gridTemplateColumns: '1fr 1.3fr',
    }),
    left: css({
      borderRight: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
    }),
    right: css({}),
  };

  if (!self || !doc) return <div {...css(styles.base, props.style)} />;

  const SAMPLE_INDEX = `
environment:
  - network:data
  - network:video

diagrams:
  - slc/intro
  - slc/macro
  - slc/impact
`.substring(1);

  return (
    <div {...css(styles.base, props.style)}>
      <MonacoEditor
        style={styles.left}
        language={'yaml'}
        text={SAMPLE_INDEX}
        onReady={({ editor, monaco }) => setIndexCtx({ editor, monaco })}
      />
      <MonacoEditor
        style={styles.right}
        language={'yaml'}
        focusOnLoad={true}
        onReady={({ editor, monaco }) => setMainCtx({ editor, monaco })}
      />
    </div>
  );
};
