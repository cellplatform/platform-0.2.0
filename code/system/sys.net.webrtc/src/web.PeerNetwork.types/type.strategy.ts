import { t } from './common';

/**
 * Single combined set of network strategies.
 */
export type PeerStrategy = t.Disposable & {
  connection: t.PeerConnectionStrategy;
};

/**
 * Strategies for connecting and disconnecting peers.
 */
export type PeerConnectionStrategy = t.Disposable & {
  /**
   * Auto purge connections when closed.
   */
  autoPurgeOnClose: boolean;

  /**
   * Ensure connections are closed on all peers within the mesh.
   */
  ensureClosed: boolean;
};

/**
 * Strategies for working with a group of peers ("mesh").
 */
export type GroupStrategy = t.Disposable & {
  /**
   * Retrieve details about the network of peers/connections.
   */
  connections: boolean;
};
