export const DEFAULTS = {
  sync: { filename: 'crdt.syncstate' },
  doc: {
    filename: 'crdt.data',
    logdir: 'log.changes',
    autosaveDebounce: 300,
  },
} as const;
