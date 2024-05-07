import { Peer, PeerUI, type t, Color } from './common';
import { Dev } from '../../test.ui';

/**
 * Imports generator
 */
export function createImports(ctx: { peer: t.PeerModel; specs?: t.SpecImports }) {
  /**
   * DevHarness specs.
   */
  const specs = Object.entries(ctx.specs || {}).reduce((acc, [key, fn]) => {
    (acc as any)[`dev:${key}`] = async () => {
      const style = { backgroundColor: Color.WHITE };
      return <Dev.Harness spec={fn} style={style} />;
    };
    return acc;
  }, {});

  /**
   * Local media player modules.
   */
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
