import { Doc, Hash, ObjectView, css, type t } from './common';

/**
 * Shared network state (transient document).
 */
export function shared(data: t.InfoData, fields: t.InfoField[]): t.PropListItem[] {
  const network = data.network;
  if (!network) return [];

  const res: t.PropListItem[] = [];
  const docid = Doc.Uri.id(network.shared.doc?.uri);
  const doc = Hash.shorten(docid, [4, 4]);

  res.push({
    label: 'Shared State',
    value: {
      data: doc ? `crdt:${doc}` : '(not connected)',
      opacity: doc ? 1 : 0.3,
    },
  });

  if (fields.includes('Network.Shared.Json')) {
    const obj = wrangle.jsonObject(data);
    if (obj) res.push({ value: obj });
  }

  return res;
}

/**
 * Helpers
 */
const wrangle = {
  jsonObject(data: t.InfoData) {
    const network = data.network;
    if (!network) return;

    const formatUri = (uri: string) => Doc.Uri.automerge(uri, { shorten: 4 });
    const obj = network.shared.doc?.toObject();
    if (!obj?.docs) return undefined;

    const docs = { ...obj?.docs };
    Object.keys(docs).forEach((uri) => {
      const value = docs[uri];
      docs[formatUri(uri)] = value;
      delete docs[uri];
    });

    return (
      <div {...css({ flex: 1 })}>
        <ObjectView
          name={'Shared'}
          data={{ ...obj, docs }}
          fontSize={11}
          style={{ marginLeft: 10, marginTop: 3, marginBottom: 4 }}
          expand={{
            level: wrangle.expandLevel(data),
            paths: wrangle.expandPaths(data),
          }}
        />
      </div>
    );
  },

  expandPaths(data: t.InfoData) {
    const res = data.shared?.json?.expand?.paths;
    return Array.isArray(res) ? res : ['$'];
  },

  expandLevel(data: t.InfoData) {
    const res = data.shared?.json?.expand?.level;
    return typeof res === 'number' ? Math.max(0, res) : 1;
  },
} as const;
