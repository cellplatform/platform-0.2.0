import { Button, copyPeer, css, FC, t, TextSyntax, WebRtc } from '../common';

export type PeerIdProps = {
  peer?: t.PeerId | t.PeerUri;
  abbreviate?: boolean | number | [number, number];
  prefix?: string;
  fontSize?: number;
  copyOnClick?: boolean;
  style?: t.CssValue;
  onClick?: (e: { id: t.PeerId; uri: t.PeerUri; copied: boolean }) => void;
};

const DEFAULTS = {
  fontSize: 13,
};

const View: React.FC<PeerIdProps> = (props) => {
  const { fontSize = DEFAULTS.fontSize, copyOnClick = false } = props;

  /**
   * Handlers
   */
  const handleClick = () => {
    if (!props.peer) return;
    const id = WebRtc.Util.asId(props.peer);
    const uri = WebRtc.Util.asUri(id);
    if (copyOnClick) copyPeer(id);
    props.onClick?.({ id, uri, copied: copyOnClick });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      fontSize,
      opacity: props.peer ? 1 : 0.3,
      filter: `grayscale(${props.peer ? 0 : 1})`,
      transition: 'all 150ms ease',
    }),
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
    return props.peer ? WebRtc.Util.asUri(props.peer) : '';
  },

  id(props: PeerIdProps) {
    const { abbreviate } = props;
    const id = props.peer ? WebRtc.Util.asId(props.peer) : '';

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
    if (!props.peer) return 'peer:initiating...';
    const id = Wrangle.id(props);
    const prefix = (props.prefix ?? '').trim();
    return prefix ? `${prefix.replace(/\:$/, '')}:${id}` : WebRtc.Util.asUri(id);
  },
};
