import { useState } from 'react';
import { Button, COLORS, css, Icons, Spinner, t, Time, useMouseState } from './common';

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
      <ButtonText results={results} />
    </Button>
  );

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      {elSpinner}
      {elButton}
    </div>
  );
};

/**
 * Helpers
 */

const ButtonText = (props: { results?: t.TestSuiteRunResponse }) => {
  const { results } = props;
  if (!results) return <div>{'run tests'}</div>;

  const { ok, stats } = results;
  const { passed, failed } = stats;
  const skipped = stats.skipped + stats.only;
  const elapsed = Time.duration(results.elapsed);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Flex: 'x-center-center',
    }),
    item: css({ Flex: 'x-center-center' }),
    failed: css({ color: COLORS.RED }),
    passed: css({ color: COLORS.GREEN }),
    skipped: css({ color: COLORS.YELLOW }),
    elapsed: css({}),
    spacer: css({ width: 6 }),
  };

  const elements: JSX.Element[] = [];
  const push = (el: JSX.Element) => {
    if (elements.length > 0) {
      const key = `spacer-${elements.length}`;
      elements.push(<div {...styles.spacer} key={key} />);
    }
    elements.push(el);
  };

  if (failed > 0) {
    const title = `${failed} failed`;
    push(
      <div {...css(styles.failed, styles.item)} key={title} title={title}>
        <Icons.Test.Failed size={14} /> {failed}
      </div>,
    );
  }

  if (passed > 0) {
    const title = `${passed} passed`;
    push(
      <div {...css(styles.passed, styles.item)} key={title} title={title}>
        <Icons.Test.Passed size={14} /> {passed}
      </div>,
    );
  }

  if (skipped > 0) {
    const title = `${skipped} skipped`;
    push(
      <div {...css(styles.skipped, styles.item)} key={title} title={title}>
        <Icons.Test.Skipped size={14} style={{ transform: 'scaleX(-1)' }} /> {skipped}
      </div>,
    );
  }

  if (elapsed.msec > 0) {
    const title = 'Re-run test suite';
    push(
      <div
        {...css(styles.elapsed, styles.item)}
        key={'elapsed'}
        title={title}
      >{`in ${elapsed}`}</div>,
    );
  }

  return <div {...styles.base}>{elements}</div>;
};
