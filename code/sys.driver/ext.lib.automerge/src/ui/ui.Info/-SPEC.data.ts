import { DEFAULTS, type t } from './common';

export type SpecDataFlags = {
  historyDesc?: boolean;
  historyDetail?: t.HashString;
  docLens?: boolean;
  docArray?: boolean;
  docToggleClickHandler?: boolean;
};

type Args = {
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
      docToggleClickHandler: true,
    };
    return { flags } as const;
  },

  /**
   * Data as {Object}
   */
  asObject(repo: t.InfoRepoName, args: Args): t.InfoData {
    return {
      repo,
      document: SpecData.document(repo, args),
    };
  },

  /**
   * Document property.
   */
  document(repo: t.InfoRepoName, args: Args) {
    const { doc } = args;
    const flags = args.flags ?? SpecData.defaults.flags;

    const document: t.InfoDoc = {
      repo,
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
