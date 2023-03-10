import { Button, copyPeer, css, FC, t, TextSyntax, WebRTC } from '../common';

export type PeerIdProps = {
  peer: t.PeerId | t.PeerUri;
  style?: t.CssValue;
  abbreviate?: boolean | number | [number, number];
  prefix?: string;
  fontSize?: number;
  copyOnClick?: boolean;
  onClick?: (e: { id: t.PeerId; uri: t.PeerUri; copied: boolean }) => void;
};

const DEFAULTS = {
  fontSize: 13,
};

const View: React.FC<PeerIdProps> = (props) => {
  const { fontSize = DEFAULTS.fontSize, copyOnClick = false } = props;
  // const uri = Wrangle.uri(props);
  const id = Wrangle.id(props);

  /**
   * Handlers
   */
  const handleClick = () => {
    const id = WebRTC.Util.asId(props.peer);
    const uri = WebRTC.Util.asUri(id);
    if (copyOnClick) copyPeer(id);
    props.onClick?.({ id, uri, copied: copyOnClick });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ fontSize }),
  };

  const elText = (
    <TextSyntax
      text={Wrangle.peerText(props)}
      monospace={true}
      fontWeight={'bold'}
      fontSize={fontSize}
    />
  );

  if (props.copyOnClick || props.onClick) {
    return (
      <Button onClick={handleClick} style={css(styles.base, props.style)}>
        {elText}
      </Button>
    );
  }

  // NB: Not a "pressable" button - return just the simple colored-highlighted text.
  return elText;
};

/**
 * Export
 */

type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const PeerId = FC.decorate<PeerIdProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'PeerId' },
);

/**
 * [Helpers]
 */
const Wrangle = {
  uri(props: PeerIdProps) {
    return WebRTC.Util.asUri(props.peer);
  },

  id(props: PeerIdProps) {
    const { abbreviate } = props;
    const id = WebRTC.Util.asId(props.peer);

    if (!abbreviate && typeof abbreviate !== 'number' && !Array.isArray(abbreviate)) {
      return id;
    }

    if (Array.isArray(abbreviate)) {
      const prefix = id.slice(0, abbreviate[0]);
      const suffix = id.slice(0 - abbreviate[1]);
      return `${prefix}..${suffix}`;
    }

    const length = abbreviate === true ? 5 : abbreviate;
    const suffix = id.slice(-length);
    return suffix;
  },

  peerText(props: PeerIdProps) {
    //
    const id = Wrangle.id(props);

    const prefix = (props.prefix ?? '').trim();

    return prefix ? `${prefix.replace(/\:$/, '')}:${id}` : WebRTC.Util.asUri(id);
  },
};
