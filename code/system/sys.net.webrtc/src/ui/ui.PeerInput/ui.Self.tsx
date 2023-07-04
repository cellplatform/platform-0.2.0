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
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <PeerId peer={self?.id} prefix={'me'} onClick={handleCopyPeer} />
    </div>
  );
};
