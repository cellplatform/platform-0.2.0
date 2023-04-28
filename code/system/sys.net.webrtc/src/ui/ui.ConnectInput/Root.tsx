import { Color, COLORS, css, DEFAULTS, FC, FIELDS, t } from './common';
import { Remote } from './ui.Remote';
import { Self } from './ui.Self';
import { Wrangle } from './Wrangle.mjs';
import { Video } from './ui.Video';

const View: React.FC<t.ConnectInputProps> = (props) => {
  const { self, spinning: isSpinning = DEFAULTS.spinning, fields = DEFAULTS.fields } = props;

  if (!self) return null;
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
      height,
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
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
          canConnect={canConnect}
          isConnected={isConnected}
          isSpinning={isSpinning}
          onRemotePeerChanged={props.onRemotePeerChanged}
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
          onLocalPeerCopied={props.onLocalPeerCopied}
          style={dividerStyle}
        />
      );
    }

    return null;
  });

  if (elFields.length === 0) return null;
  const elVideo = fields.includes('Video:Self') && <Video size={height} />;

  return (
    <div {...css(styles.base, props.style)}>
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
export const ConnectInput = FC.decorate<t.ConnectInputProps, Fields>(
  View,
  { DEFAULTS, FIELDS },
  { displayName: 'ConnectInput' },
);
