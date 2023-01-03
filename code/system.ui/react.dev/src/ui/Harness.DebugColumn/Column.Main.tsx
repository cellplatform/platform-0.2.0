import { css, t, useCurrentState } from '../common';
import { DebugColumnMainRow as Row } from './Column.Main.Row';

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
  };

  const elements = renderers.filter(Boolean).map((renderer) => {
    return <Row key={renderer.id} instance={instance} renderer={renderer} state={state} />;
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
