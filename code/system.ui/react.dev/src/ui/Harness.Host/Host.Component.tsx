import { Color, css, t, useCurrentState, useRedraw } from '../common';
import { Wrangle } from './Wrangle.mjs';
import { RenderCount } from '../RenderCount';

export type HarnessHostComponentProps = {
  instance: t.DevInstance;
  border: string;
  renderProps?: t.DevRenderProps;
  renderCount?: boolean;
  style?: t.CssValue;
};

export const HarnessHostComponent: React.FC<HarnessHostComponentProps> = (props) => {
  const { instance, renderCount = true } = props;
  const component = props.renderProps?.component;
  const renderer = component?.renderer;

  useRedraw(instance, [renderer]);
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
      {renderCount && <RenderCount absolute={[-17, 3, null, null]} />}
    </div>
  );
};
