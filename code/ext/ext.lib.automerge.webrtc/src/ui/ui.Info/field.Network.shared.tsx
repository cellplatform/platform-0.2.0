import { Button, Doc, Hash, Icons, ObjectPath, ObjectView, css, type t } from './common';

/**
 * Shared network state (transient document).
 */
export function shared(
  data: t.InfoData,
  fields: t.InfoField[],
  shared?: t.DocRef<t.CrdtShared>,
  theme?: t.CommonTheme,
): t.PropListItem[] {
  const network = data.network;
  if (!network) return [];

  const res: t.PropListItem[] = [];
  const docid = Doc.Uri.id(shared?.uri);
  const doc = Hash.shorten(docid, [4, 4]);

  res.push({
    label: 'Shared State',
    value: {
      data: wrangle.displayValue(data, shared?.uri, theme),
      opacity: doc ? 1 : 0.3,
    },
  });

  if (fields.includes('Network.Shared.Json')) {
    const obj = wrangle.jsonObject(data, shared, theme);
    if (obj) res.push({ value: obj });
  }

  return res;
}

/**
 * Helpers
 */
const wrangle = {
  displayValue(data: t.InfoData, uri?: string, theme?: t.CommonTheme) {
    if (!uri) return '(not connected)';
    const docid = Doc.Uri.id(uri);
    const doc = Hash.shorten(docid, [4, 4]);

    const parts: JSX.Element[] = [];

    const text = `crdt:${doc}`;
    parts.push(<>{text}</>);

    const elIcon = <Icons.Object size={14} />;
    const onIconClick = data.shared?.onIconClick;
    if (!onIconClick) parts.push(elIcon);
    else
      parts.push(
        <Button theme={theme} onClick={(e) => onIconClick({})}>
          {elIcon}
        </Button>,
      );

    const styles = {
      base: css({
        display: 'grid',
        alignContent: 'center',
        gridTemplateColumns: `repeat(2, auto)`,
        columnGap: '5px',
      }),
    };

    return (
      <div {...styles.base}>
        {parts.map((el, i) => {
          return <div key={i}>{el}</div>;
        })}
      </div>
    );
  },

  jsonObject(data: t.InfoData, shared?: t.DocRef<t.CrdtShared>, theme?: t.CommonTheme) {
    const network = data.network;
    if (!network) return;
    if (data.shared?.object?.visible === false) return;

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

    let output: any = { ...obj, sys: { ...obj.sys, docs } };
    const lens = data.shared?.lens;
    if (lens) output = ObjectPath.resolve(output, lens);

    const formatBeforeRender = data.shared?.object?.beforeRender;
    if (formatBeforeRender) formatBeforeRender(output);

    const dotMeta = data.shared?.object?.dotMeta ?? true;
    if (!dotMeta) delete output['.meta'];

    let name = data.shared?.name ?? '';
    if (!name && lens) name = lens.join('.');
    name = name || 'Shared';

    return (
      <div {...styles.base}>
        <div {...styles.inner}>
          <ObjectView
            name={name}
            data={output}
            fontSize={11}
            theme={theme}
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
    const res = data.shared?.object?.expand?.paths;
    return Array.isArray(res) ? res : ['$'];
  },

  expandLevel(data: t.InfoData) {
    const res = data.shared?.object?.expand?.level;
    return typeof res === 'number' ? Math.max(0, res) : 1;
  },
} as const;
