import { useRef } from 'react';

import { Color, css, Dev, t } from './-common';
import { DevEditor } from './DEV.Editor';

export type DevLayoutReadyHandler = (e: DevLayoutReadyHandlerArgs) => void;
export type DevLayoutReadyHandlerArgs = { monaco: t.Monaco; editors: DevLayoutPeerEditor[] };
export type DevLayoutPeerEditor = { peer: t.DevPeer; editor: t.MonacoCodeEditor };

export type DevLayoutEditorDisposedHandler = (e: DevLayoutEditorDisposedHandlerArgs) => void;
export type DevLayoutEditorDisposedHandlerArgs = {
  editors: DevLayoutPeerEditor[];
  disposed: DevLayoutPeerEditor;
};

export type DevLayoutProps = {
  peers?: t.DevPeer[];
  tests?: { running: boolean; results?: t.TestSuiteRunResponse };
  language: t.EditorLanguage;
  style?: t.CssValue;
  onReady?: DevLayoutReadyHandler;
  onDisposed?: DevLayoutEditorDisposedHandler;
};

/**
 * Layout of editors and test-runner.
 */
export const DevLayout: React.FC<DevLayoutProps> = (props) => {
  const { peers = [] } = props;
  const editorRefs = useRef<DevLayoutPeerEditor[]>([]);

  /**
   * [Handlers]
   */
  const handleEditorReady = (peer: t.DevPeer, monaco: t.Monaco, editor: t.MonacoCodeEditor) => {
    const editors = editorRefs.current;
    editors.push({ peer, editor });
    const isReady = peers.every((peer) => editors.some((e) => e.peer.name === peer.name));
    if (isReady) props.onReady?.({ monaco, editors });
  };

  const handleEditorDispose = (peer: t.DevPeer, editor: t.MonacoCodeEditor) => {
    const disposed = { peer, editor };
    const editors = editorRefs.current.filter((e) => e.peer.name !== peer.name);
    props.onDisposed?.({ disposed, editors });
  };

  /**
   * [Render]
   */
  const divider = `solid 1px ${Color.format(-0.1)}`;
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridAutoRows: '1fr',
    }),
    top: css({ display: 'grid' }),
    bottom: {
      base: css({
        position: 'relative',
        borderTop: peers.length > 0 ? divider : undefined,
        backgroundColor: Color.format(1),
      }),
      runner: css({ Absolute: 0 }),
    },
  };

  const elEditors = peers.map((peer, i) => {
    const isFirst = i === 0;
    const borderTop = isFirst ? undefined : divider;
    return (
      <DevEditor
        style={{ borderTop }}
        key={`${peer.name}.${i}`}
        index={i}
        name={peer.name}
        doc={peer.doc}
        language={props.language}
        onReady={(e) => handleEditorReady(peer, e.monaco, e.editor)}
        onDispose={(e) => handleEditorDispose(peer, e.editor)}
      />
    );
  });

  const elTestRunner = props.tests && (
    <div {...styles.bottom.base}>
      <Dev.TestRunner.Results
        data={props.tests.results}
        spinning={props.tests.running}
        style={styles.bottom.runner}
      />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elEditors}
      {elTestRunner}
    </div>
  );
};
