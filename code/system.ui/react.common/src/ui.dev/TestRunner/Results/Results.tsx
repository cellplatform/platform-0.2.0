import { css, Style, t, COLORS } from '../common';
import { SuiteResults } from './Results.Suite';
import { Spinner } from '../../../ui/Spinner';

export type ResultsProps = {
  data?: t.TestSuiteRunResponse;
  padding?: t.CssEdgesInput;
  isSpinning?: boolean;
  scroll?: boolean;
  style?: t.CssValue;
};

export const Results: React.FC<ResultsProps> = (props) => {
  const { data, isSpinning = false } = props;

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
      padding: 15,
    }),
    spinner: css({
      Absolute: [25, 0, null, 0],
      display: 'grid',
      placeItems: 'center',
    }),
    results: css({
      opacity: isSpinning ? 0.15 : 1,
      filter: `grayscale(${isSpinning ? 100 : 0}%) blur(${isSpinning ? 1 : 0}px)`,
    }),
  };

  const elSpinner = isSpinning && (
    <div {...styles.spinner}>
      <Spinner size={22} />
    </div>
  );

  const elEmpty = !data && !isSpinning && <div {...styles.empty}>No test results to display.</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {data && <SuiteResults data={data} style={styles.results} />}
      {elEmpty}
      {elSpinner}
    </div>
  );
};
