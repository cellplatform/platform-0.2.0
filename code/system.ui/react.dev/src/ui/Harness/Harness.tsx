import { useEffect } from 'react';

import { Color, COLORS, css, t, useBusController } from '../common';
import { HarnessHost } from '../Harness.Host';
import { DebugPanel } from '../Harness.DebugPanel';

export type HarnessProps = {
  instance?: t.DevInstance;
  spec?: t.BundleImport;
  style?: t.CssValue;
  allowRubberband?: boolean;
};

export const Harness: React.FC<HarnessProps> = (props) => {
  const { instance } = useBusController({
    bundle: props.spec,
    bus: props.instance?.bus,
    id: props.instance?.id,
    runOnLoad: true,
  });

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const allow = props.allowRubberband ?? false;
    document.body.style.overflow = allow ? 'auto' : 'hidden';
  }, [props.allowRubberband]);

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
      <HarnessHost instance={instance} />
      <DebugPanel instance={instance} />
    </div>
  );
};
