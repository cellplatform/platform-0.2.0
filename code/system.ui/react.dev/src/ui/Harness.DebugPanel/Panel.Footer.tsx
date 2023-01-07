import { Color, COLORS, css, t, rx, useRenderer } from '../common';
import { Wrangle } from './Wrangle.mjs';

export type DebugPanelFooterProps = {
  instance: t.DevInstance;
  current?: t.DevInfo;
  style?: t.CssValue;
};

export const DebugPanelFooter: React.FC<DebugPanelFooterProps> = (props) => {
  const { instance, current } = props;
  const footer = current?.render?.props?.debug.footer;
  const renderer = footer?.renderer;

  const { element } = useRenderer(instance, renderer);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      borderTop: Wrangle.borderStyle(footer?.border),
    }),
  };

  return <div {...css(styles.base, props.style)}>{element}</div>;
};
