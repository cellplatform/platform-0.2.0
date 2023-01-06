import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, useRenderer } from '../common';

export type DebugPanelFooterProps = {
  instance: t.DevInstance;
  current?: t.DevInfo;
  style?: t.CssValue;
};

export const DebugPanelFooter: React.FC<DebugPanelFooterProps> = (props) => {
  const { instance, current } = props;
  const renderer = current?.render?.props?.debug.footer.renderer;
  const { element } = useRenderer(instance, renderer);

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
  };

  return <div {...css(styles.base, props.style)}>{element}</div>;
};
