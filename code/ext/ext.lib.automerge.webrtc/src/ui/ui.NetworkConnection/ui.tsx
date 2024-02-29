import { css, usePeerMonitor, useSizeObserver, useTransmitMonitor, type t } from './common';
import { Handle } from './ui.Handle';
import { Middle } from './ui.Middle';

export const View: React.FC<t.NetworkConnectionProps> = (props) => {
  const size = useSizeObserver();
  const width = size.rect.width;
  const left = usePeerMonitor(props.left?.network);
  const right = usePeerMonitor(props.right?.network);
  const { isTransmitting } = useTransmitMonitor(left.bytes.total + right.bytes.total);
  const isConnected = left.isConnected && right.isConnected;
  const bytesIfWideEnough = (bytes: number) => (width > 150 ? bytes : undefined);

  /**
   * Render
   */
  const styles = {
    base: css({ height: 60, display: 'grid', gridTemplateColumns: 'auto 1fr auto' }),
    middle: css({ opacity: width > 116 ? 1 : 0 }),
  };

  return (
    <div ref={size.ref} {...css(styles.base, props.style)}>
      <Handle edge={'Left'} bytes={bytesIfWideEnough(left.bytes.total)} />
      <Middle isConnected={isConnected} isTransmitting={isTransmitting} style={styles.middle} />
      <Handle edge={'Right'} bytes={bytesIfWideEnough(right.bytes.total)} />
    </div>
  );
};

/**
 * Helpers
 */
export const wrangle = {
  bytes: (input: number) => `${input} B`,
} as const;
