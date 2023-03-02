export const DEFAULTS = {
  sync: {
    filename: '.tmp.syncstate',
    debounce: 300,
  },
  doc: {
    filename: 'crdt.data',
    logdir: 'log.localchange',
    autosaveDebounce: 300,
  },
} as const;
