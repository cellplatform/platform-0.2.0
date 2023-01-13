import { Color, COLORS, css, t } from '../common';
import { SpecListTitle } from './SpecList.Title';
import { SpecListFooter } from './SpecList.Footer';

const KEY = { DEV: 'dev' };

export type Imports = { [namespace: string]: () => Promise<any> };
export type SpecListProps = {
  title?: string;
  version?: string;
  imports?: Imports;
  badge?: t.SpecListBadge;
  style?: t.CssValue;
};

export const SpecList: React.FC<SpecListProps> = (props) => {
  const { imports = {} } = props;
  const url = new URL(window.location.href);
  const hasDevParam = url.searchParams.has(KEY.DEV);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      fontFamily: 'sans-serif',
      lineHeight: '2em',
      color: COLORS.DARK,
      cursor: 'default',
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      padding: 30,
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

  const elList = (
    <ul {...styles.ul}>
      {Object.keys(imports).map((key, i) => createItem(i, key))}
      <hr {...styles.hr} />
      {hasDevParam && createItem(-1, undefined, '?dev - remove param', true)}
      {!hasDevParam && createItem(-1, 'true', '?dev - add param', true)}
    </ul>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <SpecListTitle title={props.title} version={props.version} badge={props.badge} />
      {elList}
      <SpecListFooter />
    </div>
  );
};
