import { css, t, useRedraw } from '../common';

type O = Record<string, unknown>;

export type DebugPanelMainRow = {
  instance: t.DevInstance;
  renderer: t.DevRendererRef;
  state?: O;
};

export const DebugPanelMainRow: React.FC<DebugPanelMainRow> = (props) => {
  const { instance, renderer, state = {} } = props;
  useRedraw(instance, [renderer]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
    }),
  };

  return <div {...styles.base}>{renderer.fn({ state })}</div>;
};
