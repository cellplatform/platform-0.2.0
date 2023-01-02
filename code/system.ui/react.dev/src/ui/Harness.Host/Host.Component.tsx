import { Color, css, t, useCurrentState } from '../common';
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

  const current = useCurrentState(instance, { filter: (e) => e.message === 'state:write' });

  if (!component || !renderer) return null;
  const state = current.info?.render.state ?? {};

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
      pointerEvents: 'auto',
      userSelect: 'auto',

      display: component.display,
      width: size.width,
      height: size.height,
      backgroundColor: Color.format(component.backgroundColor),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.container} className={'ComponentHost'}>
        {renderer.fn({ state })}
      </div>
    </div>
  );
};
