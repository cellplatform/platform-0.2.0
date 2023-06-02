import { useEffect, useState } from 'react';
import { Util } from '../Util.mjs';
import { Button, COLORS, DEFAULTS, Spinner, Time, css, rx, t, useMouseState } from '../common';
import { Results } from './TestRunner.Results';

type Milliseconds = number;

export type TestRunnerProps = {
  data: t.TestRunnerPropListData;
  style?: t.CssValue;
};

export const TestRunner: React.FC<TestRunnerProps> = (props) => {
  const { data } = props;
  const mouse = useMouseState();

  const results = Wrangle.results(props);
  const isRunning = Wrangle.isRunning(props);

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

  const runTestsClick = async (e: React.MouseEvent) => {
    if (data.run) {
      const modifiers = Util.modifiers(e);
      await data.run.onRunAll?.({ modifiers });
      setRunAtTime(Time.now.timestamp);
    }
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
    <Button onClick={runTestsClick}>
      <Results results={results} isColored={isColoredText} isOver={mouse.isOver} />
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

/**
 * Helpers
 */
const Wrangle = {
  isRunning(props: TestRunnerProps) {
    const results = props.data.specs?.results ?? {};
    return Object.values(results).some((value) => typeof value === 'boolean');
  },

  results(props: TestRunnerProps) {
    const results = props.data.specs?.results ?? {};
    const res = Object.values(results).filter((value) => typeof value === 'object');
    return res as t.TestSuiteRunResponse[];
  },
};
