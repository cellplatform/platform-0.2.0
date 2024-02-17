import { COLORS, Color, css, type t } from './common';

export type MessageProps = {
  message: t.Message;
  style?: t.CssValue;
};

export const Message: React.FC<MessageProps> = (props) => {
  const { message } = props;

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      backgroundColor: Color.alpha(COLORS.CYAN, 0.1),
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      borderRadius: 6,
    }),
    body: css({
      padding: 10,
      paddingBottom: 15,
    }),
    role: css({
      fontWeight: 'bold',
      borderBottom: `solid 3px ${Color.alpha(COLORS.DARK, 0.1)}`,
      paddingBottom: 6,
      marginBottom: 8,
      fontSize: 14,
    }),
    content: css({
      fontSize: 14,
      lineHeight: 1.3,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div {...styles.role}>{`🤖 ${capitalize(message.role)}`}</div>
        <div {...styles.content}>{message.content}</div>
      </div>
    </div>
  );
};

/**
 * Helpers
 */
function capitalize(str: string): string {
  if (str.length === 0) return str;
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}
