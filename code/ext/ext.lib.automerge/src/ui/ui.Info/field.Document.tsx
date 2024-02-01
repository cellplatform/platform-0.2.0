import { Doc, Hash, ObjectView, css, type t } from './common';

type D = t.InfoData['document'];

export function doc(data: D, fields: t.InfoField[]) {
  if (!data) return;
  const res: t.PropListItem[] = [];
  const label = data.label ?? 'Document';
  const hasLabel = !!label.trim();

  /**
   * Title
   */
  if (hasLabel) {
    const doc = data.doc;
    const uri = fields.includes('Doc.URI') ? doc?.uri : undefined;

    let value: string | undefined;
    if (uri) {
      const id = Doc.Uri.id(uri);
      value = uri ? `crdt:automerge:${Hash.shorten(id, [4, 4])}` : undefined;
    }

    res.push({
      label,
      value,
      divider: false,
    });
  }

  /**
   * The <Object? view component.
   */
  res.push({
    value: wrangle.objectElement(data, hasLabel),
  });

  // Finish up.
  return res;
}

/**
 * Helpers
 */
const wrangle = {
  expandPaths(data: D) {
    const res = data?.object?.expand?.paths;
    return Array.isArray(res) ? res : ['$'];
  },

  expandLevel(data: D) {
    const res = data?.object?.expand?.level;
    return typeof res === 'number' ? Math.max(0, res) : 1;
  },

  objectElement(data: D, hasLabel: boolean) {
    const styles = {
      base: css({ flex: 1, display: 'grid' }),
      inner: css({ overflowX: 'hidden', maxWidth: '100%' }),
    };
    return (
      <div {...styles.base}>
        <div {...styles.inner}>
          <ObjectView
            name={data?.object?.name}
            data={data?.doc?.current}
            fontSize={11}
            style={{ marginLeft: 10, marginTop: hasLabel ? 2 : 5, marginBottom: 4 }}
            expand={{
              level: wrangle.expandLevel(data),
              paths: wrangle.expandPaths(data),
            }}
          />
        </div>
      </div>
    );
  },
} as const;
