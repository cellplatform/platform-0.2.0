import { useEffect, useRef } from 'react';
import { VscSymbolClass } from 'react-icons/vsc';
import { COLORS, Calc, Color, DEFAULTS, css, type t } from './common';

export type ListItemProps = {
  enabled?: boolean;
  index: number;
  url: URL;
  imports: t.ModuleImports;
  uri?: string;
  title?: string;
  selected?: boolean;
  focused: boolean;
  Icon?: t.IconType;
  ns?: boolean;
  hrDepth?: number;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onReadyChange?: t.ModuleListItemReadyHandler;
  onClick?: t.ModuleListItemHandler;
  onSelect?: t.ModuleListItemHandler;
};

export const ListItem: React.FC<ListItemProps> = (props) => {
  const { index, Icon, hrDepth = -1, ns, title, imports } = props;
  const { uri, url, selected, focused, enabled = true } = props;

  const importsKeys = Object.keys(imports);

  const beyondBounds = index === -1 ? true : index > importsKeys.length - 1;
  const params = url.searchParams;

  const prev = importsKeys[index - 1];
  const next = importsKeys[index];
  const showHr = !beyondBounds && Calc.showHr(hrDepth, prev, next);

  if (uri) params.set(DEFAULTS.qs.dev, uri);
  if (!uri) params.delete(DEFAULTS.qs.dev);

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
  const getArgs = (): t.ModuleListItemHandlerArgs => ({ index, uri });

  const handleClick = (e: React.MouseEvent) => {
    if (props.onClick) {
      e.preventDefault(); // NB: suppress default <a> click when handler provided.
      props.onClick?.(getArgs());
    }
  };

  /**
   * Render
   */
  const { WHITE, BLUE } = COLORS;
  const color = Color.theme(props.theme).color;
  const styles = {
    base: css({
      paddingLeft: beyondBounds ? 0 : 20,
      paddingRight: beyondBounds ? 0 : 50,
    }),
    hr: css({
      border: 'none',
      borderTop: `solid 1px ${Color.alpha(color, 0.12)}`,
    }),
    link: css({
      color: selected && focused && enabled ? WHITE : enabled ? BLUE : Color.alpha(color, 0.15),
      textDecoration: 'none',
    }),
    linkDimmed: css({
      userSelect: 'none',
      color: Color.alpha(color, 0.4),
      ':hover': { color: BLUE },
    }),
    row: {
      base: css({
        backgroundColor: selected
          ? focused && enabled
            ? BLUE
            : Color.alpha(color, 0.08)
          : undefined,
        borderRadius: 3,
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0, 1fr) auto',
      }),
      icon: css({
        color: selected && focused && enabled ? WHITE : enabled ? BLUE : Color.alpha(color, 0.15),
        marginLeft: 10,
        marginRight: 10,
        display: 'grid',
        placeItems: 'center',
      }),
      label: css({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '100%',
        ':hover': { textDecoration: 'underline' },
      }),
    },
  };

  const linkStyle = css(styles.link, !ns ? styles.linkDimmed : undefined);
  const elLink = (
    <a href={url.href} onClick={handleClick} {...linkStyle}>
      <div {...styles.row.label}>{title ?? uri}</div>
    </a>
  );

  return (
    <li ref={baseRef} {...css(styles.base, props.style)}>
      {showHr && <hr {...styles.hr} />}
      <div {...styles.row.base}>
        <div {...styles.row.icon}>{Icon && <VscSymbolClass />}</div>
        {elLink}
        <div style={{ width: 20 }} />
      </div>
    </li>
  );
};
