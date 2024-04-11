import { TestEdge, type t } from '../../test.ui';

/**
 * Initialize CRDT sample state.
 */
export async function initSampleCrdt() {
  const left = await TestEdge.createEdge('Left');
  const right = await TestEdge.createEdge('Right');

  /**
   * Monitor events
   */
  const monitorPeer = (
    dev: t.DevTools,
    edge: t.NetworkConnectionEdge,
    onLens?: (e: { shared: t.NetworkStoreShared; lens: t.Lens }) => void,
  ) => {
    const deriveLens = async () => {
      if (!onLens) return;
      const shared = await edge.network.shared();
      const lens = shared.namespace.lens('foo', { text: '' });
      onLens({ shared, lens });
      dev.redraw('subject');
    };

    const handleConnection = async () => {
      await deriveLens();
      dev.redraw('debug');
    };

    edge.network.peer.events().cmd.conn$.subscribe(handleConnection);
  };

  const peersSection = (dev: t.DevTools) => {
    return TestEdge.peersSection(dev, left.network, right.network);
  };

  /**
   * API
   */
  return {
    left,
    right,
    monitorPeer,
    peersSection,
  } as const;
}
