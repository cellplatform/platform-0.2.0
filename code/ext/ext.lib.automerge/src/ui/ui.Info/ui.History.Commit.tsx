import { COLORS, Hash, Icons, css, type t } from './common';

export type HistoryCommitProps = {
  index: number;
  total: number;
  commit: t.DocHistoryCommit;
  showDetail?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onItemClick?: t.InfoDataHistoryItemHandler;
};

export const HistoryCommit: React.FC<HistoryCommitProps> = (props) => {
  const { index, commit, total, showDetail = false, theme } = props;
  const hash = commit.change.hash;
  const is = { first: index === 0, last: index === total - 1 };

  /**
   * Handlers
   */
  const handleClick = () => {
    props.onItemClick?.({ index, hash, commit, is });
  };

  /**
   * Render
   */
  const styles = {
    base: css({ display: 'grid' }),
    main: css({
      display: 'grid',
      gridTemplateColumns: 'auto auto 1fr auto 28px',
      alignItems: 'center',
      cursor: props.onItemClick ? 'pointer' : 'default',
    }),
    mono: css({ fontFamily: 'monospace', fontSize: 10, fontWeight: 600 }),
    left: css({}),
    hash: css({ Flex: 'x-center-center' }),
    index: css({ opacity: 0.2, display: 'grid', justifyContent: 'end' }),
  };

  const elHash = (
    <div {...css(styles.hash, styles.mono)}>
      <span {...css({ color: COLORS.CYAN, opacity: 0.4, marginRight: 3 })}>{`#`}</span>
      {`${Hash.shorten(hash, 6)}`}
    </div>
  );

  const elMain = (
    <div {...styles.main} onClick={handleClick}>
      <div {...css({ width: 10 })} />
      <div {...styles.left}>
        <Icons.Git.Commit size={16} style={{ transform: 'rotate(90deg)' }} />
      </div>
      <div />
      {elHash}
      <div {...css(styles.index, styles.mono)}>{`${index}`}</div>
    </div>
  );

  /**
   * TODO 🐷
   */
  const elDetail = showDetail && <div>{'🐷 TODO: Detail'}</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {elMain}
      {elDetail}
    </div>
  );
};
