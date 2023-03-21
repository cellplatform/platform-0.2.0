import { VscSymbolClass } from 'react-icons/vsc';
import { Calc, Color, COLORS, css, DEFAULTS, t } from './common';

export type ListItemProps = {
  index: number;
  url: URL;
  imports: t.SpecImports;
  address?: string;
  title?: string;
  isSelected?: boolean;
  Icon?: t.IconType;
  ns?: boolean;
  hrDepth?: number;
  style?: t.CssValue;
};

export const ListItem: React.FC<ListItemProps> = (props) => {
  const { index, Icon, hrDepth = -1, ns, title, imports, address, url, isSelected } = props;
  const importsKeys = Object.keys(imports);

  const isLast = index >= importsKeys.length - 1;
  const beyondBounds = index === -1 ? true : index > importsKeys.length - 1;
  const params = url.searchParams;

  const prev = importsKeys[index - 1];
  const next = importsKeys[index];
  const showHr = !beyondBounds && Calc.showHr(hrDepth, prev, next);

  if (address) params.set(DEFAULTS.QS.DEV, address);
  if (!address) params.delete(DEFAULTS.QS.DEV);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      paddingLeft: beyondBounds ? 0 : 20,
      paddingRight: beyondBounds ? 0 : 50,
    }),
    hr: css({
      border: 'none',
      borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.12)}`,
    }),
    link: css({
      color: isSelected ? COLORS.WHITE : COLORS.BLUE,
      textDecoration: 'none',
    }),
    linkDimmed: {
      color: Color.alpha(COLORS.DARK, 0.4),
      ':hover': { color: COLORS.BLUE },
    },
    row: {
      base: css({
        backgroundColor: isSelected ? Color.alpha(COLORS.BLUE, 1) : undefined,
        borderRadius: 3,
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'auto auto 1fr',
      }),
      icon: css({ marginLeft: 10, marginRight: 10, display: 'grid', placeItems: 'center' }),
      label: css({ ':hover': { textDecoration: 'underline' } }),
    },
  };

  return (
    <li {...css(styles.base, props.style)}>
      {showHr && <hr {...styles.hr} />}
      <div {...styles.row.base}>
        <div {...styles.row.icon}>
          {Icon && <VscSymbolClass color={isSelected ? COLORS.WHITE : COLORS.BLUE} />}
        </div>
        <a href={url.href} {...css(styles.link, !ns ? styles.linkDimmed : undefined)}>
          <div {...styles.row.label}>{title ?? address}</div>
        </a>
        <div />
      </div>
    </li>
  );
};
