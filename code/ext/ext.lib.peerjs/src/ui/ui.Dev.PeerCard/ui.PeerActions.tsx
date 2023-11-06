import { css, type t } from './common';
import { Button } from './ui.Button';

export type PeerActionsProps = Pick<t.DevPeerCardProps, 'peer' | 'style'>;

export const PeerActions: React.FC<PeerActionsProps> = (props) => {
  const self = props.peer.self;

  /**
   * Handlers
   */
  const handleConnectData = () => self?.connect.data(props.peer.remote.id);
  const handleConnectVideo = () => self?.connect.media('media:video', props.peer.remote.id);
  const handleConnectScreen = () => self?.connect.media('media:screen', props.peer.remote.id);
  const handlePeerDispose = () => self.dispose();
  const handlePurge = () => self?.purge();

  /**
   * Render
   */
  const styles = {
    base: css({
      fontSize: 13,
    }),
    ul: css({
      margin: 0,
      lineHeight: 1.5,
    }),
  };

  const button = (label: string, handler?: () => void) => {
    return (
      <li>
        <Button onClick={handler}>{label}</Button>
      </li>
    );
  };

  return (
    <div {...css(styles.base, props.style)}>
      <ul {...styles.ul}>
        {button('peer.connect.data', handleConnectData)}
        {button('peer.connect.media.video', handleConnectVideo)}
        {button('peer.connect.media.screen', handleConnectScreen)}
        {button('peer.dispose', handlePeerDispose)}
        {button('purge', handlePurge)}
      </ul>
    </div>
  );
};
