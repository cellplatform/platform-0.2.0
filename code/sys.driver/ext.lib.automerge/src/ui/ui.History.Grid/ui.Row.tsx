import { Fragment } from 'react';
import { DEFAULTS, FONTS, Icons, css, type t } from './common';
import { MonoHash } from './ui.MonoHash';

/**
 * The set of grid elements that make up a single History row.
 */
export function rowElements(props: {
  item: t.DocHistoryListItem;
  theme?: t.CommonTheme;
  hashLength?: number;
}) {
  const { item, theme, hashLength = DEFAULTS.props.hashLength } = props;
  const { index, commit } = item;
  const hash = commit.change.hash;
  const message = commit.change.message;

  const styles = {
    base: css({ display: 'grid', placeItems: 'center', userSelect: 'none' }),
    vspace: css({ PaddingY: 5 }),
    mono: css(FONTS.mono),
    hash: css({ Flex: 'x-center-center' }),
    icon: css({ marginLeft: 0, width: 35 }),
    index: css({ opacity: 0.2, justifySelf: 'end' }),
    message: css({ opacity: 0.5, fontSize: 12, justifySelf: 'start' }),
  };

  const elIcon = <Icons.Git.Commit size={16} style={{ transform: 'rotate(90deg)' }} />;
  const elHash = <MonoHash hash={hash} theme={theme} length={hashLength} />;

  return (
    <Fragment key={hash}>
      <div {...css(styles.base, styles.icon)}>{elIcon}</div>
      <div {...css(styles.base, styles.message)}>{message}</div>
      <div {...css(styles.base, styles.vspace)}>{elHash}</div>
      <div {...css(styles.base, styles.index, styles.mono)}>{`${index}`}</div>
    </Fragment>
  );
}
