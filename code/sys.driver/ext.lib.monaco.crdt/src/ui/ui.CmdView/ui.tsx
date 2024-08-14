import { Color, css, DEFAULTS, Doc, type t } from './common';
import { Editor } from './ui.Editor';
import { PanelDocUri } from './ui.Panel.DocUri';
import { PanelInfo } from './ui.Panel.Info';
import { HistoryStack } from './ui.Stack';

type P = t.CmdViewProps;
const def = DEFAULTS.props;

export const View: React.FC<P> = (props) => {
  const { historyStack = def.historyStack, enabled = def.enabled } = props;
  const crdt = wrangle.crdt(props);

  /**
   * Render
   */
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
    docUri: css({
      borderTop: dividerBorder,
      padding: 15,
    }),
    historyStack: css({
      Absolute: [-1, 0, null, 0],
    }),
    panelInfo: {
      base: css({ position: 'relative', display: 'grid', Scroll: true }),
      inner: css({ Absolute: 0, boxSizing: 'border-box', padding: 15 }),
      footer: css({ height: 30 }),
    },
  };

  const elPageStack = historyStack && (
    <HistoryStack
      doc={crdt.doc}
      style={styles.historyStack}
      theme={theme.name}
      onClick={props.onHistoryStackClick}
    />
  );

  const elEditor = (
    <Editor theme={props.theme} doc={crdt.doc} enabled={enabled} editor={props.editor} />
  );

  const elPanelInfo = (
    <div {...styles.panelInfo.base}>
      <div {...styles.panelInfo.inner}>
        <PanelInfo repo={crdt.repo} doc={crdt.doc} enabled={enabled} theme={theme.name} />
        <div {...styles.panelInfo.footer} />
      </div>
    </div>
  );

  const elDocUri = (
    <div {...styles.docUri}>
      <PanelDocUri doc={crdt.doc} theme={theme.name} enabled={enabled} />
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
    const { repo, doc } = props;
    return { repo, doc } as const;
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
