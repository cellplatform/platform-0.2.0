import { Color, COLORS, css, t, rx, FC } from '../common.mjs';

type SemverString = string;

export type HistoryItemProps = {
  latest?: SemverString;
  data: t.PublicLogHistoryItem;
  style?: t.CssValue;
};

export const HistoryItem: React.FC<HistoryItemProps> = (props) => {
  const { data, latest = '' } = props;

  const isLatest = data.version === latest;

  /**
   * Handlers
   */
  const onClick = () => console.info(data);
  const onLoadClick = () => {
    console.log('on load click');
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      opacity: isLatest ? 1 : 0.3,
      cursor: 'pointer',
      Flex: 'x-spaceBetween-stretch',
    }),
  };
  return (
    <div {...css(styles.base, props.style)} onClick={onClick}>
      <div>{data.version}</div>
      <div onClick={onLoadClick}>{'pull'}</div>
    </div>
  );
};
