import { Color, COLORS, css, DEFAULTS, R, t, useCurrentState, WrangleUrl } from '../common';
import { PanelFooter, PanelHeader } from '../Harness.PanelEdge';
import { HostBackground } from './Host.Background';
import { HostComponent } from './Host.Component';
import { HostGrid } from './Host.Grid';

const DEFAULT = DEFAULTS.props.host;

export type HarnessHostProps = {
  instance: t.DevInstance;
  style?: t.CssValue;
  baseRef?: React.RefObject<HTMLDivElement>;
  subjectRef?: React.RefObject<HTMLDivElement>;
};

export const HarnessHost: React.FC<HarnessHostProps> = (props) => {
  const { instance } = props;

  const current = useCurrentState(instance, { distinctUntil });
  const renderProps = current.info?.render.props;
  const host = renderProps?.host;

  /**
   * [Render]
   */
  const cropmark = `solid 1px ${Color.format(host?.tracelineColor ?? DEFAULT.tracelineColor)}`;
  const styles = {
    base: css({
      position: 'relative',
      overflow: 'hidden',
      color: COLORS.DARK,
      backgroundColor:
        host?.backgroundColor === undefined
          ? Color.format(DEFAULT.backgroundColor)
          : Color.format(host.backgroundColor),
    }),
    body: css({
      Absolute: 0,
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
    }),
    empty: {
      base: css({ Absolute: 0, display: 'grid', placeContent: 'center', userSelect: 'none' }),
      label: css({ opacity: 0.3, fontStyle: 'italic', fontSize: 14 }),
    },
  };

  const elBackground = renderProps && <HostBackground renderProps={renderProps} />;

  const elGrid = renderProps && (
    <HostGrid renderProps={renderProps} border={cropmark}>
      <HostComponent
        instance={instance}
        renderProps={renderProps}
        border={cropmark}
        subjectRef={props.subjectRef}
      />
    </HostGrid>
  );

  const elBody = (
    <div {...styles.body}>
      <PanelHeader instance={instance} current={host?.header} />
      {elGrid}
      <PanelFooter instance={instance} current={host?.footer} />
    </div>
  );

  const elEmpty = !renderProps && (
    <div {...styles.empty.base}>
      <div {...styles.empty.label}>{'Nothing to display.'}</div>
    </div>
  );

  return (
    <div ref={props.baseRef} {...css(styles.base, props.style)}>
      {elBackground}
      {elBody}
      {elEmpty}
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
