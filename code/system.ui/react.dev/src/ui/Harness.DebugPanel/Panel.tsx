import { Color, css, t } from '../common';
import { DebugPanelMain } from './Panel.Main';

export type DebugPanelProps = {
  instance: t.DevInstance;
  style?: t.CssValue;
};

export const DebugPanel: React.FC<DebugPanelProps> = (props) => {
  const { instance } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 0, 0, 0.01)' /* RED */,
      border: `dashed 1px ${Color.format(-0.1)}`,
    }),
    body: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <DebugPanelMain instance={instance} />
      </div>
    </div>
  );
};
