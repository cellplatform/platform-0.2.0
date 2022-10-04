/**
 * The global context of a web-worker.
 * Example (within worker):
 *
 *    const ctx: WorkerGlobal = self as any;
 *
 */
export type WorkerGlobal = Worker & {
  name: string;
  crypto: Crypto;
  caches: CacheStorage;
  location: Location;
};

/**
 * Minimal API of a WebWorker instance exposing only the messaging functions.
 */
export type WorkerInstance = {
  onmessage: Worker['onmessage'];
  postMessage: Worker['postMessage'];
};

/**
 * Minimal API of the self/global context
 * (as seen from within side the Worker implmentation).
 *
 * NB: This "is a" subset of the [WorkerGlobal].
 */
export type WorkerSelf = {
  name: string;
  addEventListener: Worker['addEventListener'];
  postMessage: Worker['postMessage'];
};
