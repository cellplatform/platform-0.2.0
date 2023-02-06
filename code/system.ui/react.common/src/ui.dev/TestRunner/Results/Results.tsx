import { css, Style, t, COLORS, Spinner } from '../common';
import { SuiteResults } from './Results.Suite';

export type ResultsProps = {
  data?: t.TestSuiteRunResponse;
  padding?: t.CssEdgesInput;
  spinning?: boolean;
  scroll?: boolean;
  style?: t.CssValue;
};

export const Results: React.FC<ResultsProps> = (props) => {
  const { data, spinning = false, scroll = true } = props;

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
      Scroll: scroll,
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
      opacity: spinning ? 0.15 : 1,
      filter: `grayscale(${spinning ? 100 : 0}%) blur(${spinning ? 1 : 0}px)`,
    }),
  };

  const elSpinner = spinning && (
    <div {...styles.spinner}>
      <Spinner.Puff size={22} />
    </div>
  );

  const elEmpty = !data && !spinning && (
    <div {...styles.empty}>{'No test results to display.'}</div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {data && <SuiteResults data={data} style={styles.results} />}
      {elEmpty}
      {elSpinner}
    </div>
  );
};
