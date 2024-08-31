import { Color, DEFAULTS, css, type t } from './common';
import { toRowElements } from './ui.Row';

export const View: React.FC<t.InfoHistoryGridProps> = (props) => {
  const { page, theme, hashLength, onItemClick } = props;
  const total = page?.scope.length ?? 0;
  const empty = total === 0;

  /**
   * Render
   */
  const color = Color.theme(theme).fg;
  const styles = {
    base: css({ position: 'relative', color }),
    empty: css({
      display: 'grid',
      placeItems: 'center',
      padding: 5,
      opacity: 0.3,
      fontSize: 12,
    }),
    body: css({
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto auto',
    }),
  };

  const rows = page?.items ?? [];
  const elEmpty = empty && <div {...styles.empty}>{DEFAULTS.empty.message}</div>;
  const elBody = !empty && page && (
    <div {...styles.body}>
      {rows.map((item, index) => {
        const page = { index, total };
        return toRowElements({ page, item, theme, hashLength, onItemClick });
      })}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {elBody}
    </div>
  );
};
