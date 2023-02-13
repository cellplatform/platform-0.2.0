import { Button, t, TextSyntax, Util } from './common';

export type PeerIdProps = {
  peer: t.PeerId | t.PeerUri;
  style?: t.CssValue;
  abbreviate?: boolean | number;
  fontSize?: number;
  onCopy?: (peer: t.PeerUri) => void;
};

export const PeerId: React.FC<PeerIdProps> = (props) => {
  const { fontSize = 13 } = props;
  const uri = Wrangle.uri(props);

  /**
   * [Handlers]
   */
  const copyPeer = () => {
    const text = Util.asUri(props.peer);
    navigator.clipboard.writeText(text);
    props.onCopy?.(text);
  };

  /**
   * [Render]
   */
  return (
    <Button onClick={copyPeer} style={props.style}>
      <TextSyntax text={uri} monospace={true} fontWeight={'bold'} fontSize={fontSize} />
    </Button>
  );
};

const Wrangle = {
  uri(props: PeerIdProps) {
    const { abbreviate } = props;
    const id = Util.asId(props.peer);

    if (!abbreviate && typeof abbreviate !== 'number') return Util.asUri(id);

    const length = abbreviate === true ? 5 : abbreviate;

    const prefix = id.slice(0, length);
    const suffix = id.slice(-length);

    return Util.asUri(`${prefix}..${suffix}`);
  },
};
