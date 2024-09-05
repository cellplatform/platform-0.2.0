import { Doc, DocUri, Icons, ObjectPath, ObjectView, css, toObject, type t } from './common';
import { history } from './field.Doc.History';
import { repo } from './field.Repo';

type O = Record<string, unknown>;
type D = t.InfoDoc;

/**
 * Field for a document {item}.
 */
export function document(
  ctx: t.InfoCtx,
  docs: t.UseDocs,
  data: D | D[] | undefined,
): t.PropListItem[] {
  const res: t.PropListItem[] = [];
  const { fields } = ctx;
  if (!data) return res;

  let _lastRepo = '';
  const renderRepo = (data: D) => {
    const name = data.repo;
    if (!fields.includes('Doc.Repo')) return;
    if (!name || name === _lastRepo) return;

    const item = repo(ctx, data.repo);
    if (item) {
      res.push(item);
      _lastRepo = name;
    }
  };

  const list = (Array.isArray(data) ? data : [data]).filter(Boolean);
  list.forEach((data, i) => {
    const doc = docs.refs.find((doc) => doc.uri == data.uri);
    if (doc) {
      renderRepo(data);
      res.push(...renderDocument(ctx, data, doc, i));
    }
  });

  return res;
}

/**
 * Render the document {item}.
 */
function renderDocument(ctx: t.InfoCtx, data: D, doc: t.Doc, index: t.Index): t.PropListItem[] {
  const { fields, theme, enabled } = ctx;
  const res: t.PropListItem[] = [];

  const hasObject = fields.includes('Doc.Object');
  const isObjectVisible = hasObject && (data.object?.visible ?? true);
  const hasToggleHandler = !!ctx.handlers.onDocToggleClick;

  const label: t.PropListLabel = {
    body: (data.label ?? 'Document').trim(),
    toggle: hasToggleHandler ? { open: isObjectVisible } : undefined,
    onClick(e) {
      const modifiers = e.modifiers;
      const prev = isObjectVisible;
      const visible = { prev, next: !prev };
      ctx.handlers.onDocToggleClick?.({ index, data, modifiers, visible });
    },
  };
  const hasLabel = !!label.body;

  /**
   * Title Row
   */
  if (hasLabel) {
    const uri = fields.includes('Doc.URI') ? doc?.uri : undefined;
    const parts: JSX.Element[] = [];

    if (uri) {
      const { shorten, prefix, head, clipboard } = data.address ?? {};
      parts.push(
        <DocUri
          doc={doc.uri}
          prefix={prefix}
          shorten={shorten}
          head={head}
          heads={doc}
          clipboard={clipboard}
          enabled={enabled}
          theme={theme}
        />,
      );
    }

    if (doc) {
      const isLens = !!data.object?.lens || Doc.Is.lens(doc);
      const Icon = isLens ? Icons.Object : Icons.Repo;
      parts.push(<Icon size={14} />);
    } else {
      parts.push(<>{'-'}</>);
    }

    const styles = {
      base: css({
        display: 'grid',
        gridTemplateColumns: `repeat(${parts.length}, auto)`,
        columnGap: '5px',
      }),
      part: css({
        display: 'grid',
        alignContent: 'center',
      }),
    };

    const elParts = parts.map((el, i) => (
      <div key={i} {...styles.part}>
        {el}
      </div>
    ));
    const value = <div {...styles.base}>{elParts}</div>;

    res.push({
      label,
      value,
      divider: fields.includes('Doc.Object') ? !isObjectVisible : undefined,
    });
  }

  /**
   * The <Object> component.
   */
  if (isObjectVisible) {
    const value = wrangle.objectElement(ctx, data, doc, index, hasLabel);
    res.push({ value });
  }

  /**
   * The <History> component.
   */
  if (fields.includes('Doc.History')) res.push(...history(ctx, data));

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

  objectElement(ctx: t.InfoCtx, data: D, doc: t.Doc, index: t.Index, hasLabel: boolean) {
    const styles = {
      base: css({ flex: 1, display: 'grid' }),
      inner: css({ overflowX: 'hidden', maxWidth: '100%' }),
    };

    let output: O | undefined = doc.current;
    const lens = data.object?.lens;
    if (lens) output = ObjectPath.resolve(output, lens);

    if (output) {
      output = toObject(output);

      if (typeof ctx.handlers.onBeforeObjectRender === 'function') {
        const res = ctx.handlers.onBeforeObjectRender(output, { index, data });
        if (res !== undefined && res !== null && typeof res === 'object') output = res;
      }

      const dotMeta = data.object?.dotMeta ?? true;
      if (!dotMeta && output) delete output['.meta'];
    }

    let name = data.object?.name ?? '';
    if (!name && lens) name = lens.join('.');
    name = name;

    return (
      <div {...styles.base}>
        <div {...styles.inner}>
          <ObjectView
            name={name || undefined}
            data={output}
            fontSize={11}
            theme={ctx.theme}
            style={{ marginLeft: 16, marginTop: hasLabel ? 3 : 5, marginBottom: 4 }}
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
