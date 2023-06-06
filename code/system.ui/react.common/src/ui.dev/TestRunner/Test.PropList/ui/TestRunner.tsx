import { useEffect, useState } from 'react';
import { Util } from '../Util.mjs';
import { Button, COLORS, DEFAULTS, Spinner, Time, css, rx, useMouseState, type t } from '../common';
import { Results } from './TestRunner.Results';

export type TestRunnerProps = {
  data?: t.TestPropListData;
  enabled?: boolean;
  style?: t.CssValue;
};

export const TestRunner: React.FC<TestRunnerProps> = (props) => {
  const { data } = props;
  const results = Wrangle.results(props);
  const isRunning = Wrangle.isRunning(props);
  const isEnabled = Wrangle.isEnabled(props);
  const txs = results.map((m) => m.tx).join();

  const mouse = useMouseState();
  const [isColored, setColored] = useState(false);

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (results.length > 0) {
      setColored(true);
      Time.until(dispose$).delay(DEFAULTS.colorDelay, () => setColored(false));
    }

    return dispose;
  }, [txs]);

  const runTestsClick = async (e: React.MouseEvent) => {
    if (!isEnabled) return;
    if (data?.run) {
      const modifiers = Util.modifiers(e);
      await data.run.onRunAll?.({ modifiers });
      mouse.reset();
    }
  };

  /**
   * [Render]
   */
  const height = 15;
  const styles = {
    base: css({
      flex: 1,
      height,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
    }),
    spinner: css({
      height,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elSpinner = isRunning && (
    <div {...styles.spinner}>
      <Spinner.Bar color={COLORS.GREEN} width={35} />
    </div>
  );
  const elButton = !isRunning && (
    <Button onClick={runTestsClick} isEnabled={isEnabled}>
      <Results results={results} isColored={isColored} isOver={mouse.isOver} />
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
  isEnabled(props: TestRunnerProps) {
    return props.enabled ?? true;
  },

  isRunning(props: TestRunnerProps) {
    if (!Wrangle.isEnabled(props)) return false;
    const results = props.data?.specs?.results ?? {};
    return Object.values(results).some((value) => typeof value === 'boolean');
  },

  results(props: TestRunnerProps) {
    const results = props.data?.specs?.results ?? {};
    const res = Object.values(results).filter((value) => typeof value === 'object');
    return res as t.TestSuiteRunResponse[];
  },
};
