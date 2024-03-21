import { Fragment } from 'react';
import { Color, DEFAULTS, Hash, Icons, css, type t } from './common';
import { MonoHash } from './ui.MonoHash';

/**
 * The set of grid elements that make up a single History row.
 */
export function rowElements(props: {
  item: t.DocHistoryListItem;
  theme?: t.CommonTheme;
  hashLength?: number;
}) {
  const { item, theme } = props;
  const { index, commit } = item;
  const hash = commit.change.hash;
  const message = commit.change.message;
  const hashLength = DEFAULTS.hash.length;
  const hashShort = Hash.shorten(hash, [0, hashLength]);

  const color = Color.fromTheme(theme);
  const styles = {
    base: css({ display: 'grid', placeItems: 'center' }),
    vspace: css({ PaddingY: 5 }),
    mono: css(DEFAULTS.mono),
    hash: css({ Flex: 'x-center-center' }),
    icon: css({ marginLeft: 0, width: 35 }),
    index: css({ opacity: 0.2 }),
    message: css({ opacity: 0.5, fontSize: 12, justifySelf: 'start' }),
  };

  const elIcon = <Icons.Git.Commit size={16} style={{ transform: 'rotate(90deg)' }} />;
  const elHash = <MonoHash hash={hash} theme={theme} />;

  return (
    <Fragment key={hash}>
      <div {...css(styles.base, styles.icon)}>{elIcon}</div>
      <div {...css(styles.base, styles.message)}>{message}</div>
      <div {...css(styles.base, styles.vspace)}>{elHash}</div>
      <div {...css(styles.base, styles.index, styles.mono)}>{`${index}`}</div>
    </Fragment>
  );
}
