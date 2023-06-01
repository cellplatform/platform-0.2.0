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
import { Results } from './TestRunner.Results';

type Milliseconds = number;

export type TestRunnerProps = {
  bundle: t.GetTestBundle;
  style?: t.CssValue;
};

export const TestRunner: React.FC<TestRunnerProps> = (props) => {
  const mouse = useMouseState();
  const isOver = mouse.isOver;

  const [isRunning, setRunning] = useState(false);
  const [results, setResults] = useState<t.TestSuiteRunResponse[]>([]);
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
        if (isExpired) dispose(); // Stop timer when the "colored text" delay has expired.
      };

      rx.interval(300).pipe(rx.takeUntil(dispose$)).subscribe(update);
      update();
    }

    return dispose;
  }, [runAtTime]);

  const logResults = (res: t.TestSuiteRunResponse) => {
    console.group(`🌳 Run: ${res.description}`);
    console.info('ok', res.ok);
    console.info('stats', res.stats);
    console.info('root', res);
    Test.Tree.Results.walkDown(res, (e) => {
      if (!e.test) return;
      if (e.test?.ok) return;
      console.warn(`${e.suite.description} > ${e.test.description}`);
    });
    console.groupEnd();
  };

  const runTests = async () => {
    if (isRunning) return;
    setRunning(true);
    setResults([]);
    await Time.wait(0); // NB: allow UI to update.

    const { specs, ctx, timeout } = await props.bundle();
    const results: t.TestSuiteRunResponse[] = [];

    for (const suite of specs) {
      const res = await suite.run({ ctx, timeout });
      results.push(res);
      logResults(res);
    }

    setResults(results);
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
      <Results results={results} isColored={isColoredText} isOver={isOver} />
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
