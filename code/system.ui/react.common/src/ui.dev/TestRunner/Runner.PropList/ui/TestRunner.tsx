import { useEffect, useState } from 'react';
import {
  Button,
  COLORS,
  DEFAULTS,
  Spinner,
  Test,
  Time,
  css,
  rx,
  t,
  useMouseState,
} from '../common';
import { ResultsLabel } from './Results.Label';

type Milliseconds = number;

export type TestRunnerProps = {
  get: t.GetTestSuite;
  style?: t.CssValue;
};

export const TestRunner: React.FC<TestRunnerProps> = (props) => {
  const mouse = useMouseState();
  const isOver = mouse.isOver;

  const [isRunning, setRunning] = useState(false);
  const [results, setResults] = useState<t.TestSuiteRunResponse>();
  const [runAtTime, setRunAtTime] = useState<Milliseconds>();
  const [isColoredText, setColoredText] = useState(false);

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    setColoredText(false);

    if (typeof runAtTime === 'number') {
      const delay = DEFAULTS.colorDelay;
      const elapsed = () => Time.duration(Time.now.timestamp - runAtTime);
      const expired = () => elapsed().msec > delay;
      const update = () => {
        const isExpired = expired();
        setColoredText(!isExpired);
        if (isExpired) dispose(); // Stop the timer when the "colored text" delay has expired.
      };

      rx.interval(300).pipe(rx.takeUntil(dispose$)).subscribe(update);
      update();
    }

    return dispose;
  }, [runAtTime]);

  const logResults = (res: t.TestSuiteRunResponse) => {
    console.group('🌳 Test Run');
    console.info('ok', res.ok);
    console.info('stats', res.stats);
    console.info('root', res);
    Test.Tree.Results.walkDown(res, (e) => {
      if (!e.test) return;
      if (e.test?.ok) return;
      console.warn(`${e.suite.description} > ${e.test.description}`);

      /**
       * TODO 🐷
       * - include [e.parent] property, to allow for walking up the tree.
       * - toString() => "root > suite > test"
       */
    });
    console.groupEnd();
  };

  const runTests = async () => {
    if (isRunning) return;
    setRunning(true);
    setResults(undefined);

    await Time.wait(0); // Allow UI to update.
    const { root, ctx, timeout } = await props.get();
    const res = await root.run({ ctx, timeout });

    logResults(res);
    setResults(res);
    setRunAtTime(Time.now.timestamp);
    setRunning(false);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      minHeight: 16,
      display: 'grid',
      alignContent: 'center',
      gridTemplateColumns: '1fr auto',
    }),
    spinner: css({ minWidth: 110 }),
  };

  const elSpinner = isRunning && <Spinner.Bar color={COLORS.GREEN} width={35} />;
  const elButton = !isRunning && (
    <Button onClick={runTests}>
      <ResultsLabel results={results} isColored={isColoredText} isOver={isOver} />
    </Button>
  );

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      <div />
      <div>
        {elSpinner}
        {elButton}
      </div>
    </div>
  );
};
