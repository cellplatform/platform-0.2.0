import { css, t } from '../common';
import { DebugColumnMain } from './Column.Main';

export type HarnessDebugColumnProps = {
  instance: t.DevInstance;
  style?: t.CssValue;
};

export const HarnessDebugColumn: React.FC<HarnessDebugColumnProps> = (props) => {
  const { instance } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 0, 0, 0.01)' /* RED */,
    }),
    body: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <DebugColumnMain instance={instance} />
      </div>
    </div>
  );
};
