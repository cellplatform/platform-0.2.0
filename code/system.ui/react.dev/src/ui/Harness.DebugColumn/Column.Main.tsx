import { css, t, useCurrentState } from '../common';

export type DebugColumnMainProps = {
  instance: t.DevInstance;
  style?: t.CssValue;
};

export const DebugColumnMain: React.FC<DebugColumnMainProps> = (props) => {
  const { instance } = props;

  const current = useCurrentState(instance, { distinctUntil });
  const render = current.info?.render;
  if (!render) return null;

  const state = render.state;
  const renderers = render.props?.debug.main.renderers ?? [];

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    item: css({
      position: 'relative',
      display: 'grid',
    }),
  };

  const elements = renderers.filter(Boolean).map((renderer, i) => {
    return (
      <div key={renderer.id} {...styles.item}>
        {renderer.fn({ state })}
      </div>
    );
  });

  return <div {...css(styles.base, props.style)}>{elements}</div>;
};

/**
 * [Helpers]
 */

const tx = (e: t.DevInfoChanged) => e.info.run.results?.tx;
const distinctUntil = (prev: t.DevInfoChanged, next: t.DevInfoChanged) => {
  if (tx(prev) !== tx(next)) return false;
  return true;
};
