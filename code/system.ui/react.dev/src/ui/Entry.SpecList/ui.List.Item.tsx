import { VscSymbolClass } from 'react-icons/vsc';
import { Calc, Color, COLORS, css, KEY, t } from './common';

export type ListItemProps = {
  index: number;
  url: URL;
  imports: t.Imports;
  address?: string;
  title?: string;
  Icon?: t.IconType;

  dimmed?: boolean;
  hrDepth?: number;
  style?: t.CssValue;
};

export const ListItem: React.FC<ListItemProps> = (props) => {
  const { index, Icon, hrDepth = -1, dimmed, title, imports, address, url } = props;
  const importsKeys = Object.keys(imports);

  const isLast = index >= importsKeys.length - 1;
  const beyondBounds = index === -1 ? true : index > importsKeys.length - 1;
  const params = url.searchParams;

  const prev = importsKeys[index - 1];
  const next = importsKeys[index];
  const showHr = !isLast && !beyondBounds && Calc.showHr(hrDepth, prev, next);

  if (address) params.set(KEY.DEV, address);
  if (!address) params.delete(KEY.DEV);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      paddingLeft: beyondBounds ? 0 : 30,
      paddingRight: beyondBounds ? 0 : 50,
    }),
    hr: css({
      border: 'none',
      borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.12)}`,
    }),
    link: css({
      color: COLORS.BLUE,
      textDecoration: 'none',
    }),
    linkDimmed: {
      color: Color.alpha(COLORS.DARK, 0.4),
      ':hover': { color: COLORS.BLUE },
    },
    row: {
      base: css({ display: 'grid', gridTemplateColumns: 'auto 1fr' }),
      icon: css({ marginRight: 10, display: 'grid', placeItems: 'center' }),
      label: css({ ':hover': { textDecoration: 'underline' } }),
    },
  };

  return (
    <li {...css(styles.base, props.style)}>
      {showHr && <hr {...styles.hr} />}
      <a href={url.href} {...css(styles.link, dimmed ? styles.linkDimmed : undefined)}>
        <div {...styles.row.base}>
          <div {...styles.row.icon}>{Icon && <VscSymbolClass />}</div>
          <div {...styles.row.label}>{title ?? address}</div>
        </div>
      </a>
    </li>
  );
};
