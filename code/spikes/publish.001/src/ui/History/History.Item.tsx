import { css, t } from '../common';

type SemverString = string;

export type HistoryItemProps = {
  latest?: SemverString;
  data: t.LogPublicHistoryItem;
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
      fontSize: 14,
    }),
  };
  return (
    <div {...css(styles.base, props.style)} onClick={onClick}>
      <div>{data.version}</div>
      <div onClick={onLoadClick}>{'pull'}</div>
    </div>
  );
};
