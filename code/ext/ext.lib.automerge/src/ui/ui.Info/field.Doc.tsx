import {
  toObject,
  ReactEvent,
  Button,
  COLORS,
  Icons,
  Is,
  ObjectPath,
  ObjectView,
  css,
  type t,
} from './common';
import { head } from './field.Doc.Head';
import { history } from './field.Doc.History';
import { DocUriButton } from './ui.Doc.UriButton';

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
  const isObjectVisible = fields.includes('Doc.Object') && (data.object?.visible ?? true);

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
        <DocUriButton
          theme={theme}
          uri={uri}
          shorten={shorten}
          prefix={prefix}
          clipboard={clipboard}
        />,
      );
    }

    const toggleClick = (modifiers: t.KeyboardModifierFlags) => {
      const uri = doc.uri;
      data.toggle?.onClick?.({ uri, modifiers });
    };

    const pushIcon = () => {
      // NB: "blue" when showing current-state <Object>.
      const hasClickHandler = !!data.toggle?.onClick;
      const color = isObjectVisible && hasClickHandler ? COLORS.BLUE : undefined;
      const height = 14;
      const elIcon = <Icons.Object size={height} color={color} />;

      if (!hasClickHandler) {
        parts.push(elIcon);
      } else {
        parts.push(
          <Button
            theme={theme}
            style={{ height }}
            onClick={(e) => toggleClick(ReactEvent.modifiers(e))}
          >
            {elIcon}
          </Button>,
        );
      }
    };

    if (doc) {
      if (fields.includes('Doc.Object')) pushIcon();
    } else {
      parts.push(<>{'-'}</>);
    }

    const styles = {
      base: css({
        display: 'grid',
        gridTemplateColumns: `repeat(${parts.length}, auto)`,
        columnGap: '5px',
      }),
      part: css({ display: 'grid', alignContent: 'center' }),
    };

    const elParts = parts.map((el, i) => (
      <div key={i} {...styles.part}>
        {el}
      </div>
    ));
    const value = <div {...styles.base}>{elParts}</div>;

    res.push({
      label: { body: label, onClick: (e) => toggleClick(e.modifiers) },
      value,
      divider: fields.includes('Doc.Object') ? !isObjectVisible : undefined,
    });
  }

  /**
   * The <Object> component.
   */
  if (isObjectVisible) {
    const value = wrangle.objectElement(data, hasLabel, theme);
    res.push({ value });
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

    if (output) {
      output = toObject(output);

      const mutate = data.object?.beforeRender;
      if (typeof mutate === 'function') mutate(output);

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
