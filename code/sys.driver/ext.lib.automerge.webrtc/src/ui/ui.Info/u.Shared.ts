import { CrdtInfo, DEFAULTS, type t } from './common';

/**
 * Helpers for working with the "Shared" CRDT document.
 */
export const Shared = {
  default() {
    const item = (label: string, lens: t.ObjectPath) => {
      return Shared.Mutate.document({}, { defaults: { label, object: { lens } } });
    };
    return [
      //
      item('System', ['sys']),
      item('Namespaces', ['ns']),
    ];
  },

  Mutate: {
    documents(shared: t.InfoData['shared']) {
      const res = CrdtInfo.Data.documents(shared);
      res.forEach((doc) => Shared.Mutate.document(doc));
      return res;
    },

    document(shared: t.InfoDoc, options: { defaults?: t.InfoDoc } = {}) {
      const { defaults } = options;
      shared.repo = DEFAULTS.repo;
      shared.label = shared.label ?? defaults?.label ?? 'Shared State';
      shared.object = { ...defaults?.object, visible: false, dotMeta: false };
      shared.address = { ...defaults?.address, shorten: [4, 4], head: true, clipboard: true };
      return shared;
    },
  },
} as const;
