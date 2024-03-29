import { COLORS, Color, css, type t } from './common';
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
      backgroundColor: !data.ok ? Color.alpha(COLORS.RED, 0.02) : undefined,
      borderBottom: `dashed 2px ${Color.alpha(COLORS.DARK, 0.1)}`,
      Padding: [20, 20, 15, 20],
      ':last-child': {
        borderBottom: 'none',
      },
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <SuiteResults key={data.tx} data={data} />
    </div>
  );
};
