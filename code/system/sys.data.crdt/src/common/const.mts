export const DEFAULTS = {
  sync: { filename: '.tmp.syncstate' },
  doc: {
    filename: 'crdt.data',
    logdir: 'log.localchange',
    autosaveDebounce: 300,
  },
} as const;
