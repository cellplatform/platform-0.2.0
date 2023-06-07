import { Color, COLORS, css, t, rx, FC } from '../common';
import { HistoryUtil } from './HistoryUtil.mjs';
import { HistoryItem } from './History.Item';

const DEFAULT = {
  TITLE: 'History',
  V0: '0.0.0',
};

export type HistoryProps = {
  instance: t.Instance;
  title?: string;
  data?: t.LogPublicHistory;
  style?: t.CssValue;
};

export const History: React.FC<HistoryProps> = (props) => {
  const { title = DEFAULT.TITLE } = props;
  const data = HistoryUtil.format(props.data);
  const isVZero = data.latest.version === DEFAULT.V0;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      padding: 15,
      paddingRight: 0,
      boxSizing: 'border-box',
      userSelect: 'none',
    }),
    body: css({}),
    title: css({
      userSelect: 'none',
      fontWeight: 'bold',
      paddingBottom: 10,
      marginBottom: 16,
      borderBottom: `solid 6px ${Color.alpha(COLORS.DARK, 0.1)}`,
    }),

    list: css({
      lineHeight: '1.3em',
      paddingRight: 12,
    }),

    item: {
      base: css({ cursor: 'pointer' }),
      latest: css({
        paddingBottom: 6,
        marginBottom: 6,
        borderBottom: `dashed 1px ${Color.alpha(COLORS.DARK, 0.3)}`,
      }),
    },
  };

  const elBody = data && (
    <div {...styles.body}>
      <div
        {...styles.title}
        onClick={() => {
          console.info('version:history', data); // TEMP 🐷
        }}
      >
        {title}
      </div>

      <div {...css(styles.item.base, styles.item.latest)}>
        {isVZero ? '-' : data.latest.version}
      </div>

      <div {...styles.list}>
        {data.history.map((item, i) => {
          return <HistoryItem key={i} data={item} latest={data.latest?.version} />;
        })}
      </div>
    </div>
  );

  return <div {...css(styles.base, props.style)}>{elBody}</div>;
};
