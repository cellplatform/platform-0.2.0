import { useEffect, useState } from 'react';
import { MonacoCrdt, MonacoEditor } from 'sys.ui.react.monaco';

import { Yaml, COLORS, Crdt, css, rx, type t, Color, Path } from './common';

import type { DocShared, DocMe } from './-SPEC.Docs.mjs';

type EditorCtx = { monaco: t.Monaco; editor: t.MonacoCodeEditor };
type EditorState = { code: t.AutomergeText; peers: t.EditorPeersState };
type T = t.JsonMap & {
  index: EditorState;
  main: EditorState;
};

export type SpecMonacoSyncProps = {
  docs: {
    me: t.CrdtDocRef<DocMe>;
    shared: t.CrdtDocRef<DocShared>;
  };
  paths: {
    me: string;
  };
  self?: t.Peer;
  visible?: boolean;
  style?: t.CssValue;
  onChange?: (e: { kind: 'me' | 'shared'; data: any }) => void;
};

/**
 * A shared syncing code-editor.
 */
export const SpecMonacoSync: React.FC<SpecMonacoSyncProps> = (props) => {
  const { self, docs, visible = true, paths } = props;
  const theme = 'Light';

  const [indexCtx, setIndexCtx] = useState<EditorCtx>();
  const [mainCtx, setMainCtx] = useState<EditorCtx>();

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (self && indexCtx && mainCtx && docs.shared) {
      const local = self.id;

      /**
       * Ensure the code field exists.
       */
      const getTmp = () => docs.shared.current.tmp as T;
      if (!getTmp().index) docs.shared.change((d) => (d.tmp.index = {}));
      if (!getTmp().main) docs.shared.change((d) => (d.tmp.main = {}));

      if (!getTmp().main.peers) docs.shared.change((d) => ((d.tmp as T).main.peers = {}));
      if (!getTmp().index.peers) docs.shared.change((d) => ((d.tmp as T).index.peers = {}));

      if (!getTmp().main.code) docs.shared.change((d) => ((d.tmp as T).main.code = Crdt.text()));
      if (!Crdt.Is.text(docs.me.current.code)) {
        const initial = docs.me.current.text ?? '';
        docs.me.change((d) => (d.code = Crdt.text(initial)));
      }

      /**
       * Start the syncer.
       */
      const indexBinding = MonacoCrdt.syncer({
        dispose$,
        monaco: indexCtx.monaco,
        editor: indexCtx.editor,
        data: { doc: docs.me, getText: (d) => d.code! },
        // peers: { local, doc: docs.shared, getPeers: (d) => (d.tmp as T).index.peers },
      });

      const mainBinding = MonacoCrdt.syncer({
        dispose$,
        monaco: mainCtx.monaco,
        editor: mainCtx.editor,
        data: { doc: docs.shared, getText: (d) => (d.tmp as T).main.code },
        peers: { local, doc: docs.shared, getPeers: (d) => (d.tmp as T).main.peers },
      });

      const listenForChanges = <T extends {}>(
        kind: 'me' | 'shared',
        doc: t.CrdtDocRef<T>,
        getText: (doc: T) => t.AutomergeText | undefined,
      ) => {
        const firedChanged = (text?: string) => {
          if (text) {
            try {
              const data = Yaml.parse(text);
              props.onChange?.({ kind, data });
            } catch (err: any) {
              const data = `YAML Parse Error: ${err.message}`;
              console.warn(data);
              props.onChange?.({ kind, data });
            }
          }
        };

        doc.$.pipe(
          rx.takeUntil(dispose$),
          rx.debounceTime(500),
          rx.distinctWhile(
            (prev, next) => getText(prev.doc)?.toString() === getText(next.doc)?.toString(),
          ),
        ).subscribe((e) => firedChanged(getText(e.doc)?.toString()));
        firedChanged(getText(doc.current)?.toString());
      };

      listenForChanges('me', docs.me, (doc: DocMe) => doc.code!);
      listenForChanges('shared', docs.shared, (doc: DocShared) => (doc.tmp as T).main.code);
    }

    return dispose;
  }, [self, docs.shared, docs.me, mainCtx, indexCtx]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      color: COLORS.DARK,
      backgroundColor: COLORS.WHITE,
      height: visible ? 250 : 0,
      display: visible ? 'grid' : 'none',
      gridTemplateColumns: 'minmax(280px, 1fr) 1fr',
    }),
    editor: css({ Absolute: 0 }),
    left: css({
      position: 'relative',
      borderRight: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
    }),
    right: css({
      position: 'relative',
    }),
    titlebar: css({
      backgroundColor: Color.alpha(COLORS.DARK, 0.06),
      borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.08)}`,
      fontSize: 12,
      Padding: [3, 8, 4, 8],
      Flex: 'x-center-spaceBetween',
    }),
    titlebarPrivate: css({
      backgroundColor: `${Color.alpha(COLORS.GREEN, 1)}`,
      color: COLORS.WHITE,
    }),
    edge: css({ display: 'grid', gridTemplateRows: '1fr auto' }),
    editorOuter: css({ position: 'relative' }),
  };

  if (!self || !docs.shared) return <div {...css(styles.base, props.style)} />;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...css(styles.edge, styles.left)}>
        <div {...styles.editorOuter}>
          <MonacoEditor
            style={styles.editor}
            language={'yaml'}
            theme={theme}
            text={docs.me.current.code?.toString()}
            onReady={({ editor, monaco }) => setIndexCtx({ editor, monaco })}
          />
        </div>
        <div {...css(styles.titlebar, styles.titlebarPrivate)}>
          <div>{Path.ensureSlashStart(paths.me)}</div>
          <div>{'(Private)'}</div>
        </div>
      </div>
      <div {...css(styles.edge, styles.right)}>
        <div {...styles.editorOuter}>
          <MonacoEditor
            style={styles.editor}
            language={'yaml'}
            theme={theme}
            focusOnLoad={true}
            onReady={({ editor, monaco }) => setMainCtx({ editor, monaco })}
          />
        </div>
        <div {...styles.titlebar}>
          <div>{'Shared State'}</div>
        </div>
      </div>
    </div>
  );
};
