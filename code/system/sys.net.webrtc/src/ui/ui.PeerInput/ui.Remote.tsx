import { COLORS, Color, Icons, TextInput, css, type t } from './common';
import { ConnectButton } from './ui.ConnectButton';

export type RemoteProps = {
  self?: t.Peer;
  ids: { local: t.PeerId; remote: t.PeerId };
  canConnect: boolean;
  isConnected: boolean;
  isSpinning: boolean;
  style?: t.CssValue;
  onRemotePeerChanged?: t.PeerCardRemoteChangedHandler;
  onConnectRequest?: t.PeerCardConnectRequestHandler;
};

export const Remote: React.FC<RemoteProps> = (props) => {
  const { self, ids } = props;
  const error = Wrangle.error(props);

  /**
   * [Handlers]
   */
  const handleConnect = () => {
    if (!self || !props.canConnect) return;
    const { local, remote } = props.ids;
    props.onConnectRequest?.({ local, remote });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      height: 32,
      overflow: 'hidden',

      Padding: [4, 2, 5, 5],
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
    }),
    textbox: css({
      display: 'grid',
      alignContent: 'center',
      marginRight: 5,
    }),
    edgeIcons: css({
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'center',
      gridTemplateColumns: 'repeat(5, auto)',
      gap: '1px',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.edgeIcons}>
        {!props.isConnected && (
          <Icons.Globe.Language
            size={20}
            color={
              ids.remote && self ? Color.alpha(COLORS.CYAN, 0.8) : Color.alpha(COLORS.DARK, 0.2)
            }
          />
        )}
        {props.isConnected && (
          <Icons.Network.Antenna
            size={20}
            opacity={1}
            color={Color.darken(COLORS.CYAN, 0)}
            tooltip={'Secure Connection'}
            offset={[0, 1]}
          />
        )}
      </div>
      <div {...styles.textbox}>
        <TextInput
          isEnabled={Boolean(self)}
          value={ids.remote}
          placeholder={'connect to remote peer'}
          valueStyle={{
            fontFamily: 'monospace',
            fontSize: 13,
            fontWeight: 'bold',
            color: Color.alpha(COLORS.CYAN, 1),
          }}
          placeholderStyle={{
            fontFamily: 'sans-serif',
            fontSize: 14,
            opacity: 0.3,
            italic: true,
            color: Color.alpha(COLORS.DARK, 0.5),
          }}
          selectionBackground={Color.alpha(COLORS.CYAN, 0.1)}
          maxLength={40}
          focusAction={'Select'}
          spellCheck={false}
          onEnter={handleConnect}
          onChanged={(e) => {
            const local = ids.local;
            const remote = e.to;
            props.onRemotePeerChanged?.({ local, remote });
          }}
        />
      </div>
      <div {...styles.edgeIcons}>
        {!props.isConnected && props.canConnect && !error && (
          <ConnectButton
            isSpinning={props.isSpinning}
            canConnect={props.canConnect}
            onClick={handleConnect}
          />
        )}
        {error && <Icons.Error tooltip={error} size={16} color={COLORS.YELLOW} />}
      </div>
    </div>
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  error(props: RemoteProps) {
    const { self, ids } = props;

    if (ids.remote && ids.remote === self?.id) {
      return 'Cannot connect to self.';
    }

    return '';
  },
};
