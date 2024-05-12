import { Doc } from '../../crdt';
import { Button, COLORS, Hash, Icons, Is, ObjectView, css, type t } from './common';

type D = t.InfoDataDocument;

export function doc(data: D | undefined, fields: t.InfoField[], theme?: t.CommonTheme) {
  const res: t.PropListItem[] = [];
  if (!data) return res;
  if (!Is.docRef(data.doc)) return res;

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

    if (doc) {
      // NB: "blue" when showing current-state <Object>.
      const color = fields.includes('Doc.Object') ? COLORS.BLUE : undefined;
      const elIcon = <Icons.Object size={14} color={color} />;

      if (!data.icon?.onClick) parts.push(elIcon);
      else {
        parts.push(
          <Button theme={theme} onClick={() => data.icon?.onClick?.({})}>
            {elIcon}
          </Button>,
        );
      }
    } else {
      parts.push(<>{'-'}</>);
    }

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

    const divider = !fields.includes('Doc.Object');
    res.push({ label, value, divider });
  }

  /**
   * The <Object> component.
   */
  if (fields.includes('Doc.Object')) {
    const elObject = wrangle.objectElement(data, hasLabel, theme);
    res.push({ value: elObject });
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

  objectElement(data: D, hasLabel: boolean, theme?: t.CommonTheme) {
    const styles = {
      base: css({ flex: 1, display: 'grid' }),
      inner: css({ overflowX: 'hidden', maxWidth: '100%' }),
    };

    const current = Is.docRef(data.doc) ? data.doc.current : undefined;

    return (
      <div {...styles.base}>
        <div {...styles.inner}>
          <ObjectView
            name={data?.object?.name}
            data={current}
            fontSize={11}
            theme={theme}
            style={{ marginLeft: 10, marginTop: hasLabel ? 3 : 5, marginBottom: 4 }}
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
