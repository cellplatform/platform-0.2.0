import React from 'react';
import { Color, DEFAULTS, css, type t } from './common';
import { rowElements } from './ui.Row';

export const View: React.FC<t.HistoryGridProps> = (props) => {
  const { page, theme, hashLength } = props;
  const total = page?.length ?? 0;
  const empty = total === 0;

  /**
   * Render
   */
  const color = Color.theme(theme).color;
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
      columnGap: '10px',
    }),
  };

  const rows = page?.items ?? [];
  const elEmpty = empty && <div {...styles.empty}>{DEFAULTS.empty.message}</div>;
  const elBody = !empty && page && (
    <div {...styles.body}>{rows.map((item) => rowElements({ item, theme, hashLength }))}</div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {elBody}
    </div>
  );
};
