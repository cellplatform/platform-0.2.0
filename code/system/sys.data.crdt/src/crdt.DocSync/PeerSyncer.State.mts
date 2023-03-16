import { Automerge, DEFAULTS, t } from './common';

type SyncState = Automerge.SyncState;
const { initSyncState, decodeSyncState, encodeSyncState } = Automerge;

export function SyncState(args: { filedir?: t.Fs }) {
  const { filedir } = args;
  const filename = DEFAULTS.sync.filename;
  let _: SyncState | undefined;

  const api = {
    async get() {
      if (!_) api.set(await api.init());
      return _ as SyncState;
    },

    set(value: SyncState) {
      _ = value;
    },

    async init() {
      if (!filedir) return initSyncState();
      if (!(await filedir.exists(filename))) return initSyncState();
      const data = await filedir.read(filename);
      return data ? decodeSyncState(data) : initSyncState();
    },

    async save() {
      if (!filedir) return false;
      const data = encodeSyncState(await api.get());
      await filedir.write(filename, data);
      return true;
    },
  };

  return api;
}
