import { PeerId } from '../ui.PeerId';
import { css, type t } from './common';

export type SelfProps = {
  self?: t.Peer;
  style?: t.CssValue;
  onLocalPeerCopied?: t.PeerCardLocalCopiedHandler;
};

export const Self: React.FC<SelfProps> = (props) => {
  const { self } = props;

  /**
   * [Handlers]
   */
  const handleCopyPeer = () => {
    const local = (self?.id ?? '').trim();
    props.onLocalPeerCopied?.({ local });
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
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <PeerId
        peer={self?.id}
        prefix={'me'}
        enabled={Boolean(props.onLocalPeerCopied)}
        onClick={handleCopyPeer}
      />
    </div>
  );
};
