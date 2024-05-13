import { Color, css, useRenderer, type t } from '../common';
import { Wrangle } from './Wrangle';

export type HostComponentProps = {
  instance: t.DevInstance;
  border?: string;
  renderProps?: t.DevRenderProps;
  subjectRef?: React.RefObject<HTMLDivElement>;
  style?: t.CssValue;
};

export const HostComponent: React.FC<HostComponentProps> = (props) => {
  const { instance } = props;
  const component = props.renderProps?.subject;
  const renderer = component?.renderer;
  const { element } = useRenderer(instance, renderer);

  if (!component || !element) return <div />;

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
      color: Color.format(component.color),
      backgroundColor: Color.format(component.backgroundColor),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div ref={props.subjectRef} {...styles.container} className={'ComponentHost'}>
        {element}
      </div>
    </div>
  );
};
