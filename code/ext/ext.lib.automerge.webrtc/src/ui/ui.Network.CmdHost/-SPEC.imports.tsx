import { Peer, PeerUI, type t } from './common';

/**
 * Imports generator
 */
export function createImports(ctx: { peer: t.PeerModel; specs?: t.SpecImports }) {
  const specs = Object.entries(ctx.specs || {}).reduce((acc, [key, value]) => {
    (acc as any)[`dev:${key}`] = value;
    return acc;
  }, {});

  const imports = {
    async 'media.video'() {
      const conns = ctx.peer.current.connections;
      const media = conns.filter((d) => Peer.Is.Kind.video(d));
      const stream = media[0]?.stream?.remote;
      return stream ? <PeerUI.Video stream={stream} muted={true} /> : null;
    },
    ...specs,
  } as t.ModuleImports;

  return imports;
}
