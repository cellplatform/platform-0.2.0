import { Button, COLORS, Icons, Is, ObjectPath, ObjectView, css, type t } from './common';
import { head } from './field.Doc.Head';
import { history } from './field.Doc.History';
import { UriButton } from './ui.Button.Uri';

type D = t.InfoDataDoc;

export function document(data: D | D[] | undefined, fields: t.InfoField[], theme?: t.CommonTheme) {
  if (!data) return [];
  const docs = Array.isArray(data) ? data : [data];
  return docs.map((data) => render(data, fields, theme)).flat();
}

function render(data: D | undefined, fields: t.InfoField[], theme?: t.CommonTheme) {
  const res: t.PropListItem[] = [];
  if (!data) return res;
  if (!Is.docRef(data.ref)) return res;

  const label = data.label ?? 'Document';
  const hasLabel = !!label.trim();

  /**
   * Title
   */
  if (hasLabel) {
    const doc = data.ref;
    const uri = fields.includes('Doc.URI') ? doc?.uri : undefined;
    const parts: JSX.Element[] = [];

    if (uri) {
      const { shorten, prefix, clipboard } = data.uri ?? {};
      parts.push(
        <UriButton
          theme={theme}
          uri={uri}
          shorten={shorten}
          prefix={prefix}
          clipboard={clipboard}
        />,
      );
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

  /**
   * The <Head> component.
   */
  if (fields.includes('Doc.Head')) res.push(...head(data, fields, theme));

  /**
   * The <History> component.
   */
  if (fields.includes('Doc.History')) res.push(...history(data, fields, theme));

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

    let output = Is.docRef(data.ref) ? data.ref.current : undefined;
    const lens = data.object?.lens;
    if (lens) output = ObjectPath.resolve(output, lens);

    const mutate = data.object?.beforeRender;
    if (typeof mutate === 'function') {
      output = { ...output };
      mutate(output);
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
