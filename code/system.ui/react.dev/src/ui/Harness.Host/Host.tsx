import { Color, COLORS, css, R, t, useCurrentState, WrangleUrl } from '../common';
import { HarnessHostComponent } from './Host.Component';
import { HarnessHostGrid } from './Host.Grid';

export type HarnessHostProps = {
  instance: t.DevInstance;
  style?: t.CssValue;
};

export const HarnessHost: React.FC<HarnessHostProps> = (props) => {
  const { instance } = props;

  const current = useCurrentState(instance, { distinctUntil });
  const renderProps = current.info?.render.props;

  /**
   * [Handlers]
   */
  const navigateToIndex = (e: React.MouseEvent) => {
    WrangleUrl.navigate.ensureIndexDevFlag();
  };

  /**
   * [Render]
   */
  const cropmark = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
  const styles = {
    base: css({
      position: 'relative',
      overflow: 'hidden',
      userSelect: 'none',
      backgroundColor:
        renderProps?.host.backgroundColor === undefined
          ? Color.alpha(COLORS.DARK, 0.02)
          : Color.format(renderProps.host.backgroundColor),
    }),
  };

  return (
    <div {...css(styles.base, props.style)} onDoubleClick={navigateToIndex}>
      <HarnessHostGrid renderProps={renderProps} border={cropmark}>
        <HarnessHostComponent instance={instance} renderProps={renderProps} border={cropmark} />
      </HarnessHostGrid>
    </div>
  );
};

/**
 * Helpers
 */
const distinctUntil = (p: t.DevInfoChanged, n: t.DevInfoChanged) => {
  const prev = p.info;
  const next = n.info;
  if (prev.run.results?.tx !== next.run.results?.tx) return false;
  if (!R.equals(prev.render.revision, next.render.revision)) return false;
  return true;
};
