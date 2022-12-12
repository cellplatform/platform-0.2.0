import { Color, css, t } from '../common';
import { Wrangle } from './Wrangle.mjs';

export type HarnessHostComponentProps = {
  instance: t.DevInstance;
  border: string;
  renderArgs?: t.SpecRenderArgs;
  style?: t.CssValue;
};

export const HarnessHostComponent: React.FC<HarnessHostComponentProps> = (props) => {
  const { renderArgs } = props;
  if (!renderArgs) return null;

  const componentSize = Wrangle.componentSize(renderArgs.component.size);

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

      display: renderArgs.component.display,
      width: componentSize.width,
      height: componentSize.height,
      backgroundColor: Color.format(renderArgs.component.backgroundColor),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.container} className={'ComponentHost'}>
        {renderArgs.component.element}
      </div>
    </div>
  );
};
