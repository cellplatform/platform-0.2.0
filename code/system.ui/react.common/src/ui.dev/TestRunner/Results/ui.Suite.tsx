import { COLORS, Color, css, t } from './common';
import { SuiteResults } from './ui.Suite.Results';

export type SuiteProps = {
  data: t.TestSuiteRunResponse;
  spinning?: boolean;
  style?: t.CssValue;
};

export const Suite: React.FC<SuiteProps> = (props) => {
  const { data, spinning } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      filter: `grayscale(${spinning ? 100 : 0}%) blur(${spinning ? 1 : 0}px)`,
      opacity: spinning ? 0.15 : 1,
      backgroundColor: !data.ok ? Color.alpha(COLORS.RED, 0.03) : undefined,
      borderBottom: `dashed 2px ${Color.alpha(COLORS.DARK, 0.1)}`,
      Padding: [20, 20, 10, 20],
      ':first-child': { paddingTop: 15 },
      ':last-child': {
        borderBottom: 'none',
        marginBottom: 30,
      },
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <SuiteResults key={data.tx} data={data} />
    </div>
  );
};
