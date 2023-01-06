import { css, t, useCurrentState } from '../common';
import { DebugPanelMainRow as Row } from './Panel.Main.Row';

export type DebugPanelMainProps = {
  instance: t.DevInstance;
  style?: t.CssValue;
};

export const DebugPanelMain: React.FC<DebugPanelMainProps> = (props) => {
  const { instance } = props;

  const current = useCurrentState(instance, { distinctUntil });
  const renderers = current.info?.render?.props?.debug.body.renderers ?? [];

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  const elements = renderers.filter(Boolean).map((renderer) => {
    return <Row key={renderer.id} instance={instance} renderer={renderer} />;
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
