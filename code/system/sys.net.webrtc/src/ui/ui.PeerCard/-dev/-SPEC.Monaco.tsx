import { useEffect, useState } from 'react';
import { MonacoCrdt, MonacoEditor } from 'sys.ui.react.monaco';

import { COLORS, Crdt, css, rx, t, Color } from './common';

import type { DocShared } from './Schema.mjs';

type EditorCtx = { monaco: t.Monaco; editor: t.MonacoCodeEditor };
type EditorState = { code: t.AutomergeText; peers: t.EditorPeersState };
type T = t.JsonMap & { index: EditorState; main: EditorState };

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
    if (self && indexCtx && mainCtx && doc) {
      /**
       * Ensure the code field exists.
       */

      const getTmp = () => doc.current.tmp as T;
      if (!getTmp().index) doc.change((d) => (d.tmp.index = {}));
      if (!getTmp().main) doc.change((d) => (d.tmp.main = {}));

      if (!getTmp().index.code) doc.change((d) => ((d.tmp as T).index.code = Crdt.text()));
      if (!getTmp().index.peers) doc.change((d) => ((d.tmp as T).index.peers = {}));

      if (!getTmp().main.code) doc.change((d) => ((d.tmp as T).main.code = Crdt.text()));
      if (!getTmp().main.peers) doc.change((d) => ((d.tmp as T).main.peers = {}));

      /**
       * Start the syncer.
       */
      const local = self.id;
      MonacoCrdt.syncer({
        dispose$,
        monaco: mainCtx.monaco,
        editor: mainCtx.editor,
        data: { doc, getText: (d) => (d.tmp as T).main.code },
        peers: { local, doc, getPeers: (d) => (d.tmp as T).main.peers },
      });

      MonacoCrdt.syncer({
        dispose$,
        monaco: indexCtx.monaco,
        editor: indexCtx.editor,
        data: { doc, getText: (d) => (d.tmp as T).index.code },
        peers: { local, doc, getPeers: (d) => (d.tmp as T).index.peers },
      });
    }

    return dispose;
  }, [self, doc, mainCtx, indexCtx]);

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
