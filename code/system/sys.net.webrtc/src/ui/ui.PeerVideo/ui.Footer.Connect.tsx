import { Color, COLORS, css, Icons, t, TextInput } from '../common';
import { ConnectButton } from './ui.ConnectButton';

export type FooterConnectProps = {
  self?: t.Peer;
  ids: { local: t.PeerId; remote: t.PeerId };
  canConnect: boolean;
  isConnected: boolean;
  isSpinning: boolean;
  style?: t.CssValue;
  onRemotePeerChanged?: t.PeerVideoRemoteChangedHandler;
  onConnectRequest?: t.PeerVideoConnectRequestHandler;
};

export const FooterConnect: React.FC<FooterConnectProps> = (props) => {
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
      Padding: [5, 2, 5, 5],
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
        {!props.isConnected && <Icons.Globe.Language size={22} opacity={0.3} color={COLORS.DARK} />}
        {props.isConnected && (
          <Icons.Globe.Lock
            size={22}
            opacity={1}
            color={Color.darken(COLORS.CYAN, 2)}
            tooltip={'Secure Connection'}
          />
        )}
      </div>
      <div {...styles.textbox}>
        <TextInput
          value={ids.remote}
          placeholder={'connect to remote peer'}
          valueStyle={{
            fontFamily: 'monospace',
            fontSize: 13,
            fontWeight: 'bold',
            color: Color.alpha(COLORS.DARK, 1),
          }}
          placeholderStyle={{
            fontFamily: 'sans-serif',
            fontSize: 13,
            opacity: 0.3,
            italic: true,
          }}
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
        {error && <Icons.Error tooltip={error} color={COLORS.YELLOW} />}
      </div>
    </div>
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  error(props: FooterConnectProps) {
    const { self, ids } = props;

    if (ids.remote && ids.remote === self?.id) {
      return 'Cannot connect to self.';
    }

    return '';
  },
};
