import { css, FC, Style, t } from '../common';
import { DEFAULT } from './ui.Title.DEFAULT.mjs';

export type TitleProps = {
  text?: string;
  style?: t.DevTitleStyle;
  onClick?: () => void;
};

const View: React.FC<TitleProps> = (props) => {
  const { text = DEFAULT.title } = props;
  const style = { ...DEFAULT.style, ...props.style };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      ...Style.toMargins(style.margin),
      cursor: props.onClick ? 'pointer' : 'default',
      display: 'grid',
    }),
    ellipsis:
      style.ellipsis &&
      css({
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }),
    text: css({
      fontSize: 14,
      fontWeight: style.bold ? 'bold' : undefined,
      color: style.color,
    }),
  };
  return (
    <div {...styles.base} onClick={props.onClick}>
      <div {...css(styles.text, styles.ellipsis)}>{text}</div>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULT: typeof DEFAULT;
};
export const Title = FC.decorate<TitleProps, Fields>(View, { DEFAULT }, { displayName: 'Title' });
