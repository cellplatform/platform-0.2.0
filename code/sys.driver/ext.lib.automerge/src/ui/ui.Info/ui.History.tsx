import { useHistory } from '../../ui/ui.use';
import { Value, css, type t } from './common';

export type HistoryProps = {
  doc?: t.Doc;
  showGenesis?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const History: React.FC<HistoryProps> = (props) => {
  const { doc, theme } = props;
  const { history } = useHistory(doc);
  const showGenesis = props.showGenesis && !!history?.genesis;

  if (!history) return <div>{'-'}</div>;

  /**
   * Render
   */
  const styles = {
    base: css({
      display: 'grid',
      gridTemplateColumns: `repeat(${showGenesis ? 2 : 1}, auto)`,
      columnGap: '4px',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{wrangle.text(history)}</div>
      {showGenesis && <div>{wrangle.genesis(history)}</div>}
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  text(history: t.DocHistory) {
    const commits = history.commits;
    const total = commits.length ?? 0;
    const text = {
      total: total.toLocaleString(),
      commits: Value.plural(total, 'commit', 'commits'),
    } as const;
    return `${text.total} ${text.commits}`;
  },

  genesis(history: t.DocHistory) {
    const genesis = history.genesis;
    return genesis ? `← genesis (${genesis.elapsed.toString()})` : '';
  },
} as const;
