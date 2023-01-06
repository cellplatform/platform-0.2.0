import { Color, COLORS, css, R, t, useCurrentState, WrangleUrl, DEFAULT } from '../common';
import { HarnessHostComponent } from './Host.Component';
import { HarnessHostGrid } from './Host.Grid';

const HOST = DEFAULT.props.host;

export type HarnessHostProps = {
  instance: t.DevInstance;
  style?: t.CssValue;
};

export const HarnessHost: React.FC<HarnessHostProps> = (props) => {
  const { instance } = props;

  const current = useCurrentState(instance, { distinctUntil });
  const renderProps = current.info?.render.props;
  const host = renderProps?.host;

  /**
   * [Handlers]
   */
  const navigateToIndex = (e: React.MouseEvent) => {
    WrangleUrl.navigate.ensureIndexDevFlag();
  };

  /**
   * [Render]
   */
  const cropmark = `solid 1px ${Color.format(host?.gridColor ?? HOST.gridColor)}`;
  const styles = {
    base: css({
      position: 'relative',
      overflow: 'hidden',
      backgroundColor:
        host?.backgroundColor === undefined
          ? HOST.backgroundColor
          : Color.format(host.backgroundColor),
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
