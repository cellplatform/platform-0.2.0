import { DEFAULTS, type t } from './common';

type Repo = { name: t.InfoRepoName; store: t.Store; index: t.StoreIndex };

export type SpecDataFlags = {
  uris?: boolean;
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
      uris: true,
      docLens: false,
      docArray: false,
      docIconClickHandler: true,
    };
    return { flags } as const;
  },

  /**
   * Data as {Object}
   */
  asObject(args: Args) {
    const { repo, doc } = args;

    const data: t.InfoData = {
      repo: repo.name,
      document: SpecData.document(args),
      visible: {
        onToggle(e) {
          console.info('⚡️ Info.visible.onToggle', e);
        },
      },
    };

    return data;
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
      ref: flags.uris ? doc?.uri : doc,
      object: {
        // name: 'foobar',
        // visible: false,
        lens: flags.docLens ? ['child'] : undefined,
        expand: { level: 2 },
        beforeRender(mutate: any) {
          // mutate['foo'] = 123;
        },
        onToggleClick: flags.docIconClickHandler
          ? (e) => console.info('⚡️ Info.document.object.onToggleClick', e)
          : undefined,
      },
      uri: {
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
          onClick(e) {
            console.info('⚡️ Info.history.item.onClick', e);
            // State.debug.change((d) => {
            //   const detail = d.dataHistoryDetail === e.hash ? undefined : e.hash;
            //   d.dataHistoryDetail = detail;
            // });
          },
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
