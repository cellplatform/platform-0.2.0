import { Color, COLORS, css, t } from '../common';

const KEY = { DEV: 'dev' };
type Url = string;

export type Imports = { [namespace: string]: () => Promise<any> };
export type SpecListBadge = { image: Url; href: Url };
export type SpecListProps = {
  title?: string;
  version?: string;
  imports?: Imports;
  badge?: SpecListBadge;
  style?: t.CssValue;
};

export const SpecList: React.FC<SpecListProps> = (props) => {
  const { imports = {}, badge } = props;
  const url = new URL(window.location.href);
  const hasDevParam = url.searchParams.has(KEY.DEV);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      fontFamily: 'sans-serif',
      lineHeight: '2em',
      padding: 30,
      color: COLORS.DARK,
      cursor: 'default',
    }),
    body: css({
      position: 'relative',
    }),
    title: css({ fontWeight: 'bold' }),
    version: css({
      color: Color.alpha(COLORS.DARK, 0.3),
      marginLeft: 3,
    }),
    ul: css({}),
    hr: css({
      border: 'none',
      borderTop: `dashed 1px ${Color.alpha(COLORS.DARK, 0.4)}`,
    }),
    link: css({
      color: COLORS.BLUE,
      textDecoration: 'none',
    }),
    linkDimmed: {
      color: Color.alpha(COLORS.DARK, 0.4),
      ':hover': { color: COLORS.BLUE },
    },
    badge: css({ Absolute: [0, 0, null, null] }),
  };

  const createItem = (i: number, address: string | undefined, title?: string, dimmed?: boolean) => {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    if (address) params.set(KEY.DEV, address);
    if (!address) params.delete(KEY.DEV);

    return (
      <li key={i}>
        <a href={url.href} {...css(styles.link, dimmed ? styles.linkDimmed : undefined)}>
          {title ?? address}
        </a>
      </li>
    );
  };

  const elTitle = props.title && (
    <div {...styles.title}>
      <span>{props.title}</span>
      {props.version && <span {...styles.version}>{`@${props.version}`}</span>}
    </div>
  );

  const elList = (
    <ul {...styles.ul}>
      {Object.keys(imports).map((key, i) => createItem(i, key))}
      <hr {...styles.hr} />
      {hasDevParam && createItem(-1, undefined, '?dev - remove param', true)}
      {!hasDevParam && createItem(-1, 'true', '?dev - add param', true)}
    </ul>
  );

  const elBadge = props.badge && (
    <a href={badge?.href} target={'_blank'} rel={'noopener noreferrer'}>
      <img src={badge?.image} {...styles.badge} />
    </a>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        {elBadge}
        {elTitle}
        {elList}
      </div>
    </div>
  );
};
