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

  const p = renderProps.component;
  const size = Wrangle.componentSize(p.size);

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

      display: p.display,
      width: size.width,
      height: size.height,
      backgroundColor: Color.format(p.backgroundColor),
    }),
  };

  const el = <div>TMP</div>;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.container} className={'ComponentHost'}>
        {/* {p.renderer} */}
        {el}
      </div>
    </div>
  );
};
