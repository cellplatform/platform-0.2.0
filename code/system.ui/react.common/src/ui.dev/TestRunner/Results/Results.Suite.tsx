import { css, t, Time } from '../common';
import { Description } from './Result.Description';
import { TestResult } from './Results.Test';

export type SuiteResultsProps = {
  data: t.TestSuiteRunResponse;
  style?: t.CssValue;
};

export const SuiteResults: React.FC<SuiteResultsProps> = (props) => {
  const { data } = props;
  const elapsed = Time.duration(data.elapsed).toString();

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    title: {
      base: css({ Flex: 'horizontal-stretch-stretch', marginBottom: 4 }),
      description: css({ flex: 1 }),
      elapsed: css({ opacity: 1, userSelect: 'none' }),
    },
    body: css({
      position: 'relative',
      paddingLeft: 10,
    }),
  };

  const elTests = data.tests.map((test) => <TestResult key={test.id} data={test} />);
  const elChildren = data.children.map((suite) => <SuiteResults key={suite.id} data={suite} />);

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title.base}>
        <Description text={data.description} style={styles.title.description} />
        <div {...styles.title.elapsed}>{elapsed}</div>
      </div>
      <div {...styles.body}>
        {elTests}
        {elChildren}
      </div>
    </div>
  );
};
