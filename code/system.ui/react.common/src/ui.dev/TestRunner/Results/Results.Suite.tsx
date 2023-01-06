import { css, t } from '../../common';
import { TestResult } from './Results.Test';
import { Description } from './Result.Description';

export type SuiteResultsProps = {
  data: t.TestSuiteRunResponse;
  style?: t.CssValue;
};

export const SuiteResults: React.FC<SuiteResultsProps> = (props) => {
  const { data } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    title: {
      base: css({ Flex: 'horizontal-stretch-stretch', marginBottom: 4 }),
      description: css({ flex: 1 }),
      elapsed: css({ opacity: 0.4, userSelect: 'none' }),
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
        <div {...styles.title.elapsed}>{data.elapsed}ms</div>
      </div>
      <div {...styles.body}>
        {elTests}
        {elChildren}
      </div>
    </div>
  );
};
