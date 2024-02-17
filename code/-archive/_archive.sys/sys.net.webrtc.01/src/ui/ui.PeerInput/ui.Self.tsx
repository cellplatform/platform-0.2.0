import { PeerId } from '../ui.PeerId';
import { DEFAULTS, css, type t, Button, Icons } from './common';
import { ConfigButton } from './ui.Self.Config';

export type SelfProps = {
  self?: t.Peer;
  enabled: boolean;
  copiedMessage?: string;
  config?: Partial<t.PeerInputConfigButton>;
  style?: t.CssValue;
  onLocalPeerCopied?: t.PeerCardLocalCopiedHandler;
  onConfigClick?: t.PeerInputConfigClickHandler;
};

export const Self: React.FC<SelfProps> = (props) => {
  const { self, enabled } = props;

  /**
   * [Handlers]
   */
  const handleCopyPeer: t.PeerIdClickHandler = (e) => {
    e.copy();
    props.onLocalPeerCopied?.({ local: e.id });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      height: 32,
      overflow: 'hidden',
      boxSizing: 'border-box',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      opacity: enabled ? 1 : 0.4,
    }),
    peerId: css({
      paddingLeft: 8,
      display: 'grid',
      alignContent: 'center',
    }),
  };

  const elButton = props.config && (
    <ConfigButton config={props.config} onClick={props.onConfigClick} />
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.peerId}>
        <PeerId
          peer={self?.id}
          enabled={enabled}
          copyable={true}
          prefix={DEFAULTS.prefix}
          message={props.copiedMessage}
          onClick={handleCopyPeer}
        />
      </div>
      {elButton}
    </div>
  );
};
