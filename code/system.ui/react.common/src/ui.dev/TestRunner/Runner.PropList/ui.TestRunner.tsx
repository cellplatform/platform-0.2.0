import { useState, useEffect } from 'react';
import { rx, Button, COLORS, css, Icons, Spinner, t, Time, useMouseState } from './common';
import { ButtonText } from './ui.TestRunner.ButtonText';

type Milliseconds = number;

export type TestRunnerProps = {
  loadTests: () => Promise<t.TestSuiteModel>;
  style?: t.CssValue;
};

export const TestRunner: React.FC<TestRunnerProps> = (props) => {
  const mouse = useMouseState();

  const [isRunning, setRunning] = useState(false);
  const [results, setResults] = useState<t.TestSuiteRunResponse>();
  const [runAtTime, setRunAtTime] = useState<Milliseconds>();

  const [_, setRedraw] = useState(0);
  const redraw = () => setRedraw((n) => n + 1);

  const COLORED_DELAY_MSEC = 1000 * 5; // 5 secsonds.
  const sinceLastRun = runAtTime ? Time.duration(Time.now.timestamp - runAtTime) : undefined;
  const isColoredText = mouse.isOver
    ? true
    : sinceLastRun
    ? sinceLastRun.msec < COLORED_DELAY_MSEC
    : false;

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    rx.interval(COLORED_DELAY_MSEC + 200)
      .pipe(rx.takeUntil(dispose$))
      .subscribe(redraw);
    return dispose;
  }, [isColoredText]);

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
    setRunAtTime(Time.now.timestamp);
    setRunning(false);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ display: 'grid', placeItems: 'center' }),
    spinner: css({ minWidth: 110 }),
  };

  const elSpinner = isRunning && <Spinner.Bar color={COLORS.GREEN} width={40} />;
  const elButton = !isRunning && (
    <Button onClick={runTests}>
      <ButtonText results={results} isColored={isColoredText} isOver={mouse.isOver} />
    </Button>
  );

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      {elSpinner}
      {elButton}
    </div>
  );
};
