import { useState } from 'react';

import { Color, css, DEFAULTS, Doc, type t } from './common';
import { Editor } from './ui.Editor';
import { IdentityLabel } from './ui.IdentityLabel';
import { Panel } from './ui.Panel';
import { HistoryStack } from './ui.Stack';
import { useChangeMonitor } from './use.ChangeMonitor';

type P = t.CrdtEditorProps;
const def = DEFAULTS.props;

export const View: React.FC<P> = (props) => {
  const {
    data = {},
    identityLabel,
    historyStack = def.historyStack,
    enabled = def.enabled,
    editorOnly = def.editorOnly,
    onChange,
    onDataReady,
  } = props;

  const doc = data.doc;
  const dataPath = wrangle.dataPath(props);
  const identity = wrangle.editor(props).identity;

  const [editorReady, setEditorReady] = useState<t.MonacoEditorReadyArgs>();
  const editor = editorReady?.editor;

  useChangeMonitor({ doc, editor, dataPath, onChange, onDataReady });

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const border = wrangle.border(props);
  const borderColor = props.borderColor ?? Color.alpha(theme.fg, 0.8);
  const b = (width: number) => (width ? `solid ${width}px ${borderColor}` : undefined);

  const panelWidth = 300;
  const styles = {
    base: css({
      position: 'relative',
      color: theme.fg,
      minWidth: panelWidth,

      borderTop: b(border[0]),
      borderRight: b(border[1]),
      borderBottom: b(border[2]),
      borderLeft: b(border[3]),
      display: 'grid',
    }),
    body: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: editorOnly ? undefined : `1fr minmax(${panelWidth}px, auto)`,
    }),
    left: css({ display: 'grid' }),
    right: css({ borderLeft: `solid 1px ${borderColor}`, display: 'grid' }),
    historyStack: css({ Absolute: [-1, 0, null, 0] }),
  };

  const elPageStack = historyStack && (
    <HistoryStack
      doc={data.doc}
      style={styles.historyStack}
      theme={theme.name}
      onClick={props.onHistoryStackClick}
    />
  );

  const elEditor = (
    <Editor
      theme={props.theme}
      doc={data.doc}
      enabled={enabled}
      editor={props.editor}
      onReady={(e) => setEditorReady(e)}
    />
  );

  const elPanel = (
    <Panel
      data={data}
      dataPath={dataPath}
      enabled={enabled}
      borderColor={borderColor}
      theme={theme.name}
    />
  );

  const elIdentityLabel = identityLabel && identity && (
    <IdentityLabel
      identity={identity}
      theme={theme.name}
      style={{ Absolute: identityLabel.position }}
    />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elPageStack}
      {elIdentityLabel}
      <div {...styles.body}>
        <div {...styles.left}>{elEditor}</div>
        {!editorOnly && <div {...styles.right}>{elPanel}</div>}
      </div>
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  data(props: P): t.CrdtEditorData {
    return props.data ?? {};
  },

  history(props: P) {
    const { doc } = wrangle.data(props);
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

  editor(props: P) {
    const { editor = def.editor } = props;
    return editor as t.CrdtEditorPropsEditor;
  },

  dataPath(props: P) {
    return wrangle.editor(props).dataPath ?? [];
  },
} as const;
