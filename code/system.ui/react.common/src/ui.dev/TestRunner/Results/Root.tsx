import { COLORS, css, Spinner, t } from './common';
import { SuiteResults } from './ui.Suite';

export type TestResultsProps = {
  data?: t.TestSuiteRunResponse;
  spinning?: boolean;
  scroll?: boolean;
  style?: t.CssValue;
};

export const TestResults: React.FC<TestResultsProps> = (props) => {
  const { data, spinning = false, scroll = true } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      fontSize: 13,
      color: COLORS.DARK,
      cursor: 'default',
    }),
    empty: css({
      opacity: 0.4,
      Flex: 'center-center',
      userSelect: 'none',
      fontStyle: 'italic',
      padding: 20,
    }),
    spinner: css({
      Absolute: [25, 0, null, 0],
      display: 'grid',
      placeItems: 'center',
    }),
    body: css({
      position: 'relative',
      Absolute: scroll ? 0 : undefined,
      boxSizing: 'border-box',
      Scroll: scroll,
    }),
    results: css({
      opacity: spinning ? 0.15 : 1,
      filter: `grayscale(${spinning ? 100 : 0}%) blur(${spinning ? 1 : 0}px)`,
      Margin: [10, 20, 50, 20],
    }),
    statusMargin: css({
      width: 2,
      Absolute: [0, null, 0, 0],
      backgroundColor: data?.ok ? COLORS.LIME : COLORS.RED,
    }),
  };

  const elSpinner = spinning && (
    <div {...styles.spinner}>
      <Spinner.Puff size={22} />
    </div>
  );

  const elEmpty = !data && !spinning && <div {...styles.empty}>{'No results to display.'}</div>;

  const elBody = (
    <div {...styles.body}>{data && <SuiteResults data={data} style={styles.results} />}</div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {data && <div {...styles.statusMargin} />}
      {elBody}
      {elEmpty}
      {elSpinner}
    </div>
  );
};
