import { Fragment } from 'react';
import { DEFAULTS, FONTS, Icons, css, type t } from './common';
import { MonoHash } from './ui.MonoHash';

const DEF = DEFAULTS.props;

type Args = {
  page: { index: t.Index; total: number };
  item: t.DocHistoryListItem;
  theme?: t.CommonTheme;
  hashLength?: number;
  onItemClick?: t.InfoHistoryItemHandler;
};

/**
 * The set of grid elements that make up a single History row.
 */
export function toRowElements(args: Args) {
  const { item, theme, hashLength = DEF.hashLength } = args;
  const { index, commit } = item;
  const hash = commit.change.hash;
  const message = commit.change.message;

  /**
   * Handlers
   */
  const onClick = () => args.onItemClick?.(wrangle.clickArgs(args));

  /**
   * Render
   */
  const styles = {
    base: css({ display: 'grid', placeItems: 'center', userSelect: 'none' }),
    mono: css(FONTS.mono),
    icon: css({ marginLeft: 0, width: 35 }),
    message: css({ opacity: 0.5, fontSize: 12, display: 'grid', justifyContent: 'start' }),
    hash: css({ PaddingY: 5, MarginX: 10 }),
    index: css({ opacity: 0.2, display: 'grid', justifyContent: 'end' }),
  };

  const elIcon = <Icons.Git.Commit size={16} style={{ transform: 'rotate(90deg)' }} />;
  const elHash = <MonoHash hash={hash} theme={theme} length={hashLength} />;

  const attr = (style: t.CssValue) => ({ ...css(styles.base, style), onClick });

  return (
    <Fragment key={hash}>
      <div {...attr(styles.icon)}>{elIcon}</div>
      <div {...attr(styles.message)}>{message}</div>
      <div {...attr(styles.hash)}>{elHash}</div>
      <div {...attr(css(styles.index, styles.mono))}>{index}</div>
    </Fragment>
  );
}

/**
 * Helpers
 */
const wrangle = {
  clickArgs(args: Args) {
    type T = t.InfoHistoryItemHandlerArgs;
    const { item, page } = args;
    const { index, commit } = item;
    const hash = commit.change.hash;
    const is: T['page']['is'] = { first: page.index === 0, last: page.index === page.total - 1 };
    const res: T = { hash, index, commit, page: { ...page, is } };
    return res;
  },
} as const;
