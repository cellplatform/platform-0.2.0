import { css, t, useRedrawEvent } from '../common';
import { useRenderer } from '../common';

type O = Record<string, unknown>;

export type DebugPanelMainRow = {
  instance: t.DevInstance;
  renderer: t.DevRendererRef;
};

export const DebugPanelMainRow: React.FC<DebugPanelMainRow> = (props) => {
  const { instance, renderer } = props;
  const { element } = useRenderer(instance, renderer);
  useRedrawEvent(instance, [props.renderer]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
    }),
  };

  return <div {...styles.base}>{element}</div>;
};
