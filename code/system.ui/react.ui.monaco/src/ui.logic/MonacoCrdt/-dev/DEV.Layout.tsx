import { useRef } from 'react';

import { Color, css, Dev, R, t } from './common';
import { DevEditor } from './DEV.Editor';

export type DevLayoutReadyHandler = (e: DevLayoutReadyHandlerArgs) => void;
export type DevLayoutReadyHandlerArgs = { editors: DevLayoutEditor[] };
export type DevLayoutEditor = { peerName: string; editor: t.MonacoCodeEditor };

export type DevLayoutProps = {
  peerNames: string[];
  isRunningTests?: boolean;
  testResults?: t.TestSuiteRunResponse;
  style?: t.CssValue;
  onReady?: DevLayoutReadyHandler;
};

/**
 * Layout of editors and test-runner.
 */
export const DevLayout: React.FC<DevLayoutProps> = (props) => {
  const peerNames = R.uniq(props.peerNames);
  const readyRefs = useRef<DevLayoutEditor[]>([]);

  /**
   * [Handlers]
   */
  const handleEditorReady = (peerName: string, editor: t.MonacoCodeEditor) => {
    const editors = readyRefs.current;
    if (editors.some((e) => e.peerName === peerName)) return;
    editors.push({ peerName, editor });
    const isReady = peerNames.every((name) => editors.some((e) => e.peerName === name));
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
      gridTemplateRows: `${peerNames.map(() => '1pr')} 1fr`,
    }),
    top: css({ display: 'grid' }),
    bottom: {
      base: css({ position: 'relative', borderTop: peerNames.length > 0 ? divider : undefined }),
      runner: css({ Absolute: 0 }),
    },
  };

  const elEditors = peerNames.map((name, i) => {
    const isFirst = i === 0;
    return (
      <DevEditor
        style={{ borderTop: isFirst ? undefined : divider }}
        key={`${name}.${i}`}
        name={name}
        onReady={(e) => handleEditorReady(name, e.editor)}
      />
    );
  });

  return (
    <div {...css(styles.base, props.style)}>
      {elEditors}
      <div {...styles.bottom.base}>
        <Dev.TestRunner.Results
          data={props.testResults}
          spinning={props.isRunningTests}
          style={styles.bottom.runner}
          padding={[10, 20, 10, 10]}
        />
      </div>
    </div>
  );
};
