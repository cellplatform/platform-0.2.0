import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, useRenderer } from '../common';

export type DebugPanelHeaderProps = {
  instance: t.DevInstance;
  current?: t.DevInfo;
  style?: t.CssValue;
};

export const DebugPanelHeader: React.FC<DebugPanelHeaderProps> = (props) => {
  const { instance, current } = props;
  const renderer = current?.render?.props?.debug.header.renderer;
  const { element } = useRenderer(instance, renderer);

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
  };

  return <div {...css(styles.base, props.style)}>{element}</div>;
};
