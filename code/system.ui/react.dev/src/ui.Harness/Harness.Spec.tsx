import { createGunzip } from 'zlib';
import { Color, COLORS, css, t, rx, FC } from '../common';

export type HarnessSpecProps = {
  results?: t.TestSuiteRunResponse;
  style?: t.CssValue;
};

export const HarnessSpec: React.FC<HarnessSpecProps> = (props) => {
  const { results } = props;

  const desc = results?.description;
  const title = desc ? `🐷 Spec: ${desc}` : 'Spec';

  const print = () => {
    console.info(`Spec (Results Data):`, results);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      overflow: 'hidden',
    }),
    body: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    pre: css({
      fontSize: 12,
    }),
  };

  const json = props.results ? JSON.stringify(props.results, null, '..') : '';
  const elPre = json && <pre {...styles.pre}>{json}</pre>;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body} onClick={print}>
        <div>{title}</div>
        <div>{elPre}</div>
      </div>
    </div>
  );
};
