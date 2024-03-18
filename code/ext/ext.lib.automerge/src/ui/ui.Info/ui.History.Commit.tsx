import { COLORS, Hash, Icons, css, type t } from './common';

export type HistoryCommitProps = {
  index: number;
  commit: t.DocHistoryCommit;
  style?: t.CssValue;
};

export const HistoryCommit: React.FC<HistoryCommitProps> = (props) => {
  const { index, commit } = props;
  const hash = commit.change.hash;

  /**
   * Handlers
   */
  const onClick = () => {
  };

  /**
   * Render
   */
  const styles = {
    base: css({
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto 28px',
      alignItems: 'center',
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

  return (
    <div {...css(styles.base, props.style)} onClick={onClick}>
      <div {...styles.left}>
        <Icons.Git.Commit size={16} style={{ transform: 'rotate(90deg)' }} />
      </div>
      <div />
      {elHash}
      <div {...css(styles.index, styles.mono)}>{`${index}`}</div>
    </div>
  );
};
