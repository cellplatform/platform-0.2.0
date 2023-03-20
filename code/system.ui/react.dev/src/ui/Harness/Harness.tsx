import { COLORS, css, t, useBusController, useRubberband } from '../common';
import { DebugPanel } from '../Harness.DebugPanel';
import { HarnessHost } from '../Harness.Host';

export type HarnessProps = {
  instance?: t.DevInstance;
  spec?: t.SpecImport;
  allowRubberband?: boolean;
  style?: t.CssValue;
  onHostResize?: t.HarnessResizeHandler;
};

export const Harness: React.FC<HarnessProps> = (props) => {
  useRubberband(props.allowRubberband ?? false);

  const controller = useBusController({
    bundle: props.spec,
    bus: props.instance?.bus,
    id: props.instance?.id,
    runOnLoad: true,
  });
  const { instance } = controller;

  /**
   * [Handlers]
   */
  const handleResize: t.HarnessResizeHandler = (e) => {
    const { size } = e;
    props.onHostResize?.(e);
  };

  /**
   * [Render]
   */
  const styles = {
    reset: css({
      color: COLORS.DARK,
      fontFamily: 'sans-serif',
      fontSize: 16,
    }),
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
    }),
  };

  return (
    <div {...css(styles.reset, styles.base, props.style)}>
      <HarnessHost instance={instance} onResize={handleResize} />
      <DebugPanel instance={instance} />
    </div>
  );
};
