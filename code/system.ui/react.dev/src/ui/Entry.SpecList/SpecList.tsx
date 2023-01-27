import { Fragment } from 'react';

import { Color, COLORS, css, t } from '../common';
import { SpecListTitle } from './SpecList.Title';
import { SpecListFooter } from './SpecList.Footer';
import { shouldShowHr } from './calc.mjs';

import type { IconType } from 'react-icons';
import { VscSymbolClass } from 'react-icons/vsc';

const KEY = { DEV: 'dev' };

export type Imports = { [namespace: string]: () => Promise<any> };
export type SpecListProps = {
  title?: string;
  version?: string;
  imports?: Imports;
  hrDepth?: number;
  badge?: t.SpecListBadge;
  style?: t.CssValue;
};

export const SpecList: React.FC<SpecListProps> = (props) => {
  const { imports = {}, hrDepth = -1 } = props;
  const url = new URL(window.location.href);
  const hasDevParam = url.searchParams.has(KEY.DEV);
  const importsKeys = Object.keys(imports);

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
      padding: 30,
      paddingTop: 20,
    }),
    title: css({
      marginBottom: 20,
    }),
    ul: css({
      listStyleType: 'none',
      padding: 0,
      margin: 0,
      borderLeft: `solid 1px ${Color.alpha(COLORS.DARK, 0.03)}`,
    }),
    li: css({}),
    row: {
      base: css({
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
      }),
      icon: css({
        marginRight: 10,
        display: 'grid',
        placeItems: 'center',
      }),
      label: css({}),
    },
    hr: css({
      border: 'none',
      borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.12)}`,
    }),
    hrDashed: css({
      border: 'none',
      borderTop: `dashed 1px ${Color.alpha(COLORS.DARK, 0.4)}`,
      MarginY: 10,
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

  const createItem = (
    i: number,
    address: string | undefined,
    options: {
      title?: string;
      isDimmed?: boolean;
      icon?: IconType;
    } = {},
  ) => {
    const { isDimmed, title, icon: Icon } = options;
    const isLast = i >= importsKeys.length - 1;
    const beyondBounds = i === -1 ? true : i > importsKeys.length - 1;
    const url = new URL(window.location.href);
    const params = url.searchParams;

    const prev = importsKeys[i - 1];
    const next = importsKeys[i];
    const showHr = !isLast && !beyondBounds && shouldShowHr(hrDepth, prev, next);

    if (address) params.set(KEY.DEV, address);
    if (!address) params.delete(KEY.DEV);

    const style: t.CssValue = {
      paddingLeft: beyondBounds ? 0 : 30,
      paddingRight: beyondBounds ? 0 : 50,
    };

    const elIcon = Icon && <Icon />;

    return (
      <Fragment key={`item-${i}`}>
        <li {...css(styles.li, style)}>
          {showHr && <hr {...styles.hr} />}
          <a href={url.href} {...css(styles.link, isDimmed ? styles.linkDimmed : undefined)}>
            <div {...styles.row.base}>
              <div {...styles.row.icon}>{elIcon}</div>
              <div {...styles.row.label}>{title ?? address}</div>
            </div>
          </a>
        </li>
      </Fragment>
    );
  };

  const elList = (
    <ul {...styles.ul}>
      {importsKeys.map((key, i) => createItem(i, key, { icon: VscSymbolClass }))}
      <hr {...css(styles.hrDashed, { marginTop: 30 })} />
      {hasDevParam && createItem(-1, undefined, { title: '?dev - remove param', isDimmed: true })}
      {!hasDevParam && createItem(-1, 'true', { title: '?dev - add param', isDimmed: true })}
    </ul>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <SpecListTitle
        title={props.title}
        version={props.version}
        badge={props.badge}
        style={styles.title}
      />
      {elList}
      <SpecListFooter />
    </div>
  );
};
