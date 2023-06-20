export const DEFAULTS = {
  sync: {
    filename: '.syncstate',
    debounce: 300,
  },
  doc: {
    filename: 'crdt.data',
    logdir: 'local.log',
    autosaveDebounce: 300,
  },
  query: { dev: 'dev' },
} as const;
