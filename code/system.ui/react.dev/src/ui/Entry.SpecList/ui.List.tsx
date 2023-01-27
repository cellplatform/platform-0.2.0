import { VscSymbolClass } from 'react-icons/vsc';

import { Color, COLORS, css, KEY, t } from './common';
import { ListItem } from './ui.List.Item';

export type ListProps = {
  imports: t.Imports;
  url: URL;
  hrDepth?: number;
  style?: t.CssValue;
};

export const List: React.FC<ListProps> = (props) => {
  const { imports, url } = props;
  const importsKeys = Object.keys(props.imports);
  const hasDevParam = url.searchParams.has(KEY.DEV);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      listStyleType: 'none',
      borderLeft: `solid 1px ${Color.alpha(COLORS.DARK, 0.03)}`,
      padding: 0,
      margin: 0,
    }),
    hrDashed: css({
      border: 'none',
      borderTop: `dashed 1px ${Color.alpha(COLORS.DARK, 0.4)}`,
      marginTop: 30,
      marginBottom: 10,
    }),
  };

  const item = (
    index: number,
    address: string | undefined,
    options: {
      title?: string;
      ns?: boolean;
      Icon?: t.IconType;
    } = {},
  ) => {
    return (
      <ListItem
        key={index}
        index={index}
        url={url}
        imports={imports}
        address={address}
        title={options.title}
        ns={options.ns}
        Icon={options.Icon}
        hrDepth={props.hrDepth}
      />
    );
  };

  return (
    <ul {...css(styles.base, props.style)}>
      {importsKeys.map((key, i) => item(i, key, { Icon: VscSymbolClass, ns: true }))}

      <hr {...styles.hrDashed} />

      {hasDevParam && item(-1, undefined, { title: '?dev - remove param' })}
      {!hasDevParam && item(-1, 'true', { title: '?dev - add param' })}
    </ul>
  );
};
