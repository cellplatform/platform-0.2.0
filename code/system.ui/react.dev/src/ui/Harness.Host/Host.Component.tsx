import { Color, css, t } from '../common';
import { Wrangle } from './Wrangle.mjs';

export type HarnessHostComponentProps = {
  instance: t.DevInstance;
  border: string;
  renderProps?: t.SpecRenderProps;
  style?: t.CssValue;
};

export const HarnessHostComponent: React.FC<HarnessHostComponentProps> = (props) => {
  const { renderProps } = props;
  if (!renderProps) return null;

  const componentSize = Wrangle.componentSize(renderProps.component.size);

  /**
   * [Render]
   */
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

      display: renderProps.component.display,
      width: componentSize.width,
      height: componentSize.height,
      backgroundColor: Color.format(renderProps.component.backgroundColor),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.container} className={'ComponentHost'}>
        {renderProps.component.element}
      </div>
    </div>
  );
};
