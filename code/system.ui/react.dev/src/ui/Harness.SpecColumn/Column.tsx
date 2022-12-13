import { css, t, useCurrentState } from '../common';
import { SpecColumnMain } from './Column.Main';

export type HarnessSpecColumnProps = {
  instance: t.DevInstance;
  style?: t.CssValue;
};

export const HarnessSpecColumn: React.FC<HarnessSpecColumnProps> = (props) => {
  const { instance } = props;

  const current = useCurrentState(instance, (prev, next) => tx(prev) === tx(next));
  const results = current.info?.run.results;
  const renderProps = current.info?.run.props;

  /**
   * [Handlers]
   */
  const tmpPrint = () => {
    // TEMP 🐷
    console.info(`Info (Run Results):`, results);
    console.log('results.tests', results?.tests);
  };

  console.log('results', results);

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
      <div {...styles.body} onClick={tmpPrint}>
        <SpecColumnMain results={results} renderProps={renderProps} />
      </div>
    </div>
  );
};

/**
 * Helpers
 */
const tx = (changed: t.DevInfoChanged) => changed.info.run.results?.tx;
