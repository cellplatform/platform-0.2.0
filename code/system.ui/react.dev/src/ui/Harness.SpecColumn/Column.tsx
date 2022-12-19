import { css, t } from '../common';
import { SpecColumnMain } from './Column.Main';

export type HarnessSpecColumnProps = {
  instance: t.DevInstance;
  style?: t.CssValue;
};

export const HarnessSpecColumn: React.FC<HarnessSpecColumnProps> = (props) => {
  const { instance } = props;

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
        <SpecColumnMain instance={instance} />
      </div>
    </div>
  );
};
