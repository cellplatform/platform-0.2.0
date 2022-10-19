import React, { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common.mjs';
import { HistoryUtil } from './HistoryUtil.mjs';

export type HistoryProps = {
  data?: t.PublicLogSummary;
  style?: t.CssValue;
};

export const History: React.FC<HistoryProps> = (props) => {
  const { data } = props;
  const history = HistoryUtil.format(data);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      padding: 15,
      paddingRight: 0,
    }),
    body: css({}),
    title: css({
      userSelect: 'none',
      fontWeight: 'bold',
      borderBottom: `solid 4px ${Color.alpha(COLORS.DARK, 0.1)}`,
      paddingBottom: 8,
      marginBottom: 8,
    }),
    list: css({
      lineHeight: '1.6em',
    }),

    item: {
      base: css({ cursor: 'pointer' }),
    },
  };

  const elBody = data && (
    <div {...styles.body}>
      <div {...styles.title} onClick={() => console.info('history', data)}>
        History
      </div>

      <div {...styles.list}>
        {history.map((item, i) => {
          const isLatest = item.version === data.latest?.version;
          const onClick = () => console.info(item);
          return (
            <div
              key={i}
              {...styles.item.base}
              style={{ opacity: isLatest ? 1 : 0.3 }}
              onClick={onClick}
            >
              {item.version}
            </div>
          );
        })}
      </div>
    </div>
  );

  return <div {...css(styles.base, props.style)}>{elBody}</div>;
};
