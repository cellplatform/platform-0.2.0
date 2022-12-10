import { Color, COLORS, css, t } from '../common';
import { HarnessHostComponent } from './Host.Component';
import { HarnessHostGrid } from './Host.Grid';

export type HarnessHostProps = {
  renderProps?: t.SpecRenderProps;
  style?: t.CssValue;
};

export const HarnessHost: React.FC<HarnessHostProps> = (props) => {
  const { renderProps } = props;

  if (!renderProps) return null;

  const cropmark = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      pointerEvents: 'none',
      userSelect: 'none',
      backgroundColor:
        renderProps.backdropColor === undefined
          ? Color.alpha(COLORS.DARK, 0.02)
          : Color.format(renderProps.backdropColor),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <HarnessHostGrid renderProps={renderProps} border={cropmark}>
        <HarnessHostComponent renderProps={renderProps} border={cropmark} />
      </HarnessHostGrid>
    </div>
  );
};
