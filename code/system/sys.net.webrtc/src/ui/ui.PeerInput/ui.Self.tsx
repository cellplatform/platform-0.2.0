import { PeerId } from '../ui.PeerId';
import { DEFAULTS, css, type t } from './common';

export type SelfProps = {
  self?: t.Peer;
  enabled: boolean;
  copiedMessage?: string;
  style?: t.CssValue;
  onLocalPeerCopied?: t.PeerCardLocalCopiedHandler;
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
      alignContent: 'center',
      paddingLeft: 8,
      opacity: enabled ? 1 : 0.4,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <PeerId
        peer={self?.id}
        enabled={enabled}
        copyable={true}
        prefix={DEFAULTS.prefix}
        message={props.copiedMessage}
        onClick={handleCopyPeer}
      />
    </div>
  );
};
