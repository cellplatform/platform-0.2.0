import { Color, COLORS, css, DEFAULTS, FC, FIELDS, type t } from './common';
import { Remote } from './ui.Remote';
import { Self } from './ui.Self';
import { Video } from './ui.Video';
import { Wrangle } from './Wrangle.mjs';

const View: React.FC<t.PeerInputProps> = (props) => {
  const {
    self,
    spinning = DEFAULTS.spinning,
    enabled = DEFAULTS.enabled,
    fields = DEFAULTS.fields,
  } = props;
  const canConnect = Wrangle.canConnect(props);
  const isConnected = Wrangle.isConnected(props);
  const ids = Wrangle.ids(props);
  const idFields = Wrangle.idFields(props);

  /**
   * [Render]
   */
  const height = idFields.length * 32;
  const styles = {
    base: css({
      position: 'relative',
      height: self ? height : 0,
      transition: 'height 250ms ease',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
    }),
    disabled: css({
      pointerEvents: 'none',
      filter: 'grayscale(1)',
    }),
    divider: css({ borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}` }),
    fields: css({}),
  };

  const elFields = idFields.map((field, i) => {
    const key = `${field}.${i}`;
    const dividerStyle = i > 0 ? styles.divider : undefined;

    if (field === 'Peer:Remote') {
      return (
        <Remote
          key={key}
          self={self}
          ids={ids}
          enabled={enabled}
          canConnect={canConnect}
          isConnected={isConnected}
          isSpinning={spinning}
          onRemotePeerChanged={props.onRemoteChanged}
          onConnectRequest={props.onConnectRequest}
          style={dividerStyle}
        />
      );
    }

    if (field === 'Peer:Self') {
      return (
        <Self
          key={key}
          self={self}
          enabled={enabled}
          onLocalPeerCopied={props.onLocalCopied}
          style={dividerStyle}
        />
      );
    }

    return null;
  });

  if (elFields.length === 0) return null;
  const elVideo = fields.includes('Video') && (
    <Video size={height} stream={props.video} muted={props.muted} />
  );

  return (
    <div {...css(styles.base, !enabled && styles.disabled, props.style)}>
      <div {...styles.fields}>{elFields}</div>
      {elVideo}
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  FIELDS: typeof FIELDS;
};
export const PeerInput = FC.decorate<t.PeerInputProps, Fields>(
  View,
  { DEFAULTS, FIELDS },
  { displayName: 'PeerInput' },
);
