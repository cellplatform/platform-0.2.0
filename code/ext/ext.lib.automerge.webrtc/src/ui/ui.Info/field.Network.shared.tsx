import { Doc, Hash, ObjectView, css, type t } from './common';

/**
 * Shared network state (transient document).
 */
export function shared(
  data: t.InfoData,
  fields: t.InfoField[],
  shared?: t.DocRef<t.CrdtShared>,
): t.PropListItem[] {
  const network = data.network;
  if (!network) return [];

  const res: t.PropListItem[] = [];
  const docid = Doc.Uri.id(shared?.uri);
  const doc = Hash.shorten(docid, [4, 4]);

  res.push({
    label: 'Shared State',
    value: {
      data: doc ? `crdt:${doc}` : '(not connected)',
      opacity: doc ? 1 : 0.3,
    },
  });

  if (fields.includes('Network.Shared.Json')) {
    const obj = wrangle.jsonObject(data, shared);
    if (obj) res.push({ value: obj });
  }

  return res;
}

/**
 * Helpers
 */
const wrangle = {
  jsonObject(data: t.InfoData, shared?: t.DocRef<t.CrdtShared>) {
    const network = data.network;
    if (!network) return;

    const formatUri = (uri: string) => Doc.Uri.automerge(uri, { shorten: 4 });
    const obj = shared?.toObject();
    if (!obj?.sys.docs) return undefined;

    const docs = { ...obj?.sys.docs };
    Object.keys(docs).forEach((uri) => {
      const value = docs[uri];
      docs[formatUri(uri)] = value;
      delete docs[uri];
    });

    const styles = {
      base: css({ flex: 1, display: 'grid' }),
      inner: css({ overflowX: 'hidden', maxWidth: '100%' }),
    };

    return (
      <div {...styles.base}>
        <div {...styles.inner}>
          <ObjectView
            name={'Shared'}
            data={{ ...obj, sys: { ...obj.sys, docs } }}
            fontSize={11}
            style={{ marginLeft: 10, marginTop: 3, marginBottom: 4 }}
            expand={{
              level: wrangle.expandLevel(data),
              paths: wrangle.expandPaths(data),
            }}
          />
        </div>
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
