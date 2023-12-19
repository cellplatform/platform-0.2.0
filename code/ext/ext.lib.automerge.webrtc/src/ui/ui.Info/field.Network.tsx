import { Doc, Hash, ObjectView, css, type t } from './common';

/**
 * Shared network state (transient document).
 */
export function shared(data: t.InfoData, fields: t.InfoField[]): t.PropListItem[] {
  const network = data.network;
  if (!network) return [];

  const res: t.PropListItem[] = [];
  const docid = Doc.Uri.id(network.shared?.uri);
  const doc = Hash.shorten(docid, [4, 4]);

  res.push({
    label: 'Shared State',
    value: {
      data: doc ? `crdt:${doc}` : '(not connected)',
      opacity: doc ? 1 : 0.3,
    },
  });

  if (fields.includes('Network.Shared.Json')) {
    const obj = wrangle.jsonObject(network);
    if (obj) {
      res.push({ value: obj });
    }
  }

  return res;
}

/**
 * Helpers
 */
const wrangle = {
  jsonObject(network: t.WebrtcStore) {
    const formatUri = (uri: string) => Doc.Uri.automerge(uri, { shorten: 4 });
    const data = network.shared?.toObject();
    if (!data?.docs) return undefined;

    const docs = { ...data?.docs };
    Object.keys(docs).forEach((uri) => {
      const value = docs[uri];
      docs[formatUri(uri)] = value;
      delete docs[uri];
    });

    return (
      <div {...css({ flex: 1 })}>
        <ObjectView
          name={'Shared'}
          data={{ ...data, docs }}
          fontSize={11}
          style={{ marginLeft: 12, marginTop: 2 }}
          expand={{ level: 1, paths: ['$', '$.docs'] }}
        />
      </div>
    );

    //
  },
} as const;

/**
 * Export
 */
export const network = { shared } as const;
