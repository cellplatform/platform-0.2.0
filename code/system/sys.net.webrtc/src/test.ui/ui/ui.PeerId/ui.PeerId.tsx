import { Button, FC, t, TextSyntax, WebRTC } from './common';

export type PeerIdProps = {
  peer: t.PeerId | t.PeerUri;
  style?: t.CssValue;
  abbreviate?: boolean | number;
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

const Wrangle = {
  uri(props: PeerIdProps) {
    const { abbreviate } = props;
    const id = WebRTC.Util.asId(props.peer);

    if (!abbreviate && typeof abbreviate !== 'number') return WebRTC.Util.asUri(id);

    const length = abbreviate === true ? 5 : abbreviate;

    const prefix = id.slice(0, length);
    const suffix = id.slice(-length);

    return WebRTC.Util.asUri(`${prefix}..${suffix}`);
  },
};
