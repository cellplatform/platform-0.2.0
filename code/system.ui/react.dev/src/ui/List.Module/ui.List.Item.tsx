import { useEffect, useRef } from 'react';
import { VscSymbolClass } from 'react-icons/vsc';
import { COLORS, Calc, Color, DEFAULTS, css, type t } from './common';

export type ListItemProps = {
  index: number;
  url: URL;
  imports: t.SpecImports;
  address?: string;
  title?: string;
  selected?: boolean;
  focused: boolean;
  Icon?: t.IconType;
  ns?: boolean;
  hrDepth?: number;
  style?: t.CssValue;
  onReadyChange?: t.ModuleListItemReadyHandler;
  onClick?: t.ModuleListItemHandler;
  onSelect?: t.ModuleListItemHandler;
};

export const ListItem: React.FC<ListItemProps> = (props) => {
  const { index, Icon, hrDepth = -1, ns, title, imports, address, url, selected, focused } = props;
  const importsKeys = Object.keys(imports);

  const beyondBounds = index === -1 ? true : index > importsKeys.length - 1;
  const params = url.searchParams;

  const prev = importsKeys[index - 1];
  const next = importsKeys[index];
  const showHr = !beyondBounds && Calc.showHr(hrDepth, prev, next);

  if (address) params.set(DEFAULTS.qs.dev, address);
  if (!address) params.delete(DEFAULTS.qs.dev);

  const baseRef = useRef<HTMLLIElement>(null);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const el = baseRef.current ?? undefined;
    props.onReadyChange?.({ index, lifecycle: 'ready', el });
    return () => {
      props.onReadyChange?.({ index, lifecycle: 'disposed' });
    };
  }, []);

  useEffect(() => {
    if (selected) props.onSelect?.(getArgs());
  }, [selected]);

  /**
   * Handlers
   */
  const getArgs = (): t.ModuleListItemHandlerArgs => {
    const match = address ? imports[address] : undefined;
    const importer = typeof match === 'function' ? match : undefined;
    return { index, address, importer };
  };

  const handleClick = (e: React.MouseEvent) => {
    if (props.onClick) {
      e.preventDefault(); // NB: suppress default <a> click when handler provided.
      props.onClick?.(getArgs());
    }
  };

  /**
   * Render
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
      color: selected && focused ? COLORS.WHITE : COLORS.BLUE,
      textDecoration: 'none',
    }),
    linkDimmed: css({
      userSelect: 'none',
      color: Color.alpha(COLORS.DARK, 0.4),
      ':hover': { color: COLORS.BLUE },
    }),
    row: {
      base: css({
        backgroundColor: selected
          ? focused
            ? COLORS.BLUE
            : Color.alpha(COLORS.DARK, 0.08)
          : undefined,
        borderRadius: 3,
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'auto auto 1fr',
      }),
      icon: css({
        color: selected && focused ? COLORS.WHITE : COLORS.BLUE,
        marginLeft: 10,
        marginRight: 10,
        display: 'grid',
        placeItems: 'center',
      }),
      label: css({ ':hover': { textDecoration: 'underline' } }),
    },
  };

  return (
    <li ref={baseRef} {...css(styles.base, props.style)}>
      {showHr && <hr {...styles.hr} />}
      <div {...styles.row.base}>
        <div {...styles.row.icon}>{Icon && <VscSymbolClass />}</div>
        <a
          href={url.href}
          onClick={handleClick}
          {...css(styles.link, !ns ? styles.linkDimmed : undefined)}
        >
          <div {...styles.row.label}>{title ?? address}</div>
        </a>
        <div />
      </div>
    </li>
  );
};
