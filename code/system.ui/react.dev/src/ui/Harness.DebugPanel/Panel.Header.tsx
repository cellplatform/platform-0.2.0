import { css, t, useRenderer } from '../common';
import { Wrangle } from './Wrangle.mjs';

export type DebugPanelHeaderProps = {
  instance: t.DevInstance;
  current?: t.DevInfo;
  style?: t.CssValue;
};

export const DebugPanelHeader: React.FC<DebugPanelHeaderProps> = (props) => {
  const { instance, current } = props;
  const header = current?.render?.props?.debug.header;
  const renderer = header?.renderer;

  const { element } = useRenderer(instance, renderer);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      boxSizing: 'border-box',
      padding: header?.padding,
      borderBottom: Wrangle.borderStyle(header?.border),
    }),
  };

  return <div {...css(styles.base, props.style)}>{element}</div>;
};
