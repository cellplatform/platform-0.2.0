import { Color, css, t } from '../common';
import { Wrangle } from './Wrangle.mjs';

export type HarnessHostComponentProps = {
  border: string;
  renderProps?: t.SpecRenderProps;
  style?: t.CssValue;
};

export const HarnessHostComponent: React.FC<HarnessHostComponentProps> = (props) => {
  const { renderProps } = props;
  const hasRenderProps = Boolean(renderProps);

  if (!renderProps) return null;

  const { size } = renderProps;
  const componentSize = Wrangle.componentSize(size);
  const sizeMode = size?.mode ?? 'center';

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      border: props.border,
    }),
    container: css({
      position: 'relative',
      Absolute: sizeMode === 'fill' ? 0 : undefined,
      pointerEvents: 'auto',
      userSelect: 'text',
      display: renderProps.display,
      width: componentSize.width,
      height: componentSize.height,
      backgroundColor: Color.format(renderProps.backgroundColor),
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.container}>{renderProps.element}</div>
    </div>
  );
};
