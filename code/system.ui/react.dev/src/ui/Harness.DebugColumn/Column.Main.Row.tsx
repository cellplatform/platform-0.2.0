import { css, t, useRedraw } from '../common';

type O = Record<string, unknown>;

export type DebugColumnMainRowProps = {
  instance: t.DevInstance;
  renderer: t.DevRendererRef;
  state?: O;
};

export const DebugColumnMainRow: React.FC<DebugColumnMainRowProps> = (props) => {
  const { instance, renderer, state = {} } = props;
  useRedraw(instance, [renderer.id]);

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
