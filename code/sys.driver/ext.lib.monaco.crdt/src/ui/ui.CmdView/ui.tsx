import { Info as CrdtInfo } from 'ext.lib.automerge';
import { useEffect, useState } from 'react';

import {
  Color,
  COLORS,
  css,
  DEFAULTS,
  Doc,
  DocUri,
  Icons,
  Monaco,
  PageStack,
  Time,
  useRedrawOnChange,
  type t,
} from './common';

type P = t.CmdViewProps;

export const View: React.FC<P> = (props) => {
  const {
    repo,
    doc,
    readOnly = DEFAULTS.props.readOnly,
    historyStack = DEFAULTS.props.historyStack,
  } = props;
  const history = wrangle.history(props);

  /**
   * Hooks
   */
  useRedrawOnChange(doc);
  const [isCopy, setIsCopy] = useState(false);
  const [copiedText, setCopiedText] = useState<string>();
  const [page, setPage] = useState(0);

  /**
   * Lifecycle
   */
  useEffect(() => setPage((n) => n + 1), [history.join()]);

  /**
   * Render
   */
  const t = (prop: string, time: t.Msecs = 50) => `${prop} ${time}ms`;
  const transition = [t('opacity')].join(', ');
  const theme = Color.theme(props.theme);
  const border = wrangle.border(props);
  const borderColor = props.borderColor ?? Color.alpha(theme.fg, 0.8);
  const b = (width: number) => (width ? `solid ${width}px ${borderColor}` : undefined);

  const dividerBorder = `solid 1px ${Color.alpha(theme.fg, 0.8)}`;
  const styles = {
    base: css({
      position: 'relative',
      color: theme.fg,

      borderTop: b(border[0]),
      borderRight: b(border[1]),
      borderBottom: b(border[2]),
      borderLeft: b(border[3]),

      display: 'grid',
      gridTemplateColumns: `1fr minmax(300px, auto)`,
    }),
    left: css({ display: 'grid' }),
    right: css({
      borderLeft: dividerBorder,
      display: 'grid',
      gridTemplateRows: `1fr auto`,
    }),

    crdtInfo: css({ margin: 15 }),

    docuri: {
      base: css({
        borderTop: dividerBorder,
        padding: 15,
        display: 'grid',
        placeItems: 'center',
      }),
      inner: css({
        display: 'grid',
        gridTemplateColumns: doc ? `auto 1fr` : '1fr',
        columnGap: '15px',
      }),
      icon: css({
        opacity: doc ? 1 : 0.25,
        transition,
      }),
    },

    pageStack: css({
      Absolute: [-1, 0, null, 0],
      opacity: 0.3,
    }),
  };

  const elPageStack = historyStack && (
    <PageStack current={page} style={styles.pageStack} theme={theme.name} />
  );

  const elEditor = (
    <Monaco.Editor
      theme={theme.name}
      language={'yaml'}
      enabled={!!doc}
      readOnly={readOnly}
      minimap={false}
      // onDispose={(e) => controllerRef.current?.dispose()}
      onReady={(e) => {
        // const { monaco, editor } = e;
        // controllerRef.current = editorController({ monaco, editor, main });
      }}
    />
  );

  const elCrdtInfo = (
    <CrdtInfo
      style={styles.crdtInfo}
      theme={theme.name}
      stateful={true}
      fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
      data={{
        repo,
        document: {
          ref: doc,
          uri: { head: true },
          object: {
            visible: false,
            // visible: viewstate.current.docVisible,
            // onToggleClick: (e) => viewstate.change((d) => Dev.toggle(d, 'docVisible')),
          },
        },
      }}
    />
  );

  let Icon = isCopy ? Icons.Copy : Icons.Repo;
  if (!!copiedText) Icon = Icons.Done;

  const elDocUri = (
    <div {...styles.docuri.base}>
      <div {...styles.docuri.inner}>
        {doc && (
          <DocUri
            doc={doc}
            head={0}
            fontSize={20}
            theme={theme.name}
            copiedText={copiedText}
            onMouse={(e) => setIsCopy(e.is.over)}
            onCopy={(e) => {
              setCopiedText(e.part === 'Head' ? 'copied head' : 'copied address');
              Time.delay(1500, () => setCopiedText(undefined));
            }}
          />
        )}
        <Icon style={styles.docuri.icon} color={!!copiedText ? COLORS.GREEN : undefined} />
      </div>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elPageStack}
      <div {...styles.left}>{elEditor}</div>
      <div {...styles.right}>
        {elCrdtInfo}
        {elDocUri}
      </div>
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  history(props: P) {
    const { doc } = props;
    if (!doc) return [];
    const history = Doc.history(doc).commits.map((d) => d.change.hash);
    return history.slice(-5);
  },

  border(props: P): [number, number, number, number] {
    const { border } = props;
    if (!border) return [0, 0, 0, 0];
    if (typeof border === 'number') return [border, border, border, border];
    if (Array.isArray(border)) return border;
    return [0, 0, 0, 0];
  },
} as const;
