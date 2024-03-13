import { Button, Doc, Hash, Icons, ObjectView, Value, css, toObject, type t } from './common';

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
    const parts: JSX.Element[] = [];

    if (uri) {
      const id = Doc.Uri.id(uri);
      const length = data.uri?.shorten ?? [4, 4];
      const shortened = Hash.shorten(id, length);
      const text = uri ? `crdt:automerge:${shortened}` : undefined;
      parts.push(<>{text}</>);
    }

    const elIcon = <Icons.Object size={14} />;
    if (!data.onIconClick) parts.push(elIcon);
    else parts.push(<Button onClick={(e) => data.onIconClick?.({})}>{elIcon}</Button>);

    const styles = {
      base: css({
        display: 'grid',
        alignContent: 'center',
        gridTemplateColumns: `repeat(${parts.length}, auto)`,
        columnGap: '5px',
      }),
    };

    const value = (
      <div {...styles.base}>
        {parts.map((el, index) => {
          return <div key={index}>{el}</div>;
        })}
      </div>
    );

    res.push({ label, value, divider: false });
  }

  /**
   * The <Object> component.
   */
  if (fields.includes('Doc.Object')) {
    res.push({ value: wrangle.objectElement(data, hasLabel) });
  }

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
            data={wrangle.safeObject(data?.doc?.current)}
            fontSize={11}
            style={{ marginLeft: 8, marginTop: hasLabel ? 2 : 5, marginBottom: 4 }}
            expand={{
              level: wrangle.expandLevel(data),
              paths: wrangle.expandPaths(data),
            }}
          />
        </div>
      </div>
    );
  },

  safeObject(input: unknown) {
    if (!input) return input;
    const obj = toObject(input);
    Value.Object.walk(obj, (e) => {
      if (!(e.value instanceof Uint8Array)) return;
      (e.parent as any)[e.key] = `<Uint8Array>[${e.value.byteLength}]`;
    });
    return obj;
  },
} as const;
