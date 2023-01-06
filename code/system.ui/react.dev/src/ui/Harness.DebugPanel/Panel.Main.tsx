import { css, t } from '../common';
import { DebugPanelMainRow as Row } from './Panel.Main.Row';

export type DebugPanelMainProps = {
  instance: t.DevInstance;
  current?: t.DevInfo;
  style?: t.CssValue;
};

export const DebugPanelMain: React.FC<DebugPanelMainProps> = (props) => {
  const { instance, current } = props;
  const renderers = current?.render?.props?.debug.body.renderers ?? [];

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
  };

  const elements = renderers.filter(Boolean).map((renderer) => {
    return <Row key={renderer.id} instance={instance} renderer={renderer} />;
  });

  return <div {...css(styles.base, props.style)}>{elements}</div>;
};
