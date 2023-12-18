import { css, type t } from './common';
import { Handle } from './ui.Handle';
import { Middle } from './ui.Middle';
import { usePeerMonitor } from './use.Peer.Monitor';
import { useTransmitMonitor } from './use.Transmit.Monitor';

export const View: React.FC<t.NetworkConnectionProps> = (props) => {
  const left = usePeerMonitor(props.left?.network);
  const right = usePeerMonitor(props.right?.network);
  const { isTransmitting } = useTransmitMonitor(left.bytes.total + right.bytes.total);
  const isConnected = left.isConnected && right.isConnected;

  /**
   * Render
   */
  const styles = {
    base: css({
      height: 60,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Handle edge={'Left'} bytes={left.bytes.total} />
      <Middle isConnected={isConnected} isTransmitting={isTransmitting} />
      <Handle edge={'Right'} bytes={right.bytes.total} />
    </div>
  );
};

/**
 * Helpers
 */
export const Wrangle = {
  bytes(input: number) {
    return `${input} B`;
  },
} as const;
