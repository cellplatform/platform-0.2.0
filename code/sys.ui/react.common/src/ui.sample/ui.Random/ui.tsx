import { Color, DEFAULTS, css, type t } from './common';

export const View: React.FC<t.RandomProps> = (props) => {
  const { value } = props;

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      position: 'relative',
      color: theme.fg,
      display: 'grid',
      placeItems: 'center',
      padding: 25,
    }),
    value: css({
      fontSize: 44,
      wordBreak: 'break-all',
      overflowWrap: 'break-word',
    }),
  };

  const elTitle = !value && <div {...styles.value}>{`${DEFAULTS.name}`}</div>;
  const elValue = !!value && <div {...styles.value}>{`${value}`}</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {elTitle}
      {elValue}
    </div>
  );
};
