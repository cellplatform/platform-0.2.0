import { css, type t } from './common';
import { PeerId } from '../ui.PeerId';

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
      <PeerId peer={self?.id} prefix={'me'} onClick={handleCopyPeer} />
    </div>
  );
};
