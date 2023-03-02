import { useRef } from 'react';

import { Color, css, Dev, t } from './common';
import { DevEditor } from './DEV.Editor';

export type DevLayoutReadyHandler = (e: DevLayoutReadyHandlerArgs) => void;
export type DevLayoutReadyHandlerArgs = { editors: DevLayoutEditor[] };
export type DevLayoutEditor = { peer: t.DevPeer; editor: t.MonacoCodeEditor };

export type DevLayoutProps = {
  peers?: t.DevPeer[];
  tests: { running: boolean; results?: t.TestSuiteRunResponse };
  language: t.EditorLanguage;
  style?: t.CssValue;
  onReady?: DevLayoutReadyHandler;
};

/**
 * Layout of editors and test-runner.
 */
export const DevLayout: React.FC<DevLayoutProps> = (props) => {
  const { peers = [] } = props;
  const readyRefs = useRef<DevLayoutEditor[]>([]);

  /**
   * [Handlers]
   */
  const handleEditorReady = (peer: t.DevPeer, editor: t.MonacoCodeEditor) => {
    const editors = readyRefs.current;
    editors.push({ peer, editor });
    const isReady = peers.every((peer) => editors.some((e) => e.peer.name === peer.name));
    if (isReady) props.onReady?.({ editors });
  };

  /**
   * [Render]
   */
  const divider = `solid 1px ${Color.format(-0.1)}`;
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateRows: `${peers.map(() => '1pr')} 1fr`,
    }),
    top: css({ display: 'grid' }),
    bottom: {
      base: css({
        position: 'relative',
        borderTop: peers.length > 0 ? divider : undefined,
      }),
      runner: css({ Absolute: 0 }),
    },
  };

  const elEditors = peers.map((peer, i) => {
    const isFirst = i === 0;

    return (
      <DevEditor
        key={`${peer.name}.${i}`}
        name={peer.name}
        doc={peer.doc}
        language={props.language}
        onReady={(e) => handleEditorReady(peer, e.editor)}
        style={{ borderTop: isFirst ? undefined : divider }}
      />
    );
  });

  return (
    <div {...css(styles.base, props.style)}>
      {elEditors}
      <div {...styles.bottom.base}>
        <Dev.TestRunner.Results
          data={props.tests.results}
          spinning={props.tests.running}
          style={styles.bottom.runner}
          padding={[10, 20, 10, 10]}
        />
      </div>
    </div>
  );
};
