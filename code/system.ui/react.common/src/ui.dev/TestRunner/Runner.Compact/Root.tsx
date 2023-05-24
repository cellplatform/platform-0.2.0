import { Button, Color, Icons, css, t } from '../common';

export type TestRunnerCompactProps = {
  style?: t.CssValue;
};

export const TestRunnerCompact: React.FC<TestRunnerCompactProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.05)' /* RED */,
      border: `solid 1px ${Color.format(-0.1)}`,
      padding: 10,

      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
    }),
    playIcon: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      marginRight: 3,
      Size: 32,
      display: 'grid',
      alignContent: 'center',
      justifyContent: 'center',
    }),
    label: css({
      backgroundColor: 'rgba(255, 0, 0, 0.2)' /* RED */,
      display: 'grid',
      alignContent: 'center',
      paddingLeft: 5,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <Button style={styles.playIcon}>
        <Icons.Play />
      </Button>
      <div {...styles.label}>RunnerCompact 🐷</div>
    </div>
  );
};
