import { css, t, useCurrentState } from '../common';
import { SpecColumnMain } from './Column.Main';

export type HarnessSpecColumnProps = {
  instance: t.DevInstance;
  style?: t.CssValue;
};

export const HarnessSpecColumn: React.FC<HarnessSpecColumnProps> = (props) => {
  const { instance } = props;

  const current = useCurrentState(instance, { distinctUntil });
  const results = current.info?.run.results;
  const renderProps = current.info?.props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    body: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <SpecColumnMain results={results} renderProps={renderProps} />
      </div>
    </div>
  );
};

/**
 * Helpers
 */
/**
 * Helpers
 */
const tx = (e: t.DevInfoChanged) => e.info.run.results?.tx;
const distinctUntil = (prev: t.DevInfoChanged, next: t.DevInfoChanged) => {
  return tx(prev) === tx(next);
};
