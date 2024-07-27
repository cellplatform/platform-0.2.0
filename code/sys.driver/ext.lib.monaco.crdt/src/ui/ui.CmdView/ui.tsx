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
import { PanelInfo } from './ui.Panel.Info';

type P = t.CmdViewProps;

export const View: React.FC<P> = (props) => {
  const { readOnly = DEFAULTS.props.readOnly, historyStack = DEFAULTS.props.historyStack } = props;
  const crdt = wrangle.crdt(props);
  const history = wrangle.history(props);

  /**
   * Hooks
   */
  useRedrawOnChange(crdt.doc);
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

    docuri: {
      base: css({
        borderTop: dividerBorder,
        padding: 15,
        display: 'grid',
        placeItems: 'center',
      }),
      inner: css({
        display: 'grid',
        gridTemplateColumns: crdt.doc ? `auto 1fr` : '1fr',
        columnGap: '15px',
      }),
      icon: css({
        opacity: crdt.doc ? 1 : 0.25,
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
      enabled={!!crdt.doc}
      readOnly={readOnly}
      minimap={false}
      // onDispose={(e) => controllerRef.current?.dispose()}
      onReady={(e) => {
        // const { monaco, editor } = e;
        // controllerRef.current = editorController({ monaco, editor, main });
      }}
    />
  );

  const elPanelInfo = (
    <PanelInfo
      repo={crdt.repo}
      doc={crdt.doc}
      fields={crdt.info.fields}
      theme={theme.name}
      style={{ margin: 15 }}
    />
  );

  let Icon = isCopy ? Icons.Copy : Icons.Repo;
  if (!!copiedText) Icon = Icons.Done;

  const elDocUri = (
    <div {...styles.docuri.base}>
      <div {...styles.docuri.inner}>
        {crdt.doc && (
          <DocUri
            doc={crdt.doc}
            head={0}
            fontSize={20}
            theme={theme.name}
            copiedText={copiedText}
            onMouse={(e) => setIsCopy(e.is.over)}
            onCopy={(e) => {
              setCopiedText('copied');
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
        {elPanelInfo}
        {elDocUri}
      </div>
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  crdt(props: P) {
    const { repo, doc, crdtInfoFields = DEFAULTS.props.crdtInfoFields } = props;
    const info = { fields: crdtInfoFields };
    return { repo, doc, info } as const;
  },

  history(props: P) {
    const { doc } = wrangle.crdt(props);
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
