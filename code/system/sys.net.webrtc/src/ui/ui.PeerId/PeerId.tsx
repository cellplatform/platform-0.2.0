import { Button, t, TextSyntax, WebRTC } from '../common';

export type PeerIdProps = {
  peer: t.PeerId | t.PeerUri;
  style?: t.CssValue;
  abbreviate?: boolean | number | [number, number];
  fontSize?: number;
  onClick?: React.MouseEventHandler;
};

export const PeerId: React.FC<PeerIdProps> = (props) => {
  const { fontSize = 13 } = props;
  const uri = Wrangle.uri(props);

  /**
   * [Render]
   */
  return (
    <Button onClick={props.onClick} style={props.style}>
      <TextSyntax text={uri} monospace={true} fontWeight={'bold'} fontSize={fontSize} />
    </Button>
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  uri(props: PeerIdProps) {
    const { abbreviate } = props;
    const id = WebRTC.Util.asId(props.peer);

    if (!abbreviate && typeof abbreviate !== 'number' && !Array.isArray(abbreviate)) {
      return WebRTC.Util.asUri(id);
    }

    if (Array.isArray(abbreviate)) {
      const prefix = id.slice(0, abbreviate[0]);
      const suffix = id.slice(0 - abbreviate[1]);
      return WebRTC.Util.asUri(`${prefix}..${suffix}`);
    }

    const length = abbreviate === true ? 5 : abbreviate;
    const suffix = id.slice(-length);
    return WebRTC.Util.asUri(suffix);
  },
};
