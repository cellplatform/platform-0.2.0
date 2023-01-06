import { COLORS, css, R, t, useCurrentState } from '../common';
import { DebugPanelMain } from './Panel.Main';

export type DebugPanelProps = {
  instance: t.DevInstance;
  style?: t.CssValue;
};

export const DebugPanel: React.FC<DebugPanelProps> = (props) => {
  const { instance } = props;

  const current = useCurrentState(instance, { distinctUntil });
  const debug = current.info?.render.props?.debug;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      overflow: 'hidden',
      justifySelf: 'stretch',

      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
    }),
    body: css({
      Scroll: debug?.body.scroll,
      padding: debug?.body.padding,
    }),

    TMP: css({
      color: COLORS.MAGENTA, // TEMP 🐷
      padding: 5,
      opacity: 0.3,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.TMP}>Header</div>
      <div {...styles.body}>
        <DebugPanelMain instance={instance} current={current.info} />
      </div>
      <div {...styles.TMP}>Footer</div>
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
