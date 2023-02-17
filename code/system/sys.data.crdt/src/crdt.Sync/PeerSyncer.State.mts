import { Automerge, t } from './common';

type SyncState = Automerge.SyncState;

const { initSyncState, decodeSyncState, encodeSyncState } = Automerge;
const filename = '.syncstate';

export function SyncState(args: { dir?: t.Fs }) {
  const { dir } = args;
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
      if (!dir) return initSyncState();
      if (!(await dir.exists(filename))) return initSyncState();
      const data = await dir.read(filename);
      return data ? decodeSyncState(data) : initSyncState();
    },

    async save() {
      if (!dir) return false;
      const data = encodeSyncState(await api.get());
      await dir.write(filename, data);
      return true;
    },
  };

  return api;
}
