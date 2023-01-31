import { Color, COLORS, css, Icons, t } from '../common';
import { TestError } from './Results.Test.Error';
import { Description } from './Result.Description';

export type TestResultProps = {
  data: t.TestRunResponse;
  style?: t.CssValue;
};

export const TestResult: React.FC<TestResultProps> = (props) => {
  const { data } = props;
  const excluded = data.excluded ?? [];
  const isSkipped = excluded.includes('skip');
  const isExcludedViaOnly = excluded.includes('only');

  // NB: still show if "skipped" to the test retains visibility until either implemented or deleted
  if (isExcludedViaOnly && !isSkipped) return null;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', marginBottom: 4 }),
    line: {
      base: css({
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
      }),
      icon: css({ marginRight: 6 }),
      elapsed: css({ marginLeft: 20, opacity: 0.2, userSelect: 'none' }),
    },
    error: css({ marginLeft: 25 }),
  };

  const elIconSuccess = !isSkipped && data.ok && <Icons.Tick size={16} color={COLORS.LIME} />;
  const elIconFail = !isSkipped && !data.ok && <Icons.Close size={16} color={COLORS.MAGENTA} />;
  const elIconSkipped = isSkipped && (
    <Icons.Skip
      size={16}
      color={Color.alpha(COLORS.DARK, 0.3)}
      style={{ position: 'relative', top: 2 }}
    />
  );

  const elError = data.error && <TestError data={data} style={styles.error} />;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.line.base}>
        <div {...styles.line.icon}>
          {elIconSuccess}
          {elIconFail}
          {elIconSkipped}
        </div>
        <Description text={data.description} isSkipped={isSkipped} />
        {<div {...styles.line.elapsed}>{isSkipped ? '-' : `${data.elapsed} ms`}</div>}
      </div>
      {elError}
    </div>
  );
};
