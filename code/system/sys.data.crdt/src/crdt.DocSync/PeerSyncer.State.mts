import { rx, Automerge, DEFAULTS, type t } from './common';

type SyncState = Automerge.SyncState;
const { initSyncState, decodeSyncState, encodeSyncState } = Automerge;

export function SyncState(args: { filedir?: t.Fs; dispose$?: t.Observable<any> }) {
  let _disposed = false;
  const { dispose$, dispose } = rx.disposable(args.dispose$);
  dispose$.subscribe(() => (_disposed = true));

  const { filedir } = args;
  const filename = DEFAULTS.sync.filename;
  let _current: SyncState | undefined;

  const api = {
    async get() {
      if (!_current && !api.disposed) api.set(await api.init());
      return _current as SyncState;
    },

    set(value: SyncState) {
      _current = value;
    },

    async init() {
      if (api.disposed) throw new Error('PeerSyncer.State is disposed');
      if (!filedir) return initSyncState();
      if (!(await filedir.exists(filename))) return initSyncState();
      const data = await filedir.read(filename);
      return data ? decodeSyncState(data) : initSyncState();
    },

    async save() {
      if (!filedir || api.disposed) return false;
      const data = encodeSyncState(await api.get());
      await filedir.write(filename, data);
      return true;
    },

    /**
     * Lifecycle
     */
    dispose$,
    dispose,
    get disposed() {
      return _disposed;
    },
  } as const;

  return api;
}
