import { Color, COLORS, css, DevIcons, t, Time } from './common';
import { Description } from './ui.Description';
import { TestError } from './ui.Test.Error';

export type TestResultProps = {
  data: t.TestRunResponse;
  style?: t.CssValue;
};

export const TestResult: React.FC<TestResultProps> = (props) => {
  const { data } = props;
  const excluded = data.excluded ?? [];
  const isSkipped = excluded.includes('skip');
  const isExcludedViaOnly = excluded.includes('only');
  const isNoop = data.noop;

  // NB: still show if "skipped" to the test retains visibility
  //     until either implemented or deleted.
  if (isExcludedViaOnly && !isSkipped) return null;

  /**
   * [Render]
   */
  const styles = {
    _base: css({
      position: 'relative',
      marginBottom: 4,
    }),
    get base() {
      return this._base;
    },
    set base(value) {
      this._base = value;
    },
    line: {
      base: css({ display: 'grid', gridTemplateColumns: 'auto 1fr auto' }),
      icon: css({ marginRight: 6 }),
      elapsed: css({ marginLeft: 20, opacity: 0.2, userSelect: 'none' }),
    },
    error: css({ marginLeft: 25 }),
  };

  const elSuccessIcon = !isSkipped && data.ok && (
    <DevIcons.Tick size={16} color={COLORS.LIME} offset={[0, 1]} />
  );
  const elFailIcon = !isSkipped && !data.ok && (
    <DevIcons.Close size={16} color={COLORS.RED} offset={[0, 2]} />
  );
  const elSkippedIcon = isSkipped && (
    <DevIcons.Skip size={16} color={Color.alpha(COLORS.DARK, 0.3)} offset={[0, 2]} />
  );

  const elIcons = (
    <>
      {elSuccessIcon}
      {elFailIcon}
      {elSkippedIcon}
    </>
  );

  const elNoopIcon = isNoop && (
    <DevIcons.Wait size={16} color={Color.alpha(COLORS.DARK, 0.5)} offset={[0, 2]} />
  );

  const elError = data.error && <TestError data={data} style={styles.error} />;

  const elapsed = Time.duration(data.time.elapsed).toString();

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.line.base}>
        <div {...styles.line.icon}>{elNoopIcon || elIcons}</div>
        <Description text={data.description} isSkipped={isSkipped} />
        <div {...styles.line.elapsed}>{isSkipped ? '-' : elapsed}</div>
      </div>
      {elError}
    </div>
  );
};
