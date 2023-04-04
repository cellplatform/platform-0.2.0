import { css, t } from '../common';
import { PeerId } from '../ui.PeerId';

export type FooterMeProps = {
  self?: t.Peer;
  style?: t.CssValue;
  onLocalPeerCopied?: t.PeerCardLocalCopiedHandler;
};

export const FooterMe: React.FC<FooterMeProps> = (props) => {
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
