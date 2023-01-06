import { css, Style, t, COLORS } from '../../common';
import { SuiteResults } from './Results.Suite';

export type ResultsProps = {
  data?: t.TestSuiteRunResponse;
  padding?: t.CssEdgesInput;
  scroll?: boolean;
  style?: t.CssValue;
};

export const Results: React.FC<ResultsProps> = (props) => {
  const { data } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      fontSize: 13,
      color: COLORS.DARK,
      cursor: 'default',
      Scroll: props.scroll,
      ...Style.toPadding(props.padding),
    }),
    empty: css({
      opacity: 0.4,
      Flex: 'center-center',
      userSelect: 'none',
      fontStyle: 'italic',
    }),
  };

  const elEmpty = !data && <div {...styles.empty}>No test results to display.</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {data && <SuiteResults data={data} />}
      {elEmpty}
    </div>
  );
};
