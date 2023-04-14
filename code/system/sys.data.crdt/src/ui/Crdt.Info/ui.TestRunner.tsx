import { useState } from 'react';
import { Button, COLORS, css, Icons, Spinner, t, Time, useMouseState } from './common';
import { Text } from './ui.TestRunner.Text';

export type TestRunnerProps = {
  loadTests: () => Promise<t.TestSuiteModel>;
  style?: t.CssValue;
};

export const TestRunner: React.FC<TestRunnerProps> = (props) => {
  const mouse = useMouseState();

  const [isRunning, setRunning] = useState(false);
  const [results, setResults] = useState<t.TestSuiteRunResponse>();

  const runTests = async () => {
    if (isRunning) return;
    setRunning(true);
    setResults(undefined);

    const root = await props.loadTests();
    const res = await root.run();

    console.group('🌳 Test Run');
    console.info('ok', res.ok);
    console.info('stats', res.stats);
    console.info('details', res);
    console.groupEnd();

    setResults(res);
    setRunning(false);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      placeItems: 'center',
    }),
    spinner: css({ minWidth: 110 }),
  };

  const elSpinner = isRunning && <Spinner.Bar color={COLORS.CYAN} width={40} />;
  const elButton = !isRunning && (
    <Button onClick={runTests}>
      <Text results={results} />
    </Button>
  );

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      {elSpinner}
      {elButton}
    </div>
  );
};
