import {
  AutomergeInfo,
  Button,
  COLORS,
  Color,
  DEFAULTS,
  Doc,
  Hash,
  Icons,
  ObjectPath,
  ObjectView,
  css,
  type t,
} from './common';

/**
 * Shared network state (transient document).
 */
export function shared(
  data: t.InfoData,
  fields: t.InfoField[],
  sharedDoc?: t.DocRef<t.CrdtShared>,
  theme?: t.CommonTheme,
): t.PropListItem[] {
  const network = data.network;
  if (!network || !data.shared) return [];

  const res: t.PropListItem[] = [];
  const docid = Doc.Uri.id(sharedDoc?.uri);
  const doc = Hash.shorten(docid, [4, 4]);
  const shared = Array.isArray(data.shared) ? data.shared : [data.shared];

  shared.forEach((shared) => {
    const showObject = fields.includes('Network.Shared.Json');
    const obj = showObject ? wrangle.jsonObject(shared, sharedDoc, theme) : undefined;
    res.push({
      divider: !obj,
      label: shared.label ?? 'Shared State',
      value: {
        data: wrangle.displayValue(shared, sharedDoc?.uri, theme, showObject),
        opacity: doc ? 1 : 0.3,
      },
    });
    if (obj) res.push({ value: obj });
  });

  return res;
}

/**
 * Helpers
 */
const wrangle = {
  displayValue(
    shared: t.InfoDataShared,
    uri?: string,
    theme?: t.CommonTheme,
    showObject?: boolean,
  ) {
    if (!uri) return '(not connected)';
    const docid = Doc.Uri.id(uri);
    const parts: JSX.Element[] = [];

    const { shorten, prefix, clipboard } = shared.uri ?? DEFAULTS.doc.uri;
    parts.push(
      <AutomergeInfo.UriButton
        theme={theme}
        uri={uri}
        shorten={shorten}
        prefix={prefix}
        clipboard={clipboard}
      />,
    );

    const color = showObject ? COLORS.BLUE : Color.theme(theme).fg;
    const elIcon = <Icons.Object size={14} color={color} />;
    const onIconClick = shared?.onIconClick;
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

  jsonObject(shared: t.InfoDataShared, sharedDoc?: t.DocRef<t.CrdtShared>, theme?: t.CommonTheme) {
    if (shared.object?.visible === false) return;

    const formatUri = (uri: string) => Doc.Uri.automerge(uri, { shorten: 4 });
    const obj = sharedDoc?.toObject();
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
    const lens = shared.lens;
    if (lens) output = ObjectPath.resolve(output, lens);

    const mutate = shared.object?.beforeRender;
    if (typeof mutate === 'function') mutate(output);

    const dotMeta = shared.object?.dotMeta ?? true;
    if (!dotMeta && output) delete output['.meta'];

    let name = shared.name ?? '';
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
              level: wrangle.expandLevel(shared),
              paths: wrangle.expandPaths(shared),
            }}
          />
        </div>
      </div>
    );
  },

  expandPaths(shared?: t.InfoDataShared) {
    const res = shared?.object?.expand?.paths;
    return Array.isArray(res) ? res : ['$'];
  },

  expandLevel(shared?: t.InfoDataShared) {
    const res = shared?.object?.expand?.level;
    return typeof res === 'number' ? Math.max(0, res) : 1;
  },
} as const;
