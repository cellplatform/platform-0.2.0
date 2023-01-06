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
      overflow: 'hidden',
      justifySelf: 'stretch',

      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
    }),
    body: css({
      Scroll: true,
      padding: 20, // TEMP 🐷
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>Header</div>
      <div {...styles.body}>
        <DebugPanelMain instance={instance} />
      </div>
      <div>Footer</div>
    </div>
  );
};
