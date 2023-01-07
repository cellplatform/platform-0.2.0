import { Color, css, t, useRenderer } from '../common';
import { Wrangle } from './Wrangle.mjs';

export type HarnessHostComponentProps = {
  instance: t.DevInstance;
  border: string;
  renderProps?: t.DevRenderProps;
  style?: t.CssValue;
};

export const HarnessHostComponent: React.FC<HarnessHostComponentProps> = (props) => {
  const { instance } = props;
  const component = props.renderProps?.component;
  const renderer = component?.renderer;
  const { element } = useRenderer(instance, renderer);

  if (!component || !element) return null;

  /**
   * [Render]
   */
  const size = Wrangle.componentSize(component?.size);
  const styles = {
    base: css({
      position: 'relative',
      border: props.border,
      display: 'flex',
    }),
    container: css({
      flex: 1,
      position: 'relative',
      display: component.display,
      width: size.width,
      height: size.height,
      backgroundColor: Color.format(component.backgroundColor),
    }),
  };

  return (
    <div {...css(styles.base, props.style)} onDoubleClick={(e) => e.stopPropagation()}>
      <div {...styles.container} className={'ComponentHost'}>
        {element}
      </div>
    </div>
  );
};
