import { DEFAULTS, type t } from './common';

type Repo = { name: t.InfoRepoName; store: t.Store; index: t.StoreIndex };

export type SpecDataFlags = {
  historyDesc?: boolean;
  historyDetail?: t.HashString;
  docLens?: boolean;
  docArray?: boolean;
  docIconClickHandler?: boolean;
};

type Args = {
  repo: Repo;
  doc?: t.Doc;
  flags?: SpecDataFlags;
};

/**
 * Common sample {data} for specs.
 */
export const SpecData = {
  /**
   * Default flags.
   */
  get defaults() {
    const flags: SpecDataFlags = {
      historyDesc: DEFAULTS.history.list.sort === 'desc',
      docLens: false,
      docArray: false,
      docIconClickHandler: true,
    };
    return { flags } as const;
  },

  /**
   * Data as {Object}
   */
  asObject(args: Args): t.InfoData {
    const { repo } = args;
    return {
      repo: repo.name,
      document: SpecData.document(args),
    };
  },

  /**
   * Document property.
   */
  document(args: Args) {
    const { doc, repo } = args;
    const flags = args.flags ?? SpecData.defaults.flags;

    const document: t.InfoDoc = {
      repo: repo.name,
      // label: 'Foo',
      uri: doc?.uri,
      object: {
        // name: 'foobar',
        // visible: false,
        lens: flags.docLens ? ['child'] : undefined,
        expand: { level: 2 },
      },
      address: {
        // prefix: 'foo:::',
        // prefix: null,
        head: true,
      },
      history: {
        // label: 'Foo',
        list: {
          sort: flags.historyDesc ? 'desc' : 'asc',
          showDetailFor: flags.historyDetail,
        },
        item: {
          // hashLength: 3,
        },
      },
    };

    return !flags.docArray
      ? document
      : [
          { ...document, label: 'My One' },
          { ...document, label: 'My Two' },
        ];
  },
} as const;
