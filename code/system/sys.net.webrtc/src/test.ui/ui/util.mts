import { Button, t, TextSyntax, WebRTC, FC } from './common';

export const copyPeer = (peer: t.PeerId | t.PeerUri) => {
  const text = WebRTC.Util.asUri(peer);
  navigator.clipboard.writeText(text);
  return text;
};
