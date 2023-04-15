import { useEffect, useState } from 'react';

import { Button, COLORS, css, rx, Spinner, t, Time, useMouseState } from './common';
import { ButtonText } from './ui.ButtonText';

type Milliseconds = number;

const DEFAULT = {
  DELAY_COLORED_MSEC: 1000 * 5, // 5 secsonds.
};

export type TestRunnerProps = {
  get: t.GetTestPayload;
  style?: t.CssValue;
};

export const TestRunner: React.FC<TestRunnerProps> = (props) => {
  const mouse = useMouseState();

  const [isRunning, setRunning] = useState(false);
  const [results, setResults] = useState<t.TestSuiteRunResponse>();
  const [runAtTime, setRunAtTime] = useState<Milliseconds>();
  const [isColoredText, setColoredText] = useState(false);

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    setColoredText(false);

    if (typeof runAtTime === 'number') {
      const delay = DEFAULT.DELAY_COLORED_MSEC;
      const elapsed = () => Time.duration(Time.now.timestamp - runAtTime);
      const expired = () => elapsed().msec > delay;

      setColoredText(!expired());
      rx.interval(300)
        .pipe(
          rx.takeUntil(dispose$),
          rx.map((e) => expired()),
        )
        .subscribe((isExpired) => {
          setColoredText(!isExpired);
          if (isExpired) dispose();
        });
    }

    return dispose;
  }, [runAtTime]);

  const runTests = async () => {
    if (isRunning) return;
    setRunning(true);
    setResults(undefined);

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
