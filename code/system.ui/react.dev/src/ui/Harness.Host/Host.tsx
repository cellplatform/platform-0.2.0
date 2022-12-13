import { Color, COLORS, css, t, useCurrentState } from '../common';
import { HarnessHostComponent } from './Host.Component';
import { HarnessHostGrid } from './Host.Grid';

export type HarnessHostProps = {
  instance: t.DevInstance;
  style?: t.CssValue;
};

export const HarnessHost: React.FC<HarnessHostProps> = (props) => {
  const { instance } = props;

  const current = useCurrentState(instance, (prev, next) => tx(prev) === tx(next));
  const renderArgs = current.info?.run.args;
  if (!renderArgs) return null;

  /**
   * [Render]
   */
  const cropmark = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      pointerEvents: 'none',
      userSelect: 'none',
      backgroundColor:
        renderArgs.host.backgroundColor === undefined
          ? Color.alpha(COLORS.DARK, 0.02)
          : Color.format(renderArgs.host.backgroundColor),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <HarnessHostGrid instance={instance} renderArgs={renderArgs} border={cropmark}>
        <HarnessHostComponent instance={instance} renderArgs={renderArgs} border={cropmark} />
      </HarnessHostGrid>
    </div>
  );
};

/**
 * Helpers
 */
const tx = (changed: t.DevInfoChanged) => changed.info.run.results?.tx;
