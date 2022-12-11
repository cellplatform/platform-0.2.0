import { createGunzip } from 'zlib';
import { Color, COLORS, css, t, rx, FC } from '../common';
import { SpecColumnMain } from './Column.Main';

export type HarnessSpecColumnProps = {
  results?: t.TestSuiteRunResponse;
  renderArgs?: t.SpecRenderArgs;
  style?: t.CssValue;
};

export const HarnessSpecColumn: React.FC<HarnessSpecColumnProps> = (props) => {
  const { results, renderArgs } = props;

  const desc = results?.description;
  const title = desc ? `🐷 Spec: ${desc}` : 'Spec';

  const tmpPrint = () => {
    console.info(`Spec (Results Data):`, results);
  };

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
        <SpecColumnMain results={results} renderArgs={renderArgs} />
      </div>
    </div>
  );
};
