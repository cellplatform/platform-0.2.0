import { Color, COLORS, css, t } from '../common';
import { HarnessHost } from './Harness.Host';
import { HarnessSpecs } from './Harness.Specs';
import { useSpecRunner } from './useSpecRunner.mjs';

export type HarnessProps = {
  spec?: t.BundleImport;
  style?: t.CssValue;
};

export const Harness: React.FC<HarnessProps> = (props) => {
  const runner = useSpecRunner(props.spec);

  /**
   * [Render]
   */
  const styles = {
    reset: css({
      color: COLORS.DARK,
      fontFamily: 'sans-serif',
      fontSize: 16,
    }),
    base: css({
      position: 'relative',
      Flex: 'x-stretch-stretch',
    }),
    left: css({
      flex: 1,
      position: 'relative',
      display: 'flex',
    }),
    right: css({
      boxSizing: 'border-box',
      position: 'relative',
      display: 'flex',
      width: 400,
      borderLeft: `solid 1px ${Color.format(-0.1)}`,
      padding: 20, // TEMP 🐷
    }),
  };

  return (
    <div {...css(styles.reset, styles.base, props.style)}>
      <div {...styles.left}>
        <HarnessHost component={runner.props} />
      </div>
      <div {...styles.right}>
        <HarnessSpecs results={runner.results} />
      </div>
    </div>
  );
};
