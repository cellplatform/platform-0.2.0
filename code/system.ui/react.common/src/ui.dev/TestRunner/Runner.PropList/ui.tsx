import { useEffect, useState } from 'react';

import { Button, COLORS, css, rx, Spinner, t, Time, useMouseState } from './common';
import { ButtonText } from './ui.ButtonText';

type Milliseconds = number;

const MSEC = {
  DELAY_COLORED: 1000 * 10, // 10-seconds
};

export type TestRunnerProps = {
  get: t.GetTestPayload;
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
      const delay = MSEC.DELAY_COLORED;
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

  const runTests = async () => {
    if (isRunning) return;
    setRunning(true);
    setResults(undefined);

    await Time.wait(0); // Allow UI to update.
    const { root, ctx, timeout } = await props.get();
    const res = await root.run({ ctx, timeout });

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
    base: css({
      flex: 1,
      minHeight: 16,
      display: 'grid',
      alignContent: 'center',
      gridTemplateColumns: '1fr auto',
    }),
    spinner: css({ minWidth: 110 }),
  };

  const elSpinner = isRunning && <Spinner.Bar color={COLORS.GREEN} width={40} />;
  const elButton = !isRunning && (
    <Button onClick={runTests}>
      <ButtonText results={results} isColored={isColoredText} isOver={isOver} />
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
